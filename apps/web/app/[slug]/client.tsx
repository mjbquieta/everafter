'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HeroSection,
  StorySection,
  DetailsSection,
  RsvpSection,
  NavigationBar,
  FloralDivider,
  LayoutWrapper,
  MotionSection,
  ScheduleSection,
  FaqSection,
  AudioPlayer,
  OpeningExperience,
} from '@/features/public-wedding';
import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface InvitedGuest {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string | null;
  companionCount: number;
  mealPreference: string | null;
  notes: string | null;
}

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

const fontMap: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Playfair: "'Playfair Display', serif",
  Lora: "'Lora', serif",
  Montserrat: "'Montserrat', sans-serif",
};

export function PublicWeddingClient({ data }: { data: PublicWeddingData }) {
  const { wedding, profile, settings } = data;
  const searchParams = useSearchParams();
  const [invitedGuest, setInvitedGuest] = useState<InvitedGuest | null>(null);

  const coupleNames = profile.brideName && profile.groomName
    ? `${profile.brideName} & ${profile.groomName}`
    : profile.brideName || profile.groomName || 'Our Wedding';

  // Load personalized guest data from URL parameter
  useEffect(() => {
    const guestId = searchParams.get('guest');
    if (!guestId) return;

    const loadGuestById = async () => {
      try {
        const res = await fetch(`${API_URL}/public/weddings/${wedding.slug}/guests/${guestId}`);
        if (!res.ok) return; // Silently fail if guest not found
        const body = await res.json();
        setInvitedGuest(body.data);
      } catch {
        // Silently fail and show generic experience
      }
    };

    loadGuestById();
  }, [searchParams, wedding.slug]);

  const sec = settings.sections as Record<string, unknown> | null;
  const sectionOn = (key: string) => (sec?.[key] as boolean) ?? true;

  // Extract opening transition from settings (with fallback to sections for backward compatibility)
  const openingTransition = settings.openingTransition || (sec?._openingTransition as string) || 'none';

  // Extract hero text color from sections (stored as _heroTextColor)
  const heroTextColor = (sec?._heroTextColor as 'light' | 'dark') ?? (settings.heroBanner ? 'light' : 'dark');

  const DEFAULT_ORDER = ['hero', 'content', 'schedule', 'faq', 'rsvp'];
  const sectionOrder: string[] = Array.isArray(sec?._order)
    ? (sec._order as string[])
    : DEFAULT_ORDER;
  const orderOf = (key: string) => {
    const idx = sectionOrder.indexOf(key);
    return idx >= 0 ? idx : 99;
  };

  const hasStory = !!(profile.proposalStory || profile.loveStory) && sectionOn('story');
  const hasDetails = !!(
    profile.ceremonyName || profile.ceremonyAddress || profile.ceremonyTime ||
    profile.receptionName || profile.receptionAddress || profile.receptionTime ||
    profile.dressCode
  ) && sectionOn('details');
  const hasSchedule = !!(profile.scheduleEvents?.length) && sectionOn('schedule');
  const hasFaq = !!(profile.faqItems?.length) && sectionOn('faq');
  const showRsvp = sectionOn('rsvp');

  const navItems = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    items.push({ id: 'home', label: 'Home' });
    if (hasStory) items.push({ id: 'story', label: 'Our Story' });
    if (hasDetails) items.push({ id: 'details', label: 'Details' });
    if (hasSchedule) items.push({ id: 'schedule', label: 'Programme' });
    if (hasFaq) items.push({ id: 'faq', label: 'FAQ' });
    if (showRsvp) items.push({ id: 'rsvp', label: 'RSVP' });
    return items;
  }, [hasStory, hasDetails, hasSchedule, hasFaq, showRsvp]);

  const divider = (settings.dividerStyle || 'classic') as DividerStyle;
  const dividerSize = (settings.dividerSize || 'medium') as DividerSize;

  const cssVars = {
    '--wedding-primary': settings.primaryColor,
    '--wedding-secondary': settings.secondaryColor,
    '--wedding-background': settings.backgroundColor,
    '--wedding-foreground': settings.backgroundColor === '#0F1015' ? '#F5F3EF' : '#2B2726',
    '--wedding-font': fontMap[settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen scroll-smooth flex flex-col"
      style={{
        ...cssVars,
        backgroundColor: 'var(--wedding-background)',
        color: 'var(--wedding-foreground)',
        fontFamily: 'var(--wedding-font)',
      }}
    >
      <OpeningExperience
        type={openingTransition as 'none' | 'fade' | 'envelope'}
        slug={wedding.slug}
        coupleNames={coupleNames}
        invitedGuest={invitedGuest}
      />

      <NavigationBar
        items={navItems}
        coupleNames={coupleNames}
        hasBanner={!!settings.heroBanner}
        layout={settings.navigationStyle as 'left' | 'center' | 'right'}
      />

      <div style={{ order: orderOf('hero') }}>
        <MotionSection enabled={settings.animations}>
          <HeroSection
            brideName={profile.brideName}
            groomName={profile.groomName}
            weddingDate={wedding.weddingDate}
            timezone={wedding.timezone}
            hashtag={profile.weddingHashtag}
            heroBanner={settings.heroBanner}
            layout={settings.layout}
            heroTextColor={heroTextColor}
          />
        </MotionSection>
      </div>

      <div style={{ order: orderOf('content') }}>
        <MotionSection enabled={settings.animations}>
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
            }
          />
        </MotionSection>
      </div>

      {hasSchedule && (
        <div style={{ order: orderOf('schedule') }}>
          <MotionSection enabled={settings.animations}>
            <ScheduleSection
              events={profile.scheduleEvents!}
              layout={settings.layout}
            />
          </MotionSection>
        </div>
      )}

      {hasFaq && (
        <div style={{ order: orderOf('faq') }}>
          <MotionSection enabled={settings.animations}>
            <FaqSection
              items={profile.faqItems!}
              layout={settings.layout}
            />
          </MotionSection>
        </div>
      )}

      {showRsvp && (
        <div style={{ order: orderOf('rsvp') }}>
          <MotionSection enabled={settings.animations}>
            <RsvpSection slug={wedding.slug} layout={settings.layout} invitedGuest={invitedGuest} />
          </MotionSection>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`px-4 md:px-8 pt-16 pb-10 ${settings.layout === 'classic' ? 'text-center' : ''}`}
        style={{ backgroundColor: 'var(--wedding-secondary)', order: 99 }}
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

      {/* Floating Audio Player */}
      {settings.enableBackgroundMusic && settings.audioUrl && (
        <AudioPlayer audioUrl={settings.audioUrl} />
      )}
    </div>
  );
}
