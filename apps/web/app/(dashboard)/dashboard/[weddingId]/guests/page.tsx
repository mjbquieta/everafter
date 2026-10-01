'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  UserPlus,
  Users,
  UserCheck,
  Clock,
  Download,
  Upload,
  UtensilsCrossed,
  LayoutGrid,
  ChevronDown,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@everafter/ui';
import type { GuestResponse, CreateGuestRequest, UpdateGuestRequest, RSVPStatus } from '@everafter/types';
import {
  useGuests,
  useGuestSummary,
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
  type GuestQueryParams,
} from '@/lib/hooks/use-guests';
import { useSubmitRsvp } from '@/lib/hooks/use-rsvp';
import { useWeddingContext } from '@/lib/wedding-context';
import {
  GuestTable,
  GuestFilters,
  GuestDialog,
  DeleteDialog,
  GuestTableSkeleton,
} from '@/features/guests';
import { ImportDialog } from '@/features/guests/import-dialog';

export default function GuestsPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;
  const { activeWedding } = useWeddingContext();

  // Unified filter state
  const [search, setSearch] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [side, setSide] = useState('');
  const [group, setGroup] = useState('');
  const [tableFilter, setTableFilter] = useState('');

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
  const submitRsvp = useSubmitRsvp(weddingId);

  // Unified filter logic
  const filteredGuests = useMemo(() => {
    if (!guests) return [];

    let filtered = guests;

    // Search by name, email, or phone
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
          (g.email && g.email.toLowerCase().includes(q)) ||
          (g.phone && g.phone.toLowerCase().includes(q))
      );
    }

    // Filter by table assignment
    if (tableFilter) {
      if (tableFilter === 'unassigned') {
        filtered = filtered.filter((g) => !g.tableNumber || !g.tableNumber.trim());
      } else {
        filtered = filtered.filter((g) => g.tableNumber === tableFilter);
      }
    }

    return filtered;
  }, [guests, search, tableFilter]);

  // Extract unique values for filters
  const groups = useMemo(() => {
    if (!guests) return [];
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.group) set.add(g.group);
    });
    return Array.from(set).sort();
  }, [guests]);

  const tables = useMemo(() => {
    if (!guests) return [];
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.tableNumber) set.add(g.tableNumber);
    });
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [guests]);

  // Unified metrics
  const metrics = useMemo(() => {
    if (!guests) {
      return {
        attending: 0,
        attendingParty: 0,
        pending: 0,
        declined: 0,
        unassignedTables: 0,
      };
    }

    let attending = 0;
    let attendingParty = 0;
    let pending = 0;
    let declined = 0;
    let unassignedTables = 0;

    guests.forEach((guest) => {
      const status = guest.rsvp?.status;

      if (status === 'ACCEPTED') {
        attending++;
        attendingParty += 1 + (guest.rsvp?.companionCount || 0);
      } else if (status === 'DECLINED') {
        declined++;
      } else if (!status || status === 'PENDING') {
        pending++;
      }

      // Count unassigned tables
      if (!guest.tableNumber || !guest.tableNumber.trim()) {
        unassignedTables++;
      }
    });

    return { attending, attendingParty, pending, declined, unassignedTables };
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

  const handleStatusToggle = useCallback(
    async (guest: GuestResponse, newStatus: RSVPStatus) => {
      try {
        await submitRsvp.mutateAsync({
          guestId: guest.id,
          data: { status: newStatus },
        });
        toast.success(`Updated ${guest.firstName}'s status to ${newStatus}`);
      } catch {
        toast.error('Failed to update RSVP status');
      }
    },
    [submitRsvp]
  );

  const handleExportFullList = useCallback(() => {
    if (!guests) return;

    const csvHeader = 'Name,Email,Phone,Side,Group,Table,RSVP Status,Party Size,Meal Preference,Notes\n';
    const csvRows = guests
      .map((g) => {
        const name = `${g.firstName} ${g.lastName}`;
        const email = g.email || '';
        const phone = g.phone || '';
        const side = g.side || '';
        const group = g.group || '';
        const table = g.tableNumber || 'Unassigned';
        const status = g.rsvp?.status || 'PENDING';
        const partySize = g.rsvp ? 1 + (g.rsvp.companionCount || 0) : 1;
        const meal = g.rsvp?.mealPreference || g.mealPreference || '';
        const notes = (g.rsvp?.notes || g.notes || '').replace(/,/g, ';');
        return `"${name}","${email}","${phone}","${side}","${group}","${table}","${status}",${partySize},"${meal}","${notes}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Guest list exported');
  }, [guests]);

  const handleExportCatering = useCallback(() => {
    if (!guests) return;

    const attendingGuests = guests.filter((g) => g.rsvp?.status === 'ACCEPTED');

    const csvHeader = 'Name,Party Size,Meal Preference,Dietary Notes\n';
    const csvRows = attendingGuests
      .map((g) => {
        const name = `${g.firstName} ${g.lastName}`;
        const partySize = 1 + (g.rsvp?.companionCount || 0);
        const meal = g.rsvp?.mealPreference || g.mealPreference || '';
        const notes = (g.rsvp?.notes || g.notes || '').replace(/,/g, ';');
        return `"${name}",${partySize},"${meal}","${notes}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catering-manifest-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Catering manifest exported');
  }, [guests]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Guests & RSVP</h1>
            <p className="text-sm text-muted mt-1">
              Manage your guest list, attendance, companions, and table seating in one place.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
              <div className="h-20" />
            </div>
          ))}
        </div>
        <GuestTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guests & RSVP</h1>
          <p className="text-sm text-muted mt-1">
            Manage your guest list, attendance, companions, and table seating in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleExportFullList}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4 text-muted" />
                <div>
                  <p className="font-medium text-foreground">Export Full List</p>
                  <p className="text-xs text-muted">All guests with details</p>
                </div>
              </button>
              <button
                onClick={handleExportCatering}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-50 transition-colors flex items-center gap-2 border-t border-border"
              >
                <UtensilsCrossed className="h-4 w-4 text-muted" />
                <div>
                  <p className="font-medium text-foreground">Export Catering Manifest</p>
                  <p className="text-xs text-muted">Attending guests only</p>
                </div>
              </button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button size="sm" onClick={handleOpenCreate}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Unified 4-Card Metric Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{metrics.attending}</p>
            <p className="text-xs text-muted">
              Confirmed attending ({metrics.attendingParty} total party heads)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{metrics.pending}</p>
            <p className="text-xs text-muted">Awaiting response</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <UserX className="h-5 w-5 text-stone-600" />
            <span className="h-2 w-2 rounded-full bg-stone-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{metrics.declined}</p>
            <p className="text-xs text-muted">Declined</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <LayoutGrid className="h-5 w-5 text-stone-600" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{metrics.unassignedTables}</p>
            <p className="text-xs text-muted">Unassigned seating</p>
          </div>
        </div>
      </div>

      {/* Unified Filters */}
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
        slug={activeWedding?.slug}
        onImportClick={() => setImportOpen(true)}
        tableFilter={tableFilter}
        onTableFilterChange={setTableFilter}
        tables={tables}
      />

      {/* Unified Master Table */}
      {filteredGuests.length === 0 ? (
        guests?.length === 0 && !search && !rsvpStatus && !side && !group && !tableFilter ? (
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
          onStatusToggle={handleStatusToggle}
          slug={activeWedding?.slug}
          isUpdatingRsvp={submitRsvp.isPending}
        />
      )}

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
