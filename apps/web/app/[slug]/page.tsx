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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://everafter.app';

function resolveOgImage(path: string | null): string {
  if (!path) return `${SITE_URL}/og-default.jpg`;
  if (path.startsWith('http')) return path;
  return API_URL.replace('/api/v1', '') + path;
}

function buildDescription(data: PublicWeddingData): string {
  const parts: string[] = [];

  if (data.wedding.weddingDate) {
    parts.push(
      new Date(data.wedding.weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: data.wedding.timezone,
      }),
    );
  }

  if (data.profile.ceremonyName) parts.push(data.profile.ceremonyName);

  // Extract city from address (last comma-separated segment)
  if (data.profile.ceremonyAddress) {
    const segments = data.profile.ceremonyAddress.split(',').map((s) => s.trim());
    if (segments.length >= 2) {
      parts.push(segments[segments.length - 2]);
    } else {
      parts.push(segments[0]);
    }
  }

  const couple =
    data.profile.brideName && data.profile.groomName
      ? `${data.profile.brideName} & ${data.profile.groomName}`
      : data.wedding.title;

  return parts.length
    ? `Join ${couple} — ${parts.join(' · ')}`
    : `You are invited to celebrate the wedding of ${couple}.`;
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

  const title = `${couple} | Wedding Celebration`;
  const description = buildDescription(data);
  const url = `${SITE_URL}/${slug}`;
  const image = resolveOgImage(data.settings.heroBanner);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [{ url: image, width: 1200, height: 630, alt: couple }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
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

  const couple =
    data.profile.brideName && data.profile.groomName
      ? `${data.profile.brideName} & ${data.profile.groomName}`
      : data.wedding.title;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${couple} — Wedding Celebration`,
    ...(data.wedding.weddingDate && { startDate: data.wedding.weddingDate }),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };

  if (data.profile.ceremonyName || data.profile.ceremonyAddress) {
    jsonLd.location = {
      '@type': 'Place',
      ...(data.profile.ceremonyName && { name: data.profile.ceremonyName }),
      ...(data.profile.ceremonyAddress && {
        address: data.profile.ceremonyAddress,
      }),
    };
  }

  if (data.profile.brideName && data.profile.groomName) {
    jsonLd.performer = [
      { '@type': 'Person', name: data.profile.brideName },
      { '@type': 'Person', name: data.profile.groomName },
    ];
  }

  if (data.settings.heroBanner) {
    jsonLd.image = resolveOgImage(data.settings.heroBanner);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicWeddingClient data={data} />
    </>
  );
}
