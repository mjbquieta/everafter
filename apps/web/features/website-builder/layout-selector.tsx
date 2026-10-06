'use client';

import { Check } from 'lucide-react';
import { Button } from '@everafter/ui';

export type WebsiteLayout = 'asymmetric' | 'photo_focused' | 'classic';

interface LayoutOption {
  id: WebsiteLayout;
  name: string;
  description: string;
  photoHint: string;
  recommended?: boolean;
}

const layouts: LayoutOption[] = [
  {
    id: 'asymmetric',
    name: 'Contemporary Asymmetric',
    description: 'Editorial split-screen design with dynamic photo placement',
    photoHint: '5+ photos recommended',
    recommended: true,
  },
  {
    id: 'photo_focused',
    name: 'Photo Showcase',
    description: 'Full-bleed hero with prominent masonry gallery',
    photoHint: 'Ideal for 8+ photos',
  },
  {
    id: 'classic',
    name: 'Classic Bespoke',
    description: 'Formal, centered typography with featured portrait',
    photoHint: '2-3 photos sufficient',
  },
];

interface LayoutSelectorProps {
  selected: WebsiteLayout;
  onChange: (layout: WebsiteLayout) => void;
}

export function LayoutSelector({ selected, onChange }: LayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Choose Your Layout</h3>
        <p className="text-sm text-stone-500 mt-1">
          Select a visual style that best showcases your wedding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onChange(layout.id)}
            className={`group relative rounded-2xl border-2 transition-all duration-200 ${
              selected === layout.id
                ? 'border-primary shadow-lg scale-[1.02]'
                : 'border-stone-200 hover:border-stone-300 hover:scale-[1.01] hover:shadow-md'
            }`}
          >
            {/* Selection Badge */}
            {selected === layout.id && (
              <div className="absolute -top-2 -right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white shadow-md">
                <Check className="h-4 w-4" />
              </div>
            )}

            {/* Recommended Badge */}
            {layout.recommended && (
              <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-medium">
                Recommended
              </div>
            )}

            {/* Wireframe Preview */}
            <div className="p-6 pb-4">
              <LayoutWireframe layout={layout.id} />
            </div>

            {/* Layout Info */}
            <div className="px-6 pb-6 text-left">
              <h4 className="font-semibold text-stone-900 text-sm mb-1">
                {layout.name}
              </h4>
              <p className="text-xs text-stone-500 mb-2">{layout.description}</p>
              <p className="text-xs text-stone-400 italic">{layout.photoHint}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LayoutWireframe({ layout }: { layout: WebsiteLayout }) {
  if (layout === 'asymmetric') {
    return (
      <div className="w-full aspect-[4/5] bg-stone-50 rounded-lg border border-stone-200 p-3 space-y-2">
        {/* Split Hero */}
        <div className="flex gap-2 h-[35%]">
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 bg-stone-300 rounded w-3/4" />
            <div className="h-1 bg-stone-200 rounded w-full" />
            <div className="h-1 bg-stone-200 rounded w-5/6" />
            <div className="mt-auto h-4 bg-stone-300 rounded w-1/2" />
          </div>
          <div className="w-[45%] bg-stone-300 rounded" />
        </div>
        {/* Staggered Collage */}
        <div className="flex gap-1.5 h-[25%]">
          <div className="flex-1 bg-stone-300 rounded" />
          <div className="w-[35%] bg-stone-200 rounded" />
          <div className="flex-1 bg-stone-300 rounded" />
        </div>
        {/* Panoramic */}
        <div className="h-[18%] bg-stone-300 rounded" />
        {/* Details */}
        <div className="flex gap-1.5 h-[15%]">
          <div className="flex-1 bg-stone-100 rounded border border-stone-200" />
          <div className="flex-1 bg-stone-100 rounded border border-stone-200" />
        </div>
      </div>
    );
  }

  if (layout === 'photo_focused') {
    return (
      <div className="w-full aspect-[4/5] bg-stone-50 rounded-lg border border-stone-200 p-3 space-y-2">
        {/* Full-bleed Hero */}
        <div className="h-[35%] bg-stone-300 rounded relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-1 w-2/3">
              <div className="h-1 bg-white/80 rounded mx-auto w-3/4" />
              <div className="h-1 bg-white/60 rounded mx-auto w-1/2" />
            </div>
          </div>
        </div>
        {/* Photo Grid */}
        <div className="grid grid-cols-4 gap-1 h-[45%]">
          <div className="bg-stone-300 rounded" />
          <div className="bg-stone-200 rounded" />
          <div className="bg-stone-300 rounded" />
          <div className="bg-stone-200 rounded" />
          <div className="bg-stone-200 rounded" />
          <div className="bg-stone-300 rounded" />
          <div className="bg-stone-200 rounded" />
          <div className="bg-stone-300 rounded" />
        </div>
        {/* Minimal Footer */}
        <div className="h-[12%] bg-stone-100 rounded border border-stone-200" />
      </div>
    );
  }

  // Classic
  return (
    <div className="w-full aspect-[4/5] bg-stone-50 rounded-lg border border-stone-200 p-4 flex flex-col items-center space-y-2">
      {/* Monogram */}
      <div className="w-8 h-8 rounded-full border-2 border-stone-300" />
      {/* Title Lines */}
      <div className="space-y-1 w-full">
        <div className="h-1.5 bg-stone-300 rounded w-2/3 mx-auto" />
        <div className="h-1 bg-stone-200 rounded w-1/2 mx-auto" />
        <div className="h-1 bg-stone-200 rounded w-3/5 mx-auto" />
      </div>
      {/* Featured Portrait */}
      <div className="w-[60%] aspect-[3/4] bg-stone-300 rounded mt-2" />
      {/* Schedule Cards */}
      <div className="flex gap-1.5 w-full mt-auto">
        <div className="flex-1 h-10 bg-stone-100 rounded border border-stone-200" />
        <div className="flex-1 h-10 bg-stone-100 rounded border border-stone-200" />
      </div>
    </div>
  );
}
