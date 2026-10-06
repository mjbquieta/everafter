'use client';

import { useState } from 'react';
import { Button } from '@everafter/ui';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WeddingResponse } from '@everafter/types';

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

// Extended wedding type with optional profile/settings properties
type WeddingData = WeddingResponse & {
  bride?: { name?: string } | null;
  groom?: { name?: string } | null;
  venue?: {
    name?: string | null;
    address?: string | null;
  } | null;
  tagline?: string | null;
  story?: string | null;
  rsvpDeadline?: string | null;
};

interface PhotoFocusedLayoutProps {
  wedding: WeddingData;
  photos: Photo[];
  onRsvpClick: () => void;
}

export function PhotoFocusedLayout({
  wedding,
  photos,
  onRsvpClick,
}: PhotoFocusedLayoutProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const brideName = wedding.bride?.name || 'Bride';
  const groomName = wedding.groom?.name || 'Groom';
  const weddingDate = wedding.weddingDate
    ? new Date(wedding.weddingDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  const displayPhotos = photos.length > 0 ? photos : [
    { id: '1', url: '/images/placeholder-wedding.jpg' },
    { id: '2', url: '/images/placeholder-wedding.jpg' },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const goNext = () => {
    setLightboxIndex((prev) => (prev + 1) % displayPhotos.length);
  };

  const goPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Full-Bleed Hero Banner */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={displayPhotos[0].url}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Floating Typography */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-7xl text-white drop-shadow-lg">
              {brideName} & {groomName}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              {weddingDate}
            </p>
            <Button
              size="lg"
              onClick={onRsvpClick}
              className="mt-8 bg-white text-stone-900 hover:bg-stone-100"
            >
              RSVP Now
            </Button>
          </div>
        </div>
      </section>

      {/* Masonry Photo Gallery */}
      <section className="px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 text-center mb-12">
            Our Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayPhotos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 transition-transform hover:scale-[1.02] group"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Schedule & RSVP */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 mb-4">Event Schedule</h2>
            <p className="text-stone-600">Join us for a day of celebration</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-900">Ceremony</p>
                  <p className="text-sm text-stone-600">{weddingDate}</p>
                </div>
                <p className="text-sm text-stone-500">3:00 PM</p>
              </div>
              <div className="h-px bg-stone-200" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-900">Reception</p>
                  <p className="text-sm text-stone-600">Following ceremony</p>
                </div>
                <p className="text-sm text-stone-500">5:00 PM</p>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={onRsvpClick}>
            Reserve Your Spot
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {displayPhotos.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={displayPhotos[lightboxIndex].url}
            alt={displayPhotos[lightboxIndex].caption || `Photo ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
