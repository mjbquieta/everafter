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
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { BudgetService } from './budget.service';
import { CreateBudgetCategoryDto } from './dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from './dto/update-budget-category.dto';
import { ReorderBudgetCategoriesDto } from './dto/reorder-budget-categories.dto';

@Controller('weddings/:weddingId/budget/categories')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class BudgetCategoriesController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  findAll(@Param('weddingId') weddingId: string) {
    return this.budgetService.findAllCategories(weddingId);
  }

  @Get('summary')
  getSummary(@Param('weddingId') weddingId: string) {
    return this.budgetService.getSummary(weddingId);
  }

  @Get(':categoryId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.budgetService.findOneCategory(weddingId, categoryId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Body() dto: CreateBudgetCategoryDto,
  ) {
    return this.budgetService.createCategory(weddingId, dto);
  }

  @Patch(':categoryId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateBudgetCategoryDto,
  ) {
    return this.budgetService.updateCategory(weddingId, categoryId, dto);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.budgetService.removeCategory(weddingId, categoryId);
  }

  @Put('reorder')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  reorder(
    @Param('weddingId') weddingId: string,
    @Body() dto: ReorderBudgetCategoriesDto,
  ) {
    return this.budgetService.reorderCategories(weddingId, dto);
  }
}
