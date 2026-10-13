'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@everafter/ui';
import {
  HeroSection,
  StorySection,
  DetailsSection,
  LayoutWrapper,
  ScheduleSection,
  FaqSection,
  MinimalistLayout,
  AsymmetricLayout,
  StorybookLayout,
  PhotoFocusedLayout,
  ClassicLayout,
} from '@/features/public-wedding';
import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

interface PreviewPanelProps {
  slug: string;
  settings: {
    theme: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
    layout: string;
    navigationStyle: string;
    dividerStyle: string;
    dividerSize: string;
    heroTextColor: string;
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
    scheduleEvents?: { time: string; title: string; description?: string }[] | null;
    faqItems?: { question: string; answer: string }[] | null;
  };
  wedding: {
    weddingDate: string | null;
    timezone: string;
  };
  sections: Record<string, boolean>;
  sectionOrder?: string[];
  layoutSlots?: Record<string, string>;
  websitePhotos?: Array<{ id: string; url: string; caption?: string }>;
  onPhotoSlotUpdate?: (slotId: string, photoUrl: string) => void;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

const viewportConfig: Record<Viewport, { width: string; icon: typeof Monitor; label: string }> = {
  desktop: { width: '100%', icon: Monitor, label: 'Desktop' },
  tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
  mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
};

const fontMap: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Playfair: "'Playfair Display', serif",
  Lora: "'Lora', serif",
  Montserrat: "'Montserrat', sans-serif",
};

