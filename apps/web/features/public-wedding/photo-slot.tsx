'use client';

import { PhotoPlaceholder } from './photo-placeholder';

interface PhotoSlotProps {
  src: string | null;
  alt: string;
  className?: string;
  onClick?: () => void;
  isPreview?: boolean;
}

export function PhotoSlot({ src, alt, className = '', onClick, isPreview = false }: PhotoSlotProps) {
  if (!src || src === '/images/placeholder-wedding.jpg') {
    return <PhotoPlaceholder className={className} onClick={onClick} />;
  }

  const handleClick = onClick && isPreview ? onClick : undefined;

  return (
    <div className={isPreview ? 'relative group cursor-pointer' : undefined} onClick={handleClick}>
      <img
        src={src}
        alt={alt}
        className={className}
      />
      {isPreview && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white px-3 py-1.5 rounded-full text-xs font-medium text-gray-900">
            Click to change
          </div>
        </div>
      )}
    </div>
  );
}
