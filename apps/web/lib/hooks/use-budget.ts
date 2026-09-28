import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  BudgetCategoryResponse,
  BudgetSummaryResponse,
  BudgetItemResponse,
  CreateBudgetCategoryRequest,
  CreateBudgetItemRequest,
  UpdateBudgetItemRequest,
} from '@everafter/types';
import { apiFetch } from '../api-client';

const budgetKeys = {
  all: (weddingId: string) => ['weddings', weddingId, 'budget'] as const,
  categories: (weddingId: string) =>
    ['weddings', weddingId, 'budget', 'categories'] as const,
  summary: (weddingId: string) =>
    ['weddings', weddingId, 'budget', 'summary'] as const,
};

export function useBudgetCategories(weddingId: string) {
  return useQuery({
    queryKey: budgetKeys.categories(weddingId),
    queryFn: () =>
      apiFetch<BudgetCategoryResponse[]>(
        `/weddings/${weddingId}/budget/categories`,
      ),
    enabled: !!weddingId,
  });
}

export function useBudgetSummary(weddingId: string) {
  return useQuery({
    queryKey: budgetKeys.summary(weddingId),
    queryFn: () =>
      apiFetch<BudgetSummaryResponse>(
        `/weddings/${weddingId}/budget/categories/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useCreateCategory(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetCategoryRequest) =>
      apiFetch<BudgetCategoryResponse>(
        `/weddings/${weddingId}/budget/categories`,
        { method: 'POST', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.all(weddingId) });
    },
  });
}

export function useDeleteCategory(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) =>
      apiFetch<void>(
        `/weddings/${weddingId}/budget/categories/${categoryId}`,
        { method: 'DELETE' },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.all(weddingId) });
    },
  });
}

export function useCreateBudgetItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: CreateBudgetItemRequest;
    }) =>
      apiFetch<BudgetItemResponse>(
        `/weddings/${weddingId}/budget/categories/${categoryId}/items`,
        { method: 'POST', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.all(weddingId) });
    },
  });
}

export function useUpdateBudgetItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      itemId,
      data,
    }: {
      categoryId: string;
      itemId: string;
      data: UpdateBudgetItemRequest;
    }) =>
      apiFetch<BudgetItemResponse>(
        `/weddings/${weddingId}/budget/categories/${categoryId}/items/${itemId}`,
        { method: 'PATCH', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.all(weddingId) });
    },
  });
}

export function useDeleteBudgetItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      itemId,
    }: {
      categoryId: string;
      itemId: string;
    }) =>
      apiFetch<void>(
        `/weddings/${weddingId}/budget/categories/${categoryId}/items/${itemId}`,
        { method: 'DELETE' },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.all(weddingId) });
    },
  });
}
