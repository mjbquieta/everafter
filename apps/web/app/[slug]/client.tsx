'use client';

import {
  HeroSection,
  StorySection,
  DetailsSection,
  RsvpSection,
} from '@/features/public-wedding';

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
    animations: boolean;
    footerText: string | null;
  };
}

const fontMap: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Playfair: "'Playfair Display', serif",
  Lora: "'Lora', serif",
  Montserrat: "'Montserrat', sans-serif",
};

export function PublicWeddingClient({ data }: { data: PublicWeddingData }) {
  const { wedding, profile, settings } = data;

  const cssVars = {
    '--wedding-primary': settings.primaryColor,
    '--wedding-secondary': settings.secondaryColor,
    '--wedding-background': '#FAF9F7',
    '--wedding-foreground': '#2B2726',
    '--wedding-font': fontMap[settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen"
      style={{
        ...cssVars,
        backgroundColor: 'var(--wedding-background)',
        color: 'var(--wedding-foreground)',
        fontFamily: 'var(--wedding-font)',
      }}
    >
      <HeroSection
        brideName={profile.brideName}
        groomName={profile.groomName}
        weddingDate={wedding.weddingDate}
        timezone={wedding.timezone}
        hashtag={profile.weddingHashtag}
        heroBanner={settings.heroBanner}
      />

      <StorySection
        proposalStory={profile.proposalStory}
        loveStory={profile.loveStory}
      />

      <DetailsSection
        ceremonyName={profile.ceremonyName}
        ceremonyAddress={profile.ceremonyAddress}
        ceremonyTime={profile.ceremonyTime}
        receptionName={profile.receptionName}
        receptionAddress={profile.receptionAddress}
        receptionTime={profile.receptionTime}
        dressCode={profile.dressCode}
        dressCodeColors={profile.dressCodeColors}
        primaryColor={settings.primaryColor}
        timezone={wedding.timezone}
      />

      <RsvpSection slug={wedding.slug} />

      {settings.footerText && (
        <footer className="px-6 py-10 text-center text-sm opacity-50">
          {settings.footerText}
        </footer>
      )}
    </div>
  );
}
