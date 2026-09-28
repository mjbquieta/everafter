'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, CheckSquare } from 'lucide-react';
import { Button } from '@everafter/ui';
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

  const filteredItems = useMemo(() => {
    if (!items) return [];
    switch (filter) {
      case 'pending':
        return items.filter((i) => !i.completedAt);
      case 'completed':
        return items.filter((i) => !!i.completedAt);
      default:
        return items;
    }
  }, [items, filter]);

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
    async (itemId: string) => {
      if (!confirm('Delete this task?')) return;
      await deleteItem.mutateAsync(itemId);
    },
    [deleteItem],
  );

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

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: items?.length ?? 0 },
    { key: 'pending', label: 'Pending', count: items?.filter((i) => !i.completedAt).length ?? 0 },
    { key: 'completed', label: 'Completed', count: items?.filter((i) => !!i.completedAt).length ?? 0 },
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
        <Button size="sm" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      <ChecklistHeader summary={summary} isLoading={summaryLoading} />

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border">
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-16 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="mt-1 text-sm text-muted max-w-sm">
            {filter === 'all'
              ? 'Create your first task to start tracking your wedding planning progress.'
              : `You don\u2019t have any ${filter} tasks at the moment.`}
          </p>
          {filter === 'all' && (
            <Button size="sm" className="mt-4" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Task
            </Button>
          )}
        </div>
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
    </div>
  );
}
