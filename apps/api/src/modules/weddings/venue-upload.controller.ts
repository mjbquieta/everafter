import {
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import {
  STORAGE_PROVIDER,
  type StorageProvider,
} from '../../common/storage/storage.provider';
import { WeddingsService } from './weddings.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Controller('weddings/:weddingId/profile/upload')
@UseGuards(JwtAuthGuard, WeddingTenantGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
export class VenueUploadController {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: StorageProvider,
    private readonly weddingsService: WeddingsService,
  ) {}

  @Post('ceremony-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, and WebP images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadCeremonyImage(
    @Param('weddingId') weddingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const current = await this.weddingsService.getProfile(weddingId);
    if (current.ceremonyImage) {
      const oldPath = current.ceremonyImage.replace(/^\/uploads\//, '');
      await this.storage.delete(oldPath);
    }

    const relativePath = await this.storage.save(file, 'venue-images');
    const url = this.storage.getUrl(relativePath);

    return this.weddingsService.updateProfile(weddingId, {
      ceremonyImage: url,
    });
  }

  @Post('reception-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, and WebP images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadReceptionImage(
    @Param('weddingId') weddingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const current = await this.weddingsService.getProfile(weddingId);
    if (current.receptionImage) {
      const oldPath = current.receptionImage.replace(/^\/uploads\//, '');
      await this.storage.delete(oldPath);
    }

    const relativePath = await this.storage.save(file, 'venue-images');
    const url = this.storage.getUrl(relativePath);

    return this.weddingsService.updateProfile(weddingId, {
      receptionImage: url,
    });
  }
}
