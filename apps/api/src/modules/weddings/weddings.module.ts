import { Module } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { WeddingsController } from './weddings.controller';
import { WeddingMembersController } from './wedding-members.controller';
import { WeddingProfileController } from './wedding-profile.controller';
import { VenueUploadController } from './venue-upload.controller';
import { StorageModule } from '../../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [
    WeddingsController,
    WeddingMembersController,
    WeddingProfileController,
    VenueUploadController,
  ],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
