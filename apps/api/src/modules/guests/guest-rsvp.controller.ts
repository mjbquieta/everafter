import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { GuestsService } from './guests.service';
import { SubmitRsvpDto } from './dto/submit-rsvp.dto';

@Controller('weddings/:weddingId/guests/:guestId/rsvp')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class GuestRsvpController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  getRsvp(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestsService.getRsvp(weddingId, guestId);
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  submitRsvp(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
    @Body() dto: SubmitRsvpDto,
  ) {
    return this.guestsService.submitRsvp(weddingId, guestId, dto);
  }
}
