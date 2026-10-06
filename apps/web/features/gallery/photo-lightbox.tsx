'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Star, Trash2 } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { GalleryPhotoResponse } from '@everafter/types';

interface PhotoLightboxProps {
  photos: (GalleryPhotoResponse & { url: string })[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  onFeature: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  parseMetadata: (caption: string | null) => {
    uploaderName: string | null;
    uploadedAt: string | null;
    cleanCaption: string;
  };
}

export function PhotoLightbox({
  photos,
  initialIndex,
  open,
  onClose,
  onFeature,
  onDelete,
  parseMetadata,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, goToNext, goToPrevious]);

  if (!open || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const metadata = parseMetadata(currentPhoto.caption);
  const uploadedDate = metadata.uploadedAt
    ? new Date(metadata.uploadedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-white text-sm font-medium">
            {currentIndex + 1} of {photos.length}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          {/* Previous Button */}
          {photos.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-full flex items-center justify-center">
            <img
              src={currentPhoto.url}
              alt={metadata.cleanCaption || 'Guest photo'}
              className="max-w-full max-h-[calc(100vh-16rem)] object-contain rounded-lg"
            />
          </div>

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        {/* Info & Actions Bar */}
        <div className="bg-black/40 backdrop-blur-md border-t border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Photo Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">
                {metadata.uploaderName || 'Anonymous'}
              </p>
              {uploadedDate && (
                <p className="text-white/70 text-xs mt-0.5">{uploadedDate}</p>
              )}
              {metadata.cleanCaption && (
                <p className="text-white/90 text-sm mt-1 line-clamp-2">
                  {metadata.cleanCaption}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onFeature(currentPhoto.id)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Star className="h-4 w-4 mr-2" />
                Feature on Website
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(currentPhoto.id)}
                className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
