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
      <p className="text-4xl md:text-5xl font-bold tabular-nums" style={{ color: 'var(--wedding-primary)' }}>
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-xs uppercase tracking-widest mt-1 opacity-60">{label}</p>
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
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!weddingDate) return;
    function tick() {
      const diff = new Date(weddingDate!).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
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

  const coupleNames = brideName && groomName
    ? `${brideName} & ${groomName}`
    : brideName || groomName || 'Our Wedding';

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
      className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-40"
      style={{
        backgroundImage: heroBanner ? `url(${heroBanner})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {heroBanner && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-70"
           style={{ color: heroBanner ? '#fff' : 'var(--wedding-primary)' }}>
          We&apos;re getting married
        </p>

        <h1
          className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          style={{ color: heroBanner ? '#fff' : 'var(--wedding-foreground)' }}
        >
          {coupleNames}
        </h1>

        {formattedDate && (
          <p
            className="mt-4 text-lg md:text-xl"
            style={{ color: heroBanner ? 'rgba(255,255,255,0.9)' : 'var(--wedding-foreground)', opacity: 0.8 }}
          >
            {formattedDate}
          </p>
        )}

        {hashtag && (
          <p
            className="mt-2 text-sm italic"
            style={{ color: heroBanner ? 'rgba(255,255,255,0.7)' : 'var(--wedding-primary)' }}
          >
            #{hashtag}
          </p>
        )}

        {mounted && timeLeft && (
          <div className="mt-10 flex items-center justify-center gap-6 md:gap-10"
               style={{ color: heroBanner ? '#fff' : 'var(--wedding-foreground)' }}>
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
