'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  alt?: string;
}

interface GallerySectionProps {
  photos: Photo[];
  layout?: 'classic' | 'magazine' | 'editorial';
}

export function GallerySection({ photos, layout = 'classic' }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={`grid gap-4 ${
          layout === 'magazine'
            ? 'grid-cols-2 md:grid-cols-3'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 transition-transform hover:scale-[1.02]"
          >
            <Image
              src={photo.url}
              alt={photo.alt || `Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-white/70 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          {photos.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-10 p-2 text-white hover:text-white/70 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image */}
          <div className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center">
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].alt || `Photo ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
          </div>

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 z-10 p-2 text-white hover:text-white/70 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Photo Index */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
