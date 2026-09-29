import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WeddingStatus } from '@everafter/types';
import type { RSVPStatus } from '@everafter/types';
import { RSVPStatus as PrismaRSVPStatus } from '@everafter/database';
import { PublicRsvpDto } from './dto/public-rsvp.dto';

export interface PublicWeddingData {
  wedding: {
    slug: string;
    title: string;
    weddingDate: string | null;
    timezone: string;
    status: string;
  };
  profile: {
    brideName: string | null;
    groomName: string | null;
    proposalStory: string | null;
    loveStory: string | null;
    weddingHashtag: string | null;
    ceremonyName: string | null;
    ceremonyAddress: string | null;
    ceremonyTime: string | null;
    receptionName: string | null;
    receptionAddress: string | null;
    receptionTime: string | null;
    dressCode: string | null;
    dressCodeColors: string[] | null;
  };
  settings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroImage: string | null;
    heroBanner: string | null;
    navigationStyle: string;
    dividerStyle: string;
    dividerSize: string;
    animations: boolean;
    footerText: string | null;
  };
}

export interface PublicGuestSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string | null;
  companionCount: number;
  mealPreference: string | null;
  notes: string | null;
}

export interface PublicRsvpResult {
  guestId: string;
  status: string;
  respondedAt: string | null;
}

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeddingBySlug(slug: string): Promise<PublicWeddingData> {
    const wedding = await this.prisma.wedding.findUnique({
      where: { slug },
      include: {
        profile: true,
        websiteSettings: true,
      },
    });

    if (
      !wedding ||
      wedding.deletedAt !== null ||
      wedding.status !== WeddingStatus.PUBLISHED
    ) {
      throw new NotFoundException('Wedding not found');
    }

    return {
      wedding: {
        slug: wedding.slug,
        title: wedding.title,
        weddingDate: wedding.weddingDate?.toISOString() ?? null,
        timezone: wedding.timezone,
        status: wedding.status,
      },
      profile: {
        brideName: wedding.profile?.brideName ?? null,
        groomName: wedding.profile?.groomName ?? null,
        proposalStory: wedding.profile?.proposalStory ?? null,
        loveStory: wedding.profile?.loveStory ?? null,
        weddingHashtag: wedding.profile?.weddingHashtag ?? null,
        ceremonyName: wedding.profile?.ceremonyName ?? null,
        ceremonyAddress: wedding.profile?.ceremonyAddress ?? null,
        ceremonyTime: wedding.profile?.ceremonyTime?.toISOString() ?? null,
        receptionName: wedding.profile?.receptionName ?? null,
        receptionAddress: wedding.profile?.receptionAddress ?? null,
        receptionTime: wedding.profile?.receptionTime?.toISOString() ?? null,
        dressCode: wedding.profile?.dressCode ?? null,
        dressCodeColors: wedding.profile?.dressCodeColors
          ? (JSON.parse(wedding.profile.dressCodeColors) as string[])
          : null,
      },
      settings: {
        theme: wedding.websiteSettings?.theme ?? 'classic',
        primaryColor: wedding.websiteSettings?.primaryColor ?? '#8B5E5E',
        secondaryColor: wedding.websiteSettings?.secondaryColor ?? '#D8B4A0',
        font: wedding.websiteSettings?.font ?? 'Inter',
        heroImage: wedding.websiteSettings?.heroImage ?? null,
        heroBanner: wedding.websiteSettings?.heroBanner ?? null,
        navigationStyle: wedding.websiteSettings?.navigationStyle ?? 'left',
        dividerStyle: wedding.websiteSettings?.dividerStyle ?? 'classic',
        dividerSize: wedding.websiteSettings?.dividerSize ?? 'medium',
        animations: wedding.websiteSettings?.animations ?? true,
        footerText: wedding.websiteSettings?.footerText ?? null,
      },
    };
  }

  async searchGuests(
    slug: string,
    firstName: string,
    lastName: string,
  ): Promise<PublicGuestSearchResult[]> {
    const wedding = await this.prisma.wedding.findUnique({
      where: { slug },
    });

    if (
      !wedding ||
      wedding.deletedAt !== null ||
      wedding.status !== WeddingStatus.PUBLISHED
    ) {
      throw new NotFoundException('Wedding not found');
    }

    const guests = await this.prisma.guest.findMany({
      where: {
        weddingId: wedding.id,
        firstName: { equals: firstName, mode: 'insensitive' },
        lastName: { equals: lastName, mode: 'insensitive' },
      },
      include: { rsvp: true },
    });

    return guests.map((g) => ({
      id: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      rsvpStatus: g.rsvp?.status ?? null,
      companionCount: g.rsvp?.companionCount ?? 0,
      mealPreference: g.rsvp?.mealPreference ?? null,
      notes: g.rsvp?.notes ?? null,
    }));
  }

  async submitRsvp(
    slug: string,
    dto: PublicRsvpDto,
  ): Promise<PublicRsvpResult> {
    const wedding = await this.prisma.wedding.findUnique({
      where: { slug },
    });

    if (
      !wedding ||
      wedding.deletedAt !== null ||
      wedding.status !== WeddingStatus.PUBLISHED
    ) {
      throw new NotFoundException('Wedding not found');
    }

    const guest = await this.prisma.guest.findFirst({
      where: {
        weddingId: wedding.id,
        firstName: { equals: dto.firstName, mode: 'insensitive' },
        lastName: { equals: dto.lastName, mode: 'insensitive' },
      },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found on the wedding list');
    }

    const respondedAt =
      dto.status === 'ACCEPTED' || dto.status === 'DECLINED'
        ? new Date()
        : undefined;

    const rsvp = await this.prisma.rSVP.upsert({
      where: { guestId: guest.id },
      create: {
        guestId: guest.id,
        status: dto.status as PrismaRSVPStatus,
        companionCount: dto.companionCount ?? 0,
        mealPreference: dto.mealPreference ?? null,
        songRequest: dto.songRequest ?? null,
        notes: dto.notes ?? null,
        respondedAt: respondedAt ?? null,
      },
      update: {
        status: dto.status as PrismaRSVPStatus,
        companionCount: dto.companionCount ?? 0,
        mealPreference: dto.mealPreference ?? null,
        songRequest: dto.songRequest ?? null,
        notes: dto.notes ?? null,
        ...(respondedAt ? { respondedAt } : {}),
      },
    });

    return {
      guestId: rsvp.guestId,
      status: rsvp.status,
      respondedAt: rsvp.respondedAt?.toISOString() ?? null,
    };
  }
}
