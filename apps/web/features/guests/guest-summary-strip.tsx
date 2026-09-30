import { Users, Clock, Utensils, LayoutGrid } from 'lucide-react';
import type { GuestResponse } from '@everafter/types';

interface Metric {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: Metric) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted">{icon}</span>
        <p className="text-xs text-muted">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="h-3 w-24 bg-border/60 rounded animate-pulse mb-2" />
      <div className="h-6 w-12 bg-border/60 rounded animate-pulse" />
    </div>
  );
}

export function GuestSummaryStrip({
  guests,
  isLoading,
}: {
  guests?: GuestResponse[];
  isLoading: boolean;
}) {
  if (isLoading || !guests) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const attending = guests.reduce((sum, g) => {
    if (g.rsvp?.status === 'ACCEPTED') {
      return sum + 1 + (g.rsvp.companionCount ?? 0);
    }
    return sum;
  }, 0);

  const pending = guests.filter(
    (g) => !g.rsvp || g.rsvp.status === 'PENDING',
  ).length;

  const dietary = guests.filter(
    (g) =>
      (g.rsvp?.notes && g.rsvp.notes.trim()) ||
      (g.notes && g.notes.trim()),
  ).length;

  const unassigned = guests.filter(
    (g) =>
      (!g.tableNumber || !g.tableNumber.trim()) &&
      (!g.rsvp || g.rsvp.status !== 'DECLINED'),
  ).length;

  const metrics: Metric[] = [
    {
      label: 'Confirmed Attending',
      value: attending,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Awaiting Response',
      value: pending,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Dietary Notes',
      value: dietary,
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      label: 'Unassigned Tables',
      value: unassigned,
      icon: <LayoutGrid className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
