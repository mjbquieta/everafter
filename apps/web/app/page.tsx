import Link from 'next/link';
import {
  Globe,
  Users,
  Wallet,
  CheckSquare,
  Briefcase,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Palette,
  UserCheck,
  CalendarDays,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

/* ─── Theme Presets for Interactive Callout ─────────────────────────────────── */
const presets = [
  { name: 'Classic Ivory', primary: '#8B5E5E', secondary: '#D8B4A0', bg: '#FAF9F7' },
  { name: 'Minimal Sage', primary: '#5A7A6A', secondary: '#A8C5B8', bg: '#F5F7F5' },
  { name: 'Romantic Rose', primary: '#B5656B', secondary: '#E8B4B8', bg: '#FDF6F7' },
  { name: 'Editorial Navy', primary: '#3D4F6A', secondary: '#8FA3BF', bg: '#F4F6F8' },
];

const features = [
  {
    icon: Globe,
    title: 'Personalized Wedding Websites',
    description:
      'Custom colors, editorial typography, and instant path-based URLs without writing code. Your guests visit everafter.app/your-names and see a beautiful, mobile-ready site.',
  },
  {
    icon: Users,
    title: 'Smart Guest & RSVP CRM',
    description:
      'Real-time RSVP responses, plus-one tracking, dietary notes, and table assignments. Know exactly who\'s coming and manage every detail in one place.',
  },
  {
    icon: Wallet,
    title: 'Budget & Expense Tracker',
    description:
      'Track estimated vs actual costs, log payments, and organize expenses by vendor category. Stay on budget with clear summaries in Philippine Pesos.',
  },
  {
    icon: CheckSquare,
    title: 'Day-by-Day Checklist',
    description:
      'Pre-built wedding planning milestones with priorities and due dates so nothing slips through the cracks. Check off tasks as you go.',
  },
  {
    icon: Briefcase,
    title: 'Built for Planners & Couples',
    description:
      'Multi-wedding workspace support for professional coordinators with shared client access. Manage all your weddings from a single dashboard.',
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent" />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Plan your wedding.{' '}
              <span className="text-primary">Share your story.</span>{' '}
              Celebrate forever.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
              The all-in-one wedding workspace combining guest management, budget tracking,
              and planning checklists with a personalized wedding website for your guests.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Create Your Wedding Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#preview"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 text-base font-medium text-foreground transition-colors hover:bg-background"
              >
                See Sample Wedding Site
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-border bg-surface shadow-lg overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-border" />
                  <div className="h-3 w-3 rounded-full bg-border" />
                  <div className="h-3 w-3 rounded-full bg-border" />
                </div>
                <div className="mx-auto rounded-md bg-surface border border-border px-4 py-1 text-xs text-muted">
                  everafter.app/dashboard
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="flex min-h-[280px] md:min-h-[340px]">
                {/* Sidebar mock */}
                <div className="hidden w-48 shrink-0 border-r border-border bg-background p-4 md:block">
                  <div className="mb-6">
                    <span className="text-sm font-semibold text-primary">EverAfter</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', active: true },
                      { icon: Globe, label: 'Website' },
                      { icon: Users, label: 'Guests' },
                      { icon: Wallet, label: 'Budget' },
                      { icon: CheckSquare, label: 'Checklist' },
                    ].map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ${
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main content mock */}
                <div className="flex-1 p-6">
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-foreground">Mark & Issa&apos;s Wedding</div>
                    <div className="text-xs text-muted mt-0.5">128 days to go</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { label: 'Guests', value: '142', sub: '86 confirmed' },
                      { label: 'RSVPs', value: '73%', sub: 'response rate' },
                      { label: 'Budget', value: '\u20B1450K', sub: '\u20B1380K spent' },
                      { label: 'Tasks', value: '18/24', sub: '75% done' },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-lg border border-border bg-background p-3"
                      >
                        <div className="text-xs text-muted">{card.label}</div>
                        <div className="mt-1 text-lg font-bold text-foreground">{card.value}</div>
                        <div className="text-xs text-muted">{card.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile preview floating card */}
            <div className="relative mx-auto -mt-12 mr-4 ml-auto w-40 md:-mt-24 md:mr-8 md:w-48">
              <div className="rounded-2xl border border-border bg-surface shadow-lg overflow-hidden">
                <div className="bg-primary/10 px-4 py-6 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-primary">
                    The Wedding of
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground md:text-base">
                    Mark & Issa
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">December 14, 2025</p>
                </div>
                <div className="space-y-2 p-3">
                  <div className="h-2 w-full rounded bg-border" />
                  <div className="h-2 w-3/4 rounded bg-border" />
                  <div className="mt-3 rounded-md bg-primary/10 px-3 py-1.5 text-center text-[10px] font-medium text-primary">
                    RSVP Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="border-t border-border bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Everything You Need
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              One workspace for your entire wedding
            </h2>
            <p className="mt-4 text-muted">
              Stop juggling spreadsheets, messaging apps, and separate RSVP tools.
              EverAfter brings everything together.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-background p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive Callout / Preview ──────────────────────────────────── */}
      <section id="preview" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Instant Customization
              </p>
              <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                Your wedding, your style
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Choose from curated theme presets or build your own palette.
                Every color, font, and section is customizable without writing
                a single line of code. Your wedding website is live the moment
                you publish it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: Palette, label: 'Custom colors' },
                  { icon: Globe, label: 'Instant URL' },
                  { icon: UserCheck, label: 'Built-in RSVP' },
                  { icon: CalendarDays, label: 'Event details' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Theme preview card */}
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <p className="text-sm font-semibold text-foreground mb-5">Theme Presets</p>
              <div className="space-y-4">
                {presets.map((preset) => (
                  <div
                    key={preset.name}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-background"
                  >
                    <div className="flex gap-2">
                      <div
                        className="h-8 w-8 rounded-full border border-border"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{preset.name}</p>
                    </div>
                    <div
                      className="rounded-md px-3 py-1.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: preset.primary }}
                    >
                      RSVP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Placeholder ───────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Free to get started
            </h2>
            <p className="mt-4 text-muted">
              Create your wedding workspace, manage guests, track your budget, and publish
              your wedding website at no cost. Premium features coming soon.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-sm rounded-xl border border-border bg-background p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Starter</p>
            <p className="mt-4 text-4xl font-bold text-foreground">Free</p>
            <p className="mt-1 text-sm text-muted">Everything you need to plan your wedding</p>
            <ul className="mt-6 space-y-3 text-left text-sm text-foreground">
              {[
                'Wedding dashboard & checklist',
                'Guest management & RSVP',
                'Budget & expense tracking',
                'Custom wedding website',
                'Unlimited guests',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="text-sm font-semibold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-primary/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Ready to start planning?
          </h2>
          <p className="mt-4 text-muted">
            Create your free wedding workspace and personalized wedding website in minutes.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Create Your Wedding Workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
