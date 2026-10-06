'use client';

import { useState } from 'react';
import { Star, Eye, EyeOff, Trash2, MoreVertical } from 'lucide-react';
import type { GalleryPhotoResponse } from '@everafter/types';
import { parsePhotoVisibility, getCleanCaption } from '@/lib/hooks/use-gallery';

interface PhotoCardProps {
  photo: GalleryPhotoResponse;
  photoUrl: string;
  onSetHero: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onDelete: () => void;
  isHero?: boolean;
}

export function PhotoCard({
  photo,
  photoUrl,
  onSetHero,
  onToggleVisibility,
  onDelete,
  isHero,
}: PhotoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isVisible = parsePhotoVisibility(photo.caption);
  const caption = getCleanCaption(photo.caption);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-stone-100">
      {/* Image */}
      <img
        src={photoUrl}
        alt={caption || 'Wedding photo'}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-stone-200" />
      )}

      {/* Contextual Badges */}
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-1.5">
        {/* Active Hero Banner Badge */}
        {isHero && (
          <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            Active Hero Banner
          </div>
        )}

        {/* Visibility Badge */}
        {isVisible ? (
          <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
            <Eye className="h-3 w-3" />
            On Public Website
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-stone-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
            <EyeOff className="h-3 w-3" />
            Hidden from Website
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Set as Hero */}
          <button
            onClick={onSetHero}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg hover:bg-stone-50 transition-colors"
            title="Set as hero banner"
          >
            <Star className="h-3.5 w-3.5" />
            Set Hero
          </button>

          {/* Toggle visibility */}
          <button
            onClick={() => onToggleVisibility(!isVisible)}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg hover:bg-stone-50 transition-colors"
            title={isVisible ? 'Hide from website' : 'Show on website'}
          >
            {isVisible ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Show
              </>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-lg hover:bg-red-600 transition-colors"
            title="Delete photo"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Caption (if exists) */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-white line-clamp-2">{caption}</p>
        </div>
      )}
    </div>
  );
}
