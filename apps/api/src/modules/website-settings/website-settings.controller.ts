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
import { WebsiteSettingsService } from './website-settings.service';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';

@Controller('weddings/:weddingId/website-settings')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class WebsiteSettingsController {
  constructor(
    private readonly websiteSettingsService: WebsiteSettingsService,
  ) {}

  @Get()
  get(@Param('weddingId') weddingId: string) {
    return this.websiteSettingsService.get(weddingId);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Body() dto: UpdateWebsiteSettingsDto,
  ) {
    return this.websiteSettingsService.update(weddingId, dto);
  }
}
