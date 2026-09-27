import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { WeddingsService } from './weddings.service';
import { UpdateWeddingProfileDto } from './dto/update-wedding-profile.dto';

@Controller('weddings/:weddingId/profile')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class WeddingProfileController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get()
  getProfile(@Param('weddingId') weddingId: string) {
    return this.weddingsService.getProfile(weddingId);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  updateProfile(
    @Param('weddingId') weddingId: string,
    @Body() dto: UpdateWeddingProfileDto,
  ) {
    return this.weddingsService.updateProfile(weddingId, dto);
  }
}
