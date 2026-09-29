'use client';

import Image from 'next/image';

interface TemplateSettings {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  heroBanner: string;
  navigationStyle: string;
  dividerStyle: string;
  dividerSize: string;
}

interface TemplatePresetsProps {
  activeTheme: string;
  onChange: (theme: string, settings: TemplateSettings) => void;
}

const presets: (TemplateSettings & { id: string; label: string })[] = [
  {
    id: 'classic',
    label: 'Classic Elegance',
    primaryColor: '#8B5E5E',
    secondaryColor: '#D8B4A0',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-1.jpeg',
    navigationStyle: 'left',
    dividerStyle: 'classic',
    dividerSize: 'medium',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    primaryColor: '#2B2726',
    secondaryColor: '#E7E2DE',
    font: 'Lora',
    heroBanner: '/images/heroes/hero-2.jpeg',
    navigationStyle: 'right',
    dividerStyle: 'minimal',
    dividerSize: 'medium',
  },
  {
    id: 'minimal',
    label: 'Modern Minimal',
    primaryColor: '#555555',
    secondaryColor: '#F0F0F0',
    font: 'Inter',
    heroBanner: '/images/heroes/hero-3.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'none',
    dividerSize: 'small',
  },
  {
    id: 'romantic',
    label: 'Romantic Garden',
    primaryColor: '#B76E79',
    secondaryColor: '#F2D7D5',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-4.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
  },
  {
    id: 'bohemian',
    label: 'Bohemian',
    primaryColor: '#8B7355',
    secondaryColor: '#E8DDD3',
    font: 'Montserrat',
    heroBanner: '/images/heroes/hero-5.jpeg',
    navigationStyle: 'left',
    dividerStyle: 'dots',
    dividerSize: 'large',
  },
];

export function TemplatePresets({ activeTheme, onChange }: TemplatePresetsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Website Templates
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              const { id: _, label: __, ...settings } = preset;
              onChange(preset.id, settings);
            }}
            className={`rounded-lg border-2 p-2 text-left transition-colors ${
              activeTheme === preset.id
                ? 'border-primary'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="relative rounded overflow-hidden aspect-[16/9] mb-2 bg-muted">
              <Image
                src={preset.heroBanner}
                alt={preset.label}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <div
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: preset.secondaryColor }}
                />
              </div>
              <p className="text-xs font-medium text-foreground truncate">
                {preset.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
