'use client';

import { Label } from '@everafter/ui';

interface HeroTextColorPickerProps {
  value: 'light' | 'dark';
  onChange: (value: 'light' | 'dark') => void;
}

export function HeroTextColorPicker({ value, onChange }: HeroTextColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-stone-700">Hero Text Theme</Label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('light')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
            value === 'light'
              ? 'border-rose-500 bg-rose-50 text-rose-900'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
          }`}
        >
          <div className="text-sm font-medium">Light</div>
          <div className="text-xs mt-0.5 opacity-75">For dark photos</div>
        </button>
        <button
          onClick={() => onChange('dark')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
            value === 'dark'
              ? 'border-rose-500 bg-rose-50 text-rose-900'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
          }`}
        >
          <div className="text-sm font-medium">Dark</div>
          <div className="text-xs mt-0.5 opacity-75">For bright photos</div>
        </button>
      </div>
    </div>
  );
}
