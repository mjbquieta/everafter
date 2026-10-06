'use client';

import type { GalleryPhotoResponse } from '@everafter/types';
import { PhotoCard } from './photo-card';

interface PhotoGridProps {
  photos: (GalleryPhotoResponse & { url: string })[];
  heroImage: string | null;
  onSetHero: (photoUrl: string) => void;
  onToggleVisibility: (photoId: string, visible: boolean) => void;
  onDelete: (photoId: string) => void;
}

export function PhotoGrid({
  photos,
  heroImage,
  onSetHero,
  onToggleVisibility,
  onDelete,
}: PhotoGridProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => {
        const photoUrl = photo.url;
        const isHero = heroImage === photoUrl;

        return (
          <PhotoCard
            key={photo.id}
            photo={photo}
            photoUrl={photoUrl}
            isHero={isHero}
            onSetHero={() => onSetHero(photoUrl)}
            onToggleVisibility={(visible) => onToggleVisibility(photo.id, visible)}
            onDelete={() => onDelete(photo.id)}
          />
        );
      })}
    </div>
  );
}
