import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GalleryAlbumResponse, GalleryPhotoResponse } from '@everafter/types';
import { apiFetch, apiUpload, API_URL } from '../api-client';

// Use window.location to dynamically determine the storage URL
const getStorageUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
  return process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:3001';
};

const STORAGE_URL = getStorageUrl();

// Helper to get/create default album for a wedding
async function getOrCreateDefaultAlbum(weddingId: string): Promise<GalleryAlbumResponse> {
  // Try to get existing albums
  const albums = await apiFetch<GalleryAlbumResponse[]>(
    `/weddings/${weddingId}/gallery/albums`
  );

  // Return first album or create one
  if (albums.length > 0) {
    return albums[0];
  }

  // Create default album
  const newAlbum = await apiFetch<GalleryAlbumResponse>(
    `/weddings/${weddingId}/gallery/albums`,
    {
      method: 'POST',
      body: JSON.stringify({
        title: 'Wedding Photos',
      }),
    }
  );

  return newAlbum;
}

export function useGalleryPhotos(weddingId: string) {
  return useQuery({
    queryKey: ['gallery-photos', weddingId],
    queryFn: async () => {
      console.log('[useGalleryPhotos] Fetching for weddingId:', weddingId);
      const album = await getOrCreateDefaultAlbum(weddingId);
      console.log('[useGalleryPhotos] Album:', album.id, album.title);

      const photos = await apiFetch<GalleryPhotoResponse[]>(
        `/weddings/${weddingId}/gallery/albums/${album.id}/photos`
      );

      console.log('[useGalleryPhotos] Received photos:', photos.length);

      // Map photos to include full URLs
      const mapped = photos.map((photo) => {
        // Construct full URL with /uploads prefix
        const path = photo.storageKey.startsWith('/')
          ? photo.storageKey
          : `/${photo.storageKey}`;
        return {
          ...photo,
          url: `${STORAGE_URL}/uploads${path}`,
        };
      });

      console.log('[useGalleryPhotos] Mapped photos with URLs:', mapped);

      return {
        albumId: album.id,
        photos: mapped,
      };
    },
  });
}

export function useUploadPhoto(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, caption, visible = true }: { file: File; caption?: string; visible?: boolean }) => {
      const album = await getOrCreateDefaultAlbum(weddingId);

      console.log('[useUploadPhoto] Uploading file:', file.name);

      // First, upload file to storage using apiUpload
      // Note: Backend double-wraps response with { data: { data: ... } }
      const uploadResult = await apiUpload<{ data: { storageKey: string; url: string } }>(
        `/weddings/${weddingId}/gallery/upload`,
        file
      );

      console.log('[useUploadPhoto] Upload result:', uploadResult);

      const storageKey = uploadResult.data.storageKey;
      console.log('[useUploadPhoto] Storage key:', storageKey);

      // Create photo record with visibility metadata
      const visibilityMeta = `[visible:${visible}]`;
      const finalCaption = caption ? `${visibilityMeta} ${caption}` : visibilityMeta;

      console.log('[useUploadPhoto] Creating photo record with storageKey:', storageKey);

      const photo = await apiFetch<GalleryPhotoResponse>(
        `/weddings/${weddingId}/gallery/albums/${album.id}/photos`,
        {
          method: 'POST',
          body: JSON.stringify({
            storageKey,
            caption: finalCaption,
          }),
        }
      );

      return photo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', weddingId] });
      toast.success('Photo uploaded');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePhoto(weddingId: string, albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoId, caption, visible }: { photoId: string; caption?: string; visible?: boolean }) => {
      // Update caption with visibility metadata
      let finalCaption = caption || '';
      if (visible !== undefined) {
        const visibilityMeta = `[visible:${visible}]`;
        // Remove existing visibility metadata
        const cleaned = finalCaption.replace(/\[visible:(true|false)\]\s*/g, '');
        finalCaption = cleaned ? `${visibilityMeta} ${cleaned}` : visibilityMeta;
      }

      const photo = await apiFetch<GalleryPhotoResponse>(
        `/weddings/${weddingId}/gallery/albums/${albumId}/photos/${photoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ caption: finalCaption }),
        }
      );

      return photo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', weddingId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeletePhoto(weddingId: string, albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      await apiFetch(
        `/weddings/${weddingId}/gallery/albums/${albumId}/photos/${photoId}`,
        {
          method: 'DELETE',
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', weddingId] });
      toast.success('Photo deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSetHeroBanner(weddingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoUrl: string) => {
      const result = await apiFetch(
        `/weddings/${weddingId}/website-settings`,
        {
          method: 'PATCH',
          body: JSON.stringify({ heroBanner: photoUrl }),
        }
      );

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding', weddingId] });
      queryClient.invalidateQueries({ queryKey: ['website-settings', weddingId] });
      toast.success('Hero banner updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Helper to parse visibility from caption
export function parsePhotoVisibility(caption: string | null): boolean {
  if (!caption) return true; // Default to visible
  const match = caption.match(/\[visible:(true|false)\]/);
  return match ? match[1] === 'true' : true;
}

// Helper to get clean caption without metadata
export function getCleanCaption(caption: string | null): string {
  if (!caption) return '';
  return caption.replace(/\[visible:(true|false)\]\s*/g, '').trim();
}
