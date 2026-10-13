'use client';

import { PhotoPlaceholder } from './photo-placeholder';

interface PhotoSlotProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function PhotoSlot({ src, alt, className = '' }: PhotoSlotProps) {
  if (!src || src === '/images/placeholder-wedding.jpg') {
    return <PhotoPlaceholder className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}
