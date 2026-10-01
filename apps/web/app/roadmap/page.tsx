import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'Roadmap | EverAfter',
  description:
    'From initial vows to digital keepsakes—our continuous evolution in crafting timeless wedding experiences.',
};

interface Milestone {
  phase: string;
  title: string;
  status: 'Shipped' | 'In Progress' | 'Planned';
  items: string[];
  position: 'left' | 'right';
}

const milestones: Milestone[] = [
  {
    phase: 'Phase 1',
    title: 'Foundations & Canvas',
    status: 'Shipped',
    position: 'left',
    items: [
      'Core wedding layouts (Classic, Magazine, Editorial)',
      'Live builder synchronization with instant preview',
      'Guest RSVP submission and management',
      'Interactive schedule and FAQ accordion',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Tactile Audio & Opening',
    status: 'Shipped',
    position: 'right',
    items: [
      'Ambient background music player with curated presets',
      'Custom MP3 upload and URL support',
      'Wax seal & envelope opening ceremony animation',
      'Interaction-triggered audio auto-play',
    ],
  },
  {
    phase: 'Phase 3',
    title: '5 Curated Themes',
    status: 'Shipped',
    position: 'left',
    items: [
      'Warm Linen (beige editorial serif)',
      'Moody Plum (violet poetic accents)',
      'Dusty Rose (romantic blush tones)',
      'Coastal Slate (modern blue minimalism)',
      'Midnight Editorial (champagne on obsidian)',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Host Operations & Media Suites',
    status: 'In Progress',
    position: 'right',
    items: [
      'Dedicated RSVP Hub with dietary intelligence & CSV export',
      'Media & Photo Gallery Studio (up next)',
      'High-res lightbox with keyboard navigation',
      'Dress code palette swatches with custom shade names',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Social Invitations & Day-of Tools',
    status: 'Planned',
    position: 'left',
    items: [
      'Rich social preview cards (OG images for sharing)',
      'Wedding QR code suite for physical invites',
      'Printable day-of timelines and coordinator packets',
      'Command palette (⌘K) for quick navigation',
    ],
  },
];

function StatusBadge({ status }: { status: Milestone['status'] }) {
  const colors = {
    Shipped: 'bg-amber-100/80 text-amber-900 border-amber-200',
    'In Progress': 'bg-blue-100/80 text-blue-900 border-blue-200',
    Planned: 'bg-stone-100/80 text-stone-600 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${colors[status]}`}
    >
      {status === 'Shipped' && <Check className="h-2.5 w-2.5" />}
      {status}
    </span>
  );
}

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const isLeft = milestone.position === 'left';

  return (
    <div className="relative flex items-start justify-center gap-8 md:gap-16">
      {/* Left content */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'md:opacity-0'}`}>
        {isLeft && (
          <div className="inline-block max-w-sm text-left md:text-right">
            <div className="flex items-center gap-2 mb-2 md:justify-end">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                {milestone.phase}
              </span>
              <StatusBadge status={milestone.status} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-stone-900 mb-2">
              {milestone.title}
            </h3>
            <ul className="space-y-1">
              {milestone.items.map((item, i) => (
                <li key={i} className="text-xs md:text-sm text-stone-600 leading-relaxed font-serif">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Center pin */}
      <div className="relative flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center shadow-sm z-10 ${
            milestone.status === 'Shipped'
              ? 'border-amber-600 bg-amber-50'
              : milestone.status === 'In Progress'
                ? 'border-blue-600 bg-blue-50'
                : 'border-stone-300 bg-stone-50'
          }`}
        >
          {milestone.status === 'Shipped' ? (
            <Check className="h-3.5 w-3.5 text-amber-700" strokeWidth={3} />
          ) : (
            <span className="text-xs font-serif text-stone-500">{index + 1}</span>
          )}
        </div>
      </div>

      {/* Right content */}
      <div className={`flex-1 ${!isLeft ? 'text-left' : 'md:opacity-0'}`}>
        {!isLeft && (
          <div className="inline-block max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                {milestone.phase}
              </span>
              <StatusBadge status={milestone.status} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-stone-900 mb-2">
              {milestone.title}
            </h3>
            <ul className="space-y-1">
              {milestone.items.map((item, i) => (
                <li key={i} className="text-xs md:text-sm text-stone-600 leading-relaxed font-serif">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F7' }}>
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto max-w-4xl px-6 pt-12 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>

          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.25em] text-stone-500 uppercase font-sans mb-3">
              Our Journey & Vision
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-stone-900 font-normal mb-4">
              The EverAfter Roadmap
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-stone-600 leading-relaxed font-serif">
              From initial vows to digital keepsakes—our continuous evolution in crafting
              timeless wedding experiences.
            </p>
          </div>
        </section>

        {/* Winding Path */}
        <section className="relative mx-auto max-w-5xl px-6 py-16">
          {/* SVG Ribbon Path */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-full max-w-2xl pointer-events-none hidden md:block">
            <svg
              viewBox="0 0 400 1200"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Champagne ribbon body */}
              <path
                d="M 200 0 Q 150 100, 200 200 T 200 400 Q 250 500, 200 600 T 200 800 Q 150 900, 200 1000 T 200 1200"
                fill="none"
                stroke="#D6C7B2"
                strokeWidth="48"
                strokeLinecap="round"
                opacity="0.4"
              />
              {/* Inner delicate line */}
              <path
                d="M 200 0 Q 150 100, 200 200 T 200 400 Q 250 500, 200 600 T 200 800 Q 150 900, 200 1000 T 200 1200"
                fill="none"
                stroke="#92400E"
                strokeWidth="2"
                strokeDasharray="4 6"
                opacity="0.2"
              />
            </svg>
          </div>

          {/* Mobile vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-200/60 md:hidden" />

          {/* Milestones */}
          <div className="relative space-y-16 md:space-y-24">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={milestone.phase} milestone={milestone} index={index} />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-sm text-stone-600 font-serif leading-relaxed mb-6">
            Have a feature request or feedback? We'd love to hear from you.
          </p>
          <Link
            href="/#faq"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Get in Touch
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
