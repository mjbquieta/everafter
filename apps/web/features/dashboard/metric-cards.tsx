'use client';

import {
  Users,
  Mail,
  DollarSign,
  CheckSquare,
} from 'lucide-react';
import type {
  GuestSummaryResponse,
  BudgetSummaryResponse,
  ChecklistSummaryResponse,
} from '@everafter/types';
import { MetricCardSkeleton } from './skeleton';

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-border/60">
      <div
        className="h-1.5 rounded-full bg-primary transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function MetricCard({ icon, title, children }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-medium text-muted">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function GuestsCard({
  data,
  isLoading,
}: {
  data?: GuestSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading) return <MetricCardSkeleton />;

  if (!data || data.totalGuests === 0) {
    return (
      <MetricCard icon={<Users className="h-4 w-4" />} title="Guests">
        <p className="text-2xl font-bold text-foreground">0</p>
        <p className="text-xs text-muted mt-1">No guests added yet</p>
      </MetricCard>
    );
  }

  return (
    <MetricCard icon={<Users className="h-4 w-4" />} title="Guests">
      <p className="text-2xl font-bold text-foreground">
        {data.totalAttending}
      </p>
      <div className="mt-2 space-y-1 text-xs text-muted">
        <p>{data.totalGuests} invited &middot; {data.rsvpAccepted} confirmed</p>
        <p>{data.rsvpDeclined} declined &middot; {data.rsvpPending} pending</p>
      </div>
    </MetricCard>
  );
}

export function RSVPCard({
  data,
  isLoading,
}: {
  data?: GuestSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading) return <MetricCardSkeleton />;

  const responded = data
    ? data.totalGuests > 0
      ? Math.round(
          ((data.rsvpAccepted + data.rsvpDeclined) / data.totalGuests) * 100,
        )
      : 0
    : 0;

  if (!data || data.totalGuests === 0) {
    return (
      <MetricCard icon={<Mail className="h-4 w-4" />} title="RSVP Progress">
        <p className="text-2xl font-bold text-foreground">0%</p>
        <p className="text-xs text-muted mt-1">No responses yet</p>
      </MetricCard>
    );
  }

  return (
    <MetricCard icon={<Mail className="h-4 w-4" />} title="RSVP Progress">
      <p className="text-2xl font-bold text-foreground">{responded}%</p>
      <div className="mt-2">
        <ProgressBar value={responded} />
      </div>
      <p className="text-xs text-muted mt-1.5">
        {data.rsvpAccepted + data.rsvpDeclined} of {data.totalGuests} responded
      </p>
    </MetricCard>
  );
}

export function BudgetCard({
  data,
  isLoading,
}: {
  data?: BudgetSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading) return <MetricCardSkeleton />;

  if (!data || data.totalEstimated === 0) {
    return (
      <MetricCard
        icon={<DollarSign className="h-4 w-4" />}
        title="Budget"
      >
        <p className="text-2xl font-bold text-foreground">{formatCurrency(0)}</p>
        <p className="text-xs text-muted mt-1">No budget set yet</p>
      </MetricCard>
    );
  }

  const remaining = data.totalEstimated - data.totalActual;

  return (
    <MetricCard icon={<DollarSign className="h-4 w-4" />} title="Budget">
      <p className="text-2xl font-bold text-foreground">
        {formatCurrency(data.totalActual)}
      </p>
      <div className="mt-2 space-y-1 text-xs text-muted">
        <p>Estimated: {formatCurrency(data.totalEstimated)}</p>
        <p>
          Remaining:{' '}
          <span className={remaining < 0 ? 'text-error' : ''}>
            {formatCurrency(remaining)}
          </span>
        </p>
      </div>
    </MetricCard>
  );
}

export function ChecklistCard({
  data,
  isLoading,
}: {
  data?: ChecklistSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading) return <MetricCardSkeleton />;

  const pct =
    data && data.totalItems > 0
      ? Math.round((data.completedItems / data.totalItems) * 100)
      : 0;

  if (!data || data.totalItems === 0) {
    return (
      <MetricCard
        icon={<CheckSquare className="h-4 w-4" />}
        title="Checklist"
      >
        <p className="text-2xl font-bold text-foreground">0%</p>
        <p className="text-xs text-muted mt-1">No tasks added yet</p>
      </MetricCard>
    );
  }

  return (
    <MetricCard
      icon={<CheckSquare className="h-4 w-4" />}
      title="Checklist"
    >
      <p className="text-2xl font-bold text-foreground">{pct}%</p>
      <div className="mt-2">
        <ProgressBar value={pct} />
      </div>
      <p className="text-xs text-muted mt-1.5">
        {data.completedItems} of {data.totalItems} tasks done
      </p>
    </MetricCard>
  );
}