export function PreviewPanel({
  slug,
  settings,
  profile,
  wedding,
  sections,
  sectionOrder,
  layoutSlots = {},
  websitePhotos = [],
  onPhotoSlotUpdate,
}: PreviewPanelProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [copied, setCopied] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhotoSlotClick = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handlePhotoSelect = (photoUrl: string) => {
    if (selectedSlot && onPhotoSlotUpdate) {
      onPhotoSlotUpdate(selectedSlot, photoUrl);
      setSelectedSlot(null);
    }
  };

  const cssVars = {
    '--wedding-primary': settings.primaryColor,
    '--wedding-secondary': settings.secondaryColor,
    '--wedding-background': settings.backgroundColor,
    '--wedding-foreground': settings.backgroundColor === '#0F1015' ? '#F5F3EF' : '#2B2726',
    '--wedding-font': fontMap[settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

  // Check if we're using a template-specific layout
  const isTemplateLayout = ['midnight-editorial', 'moody-plum', 'warm-linen', 'dusty-rose', 'coastal-slate'].includes(settings.theme);

  // Helper to check if a section is enabled
  const hasStory = !!(profile.proposalStory || profile.loveStory) && (sections.story ?? true);
  const hasDetails = !!(
    profile.ceremonyName || profile.ceremonyAddress || profile.ceremonyTime ||
    profile.receptionName || profile.receptionAddress || profile.receptionTime ||
    profile.dressCode
  ) && (sections.details ?? true);
  const hasSchedule = !!(profile.scheduleEvents?.length) && (sections.schedule ?? true);
  const hasFaq = !!(profile.faqItems?.length) && (sections.faq ?? true);
  const showRsvp = sections.rsvp ?? true;

  // Prepare wedding data for template layouts
  const weddingData = {
    slug,
    title: `${profile.brideName} & ${profile.groomName}`,
    weddingDate: wedding.weddingDate,
    timezone: wedding.timezone,
    status: 'PUBLISHED',
    bride: { name: profile.brideName ?? undefined },
    groom: { name: profile.groomName ?? undefined },
    venue: {
      name: profile.ceremonyName ?? undefined,
      address: profile.ceremonyAddress ?? undefined,
    },
    tagline: null,
    story: profile.loveStory ?? undefined,
    rsvpDeadline: null,
  } as any;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <div className="flex items-center gap-1">
          {(Object.entries(viewportConfig) as [Viewport, typeof viewportConfig.desktop][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => setViewport(key)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  viewport === key
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:text-foreground'
                }`}
                title={cfg.label}
              >
                <cfg.icon className="h-4 w-4" />
              </button>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Open
            </Button>
          </a>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-border/20 p-4 flex justify-center">
        <div
          className="bg-white rounded-lg shadow-sm overflow-auto transition-all duration-300"
          style={{
            width: viewportConfig[viewport].width,
            maxWidth: '100%',
            minHeight: '100%',
          }}
        >
          <div
            style={{
              ...cssVars,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--wedding-background)',
              color: 'var(--wedding-foreground)',
              fontFamily: 'var(--wedding-font)',
            }}
          >
            {/* Render template-specific layouts */}
            {isTemplateLayout ? (
              <>
                {settings.theme === 'midnight-editorial' && (
                  <MinimalistLayout
                    wedding={weddingData}
                    photos={websitePhotos}
                    layoutSlots={layoutSlots}
                    showStory={hasStory}
                    showDetails={hasDetails}
                    showSchedule={hasSchedule}
                    showFaq={hasFaq}
                    showRsvp={showRsvp}
                    proposalStory={profile.proposalStory ?? undefined}
                    loveStory={profile.loveStory ?? undefined}
                    scheduleEvents={profile.scheduleEvents ?? undefined}
                    faqItems={profile.faqItems ?? undefined}
                    onRsvpClick={() => {}}
                    onPhotoSlotClick={handlePhotoSlotClick}
                    isPreview={true}
                  />
                )}
                {settings.theme === 'moody-plum' && (
                  <AsymmetricLayout
                    wedding={weddingData}
                    photos={websitePhotos}
                    layoutSlots={layoutSlots}
                    showStory={hasStory}
                    showDetails={hasDetails}
                    showSchedule={hasSchedule}
                    showFaq={hasFaq}
                    showRsvp={showRsvp}
                    proposalStory={profile.proposalStory ?? undefined}
                    loveStory={profile.loveStory ?? undefined}
                    scheduleEvents={profile.scheduleEvents ?? undefined}
                    faqItems={profile.faqItems ?? undefined}
                    onRsvpClick={() => {}}
                    onPhotoSlotClick={handlePhotoSlotClick}
                    isPreview={true}
                  />
                )}
                {settings.theme === 'warm-linen' && (
                  <ClassicLayout
                    wedding={weddingData}
                    photos={websitePhotos}
                    layoutSlots={layoutSlots}
                    showStory={hasStory}
                    showDetails={hasDetails}
                    showSchedule={hasSchedule}
                    showFaq={hasFaq}
                    showRsvp={showRsvp}
                    proposalStory={profile.proposalStory ?? undefined}
                    loveStory={profile.loveStory ?? undefined}
                    scheduleEvents={profile.scheduleEvents ?? undefined}
                    faqItems={profile.faqItems ?? undefined}
                    onRsvpClick={() => {}}
                    onPhotoSlotClick={handlePhotoSlotClick}
                    isPreview={true}
                  />
                )}
                {settings.theme === 'dusty-rose' && (
                  <StorybookLayout
                    wedding={weddingData}
                    photos={websitePhotos}
                    layoutSlots={layoutSlots}
                    showStory={hasStory}
                    showDetails={hasDetails}
                    showSchedule={hasSchedule}
                    showFaq={hasFaq}
                    showRsvp={showRsvp}
                    proposalStory={profile.proposalStory ?? undefined}
                    loveStory={profile.loveStory ?? undefined}
                    scheduleEvents={profile.scheduleEvents ?? undefined}
                    faqItems={profile.faqItems ?? undefined}
                    onRsvpClick={() => {}}
                    onPhotoSlotClick={handlePhotoSlotClick}
                    isPreview={true}
                  />
                )}
                {settings.theme === 'coastal-slate' && (
                  <PhotoFocusedLayout
                    wedding={weddingData}
                    photos={websitePhotos}
                    layoutSlots={layoutSlots}
                    showStory={hasStory}
                    showDetails={hasDetails}
                    showSchedule={hasSchedule}
                    showFaq={hasFaq}
                    showRsvp={showRsvp}
                    proposalStory={profile.proposalStory ?? undefined}
                    loveStory={profile.loveStory ?? undefined}
                    scheduleEvents={profile.scheduleEvents ?? undefined}
                    faqItems={profile.faqItems ?? undefined}
                    onRsvpClick={() => {}}
                    onPhotoSlotClick={handlePhotoSlotClick}
                    isPreview={true}
                  />
                )}
              </>
            ) : (
              <>
                {/* Legacy layout system for classic themes */}
                {(sections.hero ?? true) && (
                  <div style={{ order: sectionOrder?.indexOf('hero') ?? 0 }}>
                  <HeroSection
                    brideName={profile.brideName}
                    groomName={profile.groomName}
                    weddingDate={wedding.weddingDate}
                    timezone={wedding.timezone}
                    hashtag={profile.weddingHashtag}
                    heroBanner={settings.heroBanner}
                    layout={settings.layout}
                    heroTextColor={settings.heroTextColor as 'light' | 'dark'}
                  />
                  </div>
                )}

                <div style={{ order: sectionOrder?.indexOf('content') ?? 1 }}>
                <LayoutWrapper
                  layout={settings.layout}
                  dividerStyle={settings.dividerStyle as DividerStyle}
                  dividerSize={settings.dividerSize as DividerSize}
                  showStory={sections.story ?? true}
                  showDetails={sections.details ?? true}
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
                </div>

                {(sections.schedule ?? true) && !!profile.scheduleEvents?.length && (
                  <div style={{ order: sectionOrder?.indexOf('schedule') ?? 2 }}>
                  <ScheduleSection
                    events={profile.scheduleEvents}
                    layout={settings.layout}
                  />
                  </div>
                )}

                {(sections.faq ?? true) && !!profile.faqItems?.length && (
                  <div style={{ order: sectionOrder?.indexOf('faq') ?? 3 }}>
                  <FaqSection
                    items={profile.faqItems}
                    layout={settings.layout}
                  />
                  </div>
                )}

                {(sections.rsvp ?? true) && (
                  <div style={{ order: sectionOrder?.indexOf('rsvp') ?? 4 }}>
                  <div
                    id="rsvp"
                    className="px-4 md:px-8 py-16 md:py-24"
                  >
                    <div className={
                      settings.layout === 'editorial'
                        ? 'mx-auto max-w-lg'
                        : settings.layout === 'magazine'
                          ? 'mx-auto max-w-2xl'
                          : 'mx-auto max-w-xl text-center'
                    }>
                      {settings.layout === 'editorial' ? (
                        <>
                          <p
                            className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                            style={{ color: 'var(--wedding-primary)' }}
                          >
                            RSVP
                          </p>
                          <h2
                            className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-3"
                            style={{ color: 'var(--wedding-foreground)' }}
                          >
                            Will you attend?
                          </h2>
                        </>
                      ) : settings.layout === 'magazine' ? (
                        <>
                          <h2
                            className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
                            style={{ color: 'var(--wedding-foreground)' }}
                          >
                            RSVP
                          </h2>
                          <div
                            className="h-0.5 w-16 mb-6"
                            style={{ backgroundColor: 'var(--wedding-primary)' }}
                          />
                        </>
                      ) : (
                        <h2
                          className="text-3xl font-serif font-medium tracking-tight mb-3"
                          style={{ color: 'var(--wedding-foreground)' }}
                        >
                          RSVP
                        </h2>
                      )}
                      <p className="text-sm opacity-60">
                        RSVP form is available on the live site
                      </p>
                    </div>
                  </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Photo Selection Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  Select Photo
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Click a photo to assign it to this slot
                </p>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="p-1 hover:bg-stone-100 rounded transition-colors"
              >
                <svg className="h-4 w-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {websitePhotos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-stone-500">
                    No photos available. Upload photos to your gallery first.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {websitePhotos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => handlePhotoSelect(photo.url)}
                      className="aspect-square rounded overflow-hidden bg-stone-100 border-2 border-transparent hover:border-primary transition-colors"
                    >
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
