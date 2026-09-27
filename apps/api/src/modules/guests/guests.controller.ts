import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ListGuestsQueryDto } from './dto/list-guests-query.dto';

@Controller('weddings/:weddingId/guests')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  findAll(
    @Param('weddingId') weddingId: string,
    @Query() query: ListGuestsQueryDto,
  ) {
    return this.guestsService.findAll(weddingId, query);
  }

  @Get('summary')
  getSummary(@Param('weddingId') weddingId: string) {
    return this.guestsService.getSummary(weddingId);
  }

  @Get(':guestId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestsService.findOne(weddingId, guestId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Body() dto: CreateGuestDto,
  ) {
    return this.guestsService.create(weddingId, dto);
  }

  @Patch(':guestId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guestsService.update(weddingId, guestId, dto);
  }

  @Delete(':guestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestsService.remove(weddingId, guestId);
  }
}
