'use client';

import { useMemo } from 'react';
import {
  HeroSection,
  StorySection,
  DetailsSection,
  RsvpSection,
  NavigationBar,
  FloralDivider,
} from '@/features/public-wedding';
import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

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
    dividerStyle: string;
    dividerSize: string;
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

  const coupleNames = profile.brideName && profile.groomName
    ? `${profile.brideName} & ${profile.groomName}`
    : profile.brideName || profile.groomName || 'Our Wedding';

  const hasStory = !!(profile.proposalStory || profile.loveStory);
  const hasDetails = !!(
    profile.ceremonyName || profile.ceremonyAddress || profile.ceremonyTime ||
    profile.receptionName || profile.receptionAddress || profile.receptionTime ||
    profile.dressCode
  );

  const navItems = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    items.push({ id: 'home', label: 'Home' });
    if (hasStory) items.push({ id: 'story', label: 'Our Story' });
    if (hasDetails) items.push({ id: 'details', label: 'Details' });
    items.push({ id: 'rsvp', label: 'RSVP' });
    return items;
  }, [hasStory, hasDetails]);

  const divider = (settings.dividerStyle || 'classic') as DividerStyle;
  const dividerSize = (settings.dividerSize || 'medium') as DividerSize;

  const cssVars = {
    '--wedding-primary': settings.primaryColor,
    '--wedding-secondary': settings.secondaryColor,
    '--wedding-background': '#FAF9F7',
    '--wedding-foreground': '#2B2726',
    '--wedding-font': fontMap[settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen scroll-smooth"
      style={{
        ...cssVars,
        backgroundColor: 'var(--wedding-background)',
        color: 'var(--wedding-foreground)',
        fontFamily: 'var(--wedding-font)',
      }}
    >
      <NavigationBar
        items={navItems}
        coupleNames={coupleNames}
        hasBanner={!!settings.heroBanner}
        layout={settings.navigationStyle as 'left' | 'center' | 'right'}
      />

      <HeroSection
        brideName={profile.brideName}
        groomName={profile.groomName}
        weddingDate={wedding.weddingDate}
        timezone={wedding.timezone}
        hashtag={profile.weddingHashtag}
        heroBanner={settings.heroBanner}
      />

      {hasStory && (
        <>
          <FloralDivider className="py-4" style={divider} size={dividerSize} />
          <StorySection
            proposalStory={profile.proposalStory}
            loveStory={profile.loveStory}
          />
        </>
      )}

      {hasDetails && (
        <div style={{ backgroundColor: 'var(--wedding-secondary)' }}>
          <FloralDivider className="py-4" style={divider} size={dividerSize} />
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
          <FloralDivider className="py-4" style={divider} size={dividerSize} />
        </div>
      )}

      {!hasDetails && <FloralDivider className="py-4" style={divider} size={dividerSize} />}

      <RsvpSection slug={wedding.slug} />

      {/* Footer */}
      <footer className="px-6 pt-16 pb-10 text-center"
              style={{ backgroundColor: 'var(--wedding-secondary)' }}>
        <FloralDivider className="pb-8" style={divider} size={dividerSize} />
        <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight mb-2"
           style={{ color: 'var(--wedding-foreground)' }}>
          {coupleNames}
        </p>
        {wedding.weddingDate && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-6"
             style={{ color: 'var(--wedding-foreground)', opacity: 0.5 }}>
            {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: wedding.timezone,
            })}
          </p>
        )}
        {settings.footerText && (
          <p className="text-sm font-serif italic mb-6"
             style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}>
            {settings.footerText}
          </p>
        )}
        <p className="text-[10px] font-sans uppercase tracking-[0.2em]"
           style={{ color: 'var(--wedding-foreground)', opacity: 0.3 }}>
          Made with love on EverAfter
        </p>
      </footer>
    </div>
  );
}
