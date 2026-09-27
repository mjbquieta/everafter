import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetCategoryDto } from './dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from './dto/update-budget-category.dto';
import { ReorderBudgetCategoriesDto } from './dto/reorder-budget-categories.dto';
import { CreateBudgetItemDto } from './dto/create-budget-item.dto';
import { UpdateBudgetItemDto } from './dto/update-budget-item.dto';
import type {
  BudgetCategoryResponse,
  BudgetItemResponse,
  BudgetSummaryResponse,
} from '@everafter/types';
import type { BudgetCategory, BudgetItem } from '@everafter/database';
import { PaymentStatus as PrismaPaymentStatus } from '@everafter/database';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async ensureCategoryBelongsToWedding(
    weddingId: string,
    categoryId: string,
  ): Promise<BudgetCategory> {
    const category = await this.prisma.budgetCategory.findFirst({
      where: { id: categoryId, weddingId },
    });

    if (!category) {
      throw new NotFoundException('Budget category not found');
    }

    return category;
  }

  // ─── Category CRUD ──────────────────────────────────────────────────────────

  async createCategory(
    weddingId: string,
    dto: CreateBudgetCategoryDto,
  ): Promise<BudgetCategoryResponse> {
    const category = await this.prisma.budgetCategory.create({
      data: {
        weddingId,
        name: dto.name,
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      include: { items: true },
    });

    return this.toBudgetCategoryResponse(category);
  }

  async findAllCategories(
    weddingId: string,
  ): Promise<BudgetCategoryResponse[]> {
    const categories = await this.prisma.budgetCategory.findMany({
      where: { weddingId },
      include: { items: true },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => this.toBudgetCategoryResponse(c));
  }

  async findOneCategory(
    weddingId: string,
    categoryId: string,
  ): Promise<BudgetCategoryResponse> {
    const category = await this.prisma.budgetCategory.findFirst({
      where: { id: categoryId, weddingId },
      include: { items: true },
    });

    if (!category) {
      throw new NotFoundException('Budget category not found');
    }

    return this.toBudgetCategoryResponse(category);
  }

  async updateCategory(
    weddingId: string,
    categoryId: string,
    dto: UpdateBudgetCategoryDto,
  ): Promise<BudgetCategoryResponse> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const category = await this.prisma.budgetCategory.update({
      where: { id: categoryId },
      data,
      include: { items: true },
    });

    return this.toBudgetCategoryResponse(category);
  }

  async removeCategory(
    weddingId: string,
    categoryId: string,
  ): Promise<void> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    await this.prisma.budgetCategory.delete({
      where: { id: categoryId },
    });
  }

  async reorderCategories(
    weddingId: string,
    dto: ReorderBudgetCategoriesDto,
  ): Promise<BudgetCategoryResponse[]> {
    // Verify all IDs belong to this wedding
    const existing = await this.prisma.budgetCategory.findMany({
      where: { weddingId },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((c) => c.id));
    for (const id of dto.categoryIds) {
      if (!existingIds.has(id)) {
        throw new NotFoundException(
          `Budget category ${id} not found in this wedding`,
        );
      }
    }

    await this.prisma.$transaction(
      dto.categoryIds.map((id, index) =>
        this.prisma.budgetCategory.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    return this.findAllCategories(weddingId);
  }

  // ─── Item CRUD ──────────────────────────────────────────────────────────────

  async createItem(
    weddingId: string,
    categoryId: string,
    dto: CreateBudgetItemDto,
  ): Promise<BudgetItemResponse> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const item = await this.prisma.budgetItem.create({
      data: {
        categoryId,
        vendorName: dto.vendorName,
        estimatedCost: dto.estimatedCost,
        actualCost: dto.actualCost,
        amountPaid: dto.amountPaid,
        paymentStatus: dto.paymentStatus as PrismaPaymentStatus | undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        notes: dto.notes,
      },
    });

    return this.toBudgetItemResponse(item);
  }

  async findAllItems(
    weddingId: string,
    categoryId: string,
  ): Promise<BudgetItemResponse[]> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const items = await this.prisma.budgetItem.findMany({
      where: { categoryId },
      orderBy: { id: 'asc' },
    });

    return items.map((i) => this.toBudgetItemResponse(i));
  }

  async findOneItem(
    weddingId: string,
    categoryId: string,
    itemId: string,
  ): Promise<BudgetItemResponse> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const item = await this.prisma.budgetItem.findFirst({
      where: { id: itemId, categoryId },
    });

    if (!item) {
      throw new NotFoundException('Budget item not found');
    }

    return this.toBudgetItemResponse(item);
  }

  async updateItem(
    weddingId: string,
    categoryId: string,
    itemId: string,
    dto: UpdateBudgetItemDto,
  ): Promise<BudgetItemResponse> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const existing = await this.prisma.budgetItem.findFirst({
      where: { id: itemId, categoryId },
    });

    if (!existing) {
      throw new NotFoundException('Budget item not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.vendorName !== undefined) data.vendorName = dto.vendorName;
    if (dto.estimatedCost !== undefined) data.estimatedCost = dto.estimatedCost;
    if (dto.actualCost !== undefined) data.actualCost = dto.actualCost;
    if (dto.amountPaid !== undefined) data.amountPaid = dto.amountPaid;
    if (dto.paymentStatus !== undefined)
      data.paymentStatus = dto.paymentStatus as PrismaPaymentStatus;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.notes !== undefined) data.notes = dto.notes;

    const item = await this.prisma.budgetItem.update({
      where: { id: itemId },
      data,
    });

    return this.toBudgetItemResponse(item);
  }

  async removeItem(
    weddingId: string,
    categoryId: string,
    itemId: string,
  ): Promise<void> {
    await this.ensureCategoryBelongsToWedding(weddingId, categoryId);

    const existing = await this.prisma.budgetItem.findFirst({
      where: { id: itemId, categoryId },
    });

    if (!existing) {
      throw new NotFoundException('Budget item not found');
    }

    await this.prisma.budgetItem.delete({
      where: { id: itemId },
    });
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  async getSummary(weddingId: string): Promise<BudgetSummaryResponse> {
    const categories = await this.prisma.budgetCategory.findMany({
      where: { weddingId },
      include: { items: true },
      orderBy: { sortOrder: 'asc' },
    });

    let totalEstimated = 0;
    let totalActual = 0;
    let totalPaid = 0;

    const categoryBreakdown = categories.map((cat) => {
      let catEstimated = 0;
      let catActual = 0;
      let catPaid = 0;

      for (const item of cat.items) {
        catEstimated += Number(item.estimatedCost);
        catActual += Number(item.actualCost);
        catPaid += Number(item.amountPaid);
      }

      totalEstimated += catEstimated;
      totalActual += catActual;
      totalPaid += catPaid;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        estimatedCost: catEstimated,
        actualCost: catActual,
        amountPaid: catPaid,
      };
    });

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      categories: categoryBreakdown,
    };
  }

  // ─── Mappers ────────────────────────────────────────────────────────────────

  private toBudgetCategoryResponse(
    category: BudgetCategory & { items: BudgetItem[] },
  ): BudgetCategoryResponse {
    return {
      id: category.id,
      weddingId: category.weddingId,
      name: category.name,
      sortOrder: category.sortOrder,
      items: category.items.map((i) => this.toBudgetItemResponse(i)),
    };
  }

  private toBudgetItemResponse(item: BudgetItem): BudgetItemResponse {
    return {
      id: item.id,
      categoryId: item.categoryId,
      vendorName: item.vendorName,
      estimatedCost: Number(item.estimatedCost),
      actualCost: Number(item.actualCost),
      amountPaid: Number(item.amountPaid),
      paymentStatus: item.paymentStatus as string,
      dueDate: item.dueDate?.toISOString() ?? null,
      notes: item.notes,
    };
  }
}
