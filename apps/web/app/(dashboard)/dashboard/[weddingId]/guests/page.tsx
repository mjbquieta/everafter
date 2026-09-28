'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { GuestResponse, CreateGuestRequest, UpdateGuestRequest } from '@everafter/types';
import {
  useGuests,
  useGuestSummary,
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
  type GuestQueryParams,
} from '@/lib/hooks/use-guests';
import {
  GuestTable,
  GuestFilters,
  GuestDialog,
  DeleteDialog,
  GuestTableSkeleton,
} from '@/features/guests';

export default function GuestsPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;

  // Filter state
  const [search, setSearch] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [side, setSide] = useState('');
  const [group, setGroup] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GuestResponse | null>(null);

  // Build query params (server-side filters)
  const queryParams: GuestQueryParams = useMemo(() => {
    const p: GuestQueryParams = {};
    if (rsvpStatus) p.rsvpStatus = rsvpStatus;
    if (side) p.side = side;
    if (group) p.group = group;
    return p;
  }, [rsvpStatus, side, group]);

  // Queries
  const { data: guests, isLoading } = useGuests(weddingId, queryParams);
  const { data: summary } = useGuestSummary(weddingId);

  // Mutations
  const createGuest = useCreateGuest(weddingId);
  const updateGuest = useUpdateGuest(weddingId);
  const deleteGuest = useDeleteGuest(weddingId);

  // Client-side search filter
  const filteredGuests = useMemo(() => {
    if (!guests) return [];
    if (!search) return guests;
    const q = search.toLowerCase();
    return guests.filter(
      (g) =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        (g.email && g.email.toLowerCase().includes(q)),
    );
  }, [guests, search]);

  // Extract unique groups for filter dropdown
  const groups = useMemo(() => {
    if (!guests) return [];
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.group) set.add(g.group);
    });
    return Array.from(set).sort();
  }, [guests]);

  const handleOpenCreate = useCallback(() => {
    setEditingGuest(null);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((guest: GuestResponse) => {
    setEditingGuest(guest);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingGuest(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateGuestRequest | UpdateGuestRequest) => {
      if (editingGuest) {
        await updateGuest.mutateAsync({
          guestId: editingGuest.id,
          data: data as UpdateGuestRequest,
        });
      } else {
        await createGuest.mutateAsync(data as CreateGuestRequest);
      }
      handleCloseDialog();
    },
    [editingGuest, createGuest, updateGuest, handleCloseDialog],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteGuest.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteGuest]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Guests</h1>
        </div>
        <GuestTableSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Guests</h1>
        <Button size="sm" onClick={handleOpenCreate}>
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Guest
        </Button>
      </div>

      <div className="space-y-6">
        <GuestFilters
          search={search}
          onSearchChange={setSearch}
          rsvpStatus={rsvpStatus}
          onRsvpStatusChange={setRsvpStatus}
          side={side}
          onSideChange={setSide}
          group={group}
          onGroupChange={setGroup}
          groups={groups}
          summary={summary}
        />

        {filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-16 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {guests?.length === 0 && !search && !rsvpStatus && !side && !group
                ? 'No guests yet'
                : 'No guests match your filters'}
            </h3>
            <p className="mt-1 text-sm text-muted max-w-sm">
              {guests?.length === 0 && !search && !rsvpStatus && !side && !group
                ? 'Start adding the people you want to celebrate with you.'
                : 'Try adjusting your search or filters to find who you\u2019re looking for.'}
            </p>
            {guests?.length === 0 &&
              !search &&
              !rsvpStatus &&
              !side &&
              !group && (
                <Button size="sm" className="mt-4" onClick={handleOpenCreate}>
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Add Guest
                </Button>
              )}
          </div>
        ) : (
          <GuestTable
            guests={filteredGuests}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      <GuestDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        guest={editingGuest}
        isSubmitting={createGuest.isPending || updateGuest.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        guestName={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName}`
            : ''
        }
        isDeleting={deleteGuest.isPending}
      />
    </div>
  );
}
