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

interface MinimalistLayoutProps {
  wedding: WeddingData;
  photos: Photo[];
  onRsvpClick: () => void;
}

export function MinimalistLayout({
  wedding,
  photos,
  onRsvpClick,
}: MinimalistLayoutProps) {
  const getPhoto = (index: number) => {
    if (photos[index]) return photos[index].url;
    if (photos.length > 0) return photos[index % photos.length].url;
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
      <section className="relative px-4 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
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

            <Button
              size="lg"
              onClick={onRsvpClick}
              className="bg-white text-stone-900 hover:bg-stone-100 mt-8"
            >
              Reserve Your Place
            </Button>
          </div>

          {/* Right: Framed Portrait */}
          <div className="relative">
            <div className="aspect-[3/4] relative">
              <div className="absolute inset-0 border border-amber-400/30 rounded" />
              <div className="absolute inset-2">
                <img
                  src={getPhoto(0)}
                  alt="Hero Portrait"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
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
              <img
                src={getPhoto(1)}
                alt="Portrait 1"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <div className="aspect-square relative group">
            <div className="absolute inset-0 border border-white/20 rounded" />
            <div className="absolute inset-4">
              <img
                src={getPhoto(2)}
                alt="Portrait 2"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Details */}
      <section className="px-4 md:px-8 py-16 md:py-20 border-t border-white/10">
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

          <div className="text-center mt-16">
            <div className="inline-block space-y-4">
              <p className="text-sm text-stone-400">
                Kindly respond by {wedding.rsvpDeadline ? new Date(wedding.rsvpDeadline).toLocaleDateString() : 'invitation date'}
              </p>
              <div>
                <Button
                  size="lg"
                  onClick={onRsvpClick}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-stone-900 transition-colors"
                >
                  RSVP
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
