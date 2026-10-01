'use client';

import { Mail, Music, Palette, Users, Wallet, CheckSquare } from 'lucide-react';

const features = [
  {
    id: '01',
    icon: Mail,
    title: 'Tactile Opening & Audio',
    description: 'Interactive wax seal animation and curated ambient ceremony music that greets guests with warmth.',
    span: 'lg:col-span-7',
    badge: 'Premium Feel',
    colors: ['#FAF9F7', '#8B5E5E', '#D8B4A0'],
  },
  {
    id: '02',
    icon: Palette,
    title: 'Attire & Color Palette',
    description: 'Custom-named color swatches and dress code guidance.',
    span: 'lg:col-span-5',
    badge: null,
    colors: ['#FAF9F7', '#8B4A52', '#3E5641'],
  },
  {
    id: '03',
    icon: Users,
    title: 'Smart RSVP & Guest CRM',
    description: 'Track RSVPs, dietary needs, and table assignments in real-time.',
    span: 'lg:col-span-4',
    badge: '2,500+ couples',
    colors: null,
  },
  {
    id: '04',
    icon: CheckSquare,
    title: 'Workspace, Checklists & ₱ Budget',
    description: 'Milestone tracking, timeline hairlines, and Philippine Peso budget management.',
    span: 'lg:col-span-8',
    badge: null,
    colors: null,
  },
];

export function FeatureShowcaseGrid() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500">
            LUXURY DIFFERENTIATORS
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
            Premium features that <span className="italic">delight</span>
          </h2>
        </div>

        {/* Broken grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative bg-white/80 border border-stone-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] rounded-2xl p-8 md:p-10 transition-all hover:shadow-xl hover:shadow-stone-900/5 hover:border-stone-300 ${feature.span}`}
            >
              {/* Micro-index */}
              <p className="font-sans font-light text-xs tracking-[0.25em] text-stone-400 mb-6">
                {feature.id}
              </p>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 transition-colors group-hover:bg-stone-900 mb-6">
                <feature.icon className="h-6 w-6 text-stone-700 transition-colors group-hover:text-white" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-stone-700 font-serif text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>

              {/* Badge */}
              {feature.badge && (
                <div className="mt-6 inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-700">
                  {feature.badge}
                </div>
              )}

              {/* Color chips */}
              {feature.colors && (
                <div className="mt-6 flex items-center gap-2">
                  {feature.colors.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-stone-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[9px] text-stone-400 tracking-wider">
                    PALETTE
                  </span>
                </div>
              )}

              {/* Hairline divider (bottom accent) */}
              <div className="absolute bottom-0 left-10 right-10 h-px bg-stone-200/80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
