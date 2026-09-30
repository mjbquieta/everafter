'use client';

interface SectionTogglesProps {
  sections: Record<string, boolean>;
  onChange: (key: string, enabled: boolean) => void;
}

const sectionDefs = [
  { key: 'hero', label: 'Hero', description: 'Couple names, date & countdown' },
  { key: 'story', label: 'Our Story', description: 'Love story & proposal' },
  { key: 'details', label: 'Details', description: 'Ceremony & reception info' },
  { key: 'schedule', label: 'Programme', description: 'Order of wedding day events' },
  { key: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { key: 'rsvp', label: 'RSVP', description: 'Guest response form' },
];

export function SectionToggles({ sections, onChange }: SectionTogglesProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Sections
      </h3>
      <div className="space-y-2">
        {sectionDefs.map((s) => (
          <label
            key={s.key}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-primary/[0.02] transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-[11px] text-muted">{s.description}</p>
            </div>
            <input
              type="checkbox"
              checked={sections[s.key] ?? true}
              onChange={(e) => onChange(s.key, e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary accent-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
