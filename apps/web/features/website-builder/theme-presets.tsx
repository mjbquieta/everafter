'use client';

interface TemplateSettings {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  heroBanner: string;
  navigationStyle: string;
  dividerStyle: string;
  dividerSize: string;
  layout: string;
  heroTextColor?: string;
}

interface TemplatePresetsProps {
  activeTheme: string;
  onChange: (theme: string, settings: TemplateSettings) => void;
}

const presets: (TemplateSettings & {
  id: string;
  label: string;
  backgroundColor: string;
  palette: string[];
})[] = [
  {
    id: 'classic-ivory',
    label: 'Classic Ivory',
    backgroundColor: '#FAF9F7',
    palette: ['#FFFFFF', '#8B4A52', '#D4A373', '#C5A059'],
    primaryColor: '#8B4A52',
    secondaryColor: '#D4A373',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-1.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'classic',
    dividerSize: 'medium',
    layout: 'classic',
  },
  {
    id: 'minimal-sage',
    label: 'Minimal Sage',
    backgroundColor: '#F4F7F5',
    palette: ['#FFFFFF', '#3E5641', '#8FA89B', '#6B8E23'],
    primaryColor: '#3E5641',
    secondaryColor: '#8FA89B',
    font: 'Lora',
    heroBanner: '/images/heroes/hero-2.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'minimal',
    dividerSize: 'small',
    layout: 'classic',
  },
  {
    id: 'romantic-blush',
    label: 'Romantic Blush',
    backgroundColor: '#FAF4F4',
    palette: ['#FFFFFF', '#A25862', '#E8C5C8', '#C47C85'],
    primaryColor: '#A25862',
    secondaryColor: '#E8C5C8',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-4.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
    layout: 'classic',
  },
  {
    id: 'midnight-gold',
    label: 'Midnight Gold',
    backgroundColor: '#0E1015',
    palette: ['#0E1015', '#1F2232', '#2C3048', '#D4AF37'],
    primaryColor: '#D4AF37',
    secondaryColor: '#2C3048',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-3.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'classic',
    dividerSize: 'medium',
    layout: 'classic',
    heroTextColor: 'light',
  },
];

export function TemplatePresets({ activeTheme, onChange }: TemplatePresetsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Website Templates
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              const { id: _, label: __, backgroundColor: ___, palette: ____, ...settings } = preset;
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
                  color: preset.id === 'midnight-gold' ? '#F0E8D8' : '#2B2726'
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
