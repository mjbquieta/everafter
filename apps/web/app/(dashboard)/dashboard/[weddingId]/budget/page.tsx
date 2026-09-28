'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { BudgetItemResponse } from '@everafter/types';
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

  const handleAddCategory = useCallback(async (name: string) => {
    await createCategory.mutateAsync({ name });
    setCategoryDialogOpen(false);
  }, [createCategory]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    await deleteCategory.mutateAsync(categoryId);
  }, [deleteCategory]);

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

  const handleDeleteItem = useCallback(async (categoryId: string, itemId: string) => {
    if (!confirm('Delete this expense?')) return;
    await deleteItem.mutateAsync({ categoryId, itemId });
  }, [deleteItem]);

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
        <Button size="sm" onClick={() => setCategoryDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      <BudgetHeader summary={summary} isLoading={summaryLoading} />

      {!categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-16 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No budget categories yet</h3>
          <p className="mt-1 text-sm text-muted max-w-sm">
            Create categories like Venue, Catering, or Photography to start tracking your wedding expenses.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Category
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onAddItem={handleOpenAddItem}
              onEditItem={handleOpenEditItem}
              onDeleteItem={handleDeleteItem}
              onDeleteCategory={handleDeleteCategory}
            />
          ))}
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
    </div>
  );
}
