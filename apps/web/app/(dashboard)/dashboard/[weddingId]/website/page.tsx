'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, CircleDot, Save, Check, AlertCircle, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Label } from '@everafter/ui';
import { useWeddingContext } from '@/lib/wedding-context';
import { useWeddingProfile, useGuestSummary as useDashboardGuestSummary } from '@/lib/hooks/use-dashboard';
import {
  useWebsiteSettings,
  useUpdateWebsiteSettings,
  useUpdateSlug,
  usePublishWebsite,
  useUnpublishWebsite,
} from '@/lib/hooks/use-website-settings';
import {
  TemplatePresets,
  ColorPicker,
  FontPicker,
  SectionToggles,
  PreviewPanel,
  NavLayoutPicker,
  DividerPicker,
  HeroBannerPicker,
  LayoutPicker,
  AudioSettings,
  OpeningTransitionPicker,
  HeroTextColorPicker,
} from '@/features/website-builder';
import { DEFAULT_SECTION_ORDER } from '@/features/website-builder/section-toggles';
import { ApiError } from '@/lib/api-client';

export default function WebsiteBuilderPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;
  const { activeWedding } = useWeddingContext();

  const { data: settings, isLoading: settingsLoading } =
    useWebsiteSettings(weddingId);
  const { data: profile, isLoading: profileLoading } =
    useWeddingProfile(weddingId);
  const { data: guestSummary } = useDashboardGuestSummary(weddingId);
  const updateSettings = useUpdateWebsiteSettings(weddingId);
  const updateSlug = useUpdateSlug(weddingId);
  const publishWebsite = usePublishWebsite(weddingId);
  const unpublishWebsite = useUnpublishWebsite(weddingId);

  // Local state for optimistic preview updates
  const [localSettings, setLocalSettings] = useState<{
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
    enableBackgroundMusic: boolean;
    audioUrl: string | null;
    openingTransition: string;
    heroTextColor: string;
  } | null>(null);

  const [sections, setSections] = useState<Record<string, boolean>>({
    hero: true,
    story: true,
    details: true,
    schedule: true,
    faq: true,
    rsvp: true,
  });

  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_ORDER);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [slugValue, setSlugValue] = useState('');
  const [slugError, setSlugError] = useState('');

  // Sync from server once loaded
  useEffect(() => {
    if (settings && !localSettings) {
      const sectionsData = settings.sections as Record<string, unknown> | null;
      const openingTransition = (sectionsData?._openingTransition as string) ?? 'none';
      const heroTextColor = (sectionsData?._heroTextColor as string) ?? (settings.heroBanner ? 'light' : 'dark');

      // Map theme to default background color
      const themeBackgroundMap: Record<string, string> = {
        'warm-linen': '#F9F6F0',
        'moody-plum': '#F5F2F7',
        'dusty-rose': '#FAF0F2',
        'coastal-slate': '#EDF3F7',
        'midnight-editorial': '#0F1015',
        // Legacy themes
        'classic-ivory': '#FAF8F5',
        'minimal-sage': '#EEF3EE',
        'romantic-blush': '#FBF0F1',
        'midnight-gold': '#0E1015',
      };

      setLocalSettings({
        theme: settings.theme,
        backgroundColor: themeBackgroundMap[settings.theme] ?? '#FAF9F7',
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        font: settings.font,
        heroBanner: settings.heroBanner,
        layout: settings.layout,
        navigationStyle: settings.navigationStyle,
        dividerStyle: settings.dividerStyle,
        dividerSize: settings.dividerSize,
        enableBackgroundMusic: (settings as any).enableBackgroundMusic ?? false,
        audioUrl: (settings as any).audioUrl ?? null,
        openingTransition,
        heroTextColor,
      });
      if (settings.sections) {
        const { _order, _openingTransition, _heroTextColor, ...toggles } = settings.sections as Record<string, unknown>;
        setSections((prev) => ({ ...prev, ...(toggles as Record<string, boolean>) }));
        if (Array.isArray(_order)) {
          setSectionOrder(_order as string[]);
        }
      }
    }
  }, [settings, localSettings]);

  useEffect(() => {
    if (activeWedding) {
      setSlugValue(activeWedding.slug);
    }
  }, [activeWedding]);

  const handleThemeChange = useCallback(
    (
      theme: string,
      settings: {
        backgroundColor: string;
        primaryColor: string;
        secondaryColor: string;
        font: string;
        heroBanner: string;
        navigationStyle: string;
        dividerStyle: string;
        dividerSize: string;
        layout: string;
        heroTextColor?: string;
      },
    ) => {
      setLocalSettings((prev) => {
        if (!prev) return null;

        // CRITICAL: Preserve user's uploaded hero banner
        // Only apply template's heroBanner if user hasn't uploaded their own
        const preservedHeroBanner = prev.heroBanner;
        const shouldPreserveHeroBanner = preservedHeroBanner &&
          !preservedHeroBanner.includes('/images/heroes/');

        const newSettings = {
          ...prev,
          theme,
          backgroundColor: settings.backgroundColor,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          font: settings.font,
          navigationStyle: settings.navigationStyle,
          dividerStyle: settings.dividerStyle,
          dividerSize: settings.dividerSize,
          layout: settings.layout,
          // Preserve user's uploaded banner, or use template default
          heroBanner: shouldPreserveHeroBanner ? preservedHeroBanner : settings.heroBanner,
        };

        // Apply heroTextColor from template if provided
        if (settings.heroTextColor) {
          newSettings.heroTextColor = settings.heroTextColor;
        } else {
          // Default to 'dark' for light backgrounds, 'light' for dark backgrounds
          newSettings.heroTextColor = settings.backgroundColor === '#0F1015' ? 'light' : 'dark';
        }

        return newSettings;
      });
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleColorChange = useCallback(
    (key: 'primaryColor' | 'secondaryColor', value: string) => {
      setLocalSettings((prev) =>
        prev ? { ...prev, [key]: value } : null,
      );
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleFontChange = useCallback(
    (font: string) => {
      setLocalSettings((prev) => (prev ? { ...prev, font } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleSectionToggle = useCallback(
    (key: string, enabled: boolean) => {
      setSections((prev) => ({ ...prev, [key]: enabled }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      setSectionOrder(newOrder);
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleNavLayoutChange = useCallback(
    (layout: 'left' | 'center' | 'right') => {
      setLocalSettings((prev) => (prev ? { ...prev, navigationStyle: layout } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleLayoutChange = useCallback(
    (layout: 'classic' | 'magazine' | 'editorial') => {
      setLocalSettings((prev) => (prev ? { ...prev, layout } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleDividerChange = useCallback(
    (dividerStyle: string) => {
      setLocalSettings((prev) => (prev ? { ...prev, dividerStyle } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleDividerSizeChange = useCallback(
    (dividerSize: string) => {
      setLocalSettings((prev) => (prev ? { ...prev, dividerSize } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleAudioEnableChange = useCallback(
    (enabled: boolean) => {
      setLocalSettings((prev) => (prev ? { ...prev, enableBackgroundMusic: enabled } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleAudioUrlChange = useCallback(
    (url: string) => {
      setLocalSettings((prev) => (prev ? { ...prev, audioUrl: url || null } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleOpeningTransitionChange = useCallback(
    (transition: string) => {
      setLocalSettings((prev) => (prev ? { ...prev, openingTransition: transition } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleHeroTextColorChange = useCallback(
    (color: 'light' | 'dark') => {
      setLocalSettings((prev) => (prev ? { ...prev, heroTextColor: color } : null));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleSave = async () => {
    if (!localSettings) return;
    try {
      const { openingTransition, heroTextColor, backgroundColor, ...settingsToSave } = localSettings;
      await updateSettings.mutateAsync({
        ...settingsToSave,
        sections: {
          ...sections,
          _order: sectionOrder,
          _openingTransition: openingTransition,
          _heroTextColor: heroTextColor
        } as unknown as Record<string, boolean>
      });
      setHasUnsavedChanges(false);
      toast.success('Website settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleSlugSave = async () => {
    if (!slugValue.trim()) {
      setSlugError('URL path cannot be empty');
      return;
    }
    setSlugError('');
    try {
      await updateSlug.mutateAsync(slugValue);
      toast.success('URL path updated');
    } catch (err) {
      if (err instanceof ApiError) {
        setSlugError(err.message);
      } else {
        setSlugError('Failed to update URL path');
      }
    }
  };

  const isPublished = activeWedding?.status === 'PUBLISHED';

  const handlePublish = async () => {
    try {
      // Save any unsaved changes first
      if (hasUnsavedChanges && localSettings) {
        const { openingTransition, heroTextColor, backgroundColor, ...settingsToSave } = localSettings;
        await updateSettings.mutateAsync({
          ...settingsToSave,
          sections: {
            ...sections,
            _order: sectionOrder,
            _openingTransition: openingTransition,
            _heroTextColor: heroTextColor
          } as unknown as Record<string, boolean>
        });
        setHasUnsavedChanges(false);
      }
      await publishWebsite.mutateAsync();
      toast.success('Website published');
    } catch {
      toast.error('Failed to publish website');
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishWebsite.mutateAsync();
      toast.success('Website unpublished');
    } catch {
      toast.error('Failed to unpublish website');
    }
  };

  if (settingsLoading || profileLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading website builder...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {/* Left Panel — Controls */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-border bg-surface p-5 space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Website Builder
          </h2>
        </div>

        {/* RSVP quick-status */}
        {guestSummary && (
          <Link
            href={`/dashboard/${weddingId}/guests`}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white/60 px-3 py-2 text-xs text-stone-600 hover:bg-white transition-colors"
          >
            <MailCheck className="h-3.5 w-3.5 text-stone-400" />
            <span>
              <span className="font-semibold text-stone-900">{guestSummary.totalAttending}</span> Attending
              <span className="mx-1.5 text-stone-300">&middot;</span>
              <span className="font-semibold text-stone-900">{guestSummary.rsvpPending}</span> Pending
            </span>
          </Link>
        )}

        {/* Publish status */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CircleDot
              className={`h-4 w-4 ${isPublished ? 'text-success' : 'text-muted'}`}
            />
            <span className="text-sm font-medium text-foreground">
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Slug editor */}
          <div>
            <Label className="mb-1 block text-xs text-muted">URL Path</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-xs">/</span>
                <Input
                  value={slugValue}
                  onChange={(e) => {
                    setSlugValue(e.target.value);
                    setSlugError('');
                  }}
                  className="pl-6 h-8 text-xs"
                  error={!!slugError}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSlugSave}
                disabled={updateSlug.isPending || slugValue === activeWedding?.slug}
                className="h-8 px-2"
              >
                {updateSlug.isPending ? '...' : <Check className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {slugError && (
              <p className="mt-1 text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {slugError}
              </p>
            )}
          </div>

          {/* Publish / Unpublish buttons */}
          <div className="flex gap-2">
            {isPublished ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUnpublish}
                disabled={unpublishWebsite.isPending}
                className="flex-1"
              >
                {unpublishWebsite.isPending ? 'Unpublishing...' : 'Unpublish'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handlePublish}
                disabled={publishWebsite.isPending}
                className="flex-1"
              >
                {publishWebsite.isPending ? 'Publishing...' : 'Publish Website'}
              </Button>
            )}
          </div>
        </div>

        <TemplatePresets
          activeTheme={localSettings.theme}
          onChange={handleThemeChange}
        />

        <LayoutPicker
          value={localSettings.layout as 'classic' | 'magazine' | 'editorial'}
          onChange={handleLayoutChange}
        />

        <HeroBannerPicker
          weddingId={weddingId}
          heroBanner={localSettings.heroBanner}
          onUploaded={(url) => {
            setLocalSettings((prev) =>
              prev ? { ...prev, heroBanner: url } : null,
            );
          }}
        />

        <HeroTextColorPicker
          value={localSettings.heroTextColor as 'light' | 'dark'}
          onChange={handleHeroTextColorChange}
        />

        <ColorPicker
          primaryColor={localSettings.primaryColor}
          secondaryColor={localSettings.secondaryColor}
          onPrimaryChange={(c) => handleColorChange('primaryColor', c)}
          onSecondaryChange={(c) => handleColorChange('secondaryColor', c)}
        />

        <FontPicker
          value={localSettings.font}
          onChange={handleFontChange}
        />

        <SectionToggles
          sections={sections}
          onChange={handleSectionToggle}
          order={sectionOrder}
          onReorder={handleReorder}
        />

        <NavLayoutPicker
          value={localSettings.navigationStyle as 'left' | 'center' | 'right'}
          onChange={handleNavLayoutChange}
        />

        <DividerPicker
          value={localSettings.dividerStyle as 'classic' | 'minimal' | 'ornate' | 'dots' | 'none'}
          onChange={handleDividerChange}
          size={localSettings.dividerSize as 'small' | 'medium' | 'large'}
          onSizeChange={handleDividerSizeChange}
        />

        <AudioSettings
          weddingId={weddingId}
          enableBackgroundMusic={localSettings.enableBackgroundMusic}
          audioUrl={localSettings.audioUrl}
          onEnableChange={handleAudioEnableChange}
          onAudioUrlChange={handleAudioUrlChange}
        />

        <OpeningTransitionPicker
          value={localSettings.openingTransition}
          onChange={handleOpeningTransitionChange}
        />

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || updateSettings.isPending}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-1.5" />
          {updateSettings.isPending
            ? 'Saving...'
            : hasUnsavedChanges
              ? 'Save Changes'
              : 'Saved'}
        </Button>
      </div>

      {/* Right Panel — Preview */}
      <div className="flex-1 overflow-hidden">
        {activeWedding && profile && (
          <PreviewPanel
            slug={activeWedding.slug}
            settings={localSettings}
            profile={{
              brideName: profile.brideName,
              groomName: profile.groomName,
              proposalStory: profile.proposalStory,
              loveStory: profile.loveStory,
              weddingHashtag: profile.weddingHashtag,
              ceremonyName: profile.ceremonyName,
              ceremonyAddress: profile.ceremonyAddress,
              ceremonyTime: profile.ceremonyTime,
              receptionName: profile.receptionName,
              receptionAddress: profile.receptionAddress,
              receptionTime: profile.receptionTime,
              ceremonyImage: profile.ceremonyImage,
              receptionImage: profile.receptionImage,
              dressCode: profile.dressCode,
              dressCodeColors: profile.dressCodeColors,
              scheduleEvents: profile.scheduleEvents,
              faqItems: profile.faqItems,
            }}
            wedding={{
              weddingDate: activeWedding.weddingDate,
              timezone: activeWedding.timezone,
            }}
            sections={sections}
            sectionOrder={sectionOrder}
          />
        )}
      </div>
    </div>
  );
}
