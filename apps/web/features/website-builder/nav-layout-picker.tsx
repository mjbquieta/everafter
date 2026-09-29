import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

type NavLayout = 'left' | 'center' | 'right';

interface NavLayoutPickerProps {
  value: NavLayout;
  onChange: (layout: NavLayout) => void;
}

const options: { value: NavLayout; label: string; icon: typeof AlignLeft }[] = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
];

export function NavLayoutPicker({ value, onChange }: NavLayoutPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">Navigation Layout</p>
      <p className="text-xs text-muted mb-3">
        Choose where the menu links are positioned
      </p>
      <div className="flex gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <opt.icon className="h-4 w-4" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
