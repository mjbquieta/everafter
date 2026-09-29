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
import { WebsiteSettingsService } from './website-settings.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Controller('weddings/:weddingId/website-settings/upload')
@UseGuards(JwtAuthGuard, WeddingTenantGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
export class UploadController {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: StorageProvider,
    private readonly websiteSettingsService: WebsiteSettingsService,
  ) {}

  @Post('hero-banner')
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
  async uploadHeroBanner(
    @Param('weddingId') weddingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Delete old banner if exists
    const current = await this.websiteSettingsService.get(weddingId);
    if (current.heroBanner) {
      const oldPath = current.heroBanner.replace(/^\/uploads\//, '');
      await this.storage.delete(oldPath);
    }

    // Save new file
    const relativePath = await this.storage.save(file, 'hero-banners');
    const url = this.storage.getUrl(relativePath);

    // Update settings
    return this.websiteSettingsService.update(weddingId, {
      heroBanner: url,
    });
  }
}
