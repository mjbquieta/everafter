'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

interface SectionTogglesProps {
  sections: Record<string, boolean>;
  onChange: (key: string, enabled: boolean) => void;
  order: string[];
  onReorder: (order: string[]) => void;
}

interface BlockDef {
  key: string;
  toggles: { key: string; label: string; description: string }[];
}

const blockDefs: BlockDef[] = [
  {
    key: 'hero',
    toggles: [{ key: 'hero', label: 'Hero', description: 'Couple names, date & countdown' }],
  },
  {
    key: 'content',
    toggles: [
      { key: 'story', label: 'Our Story', description: 'Love story & proposal' },
      { key: 'details', label: 'Details', description: 'Ceremony & reception info' },
    ],
  },
  {
    key: 'schedule',
    toggles: [{ key: 'schedule', label: 'Programme', description: 'Order of wedding day events' }],
  },
  {
    key: 'faq',
    toggles: [{ key: 'faq', label: 'FAQ', description: 'Frequently asked questions' }],
  },
  {
    key: 'rsvp',
    toggles: [{ key: 'rsvp', label: 'RSVP', description: 'Guest response form' }],
  },
];

const blockMap = Object.fromEntries(blockDefs.map((b) => [b.key, b]));

export const DEFAULT_SECTION_ORDER = blockDefs.map((b) => b.key);

export function SectionToggles({ sections, onChange, order, onReorder }: SectionTogglesProps) {
  const orderedBlocks = order
    .map((key) => blockMap[key])
    .filter(Boolean);

  const swap = (i: number, dir: -1 | 1) => {
    const next = [...order];
    const j = i + dir;
    [next[i], next[j]] = [next[j], next[i]];
    onReorder(next);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Sections
      </h3>
      <div className="space-y-1.5">
        {orderedBlocks.map((block, i) => (
          <div
            key={block.key}
            className="rounded-lg border border-border overflow-hidden"
          >
            {block.toggles.map((t, ti) => (
              <label
                key={t.key}
                className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/[0.02] transition-colors ${
                  ti > 0 ? 'border-t border-border' : ''
                }`}
              >
                {/* Arrows only on first toggle of block */}
                {ti === 0 ? (
                  <div className="flex flex-col shrink-0">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={(e) => { e.preventDefault(); swap(i, -1); }}
                      className="text-muted hover:text-foreground disabled:opacity-20 disabled:cursor-default transition-colors p-0.5"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={i === orderedBlocks.length - 1}
                      onClick={(e) => { e.preventDefault(); swap(i, 1); }}
                      className="text-muted hover:text-foreground disabled:opacity-20 disabled:cursor-default transition-colors p-0.5"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-[22px] shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-[11px] text-muted">{t.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={sections[t.key] ?? true}
                  onChange={(e) => onChange(t.key, e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-border text-primary accent-primary"
                />
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
