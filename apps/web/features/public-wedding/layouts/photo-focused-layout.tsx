'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WeddingResponse } from '@everafter/types';
import { PhotoSlot } from '../photo-slot';

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
  layoutSlots?: Record<string, string>;
  showStory?: boolean;
  showDetails?: boolean;
  showSchedule?: boolean;
  showFaq?: boolean;
  showRsvp?: boolean;
  proposalStory?: string | null;
  loveStory?: string | null;
  scheduleEvents?: Array<{ time: string; title: string; description?: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
  onRsvpClick: () => void;
  onPhotoSlotClick?: (slotId: string) => void;
  isPreview?: boolean;
}

export function PhotoFocusedLayout({
  wedding,
  photos,
  layoutSlots,
  showStory = false,
  showDetails = true,
  showSchedule = false,
  showFaq = false,
  showRsvp = true,
  proposalStory,
  loveStory,
  scheduleEvents,
  faqItems,
  onRsvpClick,
  onPhotoSlotClick,
  isPreview = false,
}: PhotoFocusedLayoutProps) {
  const getPhoto = (slotId: string, fallbackIndex: number = 0) => {
    if (layoutSlots && layoutSlots[slotId]) {
      return layoutSlots[slotId];
    }
    if (photos[fallbackIndex]) return photos[fallbackIndex].url;
    if (photos.length > 0) return photos[fallbackIndex % photos.length].url;
    return '/images/placeholder-wedding.jpg';
  };
  const brideName = wedding.bride?.name || 'Bride';
  const groomName = wedding.groom?.name || 'Groom';
  const weddingDate = wedding.weddingDate
    ? new Date(wedding.weddingDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Full-Bleed Hero Banner */}
      <section id="home" className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <PhotoSlot
          src={getPhoto('hero', 0)}
          alt="Hero Landscape"
          className="w-full h-full object-cover"
          onClick={onPhotoSlotClick ? () => onPhotoSlotClick('hero') : undefined}
          isPreview={isPreview}
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
          </div>
        </div>
      </section>

      {/* Masonry Photo Gallery */}
      <section className="px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 text-center mb-12">
            Our Gallery
          </h2>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-1 row-span-2">
              <PhotoSlot
                src={getPhoto('portrait-1', 1)}
                alt="Portrait Feature 1"
                className="w-full h-full object-cover rounded-lg"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('portrait-1') : undefined}
                isPreview={isPreview}
              />
            </div>
            <div className="col-span-1">
              <PhotoSlot
                src={getPhoto('square-1', 2)}
                alt="Square Detail 1"
                className="aspect-square w-full object-cover rounded-lg"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('square-1') : undefined}
                isPreview={isPreview}
              />
            </div>
            <div className="col-span-1 row-span-2">
              <PhotoSlot
                src={getPhoto('portrait-2', 3)}
                alt="Portrait Feature 2"
                className="w-full h-full object-cover rounded-lg"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('portrait-2') : undefined}
                isPreview={isPreview}
              />
            </div>
            <div className="col-span-1">
              <PhotoSlot
                src={getPhoto('square-2', 4)}
                alt="Square Detail 2"
                className="aspect-square w-full object-cover rounded-lg"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('square-2') : undefined}
                isPreview={isPreview}
              />
            </div>
            <div className="col-span-1">
              <div className="aspect-square" />
            </div>
            <div className="col-span-1">
              <div className="aspect-square" />
            </div>
            {layoutSlots?.landscape && (
              <div className="col-span-2 md:col-span-4">
                <PhotoSlot
                  src={getPhoto('landscape', 5)}
                  alt="Landscape Break"
                  className="aspect-video w-full object-cover rounded-lg"
                  onClick={onPhotoSlotClick ? () => onPhotoSlotClick('landscape') : undefined}
                  isPreview={isPreview}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Story */}
      {showStory && (proposalStory || loveStory) && (
        <section id="story" className="px-4 md:px-8 py-16 md:py-20 bg-stone-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
              Our Story
            </h2>
            <div className="space-y-8">
              {proposalStory && (
                <div>
                  <h3 className="font-serif text-xl text-stone-700 mb-4">
                    The Proposal
                  </h3>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                    {proposalStory}
                  </p>
                </div>
              )}
              {loveStory && (
                <div>
                  {proposalStory && (
                    <h3 className="font-serif text-xl text-stone-700 mb-4">
                      Our Love Story
                    </h3>
                  )}
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                    {loveStory}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Schedule/Programme */}
      {showSchedule && scheduleEvents && scheduleEvents.length > 0 && (
        <section id="schedule" className="px-4 md:px-8 py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-stone-900 text-center mb-12">
              Programme
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {scheduleEvents.map((event, idx) => (
                <div key={idx} className="bg-stone-50 rounded-xl border border-stone-200 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-stone-900 mb-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-stone-600">{event.description}</p>
                      )}
                    </div>
                    <p className="text-sm text-stone-500 whitespace-nowrap ml-4">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {showFaq && faqItems && faqItems.length > 0 && (
        <section id="faq" className="px-4 md:px-8 py-12 md:py-16 bg-stone-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl text-center mb-12 text-stone-900">
              Frequently Asked
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-stone-200 p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.question}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Details & RSVP */}
      {showDetails && (
      <section id="details" className="px-4 md:px-8 py-16 md:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 mb-4">Event Schedule</h2>
            <p className="text-stone-600">Join us for a day of celebration</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
              <p className="font-semibold text-stone-900 mb-2">Ceremony</p>
              <p className="text-sm text-stone-600">{weddingDate}</p>
              {wedding.venue?.name && (
                <p className="text-sm text-stone-500 mt-1">{wedding.venue.name}</p>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
              <p className="font-semibold text-stone-900 mb-2">Reception</p>
              <p className="text-sm text-stone-600">Following ceremony</p>
              {wedding.venue?.name && (
                <p className="text-sm text-stone-500 mt-1">{wedding.venue.name}</p>
              )}
            </div>
          </div>

          {showRsvp && (
          <div id="rsvp">
            <button
              onClick={onRsvpClick}
              className="px-12 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors font-sans text-sm font-semibold uppercase tracking-wider rounded-lg shadow-md border-2 border-stone-900"
            >
              Reserve Your Spot
            </button>
          </div>
          )}
        </div>
      </section>
      )}
    </div>
  );
}
