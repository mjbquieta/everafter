'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Camera, Check, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button, Input } from '@everafter/ui';
import { useUploadGuestPhoto } from '@/lib/hooks/use-guest-photos';

const MAX_PHOTOS = 10; // Maximum photos per upload session

interface UploadedPhoto {
  file: File;
  preview: string;
  caption?: string;
  uploaded: boolean;
}

function MemoriesContent() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;

  const guestId = searchParams.get('guest');
  const [uploaderName, setUploaderName] = useState('');
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [weddingId, setWeddingId] = useState<string | undefined>(undefined);

  const uploadMutation = useUploadGuestPhoto(slug, weddingId);

  // Auto-fill uploader name from guest if available
  useEffect(() => {
    if (guestId) {
      // Fetch guest name from API
      const fetchGuestName = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/public/weddings/${slug}/guests/${guestId}`
          );
          if (res.ok) {
            const body = await res.json();
            setUploaderName(`${body.data.firstName} ${body.data.lastName}`);
          }
        } catch {
          // Ignore errors
        }
      };
      fetchGuestName();
    }
  }, [guestId, slug]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remaining = MAX_PHOTOS - photos.length;

      const newPhotos = files.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploaded: false,
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);
      e.target.value = '';
    },
    [photos.length]
  );

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleUpdateCaption = useCallback((index: number, caption: string) => {
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index].caption = caption;
      return updated;
    });
  }, []);

  const handleUploadAll = useCallback(async () => {
    if (!uploaderName.trim()) {
      setUploadError('Please enter your name');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadError('');

    for (let i = 0; i < photos.length; i++) {
      if (photos[i].uploaded) continue;

      try {
        const result = await uploadMutation.mutateAsync({
          file: photos[i].file,
          uploaderName: uploaderName.trim(),
          guestId: guestId ?? undefined,
          caption: photos[i].caption,
        });

        // Capture weddingId from first upload for cache invalidation
        if (!weddingId && result?.weddingId) {
          setWeddingId(result.weddingId);
        }

        setPhotos((prev) => {
          const updated = [...prev];
          updated[i].uploaded = true;
          return updated;
        });
      } catch (error) {
        // Error already shown by mutation via toast
        console.error('Upload failed:', error);
        setUploadError((error as Error).message || 'Upload failed. Please try again.');
        return;
      }
    }

    setShowSuccess(true);
    setTimeout(() => {
      setPhotos([]);
      setShowSuccess(false);
      setUploadError('');
      if (!guestId) {
        setUploaderName('');
      }
    }, 3000);
  }, [photos, uploaderName, guestId, uploadMutation]);

  const uploadedCount = photos.filter((p) => p.uploaded).length;
  const canUploadMore = photos.length < MAX_PHOTOS;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl text-stone-900 mb-3">
            Thank you!
          </h1>
          <p className="text-stone-600 text-lg">
            Your photos have been shared with the couple. They'll love seeing the moment through your eyes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
            Share Your Perspective
          </h1>
          <p className="text-stone-600">
            Capture and share your favorite moments from the celebration
          </p>
        </div>

        {/* Name Input */}
        {!guestId && (
          <div className="mb-6">
            <Input
              placeholder="Your name"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="text-center text-lg"
            />
          </div>
        )}

        {/* Photo Counter */}
        {photos.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-stone-600">
              {photos.length} of {MAX_PHOTOS} photos selected
            </p>
          </div>
        )}

        {/* Photo Tray */}
        {photos.length > 0 && (
          <div className="mb-6 space-y-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-stone-200 p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {photo.uploaded && (
                      <div className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Input
                      placeholder="Add a caption (optional)"
                      value={photo.caption ?? ''}
                      onChange={(e) => handleUpdateCaption(index, e.target.value)}
                      disabled={photo.uploaded}
                      className="mb-2"
                    />
                  </div>

                  <button
                    onClick={() => handleRemovePhoto(index)}
                    disabled={photo.uploaded}
                    className="text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Camera Button */}
        {canUploadMore && (
          <div className="mb-6">
            <input
              type="file"
              id="camera-input"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="camera-input" className="block">
              <div className="w-full aspect-square max-w-xs mx-auto bg-stone-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-stone-800 transition-colors shadow-2xl">
                <Camera className="h-20 w-20 text-white" />
              </div>
              <p className="text-center text-sm text-stone-600 mt-4">
                Tap to capture or select photos
              </p>
            </label>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 text-center">{uploadError}</p>
          </div>
        )}

        {/* Upload Button */}
        {photos.length > 0 && (
          <Button
            onClick={handleUploadAll}
            disabled={uploadMutation.isPending || uploadedCount === photos.length}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-6 text-lg"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Uploading {uploadedCount} of {photos.length}...
              </>
            ) : uploadedCount === photos.length ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                All Photos Uploaded
              </>
            ) : (
              `Share ${photos.length} Photo${photos.length !== 1 ? 's' : ''}`
            )}
          </Button>
        )}

        {guestId && (
          <p className="text-center text-xs text-stone-500 mt-4">
            Uploading as {uploaderName}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MemoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <MemoriesContent />
    </Suspense>
  );
}
