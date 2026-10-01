'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { AsymmetricHero } from '@/components/marketing/asymmetric-hero';
import { EditorialStatement } from '@/components/marketing/editorial-statement';
import { FeatureShowcaseGrid } from '@/components/marketing/feature-showcase-grid';

/* ─── Theme Showcase Data ────────────────────────────────────────────────────── */
const themes = [
  {
    name: 'Warm Linen',
    couple: 'Mark & Issa',
    date: 'December 14, 2025',
    venue: 'Manila Cathedral',
    description: 'Classic serif typography paired with warm beige canvas and earthy terracotta accents.',
    primary: '#8C7355',
    secondary: '#E8DCC8',
    bg: '#F9F6F0',
    fg: '#2B2726',
    accent: '#C2A67E',
  },
  {
    name: 'Moody Plum',
    couple: 'Aria & Lucas',
    date: 'March 22, 2026',
    venue: 'The Glass Garden',
    description: 'Poetic editorial serif on lavender-tinged canvas with deep violet and mauve.',
    primary: '#4A2E4B',
    secondary: '#D4C5D6',
    bg: '#F5F2F7',
    fg: '#1A1A1A',
    accent: '#9B7E9F',
  },
  {
    name: 'Dusty Rose',
    couple: 'Sofia & James',
    date: 'June 8, 2026',
    venue: 'Villa Rosa Estate',
    description: 'Romantic serif with soft italics on blush pink canvas and berry mauve highlights.',
    primary: '#9E4759',
    secondary: '#F2D5DA',
    bg: '#FAF0F2',
    fg: '#3A1F22',
    accent: '#D99BA5',
  },
  {
    name: 'Coastal Slate',
    couple: 'James & Clara',
    date: 'August 18, 2026',
    venue: 'Seaside Chapel',
    description: 'Clean modern serif on coastal blue canvas with deep slate and soft azure tones.',
    primary: '#2C4251',
    secondary: '#C5D4DD',
    bg: '#EDF3F7',
    fg: '#1A2A33',
    accent: '#71899C',
  },
  {
    name: 'Midnight Editorial',
    couple: 'Elena & Daniel',
    date: 'October 5, 2026',
    venue: 'The Grand Ballroom',
    description: 'Dramatic obsidian charcoal canvas with crisp white typography and champagne gold accents.',
    primary: '#FFFFFF',
    secondary: '#D4AF37',
    bg: '#0F1015',
    fg: '#F5F3EF',
    accent: '#D4AF37',
  },
];


const faqs = [
  {
    q: 'Is EverAfter free to use?',
    a: 'Yes! You can create your wedding workspace, manage guests, track your budget, and build your wedding website completely free.',
  },
  {
    q: 'Can my guests RSVP through the wedding website?',
    a: 'Absolutely. Guests search their name, confirm attendance, add plus-ones, and leave dietary notes—all directly on your personalized site.',
  },
  {
    q: 'Do I need coding skills to customize my website?',
    a: 'Not at all. Choose a theme preset, adjust colors and fonts with simple controls, and toggle sections on or off. Everything is visual.',
  },
  {
    q: 'Can wedding planners use EverAfter for multiple clients?',
    a: 'Yes. EverAfter supports multiple wedding workspaces, so planners can switch between clients from one dashboard.',
  },
];

/* ─── Theme Mockup Components ────────────────────────────────────────────────── */

function DesktopMockup({ theme }: { theme: (typeof themes)[number] }) {
  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        </div>
        <div className="mx-auto rounded-md bg-white border border-stone-200 px-4 py-1 text-[10px] text-stone-400 font-sans">
          everafter.app/{theme.couple.toLowerCase().replace(/ & /g, '-').replace(/\s/g, '-')}
        </div>
      </div>
      {/* Wedding site content */}
      <div style={{ backgroundColor: theme.bg }} className="px-6 py-10 md:px-10 md:py-14">
        {/* Nav mockup */}
        <div className="flex items-center justify-center gap-6 mb-10">
          {['Our Story', 'Details', 'RSVP'].map((item) => (
            <span
              key={item}
              className="font-sans text-[9px] uppercase tracking-[0.15em]"
              style={{ color: theme.fg, opacity: 0.4 }}
            >
              {item}
            </span>
          ))}
        </div>
        {/* Hero */}
        <div className="text-center">
          <p
            className="font-sans text-[8px] font-semibold uppercase tracking-[0.25em] mb-3"
            style={{ color: theme.primary }}
          >
            Wedding Invitation
          </p>
          <h3
            className="font-serif text-2xl md:text-3xl font-medium tracking-tight leading-tight"
            style={{ color: theme.fg }}
          >
            {theme.couple}
          </h3>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-8" style={{ backgroundColor: theme.primary, opacity: 0.3 }} />
            <p
              className="font-sans text-[8px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: theme.fg, opacity: 0.5 }}
            >
              {theme.date}
            </p>
            <div className="h-px w-8" style={{ backgroundColor: theme.primary, opacity: 0.3 }} />
          </div>
          <p
            className="font-sans text-[9px] mt-2"
            style={{ color: theme.fg, opacity: 0.4 }}
          >
            {theme.venue}
          </p>
          {/* CTA */}
          <div className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-md px-5 py-2 text-[9px] font-semibold text-white"
               style={{ backgroundColor: theme.primary }}>
            RSVP Now
          </div>
        </div>
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: theme.secondary }} />
          <Sparkles className="h-3 w-3" style={{ color: theme.accent }} />
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: theme.secondary }} />
        </div>
      </div>
    </div>
  );
}

