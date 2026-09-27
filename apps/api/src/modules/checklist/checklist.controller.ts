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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { ChecklistService } from './checklist.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Controller('weddings/:weddingId/checklist')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  findAll(@Param('weddingId') weddingId: string) {
    return this.checklistService.findAll(weddingId);
  }

  @Get('summary')
  getSummary(@Param('weddingId') weddingId: string) {
    return this.checklistService.getSummary(weddingId);
  }

  @Get('templates')
  findAllTemplates() {
    return this.checklistService.findAllTemplates();
  }

  @Get(':itemId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.checklistService.findOne(weddingId, itemId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.checklistService.create(weddingId, dto);
  }

  @Post('apply-template/:templateId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  applyTemplate(
    @Param('weddingId') weddingId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.checklistService.applyTemplate(weddingId, templateId);
  }

  @Patch(':itemId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.checklistService.update(weddingId, itemId, dto);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.checklistService.remove(weddingId, itemId);
  }
}
