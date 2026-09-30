'use client';

import { useMemo } from 'react';
import {
  HeroSection,
  StorySection,
  DetailsSection,
  RsvpSection,
  NavigationBar,
  FloralDivider,
  LayoutWrapper,
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
    ceremonyImage: string | null;
    receptionImage: string | null;
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
    layout: string;
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
        layout={settings.layout}
      />

      <LayoutWrapper
        layout={settings.layout}
        dividerStyle={divider}
        dividerSize={dividerSize}
        showStory={hasStory}
        showDetails={hasDetails}
        storySection={
          <StorySection
            proposalStory={profile.proposalStory}
            loveStory={profile.loveStory}
            layout={settings.layout}
          />
        }
        detailsSection={
          <>
            <DetailsSection
              ceremonyName={profile.ceremonyName}
              ceremonyAddress={profile.ceremonyAddress}
              ceremonyTime={profile.ceremonyTime}
              ceremonyImage={profile.ceremonyImage}
              receptionName={profile.receptionName}
              receptionAddress={profile.receptionAddress}
              receptionTime={profile.receptionTime}
              receptionImage={profile.receptionImage}
              weddingDate={wedding.weddingDate}
              dressCode={profile.dressCode}
              dressCodeColors={profile.dressCodeColors}
              primaryColor={settings.primaryColor}
              timezone={wedding.timezone}
              layout={settings.layout}
            />
            {settings.layout === 'classic' && (
              <FloralDivider className="py-4" style={divider} size={dividerSize} />
            )}
          </>
        }
      />

      {!hasDetails && settings.layout === 'classic' && (
        <FloralDivider className="py-4" style={divider} size={dividerSize} />
      )}

      <RsvpSection slug={wedding.slug} layout={settings.layout} />

      {/* Footer */}
      <footer
        className={
          settings.layout === 'editorial'
            ? 'px-8 md:px-20 pt-16 pb-10'
            : settings.layout === 'magazine'
              ? 'px-8 md:px-16 pt-16 pb-10'
              : 'px-6 pt-16 pb-10 text-center'
        }
        style={{ backgroundColor: 'var(--wedding-secondary)' }}
      >
        {settings.layout === 'classic' && (
          <FloralDivider className="pb-8" style={divider} size={dividerSize} />
        )}
        {settings.layout === 'magazine' && (
          <div className="h-px w-full mb-8" style={{ backgroundColor: 'var(--wedding-primary)', opacity: 0.2 }} />
        )}
        <p className={`font-serif tracking-tight mb-2 ${
          settings.layout === 'editorial' ? 'text-3xl md:text-4xl font-medium' :
          settings.layout === 'magazine' ? 'text-2xl md:text-3xl font-bold' :
          'text-2xl md:text-3xl font-medium'
        }`}
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
