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
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
  },
  DECLINED: {
    label: 'Declined',
    className: 'bg-stone-100 text-stone-600',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-stone-100 text-stone-500',
  },
};

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
          No RSVPs received yet. Share your website link to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {recent.map((guest) => {
            const status = guest.rsvp?.status ?? 'PENDING';
            const cfg = statusConfig[status] ?? statusConfig.PENDING;
            const companionCount = guest.rsvp?.companionCount ?? 0;
            const partySize = 1 + companionCount;

            return (
              <li
                key={guest.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">
                    {guest.firstName} {guest.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {guest.rsvp?.respondedAt && (
                      <p className="text-xs text-muted">
                        {getRelativeTime(guest.rsvp.respondedAt)}
                      </p>
                    )}
                    {partySize > 1 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-stone-500">
                          {companionCount === 1
                            ? '+1 Guest'
                            : `Party of ${partySize}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
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
