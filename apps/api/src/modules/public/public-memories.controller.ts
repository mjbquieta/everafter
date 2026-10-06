import {
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import {
  STORAGE_PROVIDER,
  type StorageProvider,
} from '../../common/storage/storage.provider';
import { PrismaService } from '../../prisma/prisma.service';
import { WeddingStatus } from '@everafter/types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('public/weddings/:slug/memories')
@SkipThrottle()
export class PublicMemoriesController {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: StorageProvider,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, WebP, and GIF images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadGuestPhoto(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('uploaderName') uploaderName: string,
    @Body('guestId') guestId?: string,
    @Body('caption') caption?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!uploaderName || !uploaderName.trim()) {
      throw new BadRequestException('Uploader name is required');
    }

    // Verify wedding exists (allow uploads even if not published for testing)
    const wedding = await this.prisma.wedding.findUnique({
      where: { slug },
    });

    if (!wedding || wedding.deletedAt !== null) {
      throw new BadRequestException('Wedding not found');
    }

    // Get or create "Guest Memories" album
    let album = await this.prisma.galleryAlbum.findFirst({
      where: {
        weddingId: wedding.id,
        title: 'Guest Memories',
      },
    });

    if (!album) {
      album = await this.prisma.galleryAlbum.create({
        data: {
          weddingId: wedding.id,
          title: 'Guest Memories',
        },
      });
    }

    // Upload file to storage
    const relativePath = await this.storage.save(file, 'guest-memories');
    const url = this.storage.getUrl(relativePath);

    // Build caption with metadata
    const uploadedAt = new Date().toISOString();
    const metadata = `[uploader:${uploaderName}]${guestId ? ` [guestId:${guestId}]` : ''} [uploadedAt:${uploadedAt}]`;
    const finalCaption = caption ? `${metadata} ${caption}` : metadata;

    // Create photo record
    const photo = await this.prisma.galleryPhoto.create({
      data: {
        albumId: album.id,
        storageKey: relativePath,
        caption: finalCaption,
      },
    });

    return {
      data: {
        id: photo.id,
        url,
        uploaderName,
        weddingId: wedding.id,
      },
    };
  }
}
