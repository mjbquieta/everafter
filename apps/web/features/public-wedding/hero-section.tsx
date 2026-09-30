'use client';

import { useState, useEffect } from 'react';
import { resolveUploadUrl } from '@/lib/api-client';

interface HeroSectionProps {
  brideName: string | null;
  groomName: string | null;
  weddingDate: string | null;
  timezone: string;
  hashtag: string | null;
  heroBanner: string | null;
  layout?: string;
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
  layout,
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

  const bannerUrl = resolveUploadUrl(heroBanner);

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      })
    : null;

  const isMagazine = layout === 'magazine';
  const isEditorial = layout === 'editorial';

  // ── Magazine hero: split layout with image on one side, text on the other ──
  if (isMagazine) {
    return (
      <section id="home" className="relative min-h-[85vh]">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[85vh]">
          {/* Image side */}
          <div
            className="relative min-h-[50vh] md:min-h-full md:col-span-6"
            style={{
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: bannerUrl ? undefined : 'var(--wedding-secondary)',
            }}
          />
          {/* Text side */}
          <div className="md:col-span-6 flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
            <p
              className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: 'var(--wedding-primary)' }}
            >
              Wedding Invitation
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[0.95] tracking-tight mb-6"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              {brideName && groomName ? (
                <>
                  {brideName}
                  <span className="block font-normal italic text-3xl md:text-4xl my-2" style={{ color: 'var(--wedding-primary)' }}>&amp;</span>
                  {groomName}
                </>
              ) : coupleNames}
            </h1>

            {formattedDate && (
              <p
                className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.5 }}
              >
                {formattedDate}
              </p>
            )}

            {hashtag && (
              <p
                className="font-serif text-base italic"
                style={{ color: 'var(--wedding-primary)' }}
              >
                #{hashtag}
              </p>
            )}

            {mounted && timeLeft && (
              <div className="mt-10 flex items-center gap-6">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <span className="text-3xl font-light opacity-30">:</span>
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <span className="text-3xl font-light opacity-30">:</span>
                <CountdownUnit value={timeLeft.minutes} label="Min" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── Editorial hero: oversized typography, asymmetric, dramatic whitespace ──
  if (isEditorial) {
    return (
      <section
        id="home"
        className="relative min-h-[85vh]"
        style={{
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {bannerUrl && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </>
        )}
        <div className="relative z-10 min-h-[85vh] flex flex-col justify-end mx-auto max-w-5xl w-full px-4 md:px-8 pb-16 md:pb-20 pt-32">
          <p
            className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            style={{
              color: bannerUrl ? 'rgba(255,255,255,0.6)' : 'var(--wedding-primary)',
            }}
          >
            Wedding Invitation
          </p>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium leading-[0.9] tracking-tight max-w-4xl"
            style={{ color: bannerUrl ? '#fff' : 'var(--wedding-foreground)' }}
          >
            {brideName && groomName ? (
              <>
                {brideName}
                <span className="block font-normal italic text-4xl md:text-5xl my-3" style={{ color: bannerUrl ? 'rgba(255,255,255,0.6)' : 'var(--wedding-primary)' }}>&amp;</span>
                {groomName}
              </>
            ) : coupleNames}
          </h1>

          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            {formattedDate && (
              <p
                className="font-sans text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: bannerUrl ? 'rgba(255,255,255,0.6)' : 'var(--wedding-foreground)',
                  opacity: bannerUrl ? 1 : 0.5,
                }}
              >
                {formattedDate}
              </p>
            )}
            {hashtag && (
              <p
                className="font-serif text-base italic"
                style={{
                  color: bannerUrl ? 'rgba(255,255,255,0.6)' : 'var(--wedding-primary)',
                }}
              >
                #{hashtag}
              </p>
            )}
          </div>

          {mounted && timeLeft && (
            <div
              className="mt-10 flex items-center gap-6"
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

  // ── Classic hero: centered, elegant ──
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
      {bannerUrl && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </>
      )}

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
