import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SubmitRSVPRequest, RSVPResponse } from '@everafter/types';
import { apiFetch } from '../api-client';
import { guestKeys } from './use-guests';

export function useSubmitRsvp(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      guestId,
      data,
    }: {
      guestId: string;
      data: SubmitRSVPRequest;
    }) =>
      apiFetch<RSVPResponse>(`/weddings/${weddingId}/guests/${guestId}/rsvp`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.all(weddingId),
      });
    },
  });
}
