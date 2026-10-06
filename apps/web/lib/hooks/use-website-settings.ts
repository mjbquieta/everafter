import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  WebsiteSettingsResponse,
  UpdateWebsiteSettingsRequest,
  WeddingResponse,
} from '@everafter/types';
import { apiFetch, apiUpload } from '../api-client';

export const websiteKeys = {
  settings: (weddingId: string) =>
    ['weddings', weddingId, 'website-settings'] as const,
};

export function useWebsiteSettings(weddingId: string) {
  return useQuery({
    queryKey: websiteKeys.settings(weddingId),
    queryFn: () =>
      apiFetch<WebsiteSettingsResponse>(
        `/weddings/${weddingId}/website-settings`,
      ),
    enabled: !!weddingId,
  });
}

export function useUpdateWebsiteSettings(weddingId: string, slug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWebsiteSettingsRequest) =>
      apiFetch<WebsiteSettingsResponse>(
        `/weddings/${weddingId}/website-settings`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(websiteKeys.settings(weddingId), data);

      // Revalidate the public wedding page cache
      if (slug) {
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          });
        } catch (error) {
          console.error('Failed to revalidate cache:', error);
        }
      }
    },
  });
}

export function useUpdateSlug(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) =>
      apiFetch<WeddingResponse>(`/weddings/${weddingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ slug }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}

export function usePublishWebsite(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch<WeddingResponse>(`/weddings/${weddingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PUBLISHED' }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}

export function useUploadHeroBanner(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      apiUpload<WebsiteSettingsResponse>(
        `/weddings/${weddingId}/website-settings/upload/hero-banner`,
        file,
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(websiteKeys.settings(weddingId), data);
    },
  });
}

export function useUploadAudio(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      apiUpload<WebsiteSettingsResponse>(
        `/weddings/${weddingId}/website-settings/upload/audio`,
        file,
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(websiteKeys.settings(weddingId), data);
    },
  });
}

export function useUnpublishWebsite(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch<WeddingResponse>(`/weddings/${weddingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DRAFT' }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}
