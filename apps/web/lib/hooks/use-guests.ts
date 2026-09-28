import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  GuestResponse,
  GuestSummaryResponse,
  CreateGuestRequest,
  UpdateGuestRequest,
} from '@everafter/types';
import { apiFetch } from '../api-client';

export interface GuestQueryParams {
  group?: string;
  side?: string;
  rsvpStatus?: string;
}

export const guestKeys = {
  all: (weddingId: string) => ['weddings', weddingId, 'guests'] as const,
  list: (weddingId: string, params?: GuestQueryParams) =>
    ['weddings', weddingId, 'guests', 'list', params ?? {}] as const,
  summary: (weddingId: string) =>
    ['weddings', weddingId, 'guests', 'summary'] as const,
};

export function useGuests(weddingId: string, params?: GuestQueryParams) {
  return useQuery({
    queryKey: guestKeys.list(weddingId, params),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.group) searchParams.set('group', params.group);
      if (params?.side) searchParams.set('side', params.side);
      if (params?.rsvpStatus) searchParams.set('rsvpStatus', params.rsvpStatus);
      const qs = searchParams.toString();
      return apiFetch<GuestResponse[]>(
        `/weddings/${weddingId}/guests${qs ? `?${qs}` : ''}`,
      );
    },
    enabled: !!weddingId,
  });
}

export function useGuestSummary(weddingId: string) {
  return useQuery({
    queryKey: guestKeys.summary(weddingId),
    queryFn: () =>
      apiFetch<GuestSummaryResponse>(
        `/weddings/${weddingId}/guests/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useCreateGuest(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuestRequest) =>
      apiFetch<GuestResponse>(`/weddings/${weddingId}/guests`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.all(weddingId),
      });
    },
  });
}

export function useUpdateGuest(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      guestId,
      data,
    }: {
      guestId: string;
      data: UpdateGuestRequest;
    }) =>
      apiFetch<GuestResponse>(`/weddings/${weddingId}/guests/${guestId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.all(weddingId),
      });
    },
  });
}

export function useDeleteGuest(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guestId: string) =>
      apiFetch<void>(`/weddings/${weddingId}/guests/${guestId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.all(weddingId),
      });
    },
  });
}
