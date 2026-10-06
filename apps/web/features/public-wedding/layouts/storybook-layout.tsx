'use client';

import { Button } from '@everafter/ui';
import { Calendar, MapPin, Heart } from 'lucide-react';
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

interface StorybookLayoutProps {
  wedding: WeddingData;
  photos: Photo[];
  onRsvpClick: () => void;
}

export function StorybookLayout({
  wedding,
  photos,
  onRsvpClick,
}: StorybookLayoutProps) {
  const getPhoto = (index: number) => {
    if (photos[index]) return photos[index].url;
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      {/* Romantic Header with Overlapping Cards */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
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
          <div className="absolute top-0 left-[5%] w-[40%] md:w-[35%] aspect-[3/4] transform rotate-[-6deg]">
            <img
              src={getPhoto(0)}
              alt="Photo 1"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
            />
          </div>
          <div className="absolute top-[15%] right-[8%] w-[45%] md:w-[38%] aspect-square transform rotate-[4deg]">
            <img
              src={getPhoto(1)}
              alt="Photo 2"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
            />
          </div>
          <div className="absolute bottom-[5%] left-[25%] w-[38%] md:w-[32%] aspect-[4/3] transform rotate-[-3deg]">
            <img
              src={getPhoto(2)}
              alt="Photo 3"
              className="w-full h-full object-cover rounded-2xl shadow-xl border-8 border-white"
            />
          </div>
        </div>
      </section>

      {/* Side-by-Side Story Vignette */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src={getPhoto(3)}
                alt="Story"
                className="aspect-[4/5] w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
                Our Love Story
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {wedding.story || 'From the moment we met, we knew there was something special. Our journey together has been filled with love, laughter, and countless beautiful memories. Join us as we celebrate the beginning of our forever.'}
              </p>
              {wedding.tagline && (
                <p className="text-rose-600 italic border-l-2 border-rose-200 pl-4">
                  "{wedding.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="px-4 md:px-8 py-16 md:py-20">
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

          <div className="text-center mt-12">
            <Button size="lg" onClick={onRsvpClick}>
              RSVP to Celebrate
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
