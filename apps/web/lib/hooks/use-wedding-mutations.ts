import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  WeddingResponse,
  CreateWeddingRequest,
  WeddingProfileResponse,
  UpdateWeddingProfileRequest,
} from '@everafter/types';
import { apiFetch } from '../api-client';
import { weddingKeys } from './use-weddings';

export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeddingRequest) =>
      apiFetch<WeddingResponse>('/weddings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weddingKeys.all });
    },
  });
}

export function useUpdateWedding(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch<WeddingResponse>(`/weddings/${weddingId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weddingKeys.all });
    },
  });
}

export function useUpdateWeddingProfile(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWeddingProfileRequest) =>
      apiFetch<WeddingProfileResponse>(
        `/weddings/${weddingId}/profile`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['weddings', weddingId, 'profile'],
        data,
      );
    },
  });
}
