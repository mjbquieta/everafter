'use client';

import { Sparkles } from 'lucide-react';

interface InvitationCardProps {
  theme?: {
    primary: string;
    secondary: string;
    bg: string;
    fg: string;
    accent: string;
  };
}

export function InvitationCard({ theme }: InvitationCardProps) {
  const defaultTheme = {
    primary: '#8B5E5E',
    secondary: '#D8B4A0',
    bg: '#FAF9F7',
    fg: '#2B2726',
    accent: '#C9A86A',
  };

  const t = theme || defaultTheme;

  return (
    <div
      className="relative w-full max-w-[280px] sm:max-w-[320px] rounded-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-stone-200/50"
      style={{ backgroundColor: t.bg }}
    >
      {/* Wax seal accent */}
      <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: t.primary }} />

      {/* Card content */}
      <div className="px-8 py-12">
        <p
          className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-center mb-4"
          style={{ color: t.primary }}
        >
          You're Invited
        </p>

        <h3
          className="font-serif text-2xl font-medium tracking-tight text-center leading-tight mb-1"
          style={{ color: t.fg }}
        >
          Mark & Issa
        </h3>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-10" style={{ backgroundColor: t.primary, opacity: 0.3 }} />
          <Sparkles className="h-3.5 w-3.5" style={{ color: t.accent }} />
          <div className="h-px w-10" style={{ backgroundColor: t.primary, opacity: 0.3 }} />
        </div>

        <p
          className="font-sans text-[10px] uppercase tracking-[0.2em] text-center mb-2"
          style={{ color: t.fg, opacity: 0.6 }}
        >
          December 14, 2025
        </p>

        <p
          className="font-serif text-xs text-center leading-relaxed"
          style={{ color: t.fg, opacity: 0.5 }}
        >
          Manila Cathedral
        </p>

        {/* Decorative border */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: t.secondary, opacity: 0.4 }}>
          <p
            className="font-serif text-[9px] text-center italic"
            style={{ color: t.fg, opacity: 0.4 }}
          >
            Ceremony at 4:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}
