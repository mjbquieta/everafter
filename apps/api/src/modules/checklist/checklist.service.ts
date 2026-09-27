import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import type {
  ChecklistItemResponse,
  ChecklistSummaryResponse,
  ChecklistTemplateResponse,
} from '@everafter/types';
import type { ChecklistItem } from '@everafter/database';
import { ChecklistPriority as PrismaChecklistPriority } from '@everafter/database';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Checklist Item CRUD ────────────────────────────────────────────────────

  async create(
    weddingId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItemResponse> {
    const item = await this.prisma.checklistItem.create({
      data: {
        weddingId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority as PrismaChecklistPriority | undefined,
        assignedTo: dto.assignedTo,
      },
    });

    return this.toChecklistItemResponse(item);
  }

  async findAll(weddingId: string): Promise<ChecklistItemResponse[]> {
    const items = await this.prisma.checklistItem.findMany({
      where: { weddingId },
      orderBy: { createdAt: 'asc' },
    });

    return items.map((i) => this.toChecklistItemResponse(i));
  }

  async findOne(
    weddingId: string,
    itemId: string,
  ): Promise<ChecklistItemResponse> {
    const item = await this.prisma.checklistItem.findFirst({
      where: { id: itemId, weddingId },
    });

    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    return this.toChecklistItemResponse(item);
  }

  async update(
    weddingId: string,
    itemId: string,
    dto: UpdateChecklistItemDto,
  ): Promise<ChecklistItemResponse> {
    const existing = await this.prisma.checklistItem.findFirst({
      where: { id: itemId, weddingId },
    });

    if (!existing) {
      throw new NotFoundException('Checklist item not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.priority !== undefined)
      data.priority = dto.priority as PrismaChecklistPriority;
    if (dto.assignedTo !== undefined) data.assignedTo = dto.assignedTo;
    if (dto.completed !== undefined) {
      data.completedAt = dto.completed ? new Date() : null;
    }

    const item = await this.prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });

    return this.toChecklistItemResponse(item);
  }

  async remove(weddingId: string, itemId: string): Promise<void> {
    const existing = await this.prisma.checklistItem.findFirst({
      where: { id: itemId, weddingId },
    });

    if (!existing) {
      throw new NotFoundException('Checklist item not found');
    }

    await this.prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  async getSummary(weddingId: string): Promise<ChecklistSummaryResponse> {
    const items = await this.prisma.checklistItem.findMany({
      where: { weddingId },
    });

    let totalItems = 0;
    let completedItems = 0;
    let overdueItems = 0;
    const now = new Date();

    for (const item of items) {
      totalItems++;
      if (item.completedAt) {
        completedItems++;
      } else if (item.dueDate && item.dueDate < now) {
        overdueItems++;
      }
    }

    return {
      totalItems,
      completedItems,
      pendingItems: totalItems - completedItems,
      overdueItems,
    };
  }

  // ─── Templates ──────────────────────────────────────────────────────────────

  async findAllTemplates(): Promise<ChecklistTemplateResponse[]> {
    const templates = await this.prisma.checklistTemplate.findMany({
      orderBy: { name: 'asc' },
    });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      items: t.items as Record<string, unknown>[],
    }));
  }

  async applyTemplate(
    weddingId: string,
    templateId: string,
  ): Promise<ChecklistItemResponse[]> {
    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Checklist template not found');
    }

    const templateItems = template.items as Array<{
      title: string;
      description?: string;
      priority?: string;
    }>;

    const created = await this.prisma.$transaction(
      templateItems.map((ti) =>
        this.prisma.checklistItem.create({
          data: {
            weddingId,
            title: ti.title,
            description: ti.description,
            priority: (ti.priority as PrismaChecklistPriority) ?? 'MEDIUM',
          },
        }),
      ),
    );

    return created.map((i) => this.toChecklistItemResponse(i));
  }

  // ─── Mapper ─────────────────────────────────────────────────────────────────

  private toChecklistItemResponse(
    item: ChecklistItem,
  ): ChecklistItemResponse {
    return {
      id: item.id,
      weddingId: item.weddingId,
      title: item.title,
      description: item.description,
      dueDate: item.dueDate?.toISOString() ?? null,
      priority: item.priority as string,
      completedAt: item.completedAt?.toISOString() ?? null,
      assignedTo: item.assignedTo,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
