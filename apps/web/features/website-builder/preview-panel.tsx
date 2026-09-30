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
} from '@/features/public-wedding';
import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

interface PreviewPanelProps {
  slug: string;
  settings: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
    layout: string;
    navigationStyle: string;
    dividerStyle: string;
    dividerSize: string;
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
}: PreviewPanelProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [copied, setCopied] = useState(false);

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cssVars = {
    '--wedding-primary': settings.primaryColor,
    '--wedding-secondary': settings.secondaryColor,
    '--wedding-background': '#FAF9F7',
    '--wedding-foreground': '#2B2726',
    '--wedding-font': fontMap[settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

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
          </div>
        </div>
      </div>
    </div>
  );
}