function MobileMockup({ theme }: { theme: (typeof themes)[number] }) {
  return (
    <div className="w-[140px] sm:w-[160px] md:w-[170px] h-[300px] sm:h-[340px] md:h-[360px] rounded-[28px] sm:rounded-[34px] border-[5px] sm:border-[6px] border-stone-800 bg-stone-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Screen */}
      <div className="rounded-[23px] sm:rounded-[28px] overflow-hidden bg-white relative flex flex-col h-full">
        {/* Dynamic Island / Speaker Pill */}
        <div className="w-10 sm:w-12 h-2.5 sm:h-3 bg-stone-900 rounded-full mx-auto mt-1.5 z-20 shrink-0" />

        {/* Content Area */}
        <div style={{ backgroundColor: theme.bg }} className="flex-1 px-3 py-4 flex flex-col justify-center">
          <div className="text-center">
            <p
              className="font-sans text-[7px] uppercase tracking-widest mb-2"
              style={{ color: theme.primary }}
            >
              The Wedding of
            </p>
            <h4
              className="font-serif text-[10px] sm:text-[11px] font-medium tracking-tight leading-tight"
              style={{ color: theme.fg }}
            >
              {theme.couple}
            </h4>
            <p
              className="font-sans text-[7px] uppercase tracking-widest mt-1.5"
              style={{ color: theme.fg, opacity: 0.5 }}
            >
              {theme.date}
            </p>
            {/* Divider */}
            <div className="mx-auto my-2.5 h-px w-8" style={{ backgroundColor: theme.secondary }} />
            {/* Placeholder content lines */}
            <div className="space-y-1 mt-2.5">
              <div className="mx-auto h-0.5 w-4/5 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
              <div className="mx-auto h-0.5 w-3/5 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
              <div className="mx-auto h-0.5 w-2/3 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
            </div>
            {/* RSVP button */}
            <div
              className="mt-3 mx-auto inline-block rounded-full px-3 py-1 text-[7px] font-sans font-bold text-white"
              style={{ backgroundColor: theme.primary }}
            >
              RSVP Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const activeTheme = themes[activeIndex];

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % themes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + themes.length) % themes.length);
    setIsPaused(true);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % themes.length);
    setIsPaused(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Asymmetric split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left: Editorial theme information (vertically centered on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div>
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-6">
              THEME SELECTOR
            </p>

            {/* Theme tabs - vertical on desktop */}
            <div className="space-y-3">
              {themes.map((theme, i) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsPaused(true);
                  }}
                  className={`group w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-left ${
                    activeIndex === i
                      ? 'bg-stone-900 text-white shadow-lg'
                      : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  <span className={`text-xs font-mono font-medium ${activeIndex === i ? 'text-white/60' : 'text-stone-400'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base font-serif flex-1">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active theme details */}
          <div className="transition-all duration-500 ease-out pt-6 border-t border-stone-200">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 mb-4">
              {activeTheme.name}
            </h3>
            <p className="text-base text-stone-600 leading-relaxed font-serif mb-6">
              {activeTheme.description}
            </p>

            {/* Color swatches */}
            <div className="mb-6">
              <p className="font-mono text-[9px] tracking-wider text-stone-400 mb-3">COLOR PALETTE</p>
              <div className="flex items-center gap-3">
                {[
                  { color: activeTheme.bg, label: 'Background' },
                  { color: activeTheme.primary, label: 'Primary' },
                  { color: activeTheme.secondary, label: 'Secondary' },
                  { color: activeTheme.accent, label: 'Accent' }
                ].map(({ color, label }, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="h-10 w-10 rounded-full border-2 border-stone-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <span className="font-mono text-[8px] text-stone-400 uppercase">{label.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800 px-6 py-3 rounded-full text-sm font-sans font-medium transition-colors w-full sm:w-auto"
            >
              Use This Theme
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right: Large overlapping dual-device showcase */}
        <div className="lg:col-span-7">
          <div className="relative">
            {/* Desktop mockup */}
            <div className="relative transition-all duration-500 ease-out">
              <DesktopMockup theme={activeTheme} />

              {/* Mobile mockup - overlapping at corner */}
              <div className="absolute -bottom-8 sm:-bottom-12 -right-6 sm:-right-12 z-10 transition-all duration-500 rotate-[2deg] hover:rotate-0">
                <MobileMockup theme={activeTheme} />
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-stone-200/60">
            <button
              onClick={handlePrevious}
              className="w-11 h-11 rounded-full border border-stone-300 hover:border-stone-900 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:shadow-md"
              aria-label="Previous theme"
            >
              <ChevronLeft className="h-5 w-5 text-stone-700" />
            </button>

            <div className="flex items-center gap-2">
              {themes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsPaused(true);
                  }}
                  className={`transition-all ${
                    activeIndex === i
                      ? 'w-10 h-2.5 bg-stone-900'
                      : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                  } rounded-full`}
                  aria-label={`Go to theme ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-stone-300 hover:border-stone-900 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:shadow-md"
              aria-label="Next theme"
            >
              <ChevronRight className="h-5 w-5 text-stone-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      <Navbar />

      {/* ─── Asymmetric Hero ────────────────────────────────────────────────── */}
      <AsymmetricHero />

      {/* ─── Editorial Philosophy Statement ──────────────────────────────── */}
      <EditorialStatement />

      {/* ─── Theme Showcase (Asymmetric Split) ───────────────────────────── */}
      <section id="themes" className="border-t border-stone-200/60 bg-white/30 py-24 md:py-32">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500">
              CURATED STATIONERY THEMES
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Bespoke templates for every <span className="italic">vision</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed font-serif">
              Each theme offers distinct editorial personality with customizable colors, typography, and layout to reflect your unique love story.
            </p>
          </div>

          <ThemeCarousel />
        </div>
      </section>

      {/* ─── Asymmetric Feature Showcase Grid ────────────────────────────── */}
      <FeatureShowcaseGrid />

      {/* ─── How it Works ────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200/60 py-24 md:py-32">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500">
              HOW IT WORKS
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Three steps to your perfect wedding
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create your workspace',
                description: 'Sign up free and tell us about your wedding. Your personalized dashboard is ready in seconds.',
              },
              {
                step: '02',
                title: 'Customize everything',
                description: 'Choose a theme, add your details, import your guest list, and set your budget.',
              },
              {
                step: '03',
                title: 'Share & celebrate',
                description: 'Publish your wedding website, collect RSVPs, and enjoy the countdown to your big day.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="border-l-2 border-stone-200 pl-8">
                <span className="inline-block font-mono text-sm text-stone-400 tracking-wider mb-4">{step}</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 mb-3">{title}</h3>
                <p className="text-base text-stone-600 leading-relaxed font-serif">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing (Asymmetric Composition) ─────────────────────────────── */}
      <section id="pricing" className="border-t border-stone-200/60 bg-white/30 py-24 md:py-32">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8">
          {/* Asymmetric 12-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Editorial messaging (5 cols) - vertically centered */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <p className="text-xs tracking-[0.25em] uppercase text-stone-400 font-sans">
                HONEST & TRANSPARENT
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-[1.2]">
                Everything you need to celebrate, completely <span className="italic">free.</span>
              </h2>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-serif">
                No hidden tiers, no paywalls on guest counts, and no watermarks on your love story. Enjoy unlimited guests, custom stationery, and RSVP tracking at zero cost.
              </p>
            </div>

            {/* Right Column: Pricing ticket card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-2xl shadow-sm">
                <div className="flex items-baseline justify-between mb-5">
                  <p className="font-sans text-sm tracking-[0.2em] uppercase text-stone-500">Starter</p>
                  <p className="font-serif text-5xl sm:text-6xl font-medium tracking-tight text-stone-900">Free</p>
                </div>
                <p className="text-base text-stone-600 font-serif mb-6">
                  Forever. No credit card needed.
                </p>
                <div className="mb-6 h-px bg-stone-100" />
                <ul className="space-y-3.5 text-base text-stone-700 mb-8">
                  {[
                    'Wedding dashboard & checklist',
                    'Guest management & RSVP',
                    'Budget & expense tracking',
                    'Custom wedding website',
                    'Ambient music & opening animation',
                    'Dress code color swatches',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-stone-700" />
                      </div>
                      <span className="font-serif">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 text-base font-medium text-white transition-colors hover:bg-stone-800 font-sans"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-stone-200/60 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500">FAQ</p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-stone-200/80 bg-white p-8 transition-all hover:border-stone-300 hover:shadow-sm"
              >
                <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-stone-900">{faq.q}</h3>
                <p className="mt-3 text-base leading-relaxed text-stone-600 font-serif">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-stone-200/60">
        <div className="relative py-24 md:py-32 bg-gradient-to-b from-white/30 to-transparent">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-6">
                READY?
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
                Your love story deserves a beautiful <span className="italic">beginning</span>
              </h2>
              <p className="mt-8 text-base sm:text-lg text-stone-600 leading-relaxed font-serif max-w-2xl mx-auto">
                Create your free wedding workspace and personalized wedding website today.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800 px-8 py-3.5 rounded-full text-base font-sans font-medium transition-colors"
                >
                  Start Planning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-full px-8 py-3.5 text-base font-sans font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
