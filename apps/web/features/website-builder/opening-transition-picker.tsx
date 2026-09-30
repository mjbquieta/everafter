'use client';

import { Label } from '@everafter/ui';

interface OpeningTransitionPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const TRANSITIONS = [
  { value: 'none', label: 'None', description: 'Page loads immediately' },
  { value: 'fade', label: 'Fade In', description: 'Gentle fade from ivory overlay' },
  { value: 'envelope', label: 'Wax Seal & Envelope', description: 'Interactive envelope reveal' },
];

export function OpeningTransitionPicker({ value, onChange }: OpeningTransitionPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-stone-700">Opening Experience</Label>
      <div className="space-y-2">
        {TRANSITIONS.map((transition) => (
          <label
            key={transition.value}
            className="flex items-start gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
          >
            <input
              type="radio"
              name="openingTransition"
              value={transition.value}
              checked={value === transition.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 h-4 w-4 text-rose-600 border-stone-300 focus:ring-rose-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-900">{transition.label}</div>
              <div className="text-xs text-stone-500 mt-0.5">{transition.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
