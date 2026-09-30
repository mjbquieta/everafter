import type { Metadata } from 'next';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'Roadmap | EverAfter',
  description:
    'See what we have shipped, what we are building, and what is coming next for EverAfter.',
};

interface RoadmapItem {
  title: string;
  description: string;
}

interface Column {
  status: string;
  icon: React.ReactNode;
  color: string;
  items: RoadmapItem[];
}

const columns: Column[] = [
  {
    status: 'Shipped',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-emerald-600',
    items: [
      {
        title: 'Guest Management CRM',
        description:
          'CSV import/export, dietary stats, table tracking, and seating summary.',
      },
      {
        title: 'Interactive Website Customizer',
        description:
          'Path-based public wedding sites with live preview and slug editor.',
      },
      {
        title: 'Multi-Theme Engine',
        description:
          'Classic, Magazine, and Editorial layouts with custom colors, fonts, and dividers.',
      },
      {
        title: 'Budget Planner',
        description:
          'Full expense tracking with PHP (₱) currency, payment status filters, and print export.',
      },
      {
        title: 'Interactive Wedding Checklist',
        description:
          'Priority-sorted tasks with search, filters, and printable checklists.',
      },
      {
        title: 'Calendar Integration',
        description:
          'Add-to-calendar buttons for Google Calendar and .ics file downloads.',
      },
      {
        title: 'FAQ & Day-of Programme',
        description:
          'Accordion FAQ section and vertical timeline for wedding-day events.',
      },
    ],
  },
  {
    status: 'In Progress',
    icon: <Clock className="h-5 w-5" />,
    color: 'text-amber-600',
    items: [
      {
        title: 'Background Music & Audio Player',
        description:
          'Ambient audio player for wedding websites with autoplay and track controls.',
      },
      {
        title: 'Prenup Photo Gallery',
        description:
          'Lightbox photo albums with masonry grid and full-screen viewer.',
      },
    ],
  },
  {
    status: 'Planned',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-violet-600',
    items: [
      {
        title: 'Drag-and-Drop Seating Chart',
        description:
          'Visual table builder with drag-and-drop guest placement.',
      },
      {
        title: 'Command Menu & Keyboard Shortcuts',
        description:
          'Quick navigation with \u2318K / Ctrl+K command palette.',
      },
      {
        title: 'Automated RSVP Confirmation Emails',
        description:
          'Send branded confirmation emails via Resend when guests respond.',
      },
      {
        title: 'Multi-client Coordinator Hub',
        description:
          'Manage multiple weddings from a single coordinator dashboard.',
      },
    ],
  },
];

function RoadmapCard({ title, description }: RoadmapItem) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F7' }}>
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
          <p className="tracking-[0.2em] uppercase text-xs text-neutral-500 font-semibold mb-3">
            Product Roadmap
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
            Building the Future of EverAfter
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-500 leading-relaxed">
            Every feature we build is shaped by couples and coordinators who trust us
            with their most important day. Here is what we have shipped, what we are
            working on, and where we are headed next.
          </p>
        </section>

        {/* Columns */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.status}>
                <div className={`flex items-center gap-2 mb-4 ${col.color}`}>
                  {col.icon}
                  <h2 className="text-sm font-bold uppercase tracking-wide">
                    {col.status}
                  </h2>
                  <span className="ml-auto rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-medium">
                    {col.items.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {col.items.map((item) => (
                    <RoadmapCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
