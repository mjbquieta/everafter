import type { DividerStyle, DividerSize } from '@/features/public-wedding/floral-divider';

interface DividerPickerProps {
  value: DividerStyle;
  onChange: (style: DividerStyle) => void;
  size?: DividerSize;
  onSizeChange?: (size: DividerSize) => void;
}

const presets: { value: DividerStyle; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'ornate', label: 'Ornate' },
  { value: 'dots', label: 'Dots' },
  { value: 'none', label: 'None' },
];

/* Small inline preview SVGs for each style */
function PreviewSvg({ style }: { style: DividerStyle }) {
  const color = 'currentColor';

  if (style === 'none') {
    return (
      <svg viewBox="0 0 80 20" className="w-full h-5" fill="none" aria-hidden="true">
        <line x1="10" y1="10" x2="70" y2="10" stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (style === 'classic') {
    return (
      <svg viewBox="0 0 80 20" className="w-full h-5" fill="none" aria-hidden="true">
        <path d="M40 10 Q28 8 16 6 Q8 8 4 10" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <path d="M40 10 Q52 8 64 6 Q72 8 76 10" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <ellipse cx="20" cy="7" rx="3" ry="1.5" transform="rotate(-15 20 7)" fill={color} opacity="0.15" />
        <ellipse cx="60" cy="7" rx="3" ry="1.5" transform="rotate(15 60 7)" fill={color} opacity="0.15" />
        <circle cx="40" cy="10" r="2" fill={color} opacity="0.25" />
      </svg>
    );
  }

  if (style === 'minimal') {
    return (
      <svg viewBox="0 0 80 20" className="w-full h-5" fill="none" aria-hidden="true">
        <line x1="10" y1="10" x2="35" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <rect x="37" y="7" width="6" height="6" rx="0.5" transform="rotate(45 40 10)" fill={color} opacity="0.25" />
        <line x1="45" y1="10" x2="70" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3" />
      </svg>
    );
  }

  if (style === 'ornate') {
    return (
      <svg viewBox="0 0 80 20" className="w-full h-5" fill="none" aria-hidden="true">
        <path d="M40 10 Q32 10 28 6 Q24 3 20 6 Q17 10 20 13 Q23 15 25 12"
              stroke={color} strokeWidth="0.5" opacity="0.35" />
        <path d="M40 10 Q48 10 52 6 Q56 3 60 6 Q63 10 60 13 Q57 15 55 12"
              stroke={color} strokeWidth="0.5" opacity="0.35" />
        <circle cx="40" cy="10" r="1.5" fill={color} opacity="0.3" />
      </svg>
    );
  }

  // dots
  return (
    <svg viewBox="0 0 80 20" className="w-full h-5" fill="none" aria-hidden="true">
      <circle cx="34" cy="10" r="1.5" fill={color} opacity="0.25" />
      <circle cx="40" cy="10" r="2" fill={color} opacity="0.4" />
      <circle cx="46" cy="10" r="1.5" fill={color} opacity="0.25" />
    </svg>
  );
}

const sizes: { value: DividerSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export function DividerPicker({ value, onChange, size = 'medium', onSizeChange }: DividerPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">Section Divider</p>
      <p className="text-xs text-muted mb-3">
        Choose a decorative divider between sections
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {presets.map((preset) => {
          const active = value === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => onChange(preset.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 py-2.5 px-1 text-[10px] font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <PreviewSvg style={preset.value} />
              {preset.label}
            </button>
          );
        })}
      </div>

      {value !== 'none' && onSizeChange && (
        <div className="mt-3">
          <p className="text-xs text-muted mb-2">Divider Size</p>
          <div className="grid grid-cols-3 gap-1.5">
            {sizes.map((s) => {
              const active = size === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => onSizeChange(s.value)}
                  className={`rounded-lg border-2 py-1.5 text-[10px] font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
