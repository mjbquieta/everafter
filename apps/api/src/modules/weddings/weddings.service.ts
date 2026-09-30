import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateWeddingProfileDto } from './dto/update-wedding-profile.dto';
import type {
  WeddingResponse,
  WeddingMemberResponse,
  WeddingProfileResponse,
} from '@everafter/types';
import { WeddingStatus, UserRole } from '@everafter/types';
import type { Wedding, WeddingMember, WeddingProfile } from '@everafter/database';

@Injectable()
export class WeddingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Wedding CRUD ───────────────────────────────────────────────────────────

  async create(
    userId: string,
    dto: CreateWeddingDto,
  ): Promise<WeddingResponse> {
    const slug = await this.generateSlug(dto.title);

    const wedding = await this.prisma.$transaction(async (tx) => {
      const w = await tx.wedding.create({
        data: {
          slug,
          title: dto.title,
          weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : null,
          timezone: dto.timezone ?? 'Asia/Manila',
        },
      });

      await tx.weddingMember.create({
        data: {
          weddingId: w.id,
          userId,
          role: UserRole.COUPLE,
        },
      });

      await tx.weddingProfile.create({
        data: { weddingId: w.id },
      });

      await tx.websiteSettings.create({
        data: { weddingId: w.id },
      });

      return w;
    });

    return this.toWeddingResponse(wedding);
  }

  async findAllByUser(userId: string): Promise<WeddingResponse[]> {
    const members = await this.prisma.weddingMember.findMany({
      where: { userId },
      include: { wedding: true },
    });

    return members
      .filter((m) => m.wedding.deletedAt === null)
      .map((m) => this.toWeddingResponse(m.wedding));
  }

  async findById(weddingId: string): Promise<WeddingResponse> {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding || wedding.deletedAt !== null) {
      throw new NotFoundException('Wedding not found');
    }

    return this.toWeddingResponse(wedding);
  }

  async update(
    weddingId: string,
    dto: UpdateWeddingDto,
  ): Promise<WeddingResponse> {
    const existing = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!existing || existing.deletedAt !== null) {
      throw new NotFoundException('Wedding not found');
    }

    const data: Record<string, unknown> = {};

    if (dto.slug !== undefined) {
      const normalized = dto.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!normalized) {
        throw new ConflictException('Slug cannot be empty');
      }

      if (normalized !== existing.slug) {
        const taken = await this.prisma.wedding.findUnique({
          where: { slug: normalized },
        });
        if (taken) {
          throw new ConflictException('This URL path is already taken');
        }
        data.slug = normalized;
      }
    }

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.timezone !== undefined) data.timezone = dto.timezone;
    if (dto.customDomain !== undefined) data.customDomain = dto.customDomain;

    if (dto.weddingDate !== undefined) {
      data.weddingDate = dto.weddingDate ? new Date(dto.weddingDate) : null;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
      if (
        dto.status === WeddingStatus.PUBLISHED &&
        existing.status !== WeddingStatus.PUBLISHED
      ) {
        data.publishedAt = new Date();
      }
    }

    const wedding = await this.prisma.wedding.update({
      where: { id: weddingId },
      data,
    });

    return this.toWeddingResponse(wedding);
  }

  async softDelete(weddingId: string): Promise<void> {
    const existing = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!existing || existing.deletedAt !== null) {
      throw new NotFoundException('Wedding not found');
    }

    await this.prisma.wedding.update({
      where: { id: weddingId },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Members ────────────────────────────────────────────────────────────────

  async listMembers(weddingId: string): Promise<WeddingMemberResponse[]> {
    const members = await this.prisma.weddingMember.findMany({
      where: { weddingId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return members.map((m) => this.toMemberResponse(m));
  }

  async inviteMember(
    weddingId: string,
    invitedByUserId: string,
    dto: InviteMemberDto,
  ): Promise<WeddingMemberResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const existingMember = await this.prisma.weddingMember.findUnique({
      where: {
        weddingId_userId: {
          weddingId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this wedding');
    }

    const member = await this.prisma.weddingMember.create({
      data: {
        weddingId,
        userId: user.id,
        role: dto.role,
        invitedBy: invitedByUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.toMemberResponse(member);
  }

  async updateMemberRole(
    weddingId: string,
    memberId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<WeddingMemberResponse> {
    const member = await this.prisma.weddingMember.findFirst({
      where: { id: memberId, weddingId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const updated = await this.prisma.weddingMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.toMemberResponse(updated);
  }

  async removeMember(weddingId: string, memberId: string): Promise<void> {
    const member = await this.prisma.weddingMember.findFirst({
      where: { id: memberId, weddingId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.prisma.weddingMember.delete({
      where: { id: memberId },
    });
  }

  // ─── Profile ────────────────────────────────────────────────────────────────

  async getProfile(weddingId: string): Promise<WeddingProfileResponse> {
    const profile = await this.prisma.weddingProfile.findUnique({
      where: { weddingId },
    });

    if (!profile) {
      throw new NotFoundException('Wedding profile not found');
    }

    return this.toProfileResponse(profile);
  }

  async updateProfile(
    weddingId: string,
    dto: UpdateWeddingProfileDto,
  ): Promise<WeddingProfileResponse> {
    const data: Record<string, unknown> = {};

    const stringFields = [
      'brideName',
      'groomName',
      'proposalStory',
      'loveStory',
      'weddingHashtag',
      'ceremonyName',
      'ceremonyAddress',
      'receptionName',
      'receptionAddress',
      'ceremonyImage',
      'receptionImage',
      'dressCode',
    ] as const;

    for (const field of stringFields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field];
      }
    }

    if (dto.dressCodeColors !== undefined) {
      data.dressCodeColors = dto.dressCodeColors
        ? JSON.stringify(dto.dressCodeColors)
        : null;
    }

    const dateFields = ['ceremonyTime', 'receptionTime'] as const;

    for (const field of dateFields) {
      if (dto[field] !== undefined) {
        if (!dto[field]) {
          data[field] = null;
        } else {
          const raw = dto[field] as string;
          // Handle bare time strings like "14:30" from <input type="time">
          const parsed = /^\d{2}:\d{2}$/.test(raw)
            ? new Date(`1970-01-01T${raw}:00Z`)
            : new Date(raw);
          data[field] = isNaN(parsed.getTime()) ? null : parsed;
        }
      }
    }

    const profile = await this.prisma.weddingProfile.upsert({
      where: { weddingId },
      update: data,
      create: { weddingId, ...data },
    });

    return this.toProfileResponse(profile);
  }

  // ─── Slug Generation ────────────────────────────────────────────────────────

  private async generateSlug(title: string): Promise<string> {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      slug = `wedding-${randomBytes(3).toString('hex')}`;
    }

    const existing = await this.prisma.wedding.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${randomBytes(3).toString('hex')}`;
    }

    return slug;
  }

  // ─── Mappers ────────────────────────────────────────────────────────────────

  private toWeddingResponse(wedding: Wedding): WeddingResponse {
    return {
      id: wedding.id,
      slug: wedding.slug,
      title: wedding.title,
      weddingDate: wedding.weddingDate?.toISOString() ?? null,
      timezone: wedding.timezone,
      status: wedding.status as WeddingStatus,
      publishedAt: wedding.publishedAt?.toISOString() ?? null,
      customDomain: wedding.customDomain,
      createdAt: wedding.createdAt.toISOString(),
      updatedAt: wedding.updatedAt.toISOString(),
    };
  }

  private toMemberResponse(
    member: WeddingMember & {
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
      };
    },
  ): WeddingMemberResponse {
    return {
      id: member.id,
      weddingId: member.weddingId,
      userId: member.userId,
      role: member.role as UserRole,
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        email: member.user.email,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        avatarUrl: member.user.avatarUrl,
      },
    };
  }

  private toProfileResponse(profile: WeddingProfile): WeddingProfileResponse {
    return {
      id: profile.id,
      weddingId: profile.weddingId,
      brideName: profile.brideName,
      groomName: profile.groomName,
      proposalStory: profile.proposalStory,
      loveStory: profile.loveStory,
      weddingHashtag: profile.weddingHashtag,
      ceremonyName: profile.ceremonyName,
      ceremonyAddress: profile.ceremonyAddress,
      ceremonyTime: profile.ceremonyTime?.toISOString() ?? null,
      receptionName: profile.receptionName,
      receptionAddress: profile.receptionAddress,
      receptionTime: profile.receptionTime?.toISOString() ?? null,
      ceremonyImage: profile.ceremonyImage,
      receptionImage: profile.receptionImage,
      dressCode: profile.dressCode,
      dressCodeColors: profile.dressCodeColors
        ? (JSON.parse(profile.dressCodeColors) as string[])
        : null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
