import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PublicWeddingClient } from './client';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

const RESERVED_SLUGS = new Set([
  'login',
  'register',
  'dashboard',
  'forgot-password',
  'admin',
  'api',
  'settings',
  'about',
  'privacy',
  'terms',
  'help',
  'support',
]);

interface PublicWeddingData {
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
  };
}

async function fetchWeddingData(
  slug: string,
): Promise<PublicWeddingData | null> {
  try {
    const res = await fetch(`${API_URL}/public/weddings/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as PublicWeddingData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const data = await fetchWeddingData(slug);
  if (!data) return {};

  const couple =
    data.profile.brideName && data.profile.groomName
      ? `${data.profile.brideName} & ${data.profile.groomName}`
      : data.wedding.title;

  return {
    title: `${couple} — EverAfter`,
    description: `You are invited to celebrate the wedding of ${couple}.`,
  };
}

export default async function PublicWeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const data = await fetchWeddingData(slug);

  if (!data) {
    notFound();
  }

  return <PublicWeddingClient data={data} />;
}
