'use client';

import { useState, useMemo } from 'react';
import { Download, ArrowLeft, MoreVertical } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { GalleryPhotoResponse } from '@everafter/types';

interface GuestAlbumsProps {
  photos: (GalleryPhotoResponse & { url: string })[];
  onPhotoClick: (index: number) => void;
  parseMetadata: (caption: string | null) => {
    uploaderName: string | null;
    guestId: string | null;
    uploadedAt: string | null;
    cleanCaption: string;
  };
}

interface GuestAlbum {
  guestName: string;
  guestId: string | null;
  photos: (GalleryPhotoResponse & { url: string })[];
  latestUpload: string | null;
  coverPhoto: GalleryPhotoResponse & { url: string };
}

export function GuestAlbums({ photos, onPhotoClick, parseMetadata }: GuestAlbumsProps) {
  const [selectedGuestAlbum, setSelectedGuestAlbum] = useState<string | null>(null);

  const guestAlbums = useMemo(() => {
    const albumsMap = new Map<string, GuestAlbum>();

    photos.forEach((photo) => {
      const metadata = parseMetadata(photo.caption);
      const guestName = metadata.uploaderName || 'Anonymous';
      const guestId = metadata.guestId;
      const key = guestId || guestName;

      if (!albumsMap.has(key)) {
        albumsMap.set(key, {
          guestName,
          guestId,
          photos: [],
          latestUpload: metadata.uploadedAt,
          coverPhoto: photo,
        });
      }

      const album = albumsMap.get(key)!;
      album.photos.push(photo);

      // Update latest upload and cover photo if this photo is newer
      if (metadata.uploadedAt) {
        if (
          !album.latestUpload ||
          new Date(metadata.uploadedAt) > new Date(album.latestUpload)
        ) {
          album.latestUpload = metadata.uploadedAt;
          album.coverPhoto = photo;
        }
      }
    });

    // Sort albums by latest upload (newest first)
    return Array.from(albumsMap.values()).sort((a, b) => {
      if (!a.latestUpload) return 1;
      if (!b.latestUpload) return -1;
      return new Date(b.latestUpload).getTime() - new Date(a.latestUpload).getTime();
    });
  }, [photos, parseMetadata]);

  const handleDownloadAlbum = (album: GuestAlbum) => {
    const csvHeader = 'Photo URL,Uploaded By,Uploaded At,Caption\n';
    const csvRows = album.photos
      .map((p) => {
        const metadata = parseMetadata(p.caption);
        return `"${p.url}","${metadata.uploaderName || ''}","${metadata.uploadedAt || ''}","${metadata.cleanCaption}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${album.guestName.toLowerCase().replace(/\s+/g, '-')}-photos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (guestAlbums.length === 0) {
    return null;
  }

  // Drill-down view for selected guest
  if (selectedGuestAlbum) {
    const album = guestAlbums.find(
      (a) => (a.guestId || a.guestName) === selectedGuestAlbum
    );
    if (!album) {
      setSelectedGuestAlbum(null);
      return null;
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedGuestAlbum(null)}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Albums
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              {album.guestName}'s Photos
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {album.photos.length} {album.photos.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => handleDownloadAlbum(album)}>
            <Download className="h-4 w-4 mr-2" />
            Download All Photos
          </Button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {album.photos.map((photo) => {
            const globalIndex = photos.findIndex((p) => p.id === photo.id);
            const metadata = parseMetadata(photo.caption);

            return (
              <button
                key={photo.id}
                onClick={() => onPhotoClick(globalIndex)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100 hover:border-purple-300 transition-all duration-200"
              >
                <img
                  src={photo.url}
                  alt={metadata.cleanCaption || 'Guest photo'}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Album folder grid view
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {guestAlbums.map((album) => {
        const key = album.guestId || album.guestName;

        return (
          <div key={key} className="space-y-2">
            {/* Album Card */}
            <div
              onClick={() => setSelectedGuestAlbum(key)}
              className="aspect-square w-full rounded-2xl overflow-hidden relative group cursor-pointer border border-stone-200/80 bg-stone-100 shadow-sm hover:shadow-md transition"
            >
              {/* Cover Image */}
              <img
                src={album.coverPhoto.url}
                alt={`${album.guestName}'s album`}
                className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Context Menu Button (optional) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add context menu functionality here if needed
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreVertical className="h-4 w-4 text-stone-700" />
              </button>
            </div>

            {/* Album Label */}
            <div className="px-1">
              <p className="font-semibold text-stone-900 text-sm truncate">
                {album.guestName}
              </p>
              <p className="text-xs text-stone-500">
                {album.photos.length} {album.photos.length === 1 ? 'Item' : 'Items'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
