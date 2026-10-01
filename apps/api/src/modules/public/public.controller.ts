import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { PublicRsvpDto } from './dto/public-rsvp.dto';

@Controller('public/weddings')
@SkipThrottle()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':slug')
  getWedding(@Param('slug') slug: string) {
    return this.publicService.getWeddingBySlug(slug);
  }

  @Get(':slug/guests/search')
  searchGuests(
    @Param('slug') slug: string,
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
  ) {
    return this.publicService.searchGuests(slug, firstName, lastName);
  }

  @Get(':slug/guests/:guestId')
  getGuestById(
    @Param('slug') slug: string,
    @Param('guestId') guestId: string,
  ) {
    return this.publicService.getGuestById(slug, guestId);
  }

  @Post(':slug/rsvp')
  submitRsvp(
    @Param('slug') slug: string,
    @Body() dto: PublicRsvpDto,
  ) {
    return this.publicService.submitRsvp(slug, dto);
  }
}
