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
import { BudgetService } from './budget.service';
import { CreateBudgetItemDto } from './dto/create-budget-item.dto';
import { UpdateBudgetItemDto } from './dto/update-budget-item.dto';

@Controller('weddings/:weddingId/budget/categories/:categoryId/items')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class BudgetItemsController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  findAll(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.budgetService.findAllItems(weddingId, categoryId);
  }

  @Get(':itemId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.budgetService.findOneItem(weddingId, categoryId, itemId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateBudgetItemDto,
  ) {
    return this.budgetService.createItem(weddingId, categoryId, dto);
  }

  @Patch(':itemId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateBudgetItemDto,
  ) {
    return this.budgetService.updateItem(weddingId, categoryId, itemId, dto);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.budgetService.removeItem(weddingId, categoryId, itemId);
  }
}
