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
    ceremonyImage: string | null;
    receptionImage: string | null;
    dressCode: string | null;
    dressCodeColors: string[] | null;
    scheduleEvents: { time: string; title: string; description?: string }[] | null;
    faqItems: { question: string; answer: string }[] | null;
  };
  settings: {
    theme: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroImage: string | null;
    heroBanner: string | null;
    layout: string;
    navigationStyle: string;
    dividerStyle: string;
    dividerSize: string;
    animations: boolean;
    sections: Record<string, boolean> | null;
    footerText: string | null;
    enableBackgroundMusic: boolean;
    audioUrl: string | null;
    openingTransition: string;
  };
}

export interface PublicGuestSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  rsvpStatus: string | null;
  companionCount: number;
  mealPreference: string | null;
  notes: string | null;
}

export interface PublicGuestByIdResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  notes: string | null;
  rsvp: {
    status: string;
    companionCount: number;
    mealPreference: string | null;
    notes: string | null;
  } | null;
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
        ceremonyImage: wedding.profile?.ceremonyImage ?? null,
        receptionImage: wedding.profile?.receptionImage ?? null,
        dressCode: wedding.profile?.dressCode ?? null,
        dressCodeColors: wedding.profile?.dressCodeColors
          ? (JSON.parse(wedding.profile.dressCodeColors) as string[])
          : null,
        scheduleEvents: wedding.profile?.scheduleEvents
          ? JSON.parse(wedding.profile.scheduleEvents)
          : null,
        faqItems: wedding.profile?.faqItems
          ? JSON.parse(wedding.profile.faqItems)
          : null,
      },
      settings: {
        theme: wedding.websiteSettings?.theme ?? 'classic',
        backgroundColor: wedding.websiteSettings?.backgroundColor ?? '#FAF9F7',
        primaryColor: wedding.websiteSettings?.primaryColor ?? '#8B5E5E',
        secondaryColor: wedding.websiteSettings?.secondaryColor ?? '#D8B4A0',
        font: wedding.websiteSettings?.font ?? 'Inter',
        heroImage: wedding.websiteSettings?.heroImage ?? null,
        heroBanner: wedding.websiteSettings?.heroBanner ?? null,
        layout: wedding.websiteSettings?.layout ?? 'classic',
        navigationStyle: wedding.websiteSettings?.navigationStyle ?? 'left',
        dividerStyle: wedding.websiteSettings?.dividerStyle ?? 'classic',
        dividerSize: wedding.websiteSettings?.dividerSize ?? 'medium',
        animations: wedding.websiteSettings?.animations ?? true,
        sections: wedding.websiteSettings?.sections
          ? JSON.parse(wedding.websiteSettings.sections)
          : null,
        footerText: wedding.websiteSettings?.footerText ?? null,
        enableBackgroundMusic: wedding.websiteSettings?.enableBackgroundMusic ?? false,
        audioUrl: wedding.websiteSettings?.audioUrl ?? null,
        openingTransition: wedding.websiteSettings?.openingTransition ?? 'none',
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
      email: g.email,
      rsvpStatus: g.rsvp?.status ?? null,
      companionCount: g.rsvp?.companionCount ?? 0,
      mealPreference: g.rsvp?.mealPreference ?? null,
      notes: g.rsvp?.notes ?? null,
    }));
  }

  async getGuestById(
    slug: string,
    guestId: string,
  ): Promise<PublicGuestByIdResult> {
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
        id: guestId,
        weddingId: wedding.id,
      },
      include: { rsvp: true },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      notes: guest.notes,
      rsvp: guest.rsvp
        ? {
            status: guest.rsvp.status,
            companionCount: guest.rsvp.companionCount,
            mealPreference: guest.rsvp.mealPreference,
            notes: guest.rsvp.notes,
          }
        : null,
    };
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

  async getGalleryPhotos(slug: string): Promise<Array<{ id: string; url: string; alt: string | null }>> {
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

    // Get all albums for this wedding
    const albums = await this.prisma.galleryAlbum.findMany({
      where: { weddingId: wedding.id },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Collect all photos from all albums
    const allPhotos = albums.flatMap((album) => album.photos);

    // Filter only visible photos (check for [visible:true] in caption)
    const visiblePhotos = allPhotos.filter((photo) => {
      if (!photo.caption) return true; // Default to visible if no caption
      const match = photo.caption.match(/\[visible:(true|false)\]/);
      return match ? match[1] === 'true' : true;
    });

    // Map to public photo format with full URL
    const STORAGE_URL = process.env.STORAGE_URL ?? 'http://localhost:3001';
    return visiblePhotos.map((photo) => ({
      id: photo.id,
      url: `${STORAGE_URL}${photo.storageKey}`,
      alt: photo.caption?.replace(/\[visible:(true|false)\]\s*/g, '').trim() || null,
    }));
  }
}
