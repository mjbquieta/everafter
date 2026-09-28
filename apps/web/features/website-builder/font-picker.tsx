'use client';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

const fonts = [
  { id: 'Inter', label: 'Inter', family: 'sans-serif', sample: 'Modern & Clean' },
  { id: 'Playfair', label: 'Playfair Display', family: 'serif', sample: 'Elegant & Classic' },
  { id: 'Lora', label: 'Lora', family: 'serif', sample: 'Editorial & Warm' },
  { id: 'Montserrat', label: 'Montserrat', family: 'sans-serif', sample: 'Bold & Contemporary' },
];

export function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Typography
      </h3>
      <div className="space-y-2">
        {fonts.map((font) => (
          <button
            key={font.id}
            onClick={() => onChange(font.id)}
            className={`w-full rounded-lg border-2 px-3 py-2.5 text-left transition-colors ${
              value === font.id
                ? 'border-primary'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <p className="text-sm font-medium text-foreground">
              {font.label}
            </p>
            <p className="text-[11px] text-muted">{font.sample}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
