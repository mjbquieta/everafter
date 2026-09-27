import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { UpdatePlannerDto } from './dto/update-planner.dto';
import type {
  PlannerResponse,
  PlannerClientResponse,
} from '@everafter/types';
import type { Planner, PlannerClient, Wedding } from '@everafter/database';

@Injectable()
export class PlannersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Planner Profile ───────────────────────────────────────────────────────

  async create(
    userId: string,
    dto: CreatePlannerDto,
  ): Promise<PlannerResponse> {
    const existing = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (existing) {
      throw new ConflictException('Planner profile already exists');
    }

    const planner = await this.prisma.planner.create({
      data: {
        ownerId: userId,
        businessName: dto.businessName,
        website: dto.website,
        phone: dto.phone,
      },
      include: { clients: { include: { wedding: true } } },
    });

    return this.toPlannerResponse(planner);
  }

  async findByOwner(userId: string): Promise<PlannerResponse> {
    const planner = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
      include: { clients: { include: { wedding: true } } },
    });

    if (!planner) {
      throw new NotFoundException('Planner profile not found');
    }

    return this.toPlannerResponse(planner);
  }

  async update(
    userId: string,
    dto: UpdatePlannerDto,
  ): Promise<PlannerResponse> {
    const existing = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Planner profile not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.businessName !== undefined) data.businessName = dto.businessName;
    if (dto.website !== undefined) data.website = dto.website;
    if (dto.phone !== undefined) data.phone = dto.phone;

    const planner = await this.prisma.planner.update({
      where: { id: existing.id },
      data,
      include: { clients: { include: { wedding: true } } },
    });

    return this.toPlannerResponse(planner);
  }

  async remove(userId: string): Promise<void> {
    const existing = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Planner profile not found');
    }

    await this.prisma.planner.delete({
      where: { id: existing.id },
    });
  }

  // ─── Client Management ─────────────────────────────────────────────────────

  async addClient(
    userId: string,
    weddingId: string,
  ): Promise<PlannerClientResponse> {
    const planner = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (!planner) {
      throw new NotFoundException('Planner profile not found');
    }

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    const existingClient = await this.prisma.plannerClient.findUnique({
      where: {
        plannerId_weddingId: {
          plannerId: planner.id,
          weddingId,
        },
      },
    });

    if (existingClient) {
      throw new ConflictException('Wedding is already a client');
    }

    const client = await this.prisma.plannerClient.create({
      data: {
        plannerId: planner.id,
        weddingId,
      },
      include: { wedding: true },
    });

    return this.toClientResponse(client);
  }

  async findAllClients(userId: string): Promise<PlannerClientResponse[]> {
    const planner = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (!planner) {
      throw new NotFoundException('Planner profile not found');
    }

    const clients = await this.prisma.plannerClient.findMany({
      where: { plannerId: planner.id },
      include: { wedding: true },
      orderBy: { createdAt: 'desc' },
    });

    return clients.map((c) => this.toClientResponse(c));
  }

  async removeClient(userId: string, clientId: string): Promise<void> {
    const planner = await this.prisma.planner.findUnique({
      where: { ownerId: userId },
    });

    if (!planner) {
      throw new NotFoundException('Planner profile not found');
    }

    const client = await this.prisma.plannerClient.findFirst({
      where: { id: clientId, plannerId: planner.id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.prisma.plannerClient.delete({
      where: { id: clientId },
    });
  }

  // ─── Mappers ────────────────────────────────────────────────────────────────

  private toPlannerResponse(
    planner: Planner & { clients: (PlannerClient & { wedding: Wedding })[] },
  ): PlannerResponse {
    return {
      id: planner.id,
      ownerId: planner.ownerId,
      businessName: planner.businessName,
      website: planner.website,
      phone: planner.phone,
      clients: planner.clients.map((c) => this.toClientResponse(c)),
    };
  }

  private toClientResponse(
    client: PlannerClient & { wedding: Wedding },
  ): PlannerClientResponse {
    return {
      id: client.id,
      plannerId: client.plannerId,
      weddingId: client.weddingId,
      weddingTitle: client.wedding.title,
      createdAt: client.createdAt.toISOString(),
    };
  }
}
