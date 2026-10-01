import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PersonalInvitationClient } from './client';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface WeddingData {
  wedding: {
    id: string;
    slug: string;
    title: string;
    weddingDate: string | null;
    timezone: string;
  };
  profile: {
    brideName: string | null;
    groomName: string | null;
    ceremonyName: string | null;
    ceremonyAddress: string | null;
  };
  settings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
    enableBackgroundMusic: boolean;
    audioUrl: string | null;
  };
}

interface GuestData {
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

async function fetchWeddingData(slug: string): Promise<WeddingData | null> {
  try {
    const res = await fetch(`${API_URL}/public/weddings/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as WeddingData;
  } catch {
    return null;
  }
}

async function fetchGuestData(slug: string, guestId: string): Promise<GuestData | null> {
  try {
    const res = await fetch(`${API_URL}/public/weddings/${slug}/guests/${guestId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as GuestData;
  } catch {
    return null;
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://everafter.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; guestId: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchWeddingData(slug);
  if (!data) return {};

  const couple =
    data.profile.brideName && data.profile.groomName
      ? `${data.profile.brideName} & ${data.profile.groomName}`
      : data.wedding.title;

  const title = `You're Invited | ${couple}`;
  const description = 'You have received a personal invitation to this wedding celebration.';

  return {
    title,
    description,
    robots: 'noindex, nofollow', // Personal invitations should not be indexed
  };
}

export default async function PersonalInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; guestId: string }>;
}) {
  const { slug, guestId } = await params;

  const [weddingData, guestData] = await Promise.all([
    fetchWeddingData(slug),
    fetchGuestData(slug, guestId),
  ]);

  if (!weddingData || !guestData) {
    notFound();
  }

  return <PersonalInvitationClient wedding={weddingData} guest={guestData} />;
}
