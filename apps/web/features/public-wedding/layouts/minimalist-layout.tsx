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

interface MinimalistLayoutProps {
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

export function MinimalistLayout({
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
}: MinimalistLayoutProps) {
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
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date To Be Announced';

  return (
    <div className="min-h-screen bg-[#0F1015] text-white">
      {/* Stark Hero */}
      <section id="home" className="relative px-4 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Minimal Typography */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                You Are Invited
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight">
                {brideName}
                <span className="block text-amber-400 my-4">&</span>
                {groomName}
              </h1>
              <div className="h-px w-24 bg-amber-400" />
            </div>

            <div className="space-y-3 text-stone-300">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-400" />
                <p>{weddingDate}</p>
              </div>
              {wedding.venue?.name && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-amber-400" />
                  <p>{wedding.venue.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Framed Portrait */}
          <div className="relative">
            <div className="aspect-[3/4] relative">
              <div className="absolute inset-0 border border-amber-400/30 rounded" />
              <div className="absolute inset-2">
                <PhotoSlot
                  src={getPhoto('hero', 0)}
                  alt="Hero Portrait"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded"
                  onClick={onPhotoSlotClick ? () => onPhotoSlotClick('hero') : undefined}
                  isPreview={isPreview}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framed Portrait Blocks */}
      <section className="px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative group">
            <div className="absolute inset-0 border border-white/20 rounded" />
            <div className="absolute inset-4">
              <PhotoSlot
                src={getPhoto('story', 1)}
                alt="Portrait 1"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rounded"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('story') : undefined}
                isPreview={isPreview}
              />
            </div>
          </div>
          <div className="aspect-square relative group">
            <div className="absolute inset-0 border border-white/20 rounded" />
            <div className="absolute inset-4">
              <PhotoSlot
                src={getPhoto('backdrop', 2)}
                alt="Portrait 2"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rounded"
                onClick={onPhotoSlotClick ? () => onPhotoSlotClick('backdrop') : undefined}
                isPreview={isPreview}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      {showStory && (proposalStory || loveStory) && (
        <section id="story" className="px-4 md:px-8 py-16 md:py-20 max-w-4xl mx-auto border-t border-white/10">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-8 text-white">
            Our Story
          </h2>
          <div className="space-y-12">
            {proposalStory && (
              <div>
                <h3 className="font-serif text-xl md:text-2xl text-center mb-4 text-amber-400">
                  The Proposal
                </h3>
                <p className="text-stone-300 text-lg leading-relaxed whitespace-pre-line text-center">
                  {proposalStory}
                </p>
              </div>
            )}
            {loveStory && (
              <div>
                {proposalStory && (
                  <h3 className="font-serif text-xl md:text-2xl text-center mb-4 text-amber-400">
                    Our Love Story
                  </h3>
                )}
                <p className="text-stone-300 text-lg leading-relaxed whitespace-pre-line text-center">
                  {loveStory}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Schedule/Programme */}
      {showSchedule && scheduleEvents && scheduleEvents.length > 0 && (
        <section id="schedule" className="px-4 md:px-8 py-16 md:py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-white">
              Programme
            </h2>
            <div className="space-y-6">
              {scheduleEvents.map((event, idx) => (
                <div key={idx} className="border-l-2 border-amber-400 pl-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-1">
                    {event.time}
                  </p>
                  <h3 className="text-xl font-serif text-white mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-stone-400">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {showFaq && faqItems && faqItems.length > 0 && (
        <section id="faq" className="px-4 md:px-8 py-16 md:py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-white">
              Frequently Asked
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-serif text-white mb-2">{item.question}</h3>
                  <p className="text-stone-400 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minimal Details */}
      {showDetails && (
      <section id="details" className="px-4 md:px-8 py-16 md:py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            Event Programme
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                Ceremony
              </p>
              <p className="text-stone-300">{weddingDate}</p>
              {wedding.venue?.name && (
                <p className="text-sm text-stone-400">{wedding.venue.name}</p>
              )}
            </div>

            <div className="space-y-4 text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                Reception
              </p>
              <p className="text-stone-300">Following Ceremony</p>
              {wedding.venue?.name && (
                <p className="text-sm text-stone-400">{wedding.venue.name}</p>
              )}
            </div>
          </div>

          {showRsvp && (
            <div id="rsvp" className="text-center mt-16">
              <div className="inline-block space-y-4">
                <p className="text-sm text-stone-400">
                  Kindly respond by {wedding.rsvpDeadline ? new Date(wedding.rsvpDeadline).toLocaleDateString() : 'invitation date'}
                </p>
                <div>
                  <button
                    onClick={onRsvpClick}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-stone-900 transition-colors font-sans text-sm font-semibold uppercase tracking-wider rounded"
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      )}
    </div>
  );
}
