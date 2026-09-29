import { Module } from '@nestjs/common';
import { WebsiteSettingsService } from './website-settings.service';
import { WebsiteSettingsController } from './website-settings.controller';
import { UploadController } from './upload.controller';
import { StorageModule } from '../../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [WebsiteSettingsController, UploadController],
  providers: [WebsiteSettingsService],
  exports: [WebsiteSettingsService],
})
export class WebsiteSettingsModule {}
