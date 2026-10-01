'use client';

import { useState, useRef } from 'react';
import { MoreHorizontal, Pencil, Trash2, UtensilsCrossed, Link2, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { GuestResponse, RSVPStatus } from '@everafter/types';

interface GuestTableProps {
  guests: GuestResponse[];
  onEdit: (guest: GuestResponse) => void;
  onDelete: (guest: GuestResponse) => void;
  onStatusToggle: (guest: GuestResponse, status: RSVPStatus) => void;
  isUpdatingRsvp: boolean;
  slug?: string;
}

function RsvpStatusCell({
  guest,
  onStatusToggle,
  isUpdating,
}: {
  guest: GuestResponse;
  onStatusToggle: (status: RSVPStatus) => void;
  isUpdating: boolean;
}) {
  const status = guest.rsvp?.status || 'PENDING';

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          status === 'ACCEPTED'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : status === 'DECLINED'
              ? 'bg-stone-100 text-stone-600 border border-stone-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}
      >
        {status === 'ACCEPTED' ? (
          <Check className="h-3 w-3" />
        ) : status === 'DECLINED' ? (
          <X className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {status === 'ACCEPTED' ? 'Attending' : status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
      <div className="flex items-center gap-0.5">
        {status !== 'ACCEPTED' && (
          <button
            onClick={() => onStatusToggle('ACCEPTED')}
            disabled={isUpdating}
            className="p-1 rounded hover:bg-emerald-50 text-emerald-600 transition-colors disabled:opacity-50"
            title="Mark as Attending"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        {status !== 'DECLINED' && (
          <button
            onClick={() => onStatusToggle('DECLINED')}
            disabled={isUpdating}
            className="p-1 rounded hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-50"
            title="Mark as Declined"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {status !== 'PENDING' && (
          <button
            onClick={() => onStatusToggle('PENDING')}
            disabled={isUpdating}
            className="p-1 rounded hover:bg-amber-50 text-amber-600 transition-colors disabled:opacity-50"
            title="Mark as Pending"
          >
            <Clock className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}


function ActionsMenu({
  guest,
  onEdit,
  onDelete,
  onCopyLink,
}: {
  guest: GuestResponse;
  onEdit: () => void;
  onDelete: () => void;
  onCopyLink?: () => void;
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
        left: rect.right - 176,
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
            className="fixed z-50 w-44 rounded-md border border-border bg-surface py-1 shadow-lg"
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
            {onCopyLink && (
              <button
                onClick={() => {
                  setOpen(false);
                  onCopyLink();
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                Copy RSVP Link
              </button>
            )}
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

export function GuestTable({ guests, onEdit, onDelete, onStatusToggle, isUpdatingRsvp, slug }: GuestTableProps) {
  const handleCopyLink = async () => {
    if (!slug) return;
    const url = `${window.location.origin}/${slug}#rsvp`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts (e.g. localhost over HTTP)
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success('RSVP link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-stone-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Guest & Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Side & Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Table
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Party Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                RSVP Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Meal / Dietary
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guests.map((guest) => {
              const partySize = guest.rsvp ? 1 + (guest.rsvp.companionCount || 0) : 1;
              const mealInfo = guest.rsvp?.mealPreference || guest.mealPreference;
              const dietaryNotes = guest.rsvp?.notes || guest.notes;
              const displayMeal = mealInfo || dietaryNotes;

              return (
                <tr
                  key={guest.id}
                  className="hover:bg-stone-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground whitespace-nowrap">
                      {guest.firstName} {guest.lastName}
                    </p>
                    {guest.email && (
                      <p className="text-xs text-muted mt-0.5 truncate max-w-[200px]">
                        {guest.email}
                      </p>
                    )}
                    {guest.phone && (
                      <p className="text-xs text-muted mt-0.5">{guest.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {guest.side && (
                        <span className="text-sm text-foreground">{guest.side}</span>
                      )}
                      {guest.group && (
                        <span className="text-xs text-muted">· {guest.group}</span>
                      )}
                      {!guest.side && !guest.group && <span className="text-muted">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {guest.tableNumber ? (
                      <span className="inline-flex items-center rounded-md border border-border bg-stone-50 px-2 py-1 text-xs font-medium text-foreground">
                        {guest.tableNumber}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{partySize}</span>
                    {guest.rsvp && guest.rsvp.companionCount > 0 && (
                      <span className="text-xs text-muted ml-1">
                        (+{guest.rsvp.companionCount})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <RsvpStatusCell
                      guest={guest}
                      onStatusToggle={(status) => onStatusToggle(guest, status)}
                      isUpdating={isUpdatingRsvp}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {displayMeal ? (
                      <div className="max-w-xs">
                        {mealInfo && (
                          <p className="text-sm text-foreground truncate">{mealInfo}</p>
                        )}
                        {dietaryNotes && (
                          <p className="text-xs text-muted mt-0.5 truncate" title={dietaryNotes}>
                            {dietaryNotes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ActionsMenu
                      guest={guest}
                      onEdit={() => onEdit(guest)}
                      onDelete={() => onDelete(guest)}
                      onCopyLink={slug ? handleCopyLink : undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {guests.map((guest) => {
          const partySize = guest.rsvp ? 1 + (guest.rsvp.companionCount || 0) : 1;
          const mealInfo = guest.rsvp?.mealPreference || guest.mealPreference;
          const dietaryNotes = guest.rsvp?.notes || guest.notes;

          return (
            <div
              key={guest.id}
              className="rounded-lg border border-border bg-white p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">
                    {guest.firstName} {guest.lastName}
                  </p>
                  {guest.email && (
                    <p className="text-xs text-muted mt-0.5">{guest.email}</p>
                  )}
                  {guest.phone && (
                    <p className="text-xs text-muted mt-0.5">{guest.phone}</p>
                  )}
                </div>
                <ActionsMenu
                  guest={guest}
                  onEdit={() => onEdit(guest)}
                  onDelete={() => onDelete(guest)}
                  onCopyLink={slug ? handleCopyLink : undefined}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted">Side & Group:</span>
                  <span className="text-foreground">
                    {guest.side || '—'}
                    {guest.group && ` · ${guest.group}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted">Table:</span>
                  {guest.tableNumber ? (
                    <span className="inline-flex items-center rounded-md border border-border bg-stone-50 px-2 py-0.5 text-xs font-medium">
                      {guest.tableNumber}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Unassigned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted">Party Size:</span>
                  <span className="text-foreground">
                    {partySize}
                    {guest.rsvp && guest.rsvp.companionCount > 0 && ` (+${guest.rsvp.companionCount})`}
                  </span>
                </div>

                <div className="pt-2">
                  <RsvpStatusCell
                    guest={guest}
                    onStatusToggle={(status) => onStatusToggle(guest, status)}
                    isUpdating={isUpdatingRsvp}
                  />
                </div>

                {(mealInfo || dietaryNotes) && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted mb-1">Meal / Dietary:</p>
                    {mealInfo && (
                      <p className="text-sm text-foreground">{mealInfo}</p>
                    )}
                    {dietaryNotes && (
                      <p className="text-xs text-muted mt-1">{dietaryNotes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
