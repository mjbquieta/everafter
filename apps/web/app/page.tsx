import Link from 'next/link';
import {
  Globe,
  Users,
  Wallet,
  CheckSquare,
  Briefcase,
  ArrowRight,
  ChevronDown,
  Heart,
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
    primary: '#1A1A2E',
    secondary: '#2D2D44',
    bg: '#0F0F1A',
    fg: '#F0E8D8',
    accent: '#C9A86A',
  },
];

const features = [
  {
    icon: Globe,
    title: 'Personalized Wedding Websites',
    description:
      'Custom colors, editorial typography, and instant URLs. Your guests see a beautiful, mobile-ready site at everafter.app/your-names.',
  },
  {
    icon: Users,
    title: 'Smart Guest & RSVP CRM',
    description:
      'Real-time RSVP responses, plus-one tracking, dietary notes, and table assignments in one place.',
  },
  {
    icon: Wallet,
    title: 'Budget & Expense Tracker',
    description:
      'Track estimated vs actual costs, log payments, and organize expenses by vendor category.',
  },
  {
    icon: CheckSquare,
    title: 'Day-by-Day Checklist',
    description:
      'Pre-built milestones with priorities and due dates so nothing slips through the cracks.',
  },
  {
    icon: Briefcase,
    title: 'Built for Planners & Couples',
    description:
      'Multi-wedding workspace for professional coordinators. Manage all weddings from one dashboard.',
  },
  {
    icon: Heart,
    title: 'Dress Code Illustrations',
    description:
      'Elegant couple illustrations with customizable outfit colors to guide your guests on what to wear.',
  },
];

const faqs = [
  {
    q: 'Is EverAfter free to use?',
    a: 'Yes! You can create your wedding workspace, manage guests, track your budget, and build your wedding website completely free.',
  },
  {
    q: 'Can my guests RSVP through the wedding website?',
    a: 'Absolutely. Guests search their name, confirm attendance, add plus-ones, and leave dietary notes\u2014all directly on your personalized site.',
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
    <div className="rounded-xl border border-neutral-200/80 bg-white shadow-2xl shadow-neutral-900/5 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        </div>
        <div className="mx-auto rounded-md bg-white border border-neutral-200 px-4 py-1 text-[10px] text-neutral-400 font-sans">
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
    <div className="w-[130px] md:w-[150px] rounded-2xl border-[3px] border-neutral-800 bg-neutral-800 shadow-2xl shadow-neutral-900/20 overflow-hidden">
      {/* Notch */}
      <div className="flex justify-center py-1.5 bg-neutral-800">
        <div className="h-1.5 w-12 rounded-full bg-neutral-700" />
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
      <div className="flex-shrink-0 text-center lg:text-left lg:max-w-[240px]">
        <h3 className="font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl">
          {theme.name}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Every detail customizable. Colors, fonts, and layout adapt to your unique style.
        </p>
        {/* Color palette */}
        <div className="mt-4 flex items-center gap-2 justify-center lg:justify-start">
          {[theme.bg, theme.primary, theme.secondary, theme.accent].map((color, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border border-neutral-200"
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-landing.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-32 md:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-5">
              Your Forever Starts Here
            </p>
            <h1 className="text-4xl font-serif font-normal leading-[1.15] tracking-tight text-neutral-900 md:text-5xl md:font-medium lg:text-6xl">
              Plan your wedding.{' '}
              <span className="text-primary">Share your story.</span>{' '}
              Celebrate forever.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-neutral-500 md:text-lg leading-relaxed">
              The all-in-one wedding workspace combining guest management, budget tracking,
              and planning checklists with a beautiful wedding website.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                Start Planning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#themes"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/60 px-8 text-sm font-semibold text-neutral-700 backdrop-blur-sm transition-all hover:bg-white hover:border-neutral-300"
              >
                Explore Themes
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Strip ──────────────────────────────────────────── */}
      <div className="border-y border-neutral-100 bg-white py-6">
        <div className="mx-auto max-w-4xl px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { value: '100%', label: 'Free to use' },
            { value: '5 min', label: 'Setup time' },
            { value: '\u221E', label: 'Guests supported' },
            { value: '4', label: 'Curated themes' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium text-foreground">{stat.value}</span>
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Theme Showcase ──────────────────────────────────────────────── */}
      <section id="themes" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Curated Themes
            </p>
            <h2 className="mt-3 text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl md:font-medium">
              Stunning designs, ready in seconds
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Choose a theme that matches your vision. Every element adapts — colors,
              typography, and layout — to create a wedding website as unique as your love story.
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
      <section id="features" className="border-t border-neutral-100 bg-neutral-50/50 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Everything You Need
            </p>
            <h2 className="mt-3 text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl md:font-medium">
              One workspace for your entire wedding
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Stop juggling spreadsheets, messaging apps, and separate RSVP tools.
              EverAfter brings everything together.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-neutral-100 bg-white p-7 transition-all hover:shadow-lg hover:shadow-neutral-900/5 hover:border-neutral-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/12">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-medium tracking-tight text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl md:font-medium">
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
                <span className="inline-block font-serif text-4xl font-medium text-primary/20">{step}</span>
                <h3 className="mt-3 font-serif text-lg font-medium tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-neutral-100 bg-neutral-50/50 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl md:font-medium">
              Free to get started
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Everything you need to plan your wedding, at no cost.
              Premium features coming soon.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-sm">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Starter</p>
              <p className="mt-4 font-serif text-5xl font-medium tracking-tight text-foreground">Free</p>
              <p className="mt-2 text-sm text-muted">Forever. No credit card needed.</p>
              <div className="my-8 h-px bg-neutral-100" />
              <ul className="space-y-3.5 text-left text-sm text-foreground">
                {[
                  'Wedding dashboard & checklist',
                  'Guest management & RSVP',
                  'Budget & expense tracking',
                  'Custom wedding website',
                  'Unlimited guests',
                  'Dress code illustrations',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
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
          <div className="text-center mb-14">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">FAQ</p>
            <h2 className="mt-3 text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl md:font-medium">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-neutral-100 bg-white p-6 transition-all hover:border-neutral-200 hover:shadow-sm"
              >
                <h3 className="font-serif text-base font-medium tracking-tight text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-landing.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white/90" />

        <div className="relative py-24 md:py-32">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Ready?
            </p>
            <h2 className="text-3xl font-serif font-normal tracking-tight text-neutral-900 md:text-4xl md:font-medium">
              Your love story deserves a beautiful beginning
            </h2>
            <p className="mt-4 text-neutral-500 leading-relaxed">
              Create your free wedding workspace and personalized wedding website today.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                Start Planning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/60 px-8 text-sm font-semibold text-neutral-700 backdrop-blur-sm transition-all hover:bg-white hover:border-neutral-300"
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
