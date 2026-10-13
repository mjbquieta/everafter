'use client';

import type { ReactElement } from 'react';

interface TemplateSkeletonProps {
  templateId: string;
}

export function TemplateSkeleton({ templateId }: TemplateSkeletonProps) {
  const skeletons: Record<string, ReactElement> = {
    'midnight-editorial': (
      <div className="space-y-1.5">
        {/* Hero Full-Bleed */}
        <div className="relative h-20 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-500">1. Hero</span>
        </div>
        {/* Story + Backdrop Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-12 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">2</span>
          </div>
          <div className="h-12 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">3</span>
          </div>
        </div>
      </div>
    ),
    'moody-plum': (
      <div className="space-y-1.5">
        {/* Split Hero */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-16 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">1</span>
          </div>
          <div className="h-16 bg-stone-200 rounded border border-dashed border-stone-300" />
        </div>
        {/* Staggered Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">2</span>
          </div>
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">3</span>
          </div>
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">4</span>
          </div>
        </div>
        {/* Panoramic */}
        <div className="h-6 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-500">5. Panoramic</span>
        </div>
      </div>
    ),
    'warm-linen': (
      <div className="space-y-1.5">
        {/* Centered Hero */}
        <div className="h-20 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-500">1. Hero</span>
        </div>
        {/* Optional Vignette */}
        <div className="h-8 bg-stone-100 rounded border border-dashed border-stone-300 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-400">2. Optional</span>
        </div>
      </div>
    ),
    'coastal-slate': (
      <div className="space-y-1.5">
        {/* Hero Wide */}
        <div className="h-12 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-500">1. Hero</span>
        </div>
        {/* Masonry Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="h-14 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">2</span>
          </div>
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">3</span>
          </div>
          <div className="h-14 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">4</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">5</span>
          </div>
          <div className="h-10 bg-stone-100 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-400">6</span>
          </div>
        </div>
      </div>
    ),
    'dusty-rose': (
      <div className="space-y-1.5">
        {/* Overlapping Cards Simulation */}
        <div className="relative h-20">
          <div className="absolute left-0 top-0 w-2/3 h-16 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center z-10">
            <span className="text-[9px] font-medium text-stone-500">1. Hero</span>
          </div>
          <div className="absolute right-0 top-4 w-1/2 h-12 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">2</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <div className="h-10 bg-stone-200 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500">3</span>
          </div>
          <div className="h-8 bg-stone-100 rounded border border-dashed border-stone-300 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-400">4</span>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">Layout Blueprint</h3>
      </div>
      <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
        {skeletons[templateId] || skeletons['warm-linen']}
      </div>
    </div>
  );
}
