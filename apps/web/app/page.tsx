import Link from 'next/link';
import {
  Mail,
  Music,
  Palette,
  Users,
  Wallet,
  CheckSquare,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

/* ─── Theme Showcase Data ────────────────────────────────────────────────────── */
const themes = [
  {
    name: 'Classic Ivory',
    couple: 'Mark & Issa',
    date: 'December 14, 2025',
    venue: 'Manila Cathedral',
    description: 'Timeless serif typography paired with warm ivory tones and gilded accents.',
    primary: '#8B5E5E',
    secondary: '#D8B4A0',
    bg: '#FAF9F7',
    fg: '#2B2726',
    accent: '#C9A86A',
  },
  {
    name: 'Minimal Sage',
    couple: 'Aria & Lucas',
    date: 'March 22, 2026',
    venue: 'The Glass Garden',
    description: 'Modern organic botanical palette with clean Swiss layouts and calm negative space.',
    primary: '#5A7A6A',
    secondary: '#A8C5B8',
    bg: '#F5F7F5',
    fg: '#1A2E22',
    accent: '#8BAF7E',
  },
  {
    name: 'Romantic Blush',
    couple: 'Sofia & James',
    date: 'June 8, 2026',
    venue: 'Villa Rosa Estate',
    description: 'Soft floral petal undertones and delicate cursive script.',
    primary: '#B5656B',
    secondary: '#F2D5D8',
    bg: '#FDF6F7',
    fg: '#3A1F22',
    accent: '#D4919A',
  },
  {
    name: 'Midnight Gold',
    couple: 'Elena & Daniel',
    date: 'October 5, 2026',
    venue: 'The Grand Ballroom',
    description: 'Dramatic deep-charcoal canvas illuminated by luminous champagne accents.',
    primary: '#1A1A2E',
    secondary: '#2D2D44',
    bg: '#0F0F1A',
    fg: '#F0E8D8',
    accent: '#C9A86A',
  },
];

const features = [
  {
    icon: Mail,
    title: 'Tactile Opening Experience',
    description:
      'Interactive wax seal and folded envelope opening animation that greets guests with tactile charm.',
  },
  {
    icon: Music,
    title: 'Ambient Ceremony Music',
    description:
      'Curated classical and acoustic audio presets, or custom MP3 uploads with interactive auto-play.',
  },
  {
    icon: Palette,
    title: 'Attire & Palette Guide',
    description:
      'Provide guests with tailored dress codes and custom-named color swatches like Dusty Blue and Rosewood.',
  },
  {
    icon: Users,
    title: 'Smart Guest & RSVP Suite',
    description:
      'Track party sizes, dietary restrictions, and table allocations in real-time.',
  },
  {
    icon: Wallet,
    title: 'Budget & Currency Management',
    description:
      'Comprehensive expense tracking with multi-currency support, including Philippine Pesos (₱).',
  },
  {
    icon: CheckSquare,
    title: 'Milestone Checklist',
    description:
      'Urgency badges and contextual progress tracking to keep planning calm and organized.',
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
    <div className="w-[130px] md:w-[150px] rounded-2xl border-[3px] border-stone-800 bg-stone-800 shadow-2xl shadow-stone-900/20 overflow-hidden">
      {/* Notch */}
      <div className="flex justify-center py-1.5 bg-stone-800">
        <div className="h-1.5 w-12 rounded-full bg-stone-700" />
      </div>
      {/* Screen */}
      <div style={{ backgroundColor: theme.bg }} className="px-3 py-5">
        <div className="text-center">
          <p
            className="font-sans text-[6px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: theme.primary }}
          >
            The Wedding of
          </p>
          <h4
            className="font-serif text-sm font-medium tracking-tight leading-tight"
            style={{ color: theme.fg }}
          >
            {theme.couple}
          </h4>
          <p
            className="font-sans text-[6px] uppercase tracking-[0.15em] mt-1.5"
            style={{ color: theme.fg, opacity: 0.5 }}
          >
            {theme.date}
          </p>
          {/* Divider */}
          <div className="mx-auto my-3 h-px w-10" style={{ backgroundColor: theme.secondary }} />
          {/* Placeholder content lines */}
          <div className="space-y-1.5 mt-3">
            <div className="mx-auto h-1 w-4/5 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
            <div className="mx-auto h-1 w-3/5 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
            <div className="mx-auto h-1 w-2/3 rounded" style={{ backgroundColor: theme.secondary, opacity: 0.5 }} />
          </div>
          {/* RSVP button */}
          <div
            className="mt-4 mx-auto rounded-md py-1.5 text-[7px] font-bold text-white"
            style={{ backgroundColor: theme.primary }}
          >
            RSVP Now
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeShowcase({ theme, reverse }: { theme: (typeof themes)[number]; reverse?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {/* Mockups */}
      <div className="relative flex-1 max-w-2xl w-full">
        <div className="relative">
          <DesktopMockup theme={theme} />
          {/* Mobile floating beside desktop */}
          <div className={`absolute -bottom-6 ${reverse ? '-left-4 md:-left-8' : '-right-4 md:-right-8'} z-10`}>
            <MobileMockup theme={theme} />
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="flex-shrink-0 text-center lg:text-left lg:max-w-[320px]">
        <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900">
          {theme.name}
        </h3>
        <p className="mt-3 text-base text-stone-600 leading-relaxed font-serif">
          {theme.description}
        </p>
        {/* Color palette */}
        <div className="mt-4 flex items-center gap-2 justify-center lg:justify-start">
          {[theme.bg, theme.primary, theme.secondary, theme.accent].map((color, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border border-stone-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
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

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/hero-landing.jpg')" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-32 md:pt-36">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-sans text-sm tracking-[0.25em] uppercase text-stone-500 mb-6">
              The Modern Wedding Workspace & Invitation Suite
            </p>
            <h1 className="text-5xl sm:text-7xl font-serif font-normal leading-[1.1] tracking-tight text-stone-900">
              Plan with intention. Invite with <span className="italic">elegance.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-stone-600 leading-relaxed font-serif">
              EverAfter unites bespoke digital wedding stationery, ambient ceremony music, and thoughtful planning tools into one refined canvas.
            </p>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800 px-8 py-3.5 rounded-full text-base font-sans font-medium transition-colors"
              >
                Begin Your Story Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#themes"
                className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-full px-8 py-3.5 text-base font-sans font-medium transition-colors"
              >
                Explore Stationery Themes
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics Bar ──────────────────────────────────────────────────── */}
      <div className="border-y border-stone-200/60 bg-[#FDFCFA] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm sm:text-base text-stone-700 font-serif">
            Zero Subscription Fees · 5-Minute Setup · Custom Ambient Audio & RSVP Suite
          </p>
        </div>
      </div>

      {/* ─── Theme Showcase ──────────────────────────────────────────────── */}
      <section id="themes" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-500">
              Curated Stationery Themes
            </p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Bespoke templates for every vision
            </h2>
            <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed font-serif max-w-xl mx-auto">
              Each theme offers distinct editorial personality with customizable colors, typography, and layout to reflect your unique love story.
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {themes.map((theme, i) => (
              <ThemeShowcase key={theme.name} theme={theme} reverse={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="border-t border-stone-200/60 bg-white/40 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-500">
              Luxury Differentiators
            </p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Premium features that delight
            </h2>
            <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed font-serif max-w-xl mx-auto">
              Thoughtfully designed tools that elevate your wedding planning from spreadsheets to stationery.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-stone-200/80 bg-white p-8 transition-all hover:shadow-lg hover:shadow-stone-900/5 hover:border-stone-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 transition-colors group-hover:bg-stone-200">
                  <feature.icon className="h-6 w-6 text-stone-700" />
                </div>
                <h3 className="mt-6 font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-stone-600 font-serif">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-500">
              How It Works
            </p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
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
              <div key={step} className="text-center">
                <span className="inline-block font-serif text-5xl font-medium text-stone-300">{step}</span>
                <h3 className="mt-4 font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900">{title}</h3>
                <p className="mt-3 text-base text-stone-600 leading-relaxed font-serif">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-stone-200/60 bg-white/40 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-500">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Free to get started
            </h2>
            <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed font-serif max-w-xl mx-auto">
              Everything you need to plan your wedding, at no cost. Premium features coming soon.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-md">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-10 shadow-sm text-center">
              <p className="font-sans text-sm tracking-[0.2em] uppercase text-stone-500">Starter</p>
              <p className="mt-5 font-serif text-6xl font-medium tracking-tight text-stone-900">Free</p>
              <p className="mt-3 text-base text-stone-600 font-serif">Forever. No credit card needed.</p>
              <div className="my-10 h-px bg-stone-100" />
              <ul className="space-y-4 text-left text-base text-stone-700">
                {[
                  'Wedding dashboard & checklist',
                  'Guest management & RSVP',
                  'Budget & expense tracking',
                  'Custom wedding website',
                  'Ambient music & opening animation',
                  'Dress code color swatches',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100">
                      <Check className="h-3.5 w-3.5 text-stone-700" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 text-base font-medium text-white transition-colors hover:bg-stone-800"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-500">FAQ</p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
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
        <div className="relative py-24 md:py-32 bg-gradient-to-b from-white/40 to-transparent">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-sans text-sm tracking-[0.25em] uppercase text-stone-500 mb-5">
              Ready?
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-stone-900">
              Your love story deserves a beautiful beginning
            </h2>
            <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed font-serif">
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
      </section>

      <Footer />
    </div>
  );
}
