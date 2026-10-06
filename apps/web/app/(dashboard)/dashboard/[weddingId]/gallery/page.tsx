'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Globe, Eye, Star, Users, QrCode, Download, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@everafter/ui';
import {
  useGalleryPhotos,
  useUploadPhoto,
  useUpdatePhoto,
  useDeletePhoto,
  useSetHeroBanner,
  parsePhotoVisibility,
} from '@/lib/hooks/use-gallery';
import {
  useGuestPhotos,
  useFeatureGuestPhoto,
  useDeleteGuestPhoto,
  parseGuestPhotoMetadata,
  isGuestUpload,
  isGuestMemory,
} from '@/lib/hooks/use-guest-photos';
import { useWebsiteSettings } from '@/lib/hooks/use-website-settings';
import { useWedding } from '@/lib/hooks/use-weddings';
import { useWeddingProfile } from '@/lib/hooks/use-dashboard';
import { UploadZone, PhotoGrid, DeleteDialog } from '@/features/gallery';
import { QRGeneratorModal } from '@/features/gallery/qr-generator-modal';
import { GuestAlbums } from '@/features/gallery/guest-albums';
import { PhotoLightbox } from '@/features/gallery/photo-lightbox';

// Use window.location to dynamically determine the storage URL
const getStorageUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
  return process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:3001';
};

