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
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { WeddingsService } from './weddings.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';

@Controller('weddings')
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser, @Body() dto: CreateWeddingDto) {
    return this.weddingsService.create(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestWithUser) {
    return this.weddingsService.findAllByUser(req.user.userId);
  }

  @Get(':weddingId')
  @UseGuards(JwtAuthGuard, WeddingTenantGuard)
  findOne(@Param('weddingId') weddingId: string) {
    return this.weddingsService.findById(weddingId);
  }

  @Patch(':weddingId')
  @UseGuards(JwtAuthGuard, WeddingTenantGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  update(
    @Param('weddingId') weddingId: string,
    @Body() dto: UpdateWeddingDto,
  ) {
    return this.weddingsService.update(weddingId, dto);
  }

  @Delete(':weddingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, WeddingTenantGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  remove(@Param('weddingId') weddingId: string) {
    return this.weddingsService.softDelete(weddingId);
  }
}
