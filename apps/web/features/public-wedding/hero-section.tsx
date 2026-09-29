'use client';

import { useState, useEffect } from 'react';

interface HeroSectionProps {
  brideName: string | null;
  groomName: string | null;
  weddingDate: string | null;
  timezone: string;
  hashtag: string | null;
  heroBanner: string | null;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p
        className="text-4xl md:text-5xl font-bold tabular-nums"
        style={{ color: 'var(--wedding-primary)' }}
      >
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-xs uppercase tracking-widest mt-1 opacity-60">
        {label}
      </p>
    </div>
  );
}

export function HeroSection({
  brideName,
  groomName,
  weddingDate,
  timezone,
  hashtag,
  heroBanner,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!weddingDate) return;
    function tick() {
      const diff = new Date(weddingDate!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
      });
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [weddingDate]);

  const coupleNames =
    brideName && groomName
      ? `${brideName} & ${groomName}`
      : brideName || groomName || 'Our Wedding';

  // Resolve banner URL — stored paths like /uploads/... need the API origin
  const bannerUrl = (() => {
    if (!heroBanner) return null;
    if (heroBanner.startsWith('http')) return heroBanner;
    if (heroBanner.startsWith('/images/')) return heroBanner;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
    return apiUrl.replace('/api/v1', '') + heroBanner;
  })();

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      })
    : null;

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-48 md:pb-40 min-h-[85vh]"
      style={{
        backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {bannerUrl && <div className="absolute inset-0 bg-black/30" />}

      <div className="relative z-10">
        <p
          className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          style={{
            color: bannerUrl
              ? 'rgba(255,255,255,0.7)'
              : 'var(--wedding-primary)',
          }}
        >
          Wedding Invitation
        </p>

        <h1
          className="text-5xl md:text-7xl font-serif font-medium leading-tight tracking-tight"
          style={{ color: bannerUrl ? '#fff' : 'var(--wedding-foreground)' }}
        >
          {coupleNames}
        </h1>

        {formattedDate && (
          <p
            className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              color: bannerUrl
                ? 'rgba(255,255,255,0.7)'
                : 'var(--wedding-foreground)',
              opacity: 0.7,
            }}
          >
            {formattedDate}
          </p>
        )}

        {hashtag && (
          <p
            className="mt-3 font-serif text-base italic"
            style={{
              color: bannerUrl
                ? 'rgba(255,255,255,0.7)'
                : 'var(--wedding-primary)',
            }}
          >
            #{hashtag}
          </p>
        )}

        {mounted && timeLeft && (
          <div
            className="mt-10 flex items-center justify-center gap-6 md:gap-10"
            style={{ color: bannerUrl ? '#fff' : 'var(--wedding-foreground)' }}
          >
            <CountdownUnit value={timeLeft.days} label="Days" />
            <span className="text-3xl font-light opacity-30">:</span>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <span className="text-3xl font-light opacity-30">:</span>
            <CountdownUnit value={timeLeft.minutes} label="Min" />
          </div>
        )}

      </div>
    </section>
  );
}
