'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { InvitationCard } from './invitation-card';

export function AsymmetricHero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
        style={{ backgroundImage: "url('/hero-landing.jpg')" }}
      />

      <div className="relative max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8">
        {/* 12-column asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Architectural index */}
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 font-sans">
              01 / THE MODERN WEDDING SUITE
            </p>

            {/* Editorial headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal leading-[1.05] tracking-tight text-stone-900">
              Plan with intention.
              <br />
              Invite with <span className="italic">elegance.</span>
            </h1>

            {/* Left-anchored description */}
            <p className="max-w-md text-stone-600 font-serif text-lg leading-relaxed">
              EverAfter unites bespoke digital wedding stationery, ambient ceremony music, and thoughtful planning tools into one refined canvas.
            </p>

            {/* CTAs with staggered layout */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="space-y-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800 px-8 py-3.5 rounded-full text-base font-sans font-medium transition-colors"
                >
                  Begin Your Story Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-sans pl-2">
                  No credit card · 5 min setup
                </p>
              </div>

              <a
                href="#themes"
                className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-full px-8 py-3.5 text-base font-sans font-medium transition-colors"
              >
                Explore Themes
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 5 columns - Layered Visual Anchor */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end overflow-visible">
            {/* Preview stage with controlled dimensions */}
            <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] w-full max-w-[420px]">
              {/* Invitation Card - Base layer, shifted left */}
              <div className="relative z-0 -translate-x-6 sm:-translate-x-10">
                <InvitationCard />
              </div>

              {/* Mobile Phone Mockup - Floating layer, positioned right */}
              <div className="absolute right-2 sm:right-4 bottom-2 z-10 w-[140px] sm:w-[155px] rounded-[28px] border-[5px] border-stone-900 bg-stone-900 shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19' }}>
                <div className="rounded-[23px] overflow-hidden bg-white h-full flex flex-col">
                  {/* Dynamic Island */}
                  <div className="w-10 h-2.5 bg-stone-900 rounded-full mx-auto mt-1.5 shrink-0" />

                  {/* Screen content */}
                  <div className="flex-1 px-3 py-6" style={{ backgroundColor: '#FAF9F7' }}>
                    <div className="text-center">
                      <p className="font-sans text-[7px] uppercase tracking-widest mb-2 text-stone-600">
                        The Wedding of
                      </p>
                      <h4 className="font-serif text-[11px] font-medium tracking-tight text-stone-900">
                        Mark & Issa
                      </h4>
                      <p className="font-sans text-[7px] uppercase tracking-widest mt-1.5 text-stone-500">
                        December 14, 2025
                      </p>
                      <div className="mx-auto my-3 h-px w-8 bg-stone-300" />
                      <div className="space-y-1 mt-3">
                        <div className="mx-auto h-0.5 w-4/5 rounded bg-stone-200" />
                        <div className="mx-auto h-0.5 w-3/5 rounded bg-stone-200" />
                        <div className="mx-auto h-0.5 w-2/3 rounded bg-stone-200" />
                      </div>
                      <div className="mt-3 mx-auto inline-block rounded-full px-3 py-1 text-[7px] font-sans font-bold text-white bg-stone-800">
                        RSVP Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
