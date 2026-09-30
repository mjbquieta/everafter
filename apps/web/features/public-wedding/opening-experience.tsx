'use client';

import { useState, useEffect } from 'react';

interface OpeningExperienceProps {
  type: 'none' | 'fade' | 'envelope';
  slug: string;
  coupleNames: string;
}

export function OpeningExperience({ type, slug, coupleNames }: OpeningExperienceProps) {
  const [showOpening, setShowOpening] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

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

    // Start exit animation
    setIsExiting(true);
    sessionStorage.setItem(`hasOpenedInvitation_${slug}`, 'true');

    // Unmount after animation completes
    setTimeout(() => {
      setShowOpening(false);
    }, 600);
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
          isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div
          className={`bg-[#FAF9F7] rounded-lg shadow-2xl max-w-md w-full p-8 text-center transition-all duration-500 ${
            isExiting ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Envelope decorative header */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-rose-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Wax seal effect */}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-rose-600 border-2 border-[#FAF9F7] flex items-center justify-center">
                <span className="text-[10px] text-white font-serif">❦</span>
              </div>
            </div>
          </div>

          {/* Invitation text */}
          <h2 className="font-serif text-3xl text-stone-900 mb-2">
            {coupleNames}
          </h2>
          <p className="text-sm text-stone-600 mb-6 tracking-wide uppercase">
            You are invited
          </p>

          {/* Open button */}
          <button
            onClick={handleOpen}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Open Invitation
          </button>
        </div>
      </div>
    );
  }

  return null;
}
