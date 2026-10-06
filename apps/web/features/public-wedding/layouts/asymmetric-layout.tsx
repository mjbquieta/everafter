'use client';

import { Button } from '@everafter/ui';
import { Calendar, MapPin } from 'lucide-react';
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

interface AsymmetricLayoutProps {
  wedding: WeddingData;
  photos: Photo[];
  onRsvpClick: () => void;
}

export function AsymmetricLayout({
  wedding,
  photos,
  onRsvpClick,
}: AsymmetricLayoutProps) {
  // Ensure we have at least placeholder slots
  const getPhoto = (index: number) => {
    if (photos[index]) return photos[index].url;
    // Cycle through available photos or use placeholder
    if (photos.length > 0) return photos[index % photos.length].url;
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
      <section className="relative px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
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
            <Button size="lg" onClick={onRsvpClick} className="mt-4">
              RSVP Now
            </Button>
          </div>

          {/* Right: Tall Portrait */}
          <div className="relative">
            <img
              src={getPhoto(0)}
              alt="Hero"
              className="aspect-[3/4] w-full object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Narrative & Staggered Collage */}
      <section className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-stone-900">Our Story</h2>
            <p className="text-stone-600 leading-relaxed">
              {wedding.story || 'Our journey together has been filled with love, laughter, and countless memories. We are excited to share this special day with you.'}
            </p>
          </div>
          <div className="relative">
            <img
              src={getPhoto(1)}
              alt="Story"
              className="aspect-square w-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* 3-Frame Asymmetric Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <img
            src={getPhoto(2)}
            alt="Gallery 1"
            className="aspect-[4/3] w-full object-cover rounded-xl"
          />
          <img
            src={getPhoto(3)}
            alt="Gallery 2"
            className="aspect-square w-full object-cover rounded-xl"
          />
          <img
            src={getPhoto(4)}
            alt="Gallery 3"
            className="aspect-[3/4] w-full object-cover rounded-xl col-span-2 md:col-span-1"
          />
        </div>
      </section>

      {/* Section 3: Full-Width Cinematic Moment */}
      <section className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
        <img
          src={getPhoto(5)}
          alt="Cinematic"
          className="w-full aspect-[21/9] max-h-[460px] object-cover rounded-3xl shadow-xl"
        />
      </section>

      {/* Section 4: Event Details & RSVP */}
      <section className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
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

        <div className="text-center">
          <Button size="lg" onClick={onRsvpClick}>
            RSVP to Celebrate With Us
          </Button>
        </div>
      </section>
    </div>
  );
}
