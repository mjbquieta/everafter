import { Rows3, Columns2, AlignLeft } from 'lucide-react';

type Layout = 'classic' | 'magazine' | 'editorial';

interface LayoutPickerProps {
  value: Layout;
  onChange: (layout: Layout) => void;
}

const options: { value: Layout; label: string; description: string; icon: typeof Rows3 }[] = [
  { value: 'classic', label: 'Classic', description: 'Single column stack', icon: Rows3 },
  { value: 'magazine', label: 'Magazine', description: 'Side-by-side grid', icon: Columns2 },
  { value: 'editorial', label: 'Editorial', description: 'Asymmetric layout', icon: AlignLeft },
];

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">Page Layout</p>
      <p className="text-xs text-muted mb-3">
        Choose how sections are arranged on the page
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
