'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@everafter/ui';
import {
  HeroSection,
  StorySection,
  DetailsSection,
  FloralDivider,
} from '@/features/public-wedding';
import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

interface PreviewPanelProps {
  slug: string;
  settings: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
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
    dressCode: string | null;
    dressCodeColors: string[] | null;
  };
  wedding: {
    weddingDate: string | null;
    timezone: string;
  };
  sections: Record<string, boolean>;
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
              backgroundColor: 'var(--wedding-background)',
              color: 'var(--wedding-foreground)',
              fontFamily: 'var(--wedding-font)',
            }}
          >
            {(sections.hero ?? true) && (
              <HeroSection
                brideName={profile.brideName}
                groomName={profile.groomName}
                weddingDate={wedding.weddingDate}
                timezone={wedding.timezone}
                hashtag={profile.weddingHashtag}
                heroBanner={settings.heroBanner}
              />
            )}

            {(sections.story ?? true) && (
              <>
                <FloralDivider className="py-4" style={settings.dividerStyle as DividerStyle} size={settings.dividerSize as DividerSize} />
                <StorySection
                  proposalStory={profile.proposalStory}
                  loveStory={profile.loveStory}
                />
              </>
            )}

            {(sections.details ?? true) && (
              <div style={{ backgroundColor: 'var(--wedding-secondary)' }}>
                <FloralDivider className="py-4" style={settings.dividerStyle as DividerStyle} size={settings.dividerSize as DividerSize} />
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
              </div>
            )}

            {(sections.rsvp ?? true) && (
              <div id="rsvp" className="px-6 py-20 text-center">
                <h2
                  className="text-3xl font-serif font-medium tracking-tight mb-3"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  RSVP
                </h2>
                <p className="text-sm opacity-60">
                  RSVP form is available on the live site
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
