'use client';

import { Calendar, MapPin, Clock } from 'lucide-react';
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

interface ClassicLayoutProps {
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

export function ClassicLayout({
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
}: ClassicLayoutProps) {
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
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date To Be Announced';

  const getInitials = () => {
    const b = brideName.charAt(0).toUpperCase();
    const g = groomName.charAt(0).toUpperCase();
    return `${b} & ${g}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Centered Formal Header */}
      <section id="home" className="px-4 py-16 md:py-24 max-w-3xl mx-auto text-center">
        {/* Monogram */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-stone-300 mb-8">
          <span className="font-serif text-xl text-stone-600">{getInitials()}</span>
        </div>

        {/* Formal Invitation Copy */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
            Together with their families
          </p>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 leading-tight">
            {brideName}
            <span className="block my-4 text-3xl text-stone-400">&</span>
            {groomName}
          </h1>

          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Request the honor of your presence
          </p>

          <div className="py-8 space-y-3 text-stone-700">
            <p className="text-lg">{weddingDate}</p>
            {wedding.venue?.name && (
              <>
                <p className="font-semibold">{wedding.venue.name}</p>
                {wedding.venue?.address && (
                  <p className="text-sm text-stone-600">{wedding.venue.address}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Featured Portrait */}
        <div className="relative w-full max-w-sm mx-auto my-12">
          <PhotoSlot
            src={getPhoto('hero', 0)}
            alt="Wedding Portrait"
            className="aspect-[3/4] w-full object-cover rounded-lg shadow-lg"
            onClick={onPhotoSlotClick ? () => onPhotoSlotClick('hero') : undefined}
            isPreview={isPreview}
          />
        </div>

        {/* Optional Vignette */}
        {layoutSlots?.vignette && (
          <div className="relative w-full max-w-xs mx-auto my-8">
            <PhotoSlot
              src={getPhoto('vignette', 1)}
              alt="Vignette"
              className="aspect-square w-full object-cover rounded-full shadow-md"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('vignette') : undefined}
              isPreview={isPreview}
            />
          </div>
        )}

        {/* Tagline */}
        {wedding.tagline && (
          <p className="text-stone-600 italic leading-relaxed max-w-md mx-auto mb-8">
            "{wedding.tagline}"
          </p>
        )}
      </section>

      {/* Our Story */}
      {showStory && (proposalStory || loveStory) && (
        <section id="story" className="px-4 py-12 md:py-16 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-8 text-stone-900">
            Our Story
          </h2>
          <div className="space-y-8">
            {proposalStory && (
              <div>
                <h3 className="font-serif text-xl text-center mb-4 text-stone-700">
                  The Proposal
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line text-center">
                  {proposalStory}
                </p>
              </div>
            )}
            {loveStory && (
              <div>
                {proposalStory && (
                  <h3 className="font-serif text-xl text-center mb-4 text-stone-700">
                    Our Love Story
                  </h3>
                )}
                <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line text-center">
                  {loveStory}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Schedule/Programme */}
      {showSchedule && scheduleEvents && scheduleEvents.length > 0 && (
        <section id="schedule" className="px-4 py-12 md:py-16 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-stone-900 text-center mb-12">
              Programme
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              {scheduleEvents.map((event, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
                    {event.time}
                  </p>
                  <h3 className="text-lg font-semibold text-stone-900 mb-1">{event.title}</h3>
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
        <section id="faq" className="px-4 py-12 md:py-16 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12 text-stone-900">
            Frequently Asked
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-stone-200 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.question}</h3>
                <p className="text-stone-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Event Details Cards */}
      {showDetails && (
      <section id="details" className="px-4 py-12 md:py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-stone-900 text-center mb-12">
            Event Schedule
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 mb-4">
                <Calendar className="h-6 w-6 text-stone-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Ceremony</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <p>3:00 PM</p>
                </div>
                {wedding.venue?.name && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p>{wedding.venue.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 mb-4">
                <Calendar className="h-6 w-6 text-stone-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Reception</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <p>Following Ceremony</p>
                </div>
                {wedding.venue?.name && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p>{wedding.venue.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      )}

      {/* RSVP */}
      {showRsvp && (
      <section id="rsvp" className="px-4 py-16 md:py-24 max-w-2xl mx-auto text-center">
        <div className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
            Kindly Respond
          </h2>
          <p className="text-stone-600">
            We would be honored by your presence at our celebration
          </p>

          <div className="pt-8">
            <button
              onClick={onRsvpClick}
              className="px-12 py-4 bg-stone-900 text-white hover:bg-stone-800 transition-colors font-sans text-sm font-semibold uppercase tracking-wider rounded-lg"
            >
              RSVP
            </button>
          </div>

          <p className="text-xs text-stone-500 pt-4">
            Please respond by {wedding.rsvpDeadline ? new Date(wedding.rsvpDeadline).toLocaleDateString() : 'the date on your invitation'}
          </p>
        </div>
      </section>
      )}
    </div>
  );
}
