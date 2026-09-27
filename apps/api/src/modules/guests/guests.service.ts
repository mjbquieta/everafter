import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ListGuestsQueryDto } from './dto/list-guests-query.dto';
import { SubmitRsvpDto } from './dto/submit-rsvp.dto';
import type {
  GuestResponse,
  RSVPResponse,
  GuestSummaryResponse,
} from '@everafter/types';
import { RSVPStatus } from '@everafter/types';
import type { Guest, RSVP } from '@everafter/database';
import { RSVPStatus as PrismaRSVPStatus } from '@everafter/database';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Guest CRUD ──────────────────────────────────────────────────────────────

  async create(
    weddingId: string,
    dto: CreateGuestDto,
  ): Promise<GuestResponse> {
    const guest = await this.prisma.guest.create({
      data: {
        weddingId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        group: dto.group,
        side: dto.side,
        tableNumber: dto.tableNumber,
        mealPreference: dto.mealPreference,
        notes: dto.notes,
      },
      include: { rsvp: true },
    });

    return this.toGuestResponse(guest);
  }

  async findAll(
    weddingId: string,
    query: ListGuestsQueryDto,
  ): Promise<GuestResponse[]> {
    const where: Record<string, unknown> = { weddingId };

    if (query.group) where.group = query.group;
    if (query.side) where.side = query.side;
    if (query.invitationStatus) where.invitationStatus = query.invitationStatus;
    if (query.rsvpStatus) {
      where.rsvp = { status: query.rsvpStatus };
    }

    const guests = await this.prisma.guest.findMany({
      where,
      include: { rsvp: true },
      orderBy: { createdAt: 'asc' },
    });

    return guests.map((g) => this.toGuestResponse(g));
  }

  async findOne(
    weddingId: string,
    guestId: string,
  ): Promise<GuestResponse> {
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId },
      include: { rsvp: true },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return this.toGuestResponse(guest);
  }

  async update(
    weddingId: string,
    guestId: string,
    dto: UpdateGuestDto,
  ): Promise<GuestResponse> {
    const existing = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId },
    });

    if (!existing) {
      throw new NotFoundException('Guest not found');
    }

    const data: Record<string, unknown> = {};

    const fields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'group',
      'side',
      'tableNumber',
      'mealPreference',
      'notes',
    ] as const;

    for (const field of fields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field];
      }
    }

    const guest = await this.prisma.guest.update({
      where: { id: guestId },
      data,
      include: { rsvp: true },
    });

    return this.toGuestResponse(guest);
  }

  async remove(weddingId: string, guestId: string): Promise<void> {
    const existing = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId },
    });

    if (!existing) {
      throw new NotFoundException('Guest not found');
    }

    await this.prisma.guest.delete({
      where: { id: guestId },
    });
  }

  async getSummary(weddingId: string): Promise<GuestSummaryResponse> {
    const [totalGuests, rsvpAccepted, rsvpDeclined, rsvpPending, companionAgg] =
      await Promise.all([
        this.prisma.guest.count({ where: { weddingId } }),
        this.prisma.rSVP.count({
          where: {
            guest: { weddingId },
            status: RSVPStatus.ACCEPTED,
          },
        }),
        this.prisma.rSVP.count({
          where: {
            guest: { weddingId },
            status: RSVPStatus.DECLINED,
          },
        }),
        this.prisma.rSVP.count({
          where: {
            guest: { weddingId },
            status: RSVPStatus.PENDING,
          },
        }),
        this.prisma.rSVP.aggregate({
          where: {
            guest: { weddingId },
            status: RSVPStatus.ACCEPTED,
          },
          _sum: { companionCount: true },
        }),
      ]);

    const totalCompanions = companionAgg._sum.companionCount ?? 0;

    return {
      totalGuests,
      rsvpAccepted,
      rsvpDeclined,
      rsvpPending,
      totalCompanions,
      totalAttending: rsvpAccepted + totalCompanions,
    };
  }

  // ─── RSVP ────────────────────────────────────────────────────────────────────

  async submitRsvp(
    weddingId: string,
    guestId: string,
    dto: SubmitRsvpDto,
  ): Promise<RSVPResponse> {
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    const respondedAt =
      dto.status === RSVPStatus.ACCEPTED || dto.status === RSVPStatus.DECLINED
        ? new Date()
        : undefined;

    const rsvp = await this.prisma.rSVP.upsert({
      where: { guestId },
      create: {
        guestId,
        status: dto.status as PrismaRSVPStatus,
        companionCount: dto.companionCount ?? 0,
        mealPreference: dto.mealPreference,
        songRequest: dto.songRequest,
        notes: dto.notes,
        respondedAt: respondedAt ?? null,
      },
      update: {
        status: dto.status as PrismaRSVPStatus,
        companionCount: dto.companionCount ?? 0,
        mealPreference: dto.mealPreference,
        songRequest: dto.songRequest,
        notes: dto.notes,
        ...(respondedAt ? { respondedAt } : {}),
      },
    });

    return this.toRsvpResponse(rsvp);
  }

  async getRsvp(
    weddingId: string,
    guestId: string,
  ): Promise<RSVPResponse> {
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    const rsvp = await this.prisma.rSVP.findUnique({
      where: { guestId },
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    return this.toRsvpResponse(rsvp);
  }

  // ─── Mappers ─────────────────────────────────────────────────────────────────

  private toGuestResponse(
    guest: Guest & { rsvp: RSVP | null },
  ): GuestResponse {
    return {
      id: guest.id,
      weddingId: guest.weddingId,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      group: guest.group,
      side: guest.side,
      tableNumber: guest.tableNumber,
      invitationStatus: guest.invitationStatus,
      mealPreference: guest.mealPreference,
      notes: guest.notes,
      rsvp: guest.rsvp ? this.toRsvpResponse(guest.rsvp) : null,
      createdAt: guest.createdAt.toISOString(),
      updatedAt: guest.updatedAt.toISOString(),
    };
  }

  private toRsvpResponse(rsvp: RSVP): RSVPResponse {
    return {
      id: rsvp.id,
      guestId: rsvp.guestId,
      status: rsvp.status as RSVPStatus,
      companionCount: rsvp.companionCount,
      mealPreference: rsvp.mealPreference,
      songRequest: rsvp.songRequest,
      notes: rsvp.notes,
      respondedAt: rsvp.respondedAt?.toISOString() ?? null,
    };
  }
}
