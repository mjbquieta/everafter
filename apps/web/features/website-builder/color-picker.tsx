'use client';

import { Label } from '@everafter/ui';

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-9 cursor-pointer rounded-md border border-border p-0.5"
      />
      <div className="flex-1">
        <Label className="text-xs">{label}</Label>
        <p className="text-[11px] text-muted font-mono">{value}</p>
      </div>
    </div>
  );
}

export function ColorPicker({
  primaryColor,
  secondaryColor,
  onPrimaryChange,
  onSecondaryChange,
}: ColorPickerProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Colors</h3>
      <div className="space-y-3">
        <ColorInput
          label="Primary"
          value={primaryColor}
          onChange={onPrimaryChange}
        />
        <ColorInput
          label="Secondary"
          value={secondaryColor}
          onChange={onSecondaryChange}
        />
      </div>
    </div>
  );
}
