import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GalleryPhotoResponse, GalleryAlbumResponse } from '@everafter/types';
import { apiFetch, API_URL, resolveUploadUrl } from '../api-client';

// Use window.location to dynamically determine the storage URL
const getStorageUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
  return process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:3001';
};

const STORAGE_URL = getStorageUrl();

async function getOrCreateGuestAlbum(weddingId: string): Promise<string> {
  console.log('[getOrCreateGuestAlbum] Getting album for weddingId:', weddingId);

  // Get all albums
  const albums = await apiFetch<GalleryAlbumResponse[]>(`/weddings/${weddingId}/gallery/albums`);
  console.log('[getOrCreateGuestAlbum] Found albums:', albums.map((a) => ({ id: a.id, title: a.title })));

  const guestAlbum = albums.find((a) => a.title === 'Guest Memories');
  if (guestAlbum) {
    console.log('[getOrCreateGuestAlbum] Found existing Guest Memories album:', guestAlbum.id);
    return guestAlbum.id;
  }

  console.log('[getOrCreateGuestAlbum] No Guest Memories album found, creating new one');

  // Create guest album
  const newAlbum = await apiFetch<GalleryAlbumResponse>(`/weddings/${weddingId}/gallery/albums`, {
    method: 'POST',
    body: JSON.stringify({ title: 'Guest Memories' }),
  });

  console.log('[getOrCreateGuestAlbum] Created new album:', newAlbum.id);
  return newAlbum.id;
}

export function useGuestPhotos(weddingId: string) {
  return useQuery({
    queryKey: ['guest-photos', weddingId],
    queryFn: async () => {
      console.log('[useGuestPhotos] Fetching for weddingId:', weddingId);

      const albumId = await getOrCreateGuestAlbum(weddingId);
      console.log('[useGuestPhotos] Album ID:', albumId);

      const photos = await apiFetch<GalleryPhotoResponse[]>(
        `/weddings/${weddingId}/gallery/albums/${albumId}/photos`
      );

      console.log('[useGuestPhotos] Received photos:', photos.length, 'photos');

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

      console.log('[useGuestPhotos] Mapped photos:', mapped);

      return {
        albumId,
        photos: mapped,
      };
    },
    enabled: !!weddingId,
  });
}

export function useUploadGuestPhoto(slug: string, weddingId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      uploaderName,
      guestId,
      caption,
    }: {
      file: File;
      uploaderName: string;
      guestId?: string;
      caption?: string;
    }) => {
      // Upload to public endpoint (no auth required)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaderName', uploaderName);
      if (guestId) formData.append('guestId', guestId);
      if (caption) formData.append('caption', caption);

      const uploadUrl = `${API_URL}/public/weddings/${slug}/memories/upload`;
      console.log('Uploading to:', uploadUrl);
      console.log('File:', file.name, file.size, 'bytes');
      console.log('Uploader:', uploaderName);

      let res: Response;
      try {
        res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error('Network error:', err);
        throw new Error(`Network error: Cannot reach server at ${API_URL}`);
      }

      console.log('Response status:', res.status);

      if (!res.ok) {
        let errorMessage = 'Failed to upload photo';
        try {
          const error = await res.json();
          console.error('Error response:', error);
          errorMessage = error.message || error.error?.message || errorMessage;
        } catch {
          errorMessage = `Upload failed: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const body = await res.json();
      console.log('Upload successful:', body);
      return body.data;
    },
    onSuccess: (data) => {
      console.log('[useUploadGuestPhoto] Upload successful, data:', data);
      console.log('[useUploadGuestPhoto] Invalidating cache for weddingId:', weddingId);

      // Invalidate guest photos query cache so dashboard updates
      if (weddingId) {
        queryClient.invalidateQueries({ queryKey: ['guest-photos', weddingId] });
        console.log('[useUploadGuestPhoto] Cache invalidated for:', ['guest-photos', weddingId]);
      } else {
        console.warn('[useUploadGuestPhoto] No weddingId available for cache invalidation');
      }

      toast.success('Photo uploaded successfully!');
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error(error.message);
    },
  });
}

export function useFeatureGuestPhoto(weddingId: string, guestAlbumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoId, targetAlbumId }: { photoId: string; targetAlbumId: string }) => {
      // Get photo details
      const photo = await apiFetch<GalleryPhotoResponse>(
        `/weddings/${weddingId}/gallery/albums/${guestAlbumId}/photos/${photoId}`
      );

      // Parse existing metadata
      const metadata = parseGuestPhotoMetadata(photo.caption);

      // Create copy in main album with [visible:true] and [featured:true] to mark it as a promoted guest photo
      // Preserve uploader info so it can be filtered if needed
      const metaTags = `[visible:true] [featured:true]${metadata.uploaderName ? ` [uploader:${metadata.uploaderName}]` : ''}`;
      const caption = metadata.cleanCaption ? `${metaTags} ${metadata.cleanCaption}` : metaTags;

      const newPhoto = await apiFetch<GalleryPhotoResponse>(
        `/weddings/${weddingId}/gallery/albums/${targetAlbumId}/photos`,
        {
          method: 'POST',
          body: JSON.stringify({
            storageKey: photo.storageKey,
            caption,
          }),
        }
      );

      return newPhoto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', weddingId] });
      toast.success('Photo featured in main gallery');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteGuestPhoto(weddingId: string, albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      await apiFetch(`/weddings/${weddingId}/gallery/albums/${albumId}/photos/${photoId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-photos', weddingId] });
      toast.success('Photo deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Helper to parse metadata from caption
export function parseGuestPhotoMetadata(caption: string | null): {
  uploaderName: string | null;
  guestId: string | null;
  uploadedAt: string | null;
  featured: boolean;
  cleanCaption: string;
} {
  if (!caption) {
    return { uploaderName: null, guestId: null, uploadedAt: null, featured: false, cleanCaption: '' };
  }

  const uploaderMatch = caption.match(/\[uploader:([^\]]+)\]/);
  const guestIdMatch = caption.match(/\[guestId:([^\]]+)\]/);
  const uploadedAtMatch = caption.match(/\[uploadedAt:([^\]]+)\]/);
  const featuredMatch = caption.match(/\[featured:true\]/);

  const cleanCaption = caption
    .replace(/\[uploader:[^\]]+\]\s*/g, '')
    .replace(/\[guestId:[^\]]+\]\s*/g, '')
    .replace(/\[uploadedAt:[^\]]+\]\s*/g, '')
    .replace(/\[featured:true\]\s*/g, '')
    .replace(/\[visible:(true|false)\]\s*/g, '')
    .trim();

  return {
    uploaderName: uploaderMatch ? uploaderMatch[1] : null,
    guestId: guestIdMatch ? guestIdMatch[1] : null,
    uploadedAt: uploadedAtMatch ? uploadedAtMatch[1] : null,
    featured: !!featuredMatch,
    cleanCaption,
  };
}

// Helper to check if a photo is a guest upload (has uploader metadata and not featured)
export function isGuestUpload(caption: string | null): boolean {
  if (!caption) return false;
  const metadata = parseGuestPhotoMetadata(caption);
  return !!metadata.uploaderName && !metadata.featured;
}

// Helper to check if a photo is a genuine guest memory (has uploader metadata, regardless of featured status)
export function isGuestMemory(caption: string | null): boolean {
  if (!caption) return false;
  const metadata = parseGuestPhotoMetadata(caption);
  return !!metadata.uploaderName;
}

function getCleanCaption(caption: string | null): string {
  const { cleanCaption } = parseGuestPhotoMetadata(caption);
  return cleanCaption;
}
