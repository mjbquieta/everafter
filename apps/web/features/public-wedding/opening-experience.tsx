'use client';

import { useState, useEffect } from 'react';

interface InvitedGuest {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string | null;
  companionCount: number;
  mealPreference: string | null;
  notes: string | null;
}

interface OpeningExperienceProps {
  type: 'none' | 'fade' | 'envelope';
  slug: string;
  coupleNames: string;
  invitedGuest?: InvitedGuest | null;
}

export function OpeningExperience({ type, slug, coupleNames, invitedGuest }: OpeningExperienceProps) {
  const [showOpening, setShowOpening] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterSlide, setLetterSlide] = useState(false);

  useEffect(() => {
    if (type === 'none') return;

    const storageKey = `hasOpenedInvitation_${slug}`;
    const hasOpened = sessionStorage.getItem(storageKey);

    if (!hasOpened) {
      setShowOpening(true);

      // For fade transition, auto-start fade out
      if (type === 'fade') {
        sessionStorage.setItem(storageKey, 'true');
        // Small delay to ensure the element is mounted before starting fade
        setTimeout(() => {
          setIsExiting(true);
        }, 100);
      }
    }
  }, [type, slug]);

  const handleOpen = () => {
    // Start audio playback on user interaction
    const audioEl = document.querySelector('audio');
    if (audioEl) {
      audioEl.muted = false;
      audioEl.volume = 0.6;
      audioEl.play().catch((err) => console.warn('Audio autoplay failed:', err));
    }

    sessionStorage.setItem(`hasOpenedInvitation_${slug}`, 'true');

    // Step 1: Flip flap open (0ms)
    setFlapOpen(true);

    // Step 2: Slide letter out (400ms delay)
    setTimeout(() => {
      setLetterSlide(true);
    }, 400);

    // Step 3: Zoom fade-out entire overlay (800ms delay)
    setTimeout(() => {
      setIsExiting(true);
    }, 800);

    // Step 4: Unmount after all animations complete (1200ms total)
    setTimeout(() => {
      setShowOpening(false);
    }, 1200);
  };

  if (!showOpening || type === 'none') return null;

  if (type === 'fade') {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-[#FAF9F7] transition-opacity duration-[1200ms] ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
        onTransitionEnd={() => {
          if (isExiting) setShowOpening(false);
        }}
      />
    );
  }

  if (type === 'envelope') {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-500 ${
          isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
      >
        {/* Envelope container */}
        <div className="relative w-full max-w-md" style={{ aspectRatio: '4/3' }}>
          {/* Envelope body (pocket) */}
          <div className="absolute inset-0 bg-[#FDFBF7] border border-stone-200 shadow-2xl rounded-sm overflow-hidden">
            {/* Inner invitation card */}
            <div
              className={`absolute inset-x-4 top-8 bottom-16 bg-white border border-stone-200 shadow-lg rounded-sm p-6 flex flex-col items-center justify-center transition-transform duration-500 ${
                letterSlide ? '-translate-y-10' : 'translate-y-0'
              }`}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2 text-center">
                {coupleNames}
              </h2>
              <p className="text-xs md:text-sm text-stone-600 tracking-[0.2em] uppercase">
                You are invited
              </p>
            </div>
          </div>

          {/* Envelope flap (triangle) */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 origin-top transition-all duration-500 ${
              flapOpen ? '[transform:rotateX(180deg)]' : '[transform:rotateX(0deg)]'
            }`}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div
              className="w-full h-full bg-[#FDFBF7] border border-stone-200 shadow-xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>

          {/* Personalized address (if invited guest) */}
          {invitedGuest && (
            <div
              className={`absolute left-1/2 top-[15%] -translate-x-1/2 text-center px-4 transition-all duration-500 ${
                flapOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
            >
              <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-stone-600 mb-1">
                Cordially Invited:
              </p>
              <p className="font-serif italic text-base sm:text-lg text-stone-800 leading-tight">
                {invitedGuest.firstName} {invitedGuest.lastName}
              </p>
              {invitedGuest.companionCount > 0 && (
                <p className="text-[10px] sm:text-xs text-stone-600 mt-0.5">
                  {invitedGuest.companionCount === 1
                    ? 'and Guest'
                    : `Party of ${invitedGuest.companionCount + 1}`}
                </p>
              )}
            </div>
          )}

          {/* Wax seal button */}
          <button
            onClick={handleOpen}
            className={`absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#8B2635] text-amber-100 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
              flapOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
            aria-label="Open Invitation"
          >
            <div className="text-center">
              <div className="text-2xl leading-none mb-0.5">❦</div>
              <div className="text-[7px] font-serif tracking-wide uppercase">Open</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
