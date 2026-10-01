'use client';

interface TemplateSettings {
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
}

interface TemplatePresetsProps {
  activeTheme: string;
  onChange: (theme: string, settings: TemplateSettings) => void;
}

const presets: {
  id: string;
  label: string;
  backgroundColor: string;
  palette: string[];
  primaryColor: string;
  secondaryColor: string;
  font: string;
  heroBanner: string;
  navigationStyle: string;
  dividerStyle: string;
  dividerSize: string;
  layout: string;
  heroTextColor?: string;
}[] = [
  {
    id: 'warm-linen',
    label: 'Warm Linen',
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
  },
  {
    id: 'moody-plum',
    label: 'Moody Plum',
    backgroundColor: '#F5F2F7',
    palette: ['#F5F2F7', '#4A2E4B', '#9B7E9F', '#D4C5D6'],
    primaryColor: '#4A2E4B',
    secondaryColor: '#9B7E9F',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-2.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
    layout: 'classic',
  },
  {
    id: 'dusty-rose',
    label: 'Dusty Rose',
    backgroundColor: '#FAF0F2',
    palette: ['#FAF0F2', '#9E4759', '#D99BA5', '#F2D5DA'],
    primaryColor: '#9E4759',
    secondaryColor: '#D99BA5',
    font: 'Playfair',
    heroBanner: '/images/heroes/hero-4.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'ornate',
    dividerSize: 'medium',
    layout: 'classic',
  },
  {
    id: 'coastal-slate',
    label: 'Coastal Slate',
    backgroundColor: '#EDF3F7',
    palette: ['#EDF3F7', '#2C4251', '#71899C', '#C5D4DD'],
    primaryColor: '#2C4251',
    secondaryColor: '#71899C',
    font: 'Lora',
    heroBanner: '/images/heroes/hero-5.jpeg',
    navigationStyle: 'center',
    dividerStyle: 'minimal',
    dividerSize: 'small',
    layout: 'classic',
  },
  {
    id: 'midnight-editorial',
    label: 'Midnight Editorial',
    backgroundColor: '#0F1015',
    palette: ['#0F1015', '#FFFFFF', '#D4AF37', '#8B7355'],
    primaryColor: '#FFFFFF',
    secondaryColor: '#D4AF37',
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
              const { id: _, label: __, palette: ___, ...settings } = preset;
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