export default function GalleryPage() {
  const params = useParams<{ weddingId: string }>();
  const weddingId = params.weddingId;

  const [activeTab, setActiveTab] = useState<'official' | 'guest'>('official');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Queries
  const { data: wedding } = useWedding(weddingId);
  const { data: profile } = useWeddingProfile(weddingId);
  const { data: galleryData, isLoading: isLoadingGallery } = useGalleryPhotos(weddingId);
  const { data: guestData, isLoading: isLoadingGuest } = useGuestPhotos(weddingId);
  const { data: websiteSettings } = useWebsiteSettings(weddingId);

  // Mutations
  const uploadPhoto = useUploadPhoto(weddingId);
  const updatePhoto = useUpdatePhoto(weddingId, galleryData?.albumId ?? '');
  const deletePhoto = useDeletePhoto(weddingId, galleryData?.albumId ?? '');
  const setHeroBanner = useSetHeroBanner(weddingId);
  const featureGuestPhoto = useFeatureGuestPhoto(weddingId, guestData?.albumId ?? '');
  const deleteGuestPhoto = useDeleteGuestPhoto(weddingId, guestData?.albumId ?? '');

  // Filter website photos to exclude non-featured guest uploads
  const allPhotos = galleryData?.photos ?? [];
  const photos = useMemo(
    () => allPhotos.filter((photo) => !isGuestUpload(photo.caption)),
    [allPhotos]
  );

  // Filter guest photos to ONLY include genuine guest memories (have uploader metadata)
  // This prevents official photos from accidentally appearing in Guest Memories
  const allGuestPhotos = guestData?.photos ?? [];
  const guestPhotos = useMemo(() => {
    const filtered = allGuestPhotos.filter((photo) => isGuestMemory(photo.caption));
    const removed = allGuestPhotos.length - filtered.length;
    if (removed > 0) {
      console.log(
        `[Gallery] Filtered out ${removed} photo(s) from Guest Memories (missing uploader metadata)`
      );
    }
    return filtered;
  }, [allGuestPhotos]);

  const isLoading = activeTab === 'official' ? isLoadingGallery : isLoadingGuest;

  // Metrics - count only host photos + featured guest photos
  const metrics = useMemo(() => {
    if (activeTab === 'official') {
      const total = photos.length;
      const visible = photos.filter((p) => parsePhotoVisibility(p.caption)).length;
      return { total, visible };
    } else {
      const total = guestPhotos.length;
      return { total, visible: 0 };
    }
  }, [activeTab, photos, guestPhotos]);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        await uploadPhoto.mutateAsync({ file, visible: true });
      }
    },
    [uploadPhoto]
  );

  const handleSetHero = useCallback(
    (photoUrl: string) => {
      setHeroBanner.mutate(photoUrl);
    },
    [setHeroBanner]
  );

  const handleToggleVisibility = useCallback(
    (photoId: string, visible: boolean) => {
      updatePhoto.mutate({ photoId, visible });
    },
    [updatePhoto]
  );

  const handleDeleteClick = useCallback((photoId: string) => {
    setDeleteTarget(photoId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    if (activeTab === 'official') {
      await deletePhoto.mutateAsync(deleteTarget);
    } else {
      await deleteGuestPhoto.mutateAsync(deleteTarget);
    }
    setDeleteTarget(null);
  }, [deleteTarget, activeTab, deletePhoto, deleteGuestPhoto]);

  const handleFeatureGuestPhoto = useCallback(
    (photoId: string) => {
      if (!galleryData?.albumId) return;
      featureGuestPhoto.mutate({
        photoId,
        targetAlbumId: galleryData.albumId,
      });
    },
    [featureGuestPhoto, galleryData?.albumId]
  );

  const handleDownloadAll = useCallback(() => {
    // Create CSV with photo URLs
    const csvHeader = 'Photo URL,Uploaded By,Uploaded At,Caption\n';
    const csvRows = guestPhotos
      .map((p) => {
        const metadata = parseGuestPhotoMetadata(p.caption);
        return `"${p.url}","${metadata.uploaderName || ''}","${metadata.uploadedAt || ''}","${metadata.cleanCaption}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guest-photos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [guestPhotos]);

  const handlePhotoClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleLightboxFeature = useCallback(
    (photoId: string) => {
      handleFeatureGuestPhoto(photoId);
      setLightboxOpen(false);
    },
    [handleFeatureGuestPhoto]
  );

  const handleLightboxDelete = useCallback(
    (photoId: string) => {
      setDeleteTarget(photoId);
      setLightboxOpen(false);
    },
    []
  );

  const heroImage = websiteSettings?.heroBanner ?? null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Photo Gallery</h1>
            <p className="text-sm text-muted mt-1">
              Upload, curate, and organize photos for your published wedding website.
            </p>
          </div>
        </div>
        <div className="flex gap-2 border-b border-border">
          <div className="px-4 py-2 border-b-2 border-transparent animate-pulse">
            <div className="h-5 w-32 bg-stone-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
              <div className="h-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Photo Gallery</h1>
          <p className="text-sm text-muted mt-1">
            Curate and manage all images displayed on your published wedding website.
          </p>
        </div>
        {activeTab === 'official' ? (
          <div>
            <input
              type="file"
              id="photo-upload-header"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  handleFilesSelected(files);
                }
                e.target.value = '';
              }}
              className="hidden"
            />
            <Button
              size="sm"
              disabled={uploadPhoto.isPending}
              onClick={() => document.getElementById('photo-upload-header')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleDownloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button size="sm" onClick={() => setQrModalOpen(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Print QR Signs
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('official')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'official'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website Photos
          </div>
        </button>
        <button
          onClick={() => setActiveTab('guest')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'guest'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guest Memories
            {guestPhotos.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {guestPhotos.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Website Photos Tab */}
      {activeTab === 'official' && (
        <>
          {/* Metric Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
                <p className="text-xs text-muted">Total website photos</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <Eye className="h-5 w-5 text-emerald-600" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{metrics.visible}</p>
                <p className="text-xs text-muted">Visible on website</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                {heroImage ? (
                  <>
                    <div className="relative h-12 w-full rounded-md overflow-hidden bg-stone-100 mb-1">
                      <img
                        src={
                          heroImage.startsWith('http')
                            ? heroImage
                            : `${getStorageUrl()}${heroImage}`
                        }
                        alt="Current hero banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted">Current hero banner</p>
                  </>
                ) : (
                  <>
                    <p className="text-base text-muted">—</p>
                    <p className="text-xs text-muted">No hero banner set</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upload Zone or Photo Grid */}
          {photos.length === 0 ? (
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isUploading={uploadPhoto.isPending}
            />
          ) : (
            <>
              <UploadZone
                onFilesSelected={handleFilesSelected}
                isUploading={uploadPhoto.isPending}
              />

              <PhotoGrid
                photos={photos}
                heroImage={heroImage}
                onSetHero={handleSetHero}
                onToggleVisibility={handleToggleVisibility}
                onDelete={handleDeleteClick}
              />
            </>
          )}
        </>
      )}

      {/* Guest Memories Tab */}
      {activeTab === 'guest' && (
        <>
          {/* Metric Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="h-2 w-2 rounded-full bg-purple-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{guestPhotos.length}</p>
                <p className="text-xs text-muted">Guest photos shared</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <QrCode className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQrModalOpen(true)}
                  className="w-full"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Table QR Signs
                </Button>
                <p className="text-xs text-muted">Let guests upload photos</p>
              </div>
            </div>
          </div>

          {/* Guest Photos Albums */}
          {guestPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 py-16 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 mb-5">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">No guest photos yet</h3>
              <p className="mt-2 text-sm text-muted max-w-sm mb-4">
                Generate and print QR codes for your tables so guests can upload photos during the celebration.
              </p>
              <Button size="sm" onClick={() => setQrModalOpen(true)}>
                <QrCode className="h-4 w-4 mr-2" />
                Print QR Signs
              </Button>
            </div>
          ) : (
            <GuestAlbums
              photos={guestPhotos}
              onPhotoClick={handlePhotoClick}
              parseMetadata={parseGuestPhotoMetadata}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={
          activeTab === 'official' ? deletePhoto.isPending : deleteGuestPhoto.isPending
        }
      />

      {/* QR Generator Modal */}
      <QRGeneratorModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        slug={wedding?.slug ?? ''}
        brideName={profile?.brideName}
        groomName={profile?.groomName}
        weddingDate={wedding?.weddingDate}
      />

      {/* Photo Lightbox */}
      <PhotoLightbox
        photos={guestPhotos}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onFeature={handleLightboxFeature}
        onDelete={handleLightboxDelete}
        parseMetadata={parseGuestPhotoMetadata}
      />
    </div>
  );
}
