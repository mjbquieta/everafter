'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Plus, DollarSign, Search, X, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@everafter/ui';
import type { BudgetItemResponse, BudgetCategoryResponse } from '@everafter/types';
import {
  useBudgetCategories,
  useBudgetSummary,
  useCreateCategory,
  useDeleteCategory,
  useCreateBudgetItem,
  useUpdateBudgetItem,
  useDeleteBudgetItem,
} from '@/lib/hooks/use-budget';
import {
  BudgetHeader,
  CategoryCard,
  CategoryDialog,
  ItemDialog,
} from '@/features/budget';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

type DeleteTarget =
  | { type: 'category'; id: string; name: string }
  | { type: 'item'; categoryId: string; itemId: string; name: string };

export default function BudgetPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;

  const { data: categories, isLoading } = useBudgetCategories(weddingId);
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary(weddingId);

  const createCategory = useCreateCategory(weddingId);
  const deleteCategory = useDeleteCategory(weddingId);
  const createItem = useCreateBudgetItem(weddingId);
  const updateItem = useUpdateBudgetItem(weddingId);
  const deleteItem = useDeleteBudgetItem(weddingId);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BudgetItemResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const hasActiveFilter = !!(search || paymentFilter);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!hasActiveFilter) return categories;

    const q = search.toLowerCase();

    return categories
      .map((cat) => {
        const matchingItems = cat.items.filter((item) => {
          const matchesSearch =
            !q ||
            (item.vendorName && item.vendorName.toLowerCase().includes(q)) ||
            (item.notes && item.notes.toLowerCase().includes(q)) ||
            cat.name.toLowerCase().includes(q);
          const matchesStatus =
            !paymentFilter || item.paymentStatus === paymentFilter;
          return matchesSearch && matchesStatus;
        });
        return { ...cat, items: matchingItems } as BudgetCategoryResponse;
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, search, paymentFilter, hasActiveFilter]);

  const filterSubtotals = useMemo(() => {
    if (!hasActiveFilter || !filteredCategories) return null;
    let totalEstimated = 0;
    let totalActual = 0;
    let totalPaid = 0;
    let itemCount = 0;
    filteredCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        totalEstimated += item.estimatedCost;
        totalActual += item.actualCost;
        totalPaid += item.amountPaid;
        itemCount++;
      });
    });
    return { totalEstimated, totalActual, totalPaid, itemCount };
  }, [hasActiveFilter, filteredCategories]);

  const handleAddCategory = useCallback(async (name: string) => {
    await createCategory.mutateAsync({ name });
    setCategoryDialogOpen(false);
  }, [createCategory]);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    const cat = categories?.find((c) => c.id === categoryId);
    setDeleteTarget({ type: 'category', id: categoryId, name: cat?.name ?? 'this category' });
  }, [categories]);

  const handleOpenAddItem = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    setEditingItem(null);
    setItemDialogOpen(true);
  }, []);

  const handleOpenEditItem = useCallback((categoryId: string, item: BudgetItemResponse) => {
    setActiveCategoryId(categoryId);
    setEditingItem(item);
    setItemDialogOpen(true);
  }, []);

  const handleDeleteItem = useCallback((categoryId: string, itemId: string) => {
    const cat = categories?.find((c) => c.id === categoryId);
    const item = cat?.items.find((i) => i.id === itemId);
    setDeleteTarget({ type: 'item', categoryId, itemId, name: item?.vendorName || 'this expense' });
  }, [categories]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'category') {
        await deleteCategory.mutateAsync(deleteTarget.id);
        toast.success('Category deleted');
      } else {
        await deleteItem.mutateAsync({ categoryId: deleteTarget.categoryId, itemId: deleteTarget.itemId });
        toast.success('Expense deleted');
      }
    } catch {
      toast.error(deleteTarget.type === 'category' ? 'Failed to delete category' : 'Failed to delete expense');
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteCategory, deleteItem]);

  const handleItemSubmit = useCallback(async (data: Record<string, unknown>) => {
    if (!activeCategoryId) return;
    if (editingItem) {
      await updateItem.mutateAsync({
        categoryId: activeCategoryId,
        itemId: editingItem.id,
        data,
      });
    } else {
      await createItem.mutateAsync({ categoryId: activeCategoryId, data });
    }
    setItemDialogOpen(false);
    setEditingItem(null);
  }, [activeCategoryId, editingItem, createItem, updateItem]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Budget</h1>
        </div>
        <BudgetHeader isLoading />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-6">
              <div className="h-5 w-32 bg-border/60 rounded animate-pulse mb-3" />
              <div className="h-1.5 w-full bg-border/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Budget</h1>
        <div className="flex items-center gap-2 print:hidden">
          {categories && categories.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </Button>
          )}
          <Button size="sm" onClick={() => setCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Category
          </Button>
        </div>
      </div>

      <BudgetHeader summary={summary} isLoading={summaryLoading} />

      {/* Filters */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search by vendor, notes, or category..."
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
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Payment Status"
            className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PENDING">Unpaid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      )}

      {!categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white/50 py-16 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 mb-5">
            <DollarSign className="h-7 w-7 text-stone-400" />
          </div>
          <h3 className="font-serif text-xl text-stone-900">No expenses yet</h3>
          <p className="mt-2 text-sm text-stone-500 max-w-sm">
            Add a category like Venue, Catering, or Photography to start tracking your wedding budget.
          </p>
          <Button size="sm" className="mt-5" onClick={() => setCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Your First Category
          </Button>
        </div>
      ) : filteredCategories.length === 0 && hasActiveFilter ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-12 px-6 text-center">
          <p className="text-sm text-muted">No expenses match your filter.</p>
          <button
            onClick={() => { setSearch(''); setPaymentFilter(''); }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onAddItem={handleOpenAddItem}
              onEditItem={handleOpenEditItem}
              onDeleteItem={handleDeleteItem}
              onDeleteCategory={handleDeleteCategory}
              forceExpanded={hasActiveFilter ? true : undefined}
            />
          ))}

          {filterSubtotals && (
            <div className="text-xs text-stone-500 bg-stone-100/60 rounded-lg p-2.5 flex justify-between items-center">
              <span>
                Showing <span className="font-medium text-stone-700">{filterSubtotals.itemCount}</span> matching expense{filterSubtotals.itemCount !== 1 ? 's' : ''}
              </span>
              <span>
                Total: <span className="font-semibold text-stone-800">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(filterSubtotals.totalActual)}</span>
                {' · '}
                <span className="font-medium text-stone-700">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(filterSubtotals.totalPaid)}</span> paid
              </span>
            </div>
          )}
        </div>
      )}

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSubmit={handleAddCategory}
        isSubmitting={createCategory.isPending}
      />

      <ItemDialog
        open={itemDialogOpen}
        onClose={() => { setItemDialogOpen(false); setEditingItem(null); }}
        onSubmit={handleItemSubmit}
        item={editingItem}
        isSubmitting={createItem.isPending || updateItem.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'category' ? 'Delete Category?' : 'Delete Expense?'}
        itemName={deleteTarget?.name ?? ''}
        description={
          deleteTarget?.type === 'category'
            ? 'All expenses in this category will also be removed.'
            : undefined
        }
        isDeleting={deleteCategory.isPending || deleteItem.isPending}
      />
    </div>
  );
}
