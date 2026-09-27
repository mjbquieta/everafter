import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { GuestRsvpController } from './guest-rsvp.controller';

@Module({
  controllers: [GuestsController, GuestRsvpController],
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
