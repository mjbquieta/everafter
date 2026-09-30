'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Globe, CircleDot, Save, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Label } from '@everafter/ui';
import { useWeddingContext } from '@/lib/wedding-context';
import { useWeddingProfile } from '@/lib/hooks/use-dashboard';
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
} from '@/features/website-builder';
import { ApiError } from '@/lib/api-client';

export default function WebsiteBuilderPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;
  const { activeWedding } = useWeddingContext();

  const { data: settings, isLoading: settingsLoading } =
    useWebsiteSettings(weddingId);
  const { data: profile, isLoading: profileLoading } =
    useWeddingProfile(weddingId);
  const updateSettings = useUpdateWebsiteSettings(weddingId);
  const updateSlug = useUpdateSlug(weddingId);
  const publishWebsite = usePublishWebsite(weddingId);
  const unpublishWebsite = useUnpublishWebsite(weddingId);

  // Local state for optimistic preview updates
  const [localSettings, setLocalSettings] = useState<{
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
    layout: string;
    navigationStyle: string;
    dividerStyle: string;
    dividerSize: string;
  } | null>(null);

  const [sections, setSections] = useState<Record<string, boolean>>({
    hero: true,
    story: true,
    details: true,
    schedule: true,
    faq: true,
    rsvp: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [slugValue, setSlugValue] = useState('');
  const [slugError, setSlugError] = useState('');

  // Sync from server once loaded
  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings({
        theme: settings.theme,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        font: settings.font,
        heroBanner: settings.heroBanner,
        layout: settings.layout,
        navigationStyle: settings.navigationStyle,
        dividerStyle: settings.dividerStyle,
        dividerSize: settings.dividerSize,
      });
      if (settings.sections) {
        setSections((prev) => ({ ...prev, ...settings.sections }));
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
        primaryColor: string;
        secondaryColor: string;
        font: string;
        heroBanner: string;
        navigationStyle: string;
        dividerStyle: string;
        dividerSize: string;
        layout: string;
      },
    ) => {
      setLocalSettings((prev) => (prev ? { ...prev, theme, ...settings } : null));
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

  const handleSave = async () => {
    if (!localSettings) return;
    try {
      await updateSettings.mutateAsync({ ...localSettings, sections });
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
        await updateSettings.mutateAsync({ ...localSettings, sections });
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
          />
        )}
      </div>
    </div>
  );
}
