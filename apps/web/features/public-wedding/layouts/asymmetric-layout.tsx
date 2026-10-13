'use client';

import { Calendar, MapPin } from 'lucide-react';
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

interface AsymmetricLayoutProps {
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

export function AsymmetricLayout({
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
}: AsymmetricLayoutProps) {
  const getPhoto = (slotId: string, fallbackIndex: number = 0) => {
    // First, try to get from layoutSlots
    if (layoutSlots && layoutSlots[slotId]) {
      return layoutSlots[slotId];
    }
    // Fallback to photos array by index
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
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Section 1: Split Hero */}
      <section id="home" className="relative px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Editorial Text */}
          <div className="space-y-6 md:pr-8">
            <div className="space-y-3">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
                {brideName}
                <span className="text-stone-400 mx-3">&</span>
                {groomName}
              </h1>
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar className="h-4 w-4" />
                <p className="text-lg">{weddingDate}</p>
              </div>
              {wedding.venue?.name && (
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">{wedding.venue.name}</p>
                </div>
              )}
            </div>
            <p className="text-stone-600 leading-relaxed max-w-md">
              {wedding.tagline || 'Join us as we celebrate our love story and begin our journey together.'}
            </p>
          </div>

          {/* Right: Tall Portrait */}
          <div className="relative">
            <PhotoSlot
              src={getPhoto('hero', 0)}
              alt="Hero"
              className="aspect-[3/4] w-full object-cover rounded-2xl shadow-lg"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('hero') : undefined}
              isPreview={isPreview}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Narrative & Staggered Collage */}
      {showStory && (proposalStory || loveStory) && (
      <section id="story" className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-stone-900">Our Story</h2>
            {proposalStory && (
              <div>
                <h3 className="font-serif text-xl text-stone-700 mb-2">The Proposal</h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {proposalStory}
                </p>
              </div>
            )}
            {loveStory && (
              <div>
                {proposalStory && <h3 className="font-serif text-xl text-stone-700 mb-2">Our Love Story</h3>}
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {loveStory}
                </p>
              </div>
            )}
          </div>
          <div className="relative">
            <PhotoSlot
              src={getPhoto('story-landscape', 1)}
              alt="Story"
              className="aspect-video w-full object-cover rounded-2xl shadow-md"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('story-landscape') : undefined}
              isPreview={isPreview}
            />
          </div>
        </div>

        {/* 3-Frame Asymmetric Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <PhotoSlot
            src={getPhoto('detail-square', 2)}
            alt="Gallery 1"
            className="aspect-square w-full object-cover rounded-xl"
            onClick={onPhotoSlotClick ? () => onPhotoSlotClick('detail-square') : undefined}
            isPreview={isPreview}
          />
          <PhotoSlot
            src={getPhoto('portrait-accent', 3)}
            alt="Gallery 2"
            className="aspect-[3/4] w-full object-cover rounded-xl"
            onClick={onPhotoSlotClick ? () => onPhotoSlotClick('portrait-accent') : undefined}
            isPreview={isPreview}
          />
          <PhotoSlot
            src={getPhoto('panoramic', 4)}
            alt="Gallery 3"
            className="aspect-[21/9] w-full object-cover rounded-xl col-span-2 md:col-span-1"
            onClick={onPhotoSlotClick ? () => onPhotoSlotClick('panoramic') : undefined}
            isPreview={isPreview}
          />
        </div>
      </section>
      )}

      {/* Schedule/Programme */}
      {showSchedule && scheduleEvents && scheduleEvents.length > 0 && (
        <section id="schedule" className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-stone-900">
              Programme
            </h2>
            <div className="space-y-6">
              {scheduleEvents.map((event, idx) => (
                <div key={idx} className="border-l-2 border-stone-300 pl-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">
                    {event.time}
                  </p>
                  <h3 className="text-xl font-serif text-stone-900 mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-stone-600">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {showFaq && faqItems && faqItems.length > 0 && (
        <section id="faq" className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-stone-900">
              Frequently Asked
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-serif text-stone-900 mb-2">{item.question}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Details & RSVP */}
      {showDetails && (
      <section id="details" className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3">
            Event Details
          </h2>
          <p className="text-stone-600">Mark your calendars for our special day</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">Ceremony</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <p>{weddingDate}</p>
              {wedding.venue?.name && <p>{wedding.venue.name}</p>}
              {wedding.venue?.address && <p className="text-xs">{wedding.venue.address}</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">Reception</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <p>Following ceremony</p>
              {wedding.venue?.name && <p>{wedding.venue.name}</p>}
            </div>
          </div>
        </div>

        {showRsvp && (
        <div id="rsvp" className="text-center">
          <button
            onClick={onRsvpClick}
            className="px-8 py-4 bg-stone-900 text-white hover:bg-stone-800 transition-colors font-sans text-sm font-semibold uppercase tracking-wider rounded-lg"
          >
            RSVP to Celebrate With Us
          </button>
        </div>
        )}
      </section>
      )}
    </div>
  );
}
