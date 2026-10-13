'use client';

import { Calendar, MapPin, Heart } from 'lucide-react';
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

interface StorybookLayoutProps {
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

export function StorybookLayout({
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
}: StorybookLayoutProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      {/* Romantic Header with Overlapping Cards */}
      <section id="home" className="relative px-4 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-6">
            <Heart className="h-8 w-8 text-rose-600 fill-rose-200" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-4">
            {brideName}
            <span className="block text-3xl text-rose-400 my-3">&</span>
            {groomName}
          </h1>
          <p className="text-lg text-stone-600">{weddingDate}</p>
          {wedding.venue?.name && (
            <p className="text-sm text-stone-500 mt-2">{wedding.venue.name}</p>
          )}
        </div>

        {/* Overlapping Photo Cards */}
        <div className="relative max-w-4xl mx-auto h-[400px] md:h-[500px]">
          <div className="absolute top-0 left-[5%] w-[40%] md:w-[35%] aspect-[4/5] transform rotate-[-6deg]">
            <PhotoSlot
              src={getPhoto('hero', 0)}
              alt="Romantic Hero"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('hero') : undefined}
              isPreview={isPreview}
            />
          </div>
          <div className="absolute top-[15%] right-[8%] w-[45%] md:w-[38%] aspect-[3/4] transform rotate-[4deg]">
            <PhotoSlot
              src={getPhoto('story-left', 1)}
              alt="Story Left"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('story-left') : undefined}
              isPreview={isPreview}
            />
          </div>
          <div className="absolute bottom-[5%] left-[25%] w-[38%] md:w-[32%] aspect-square transform rotate-[-3deg]">
            <PhotoSlot
              src={getPhoto('story-right', 2)}
              alt="Story Right"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
              onClick={onPhotoSlotClick ? () => onPhotoSlotClick('story-right') : undefined}
              isPreview={isPreview}
            />
          </div>
        </div>
      </section>

      {/* Side-by-Side Story Vignette */}
      {showStory && (proposalStory || loveStory) && (
      <section id="story" className="px-4 md:px-8 py-16 md:py-20 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {layoutSlots?.detail && (
              <div className="order-2 md:order-1">
                <PhotoSlot
                  src={getPhoto('detail', 3)}
                  alt="Botanical Detail"
                  className="aspect-[4/3] w-full object-cover rounded-2xl shadow-lg"
                  onClick={onPhotoSlotClick ? () => onPhotoSlotClick('detail') : undefined}
                  isPreview={isPreview}
                />
              </div>
            )}
            <div className={`order-1 ${layoutSlots?.detail ? 'md:order-2' : 'md:col-span-2 text-center max-w-3xl mx-auto'} space-y-6`}>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
                Our Story
              </h2>
              {proposalStory && (
                <div>
                  <h3 className="font-serif text-xl text-rose-600 mb-3">
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
                    <h3 className="font-serif text-xl text-rose-600 mb-3">
                      Our Love Story
                    </h3>
                  )}
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                    {loveStory}
                  </p>
                </div>
              )}
              {wedding.tagline && (
                <p className="text-rose-600 italic border-l-2 border-rose-200 pl-4">
                  "{wedding.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Schedule/Programme */}
      {showSchedule && scheduleEvents && scheduleEvents.length > 0 && (
        <section id="schedule" className="px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-stone-900 text-center mb-12">
              Programme
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              {scheduleEvents.map((event, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-600 mb-2">
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
        <section id="faq" className="px-4 md:px-8 py-12 md:py-16 bg-white/60">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl text-center mb-12 text-stone-900">
              Frequently Asked
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.question}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Details */}
      {showDetails && (
      <section id="details" className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 text-center mb-12">
            Celebration Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-rose-100 p-8 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mb-4">
                <Calendar className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-3">Ceremony</h3>
              <div className="space-y-2 text-sm text-stone-600">
                <p>{weddingDate}</p>
                {wedding.venue?.name && <p>{wedding.venue.name}</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-100 p-8 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mb-4">
                <MapPin className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-3">Reception</h3>
              <div className="space-y-2 text-sm text-stone-600">
                <p>Following ceremony</p>
                {wedding.venue?.name && <p>{wedding.venue.name}</p>}
              </div>
            </div>
          </div>

          {showRsvp && (
          <div id="rsvp" className="text-center mt-12">
            <button
              onClick={onRsvpClick}
              className="px-12 py-4 bg-rose-600 text-white hover:bg-rose-700 transition-colors font-sans text-sm font-semibold uppercase tracking-wider rounded-lg shadow-md"
            >
              RSVP to Celebrate
            </button>
          </div>
          )}
        </div>
      </section>
      )}
    </div>
  );
}
