'use client';

import { useState, useRef } from 'react';
import { MoreHorizontal, Pencil, Trash2, UtensilsCrossed } from 'lucide-react';
import type { GuestResponse } from '@everafter/types';

interface GuestTableProps {
  guests: GuestResponse[];
  onEdit: (guest: GuestResponse) => void;
  onDelete: (guest: GuestResponse) => void;
}

const rsvpConfig: Record<string, { label: string; className: string }> = {
  ACCEPTED: { label: 'Accepted', className: 'bg-success/10 text-success' },
  DECLINED: { label: 'Declined', className: 'bg-error/10 text-error' },
  PENDING: { label: 'Pending', className: 'bg-warning/10 text-warning' },
};

function RsvpBadge({ status }: { status: string }) {
  const cfg = rsvpConfig[status] ?? { label: 'No RSVP', className: 'bg-border/40 text-muted' };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function SideBadge({ side }: { side: string | null }) {
  if (!side) return <span className="text-muted">—</span>;
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
      {side}
    </span>
  );
}

function GroupBadge({ group }: { group: string | null }) {
  if (!group) return <span className="text-muted">—</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
      {group}
    </span>
  );
}

function ActionsMenu({
  guest,
  onEdit,
  onDelete,
}: {
  guest: GuestResponse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 80;

      setPosition({
        top: spaceBelow < menuHeight ? rect.top - menuHeight : rect.bottom + 4,
        left: rect.right - 144,
      });
    }
    setOpen(!open);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary/5 hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed z-50 w-36 rounded-md border border-border bg-surface py-1 shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-error hover:bg-error/5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

export function GuestTable({ guests, onEdit, onDelete }: GuestTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-4 py-3 text-left font-medium text-muted">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Contact
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Side
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Group
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Table
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                RSVP
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Companions
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">
                Meal
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="border-b border-border last:border-0 hover:bg-primary/[0.02] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                  {guest.firstName} {guest.lastName}
                </td>
                <td className="px-4 py-3 text-muted">
                  <div className="space-y-0.5">
                    {guest.email && (
                      <p className="truncate max-w-[180px]">{guest.email}</p>
                    )}
                    {guest.phone && <p>{guest.phone}</p>}
                    {!guest.email && !guest.phone && '—'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SideBadge side={guest.side} />
                </td>
                <td className="px-4 py-3">
                  <GroupBadge group={guest.group} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {guest.tableNumber ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <RsvpBadge status={guest.rsvp?.status ?? 'NO_RSVP'} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {guest.rsvp ? guest.rsvp.companionCount : '—'}
                </td>
                <td className="px-4 py-3">
                  {guest.mealPreference ? (
                    <span
                      className="inline-flex items-center gap-1 text-xs text-muted"
                      title={guest.mealPreference}
                    >
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[80px]">
                        {guest.mealPreference}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu
                    guest={guest}
                    onEdit={() => onEdit(guest)}
                    onDelete={() => onDelete(guest)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {guest.firstName} {guest.lastName}
                </p>
                {guest.email && (
                  <p className="text-xs text-muted mt-0.5">{guest.email}</p>
                )}
              </div>
              <ActionsMenu
                guest={guest}
                onEdit={() => onEdit(guest)}
                onDelete={() => onDelete(guest)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <RsvpBadge status={guest.rsvp?.status ?? 'NO_RSVP'} />
              <SideBadge side={guest.side} />
              <GroupBadge group={guest.group} />
              {guest.tableNumber && (
                <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
                  {guest.tableNumber}
                </span>
              )}
            </div>
            {guest.rsvp && guest.rsvp.companionCount > 0 && (
              <p className="mt-2 text-xs text-muted">
                +{guest.rsvp.companionCount} companion
                {guest.rsvp.companionCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
