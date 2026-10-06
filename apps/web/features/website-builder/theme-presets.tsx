'use client';

import { Link } from 'lucide-react';

export type WebsiteLayoutType = 'classic' | 'asymmetric' | 'storybook' | 'photo_focused' | 'minimalist';

interface TemplateSettings {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  heroBanner: string;
  navigationStyle: string;
  dividerStyle: string;
  dividerSize: string;
  layout: WebsiteLayoutType;
  heroTextColor?: string;
}

interface TemplatePresetsProps {
  activeTheme: string;
  onChange: (theme: string, settings: TemplateSettings) => void;
  photoCount?: number;
  onManagePhotos?: () => void;
}

const presets: {
  id: string;
  label: string;
  description: string;
  backgroundColor: string;
  palette: string[];
  primaryColor: string;
  secondaryColor: string;
  font: string;
  heroBanner: string;
  navigationStyle: string;
  dividerStyle: string;
  dividerSize: string;
  layout: WebsiteLayoutType;
  requiredPhotos: number;
  heroTextColor?: string;
}[] = [
  {
    id: 'warm-linen',
    label: 'Warm Linen',
    description: 'Classic stationery with formal card sections',
    backgroundColor: '#F9F6F0',
    palette: ['#F9F6F0', '#8C7355', '#C2A67E', '#E8DCC8'],
    primaryColor: '#8C7355',
    secondaryColor: '#C2A67E',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-1.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'classic',
    dividerSize: 'medium',
    layout: 'classic',
    requiredPhotos: 1,
  },
  {
    id: 'moody-plum',
    label: 'Moody Plum',
    description: 'Contemporary asymmetric with split hero',
    backgroundColor: '#F5F2F7',
    palette: ['#F5F2F7', '#4A2E4B', '#9B7E9F', '#D4C5D6'],
    primaryColor: '#4A2E4B',
    secondaryColor: '#9B7E9F',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-2.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
    layout: 'asymmetric',
    requiredPhotos: 5,
  },
  {
    id: 'dusty-rose',
    label: 'Dusty Rose',
    description: 'Romantic storybook with overlapping cards',
    backgroundColor: '#FAF0F2',
    palette: ['#FAF0F2', '#9E4759', '#D99BA5', '#F2D5DA'],
    primaryColor: '#9E4759',
    secondaryColor: '#D99BA5',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-4.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
    layout: 'storybook',
    requiredPhotos: 4,
  },
  {
    id: 'coastal-slate',
    label: 'Coastal Slate',
    description: 'Modern photo showcase with masonry gallery',
    backgroundColor: '#EDF3F7',
    palette: ['#EDF3F7', '#2C4251', '#71899C', '#C5D4DD'],
    primaryColor: '#2C4251',
    secondaryColor: '#71899C',
    font: 'Lora',
    heroBanner: '/images/heroes/hero-5.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'minimal',
    dividerSize: 'small',
    layout: 'photo_focused',
    requiredPhotos: 6,
  },
  {
    id: 'midnight-editorial',
    label: 'Midnight Editorial',
    description: 'High-fashion minimalist with dark canvas',
    backgroundColor: '#0F1015',
    palette: ['#0F1015', '#FFFFFF', '#D4AF37', '#8B7355'],
    primaryColor: '#FFFFFF',
    secondaryColor: '#D4AF37',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-3.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'classic',
    dividerSize: 'medium',
    layout: 'minimalist',
    requiredPhotos: 3,
    heroTextColor: 'light',
  },
];

export function TemplatePresets({
  activeTheme,
  onChange,
  photoCount = 0,
  onManagePhotos
}: TemplatePresetsProps) {
  const activePreset = presets.find(p => p.id === activeTheme);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Website Templates
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              const { id: _, label: __, palette: ___, description: ____, requiredPhotos: _____, ...settings } = preset;
              onChange(preset.id, settings);
            }}
            className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
              activeTheme === preset.id
                ? 'border-primary shadow-sm'
                : 'border-stone-200 hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            {/* Mini Canvas Preview */}
            <div
              className="relative aspect-[4/3] p-4 flex flex-col items-center justify-center"
              style={{ backgroundColor: preset.backgroundColor }}
            >
              {/* Sample Couple Names */}
              <p
                className="font-serif text-[11px] font-medium tracking-tight text-center mb-2"
                style={{
                  color: preset.id === 'midnight-editorial' ? '#F5F3EF' : '#2B2726'
                }}
              >
                Milagros & Roberto
              </p>

              {/* Decorative Divider */}
              <div className="flex items-center gap-1 mb-2">
                <div
                  className="h-px w-5"
                  style={{ backgroundColor: preset.primaryColor, opacity: 0.3 }}
                />
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <div
                  className="h-px w-5"
                  style={{ backgroundColor: preset.primaryColor, opacity: 0.3 }}
                />
              </div>

              {/* Color Palette Strip */}
              <div className="flex gap-1 mt-auto">
                {preset.palette.map((color, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-stone-200/60"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Label */}
            <div className="bg-white px-3 py-2 border-t border-stone-100">
              <p className="text-xs font-medium text-stone-900">
                {preset.label}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {preset.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Photo Requirement Guidance */}
      {activePreset && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-start gap-2">
            <span className="text-stone-400 mt-0.5">✦</span>
            <div className="flex-1 text-xs text-stone-600">
              <p>
                <span className="font-medium">Best with {activePreset.requiredPhotos} website photo{activePreset.requiredPhotos > 1 ? 's' : ''}</span>
                {photoCount > 0 && (
                  <span className="text-stone-500">
                    {' '}(currently {photoCount} uploaded
                    {photoCount < activePreset.requiredPhotos && ', using placeholders for missing shots'})
                  </span>
                )}
              </p>
              {onManagePhotos && (
                <button
                  onClick={onManagePhotos}
                  className="text-primary hover:underline mt-1 inline-flex items-center gap-1"
                >
                  Manage in Gallery →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
