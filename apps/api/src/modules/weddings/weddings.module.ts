import { Module } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { WeddingsController } from './weddings.controller';
import { WeddingMembersController } from './wedding-members.controller';
import { WeddingProfileController } from './wedding-profile.controller';

@Module({
  controllers: [
    WeddingsController,
    WeddingMembersController,
    WeddingProfileController,
  ],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
