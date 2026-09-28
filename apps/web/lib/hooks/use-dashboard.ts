import { useQuery } from '@tanstack/react-query';
import type {
  GuestSummaryResponse,
  BudgetSummaryResponse,
  ChecklistSummaryResponse,
  ChecklistItemResponse,
  GuestResponse,
  WeddingProfileResponse,
} from '@everafter/types';
import { apiFetch } from '../api-client';

export const dashboardKeys = {
  guestSummary: (weddingId: string) =>
    ['weddings', weddingId, 'guests', 'summary'] as const,
  budgetSummary: (weddingId: string) =>
    ['weddings', weddingId, 'budget', 'summary'] as const,
  checklistSummary: (weddingId: string) =>
    ['weddings', weddingId, 'checklist', 'summary'] as const,
  checklistItems: (weddingId: string) =>
    ['weddings', weddingId, 'checklist'] as const,
  guests: (weddingId: string) =>
    ['weddings', weddingId, 'guests'] as const,
  profile: (weddingId: string) =>
    ['weddings', weddingId, 'profile'] as const,
};

export function useGuestSummary(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.guestSummary(weddingId),
    queryFn: () =>
      apiFetch<GuestSummaryResponse>(
        `/weddings/${weddingId}/guests/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useBudgetSummary(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.budgetSummary(weddingId),
    queryFn: () =>
      apiFetch<BudgetSummaryResponse>(
        `/weddings/${weddingId}/budget/categories/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useChecklistSummary(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.checklistSummary(weddingId),
    queryFn: () =>
      apiFetch<ChecklistSummaryResponse>(
        `/weddings/${weddingId}/checklist/summary`,
      ),
    enabled: !!weddingId,
  });
}

export function useChecklistItems(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.checklistItems(weddingId),
    queryFn: () =>
      apiFetch<ChecklistItemResponse[]>(
        `/weddings/${weddingId}/checklist`,
      ),
    enabled: !!weddingId,
  });
}

export function useGuests(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.guests(weddingId),
    queryFn: () =>
      apiFetch<GuestResponse[]>(`/weddings/${weddingId}/guests`),
    enabled: !!weddingId,
  });
}

export function useWeddingProfile(weddingId: string) {
  return useQuery({
    queryKey: dashboardKeys.profile(weddingId),
    queryFn: () =>
      apiFetch<WeddingProfileResponse>(
        `/weddings/${weddingId}/profile`,
      ),
    enabled: !!weddingId,
  });
}
