'use client';

import { useMemo } from 'react';
import type { GuestResponse } from '@everafter/types';
import { SectionSkeleton } from './skeleton';

interface RecentRSVPsProps {
  guests?: GuestResponse[];
  isLoading: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ACCEPTED: {
    label: 'Accepted',
    className: 'bg-success/10 text-success',
  },
  DECLINED: {
    label: 'Declined',
    className: 'bg-error/10 text-error',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning',
  },
};

export function RecentRSVPs({ guests, isLoading }: RecentRSVPsProps) {
  const recent = useMemo(() => {
    if (!guests) return [];
    return guests
      .filter((g) => g.rsvp?.respondedAt)
      .sort((a, b) => {
        const dateA = a.rsvp!.respondedAt!;
        const dateB = b.rsvp!.respondedAt!;
        return dateB.localeCompare(dateA);
      })
      .slice(0, 3);
  }, [guests]);

  if (isLoading) return <SectionSkeleton rows={3} />;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Recent RSVPs
      </h3>

      {recent.length === 0 ? (
        <p className="text-sm text-muted">
          No RSVP responses yet. Guests will appear here once they respond.
        </p>
      ) : (
        <ul className="space-y-3">
          {recent.map((guest) => {
            const status = guest.rsvp?.status ?? 'PENDING';
            const cfg = statusConfig[status] ?? statusConfig.PENDING;
            return (
              <li
                key={guest.id}
                className="flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {guest.firstName} {guest.lastName}
                  </p>
                  {guest.rsvp?.respondedAt && (
                    <p className="text-xs text-muted">
                      {new Date(guest.rsvp.respondedAt).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' },
                      )}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.className}`}
                >
                  {cfg.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
