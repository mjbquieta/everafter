import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetCategoriesController } from './budget-categories.controller';
import { BudgetItemsController } from './budget-items.controller';

@Module({
  controllers: [BudgetCategoriesController, BudgetItemsController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
