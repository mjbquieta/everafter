'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, CheckSquare, Search, X, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@everafter/ui';
import type { ChecklistItemResponse, CreateChecklistItemRequest, UpdateChecklistItemRequest } from '@everafter/types';
import {
  useChecklistItems,
  useChecklistSummary,
  useCreateChecklistItem,
  useUpdateChecklistItem,
  useToggleChecklistItem,
  useDeleteChecklistItem,
} from '@/lib/hooks/use-checklist';
import { ChecklistHeader, TaskItem, TaskDialog } from '@/features/checklist';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

type FilterTab = 'all' | 'pending' | 'completed';

export default function ChecklistPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;

  const { data: items, isLoading } = useChecklistItems(weddingId);
  const { data: summary, isLoading: summaryLoading } = useChecklistSummary(weddingId);

  const createItem = useCreateChecklistItem(weddingId);
  const updateItem = useUpdateChecklistItem(weddingId);
  const toggleItem = useToggleChecklistItem(weddingId);
  const deleteItem = useDeleteChecklistItem(weddingId);

  const [filter, setFilter] = useState<FilterTab>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItemResponse | null>(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ChecklistItemResponse | null>(null);

  const hasActiveFilter = !!(search || priorityFilter);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    let result = items;

    // Status tab filter
    switch (filter) {
      case 'pending':
        result = result.filter((i) => !i.completedAt);
        break;
      case 'completed':
        result = result.filter((i) => !!i.completedAt);
        break;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)),
      );
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter((i) => i.priority === priorityFilter);
    }

    return result;
  }, [items, filter, search, priorityFilter]);

  // Group by priority then sort by due date
  const sortedItems = useMemo(() => {
    const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return [...filteredItems].sort((a, b) => {
      // Completed items go to the bottom
      if (!!a.completedAt !== !!b.completedAt) return a.completedAt ? 1 : -1;
      const pa = priorityOrder[a.priority] ?? 1;
      const pb = priorityOrder[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [filteredItems]);

  const handleToggle = useCallback(
    (itemId: string, completed: boolean) => {
      toggleItem.mutate({ itemId, completed });
    },
    [toggleItem],
  );

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item: ChecklistItemResponse) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    (itemId: string) => {
      const target = items?.find((i) => i.id === itemId);
      if (target) setDeleteTarget(target);
    },
    [items],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem.mutateAsync(deleteTarget.id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteItem]);

  const handleSubmit = useCallback(
    async (data: CreateChecklistItemRequest | UpdateChecklistItemRequest) => {
      if (editingItem) {
        await updateItem.mutateAsync({
          itemId: editingItem.id,
          data: data as UpdateChecklistItemRequest,
        });
      } else {
        await createItem.mutateAsync(data as CreateChecklistItemRequest);
      }
      setDialogOpen(false);
      setEditingItem(null);
    },
    [editingItem, createItem, updateItem],
  );

  // Counts that respect search/priority filters but not the status tab
  const baseFiltered = useMemo(() => {
    if (!items) return [];
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)),
      );
    }
    if (priorityFilter) {
      result = result.filter((i) => i.priority === priorityFilter);
    }
    return result;
  }, [items, search, priorityFilter]);

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: baseFiltered.length },
    { key: 'pending', label: 'Pending', count: baseFiltered.filter((i) => !i.completedAt).length },
    { key: 'completed', label: 'Completed', count: baseFiltered.filter((i) => !!i.completedAt).length },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Checklist</h1>
        </div>
        <ChecklistHeader isLoading />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-border/60 animate-pulse" />
                <div className="h-4 flex-1 bg-border/60 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Checklist</h1>
        <div className="flex items-center gap-2 print:hidden">
          {items && items.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </Button>
          )}
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="print:hidden">
        <ChecklistHeader summary={summary} isLoading={summaryLoading} />
      </div>

      {/* Search & priority filter */}
      {items && items.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Priority"
            className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border print:hidden">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs">({tab.count})</span>
          </button>
        ))}
      </div>

      {sortedItems.length === 0 ? (
        hasActiveFilter ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-12 px-6 text-center">
            <p className="text-sm text-muted">No tasks match your filter.</p>
            <button
              onClick={() => { setSearch(''); setPriorityFilter(''); }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white/50 py-16 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 mb-5">
              <CheckSquare className="h-7 w-7 text-stone-400" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="mt-2 text-sm text-stone-500 max-w-sm">
              {filter === 'all'
                ? 'Start planning your big day by adding the first task to your checklist.'
                : `You don\u2019t have any ${filter} tasks at the moment.`}
            </p>
            {filter === 'all' && (
              <Button size="sm" className="mt-5" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create First Task
              </Button>
            )}
          </div>
        )
      ) : (
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <TaskItem
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingItem(null); }}
        onSubmit={handleSubmit}
        item={editingItem}
        isSubmitting={createItem.isPending || updateItem.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task?"
        itemName={deleteTarget?.title ?? ''}
        isDeleting={deleteItem.isPending}
      />
    </div>
  );
}
