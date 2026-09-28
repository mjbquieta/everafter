'use client';

interface ThemePresetsProps {
  activeTheme: string;
  onChange: (theme: string, colors: { primaryColor: string; secondaryColor: string; font: string }) => void;
}

const presets = [
  {
    id: 'classic',
    label: 'Classic',
    primaryColor: '#8B5E5E',
    secondaryColor: '#D8B4A0',
    font: 'Playfair',
    preview: ['#8B5E5E', '#D8B4A0', '#FAF9F7'],
  },
  {
    id: 'editorial',
    label: 'Editorial',
    primaryColor: '#2B2726',
    secondaryColor: '#E7E2DE',
    font: 'Lora',
    preview: ['#2B2726', '#E7E2DE', '#FAF9F7'],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    primaryColor: '#555555',
    secondaryColor: '#F0F0F0',
    font: 'Inter',
    preview: ['#555555', '#F0F0F0', '#FFFFFF'],
  },
  {
    id: 'romantic',
    label: 'Romantic',
    primaryColor: '#B76E79',
    secondaryColor: '#F2D7D5',
    font: 'Playfair',
    preview: ['#B76E79', '#F2D7D5', '#FFF9F8'],
  },
];

export function ThemePresets({ activeTheme, onChange }: ThemePresetsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Theme Presets
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() =>
              onChange(preset.id, {
                primaryColor: preset.primaryColor,
                secondaryColor: preset.secondaryColor,
                font: preset.font,
              })
            }
            className={`rounded-lg border-2 p-3 text-left transition-colors ${
              activeTheme === preset.id
                ? 'border-primary'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex gap-1 mb-2">
              {preset.preview.map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs font-medium text-foreground">
              {preset.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
