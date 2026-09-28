import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ChecklistItemResponse,
  ChecklistSummaryResponse,
  CreateChecklistItemRequest,
  UpdateChecklistItemRequest,
} from '@everafter/types';
import { apiFetch } from '../api-client';

const checklistKeys = {
  all: (weddingId: string) => ['weddings', weddingId, 'checklist'] as const,
  items: (weddingId: string) =>
    ['weddings', weddingId, 'checklist', 'items'] as const,
  summary: (weddingId: string) =>
    ['weddings', weddingId, 'checklist', 'summary'] as const,
};

export function useChecklistItems(weddingId: string) {
  return useQuery({
    queryKey: checklistKeys.items(weddingId),
    queryFn: () =>
      apiFetch<ChecklistItemResponse[]>(
        `/weddings/${weddingId}/checklist`,
      ),
    enabled: !!weddingId,
  });
}

export function useChecklistSummary(weddingId: string) {
  return useQuery({
    queryKey: checklistKeys.summary(weddingId),
    queryFn: () =>
      apiFetch<ChecklistSummaryResponse>(
        `/weddings/${weddingId}/checklist/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useCreateChecklistItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChecklistItemRequest) =>
      apiFetch<ChecklistItemResponse>(
        `/weddings/${weddingId}/checklist`,
        { method: 'POST', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: checklistKeys.all(weddingId) });
    },
  });
}

export function useUpdateChecklistItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: UpdateChecklistItemRequest;
    }) =>
      apiFetch<ChecklistItemResponse>(
        `/weddings/${weddingId}/checklist/${itemId}`,
        { method: 'PATCH', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: checklistKeys.all(weddingId) });
    },
  });
}

export function useToggleChecklistItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      completed,
    }: {
      itemId: string;
      completed: boolean;
    }) =>
      apiFetch<ChecklistItemResponse>(
        `/weddings/${weddingId}/checklist/${itemId}`,
        { method: 'PATCH', body: JSON.stringify({ completed }) },
      ),
    onMutate: async ({ itemId, completed }) => {
      await qc.cancelQueries({ queryKey: checklistKeys.items(weddingId) });
      const prev = qc.getQueryData<ChecklistItemResponse[]>(
        checklistKeys.items(weddingId),
      );
      if (prev) {
        qc.setQueryData(
          checklistKeys.items(weddingId),
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  completedAt: completed
                    ? new Date().toISOString()
                    : null,
                }
              : item,
          ),
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(checklistKeys.items(weddingId), ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: checklistKeys.all(weddingId) });
    },
  });
}

export function useDeleteChecklistItem(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      apiFetch<void>(`/weddings/${weddingId}/checklist/${itemId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: checklistKeys.all(weddingId) });
    },
  });
}
