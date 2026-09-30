'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
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
  GuestSummaryStrip,
} from '@/features/guests';
import { ImportDialog } from '@/features/guests/import-dialog';

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
  const [importOpen, setImportOpen] = useState(false);

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
    try {
      await deleteGuest.mutateAsync(deleteTarget.id);
      toast.success('Guest removed');
    } catch {
      toast.error('Failed to remove guest');
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteGuest]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Guests</h1>
        </div>
        <GuestSummaryStrip isLoading />
        <div className="mt-6">
          <GuestTableSkeleton />
        </div>
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

      <GuestSummaryStrip guests={guests} isLoading={false} />

      <div className="space-y-6 mt-6">
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
          guests={filteredGuests}
          slug={weddingId}
          onImportClick={() => setImportOpen(true)}
        />

        {filteredGuests.length === 0 ? (
          guests?.length === 0 && !search && !rsvpStatus && !side && !group ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white/50 py-16 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 mb-5">
                <Users className="h-7 w-7 text-stone-400" />
              </div>
              <h3 className="font-serif text-xl text-stone-900">No guests yet</h3>
              <p className="mt-2 text-sm text-stone-500 max-w-sm">
                Start building your guest list with the people you want to celebrate with.
              </p>
              <Button size="sm" className="mt-5" onClick={handleOpenCreate}>
                <UserPlus className="h-4 w-4 mr-1.5" />
                Add First Guest
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-12 px-6 text-center">
              <p className="text-sm text-muted">No guests match your filters.</p>
              <p className="mt-1 text-xs text-muted">
                Try adjusting your search or filters to find who you&#39;re looking for.
              </p>
            </div>
          )
        ) : (
          <GuestTable
            guests={filteredGuests}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
            slug={weddingId}
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

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(guest) => createGuest.mutateAsync(guest)}
      />
    </div>
  );
}
