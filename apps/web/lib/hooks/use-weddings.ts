import { useQuery } from '@tanstack/react-query';
import type { WeddingResponse } from '@everafter/types';
import { apiFetch } from '../api-client';

export const weddingKeys = {
  all: ['weddings'] as const,
  detail: (id: string) => ['weddings', id] as const,
};

export function useWeddings() {
  return useQuery({
    queryKey: weddingKeys.all,
    queryFn: () => apiFetch<WeddingResponse[]>('/weddings'),
  });
}

export function useWedding(id: string) {
  return useQuery({
    queryKey: weddingKeys.detail(id),
    queryFn: () => apiFetch<WeddingResponse>(`/weddings/${id}`),
    enabled: !!id,
  });
}
