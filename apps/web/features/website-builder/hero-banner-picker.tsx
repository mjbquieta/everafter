'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { Button, Label } from '@everafter/ui';
import { toast } from 'sonner';
import { useUploadHeroBanner, useUpdateWebsiteSettings } from '@/lib/hooks/use-website-settings';
import { resolveUploadUrl } from '@/lib/api-client';

const ACCEPT = 'image/jpeg,image/png,image/webp';

const PRESET_HEROES = [
  '/images/heroes/hero-1.jpeg',
  '/images/heroes/hero-2.jpeg',
  '/images/heroes/hero-3.jpeg',
  '/images/heroes/hero-4.jpeg',
  '/images/heroes/hero-5.jpeg',
];

interface HeroBannerPickerProps {
  weddingId: string;
  heroBanner: string | null;
  onUploaded: (url: string | null) => void;
}

export function HeroBannerPicker({
  weddingId,
  heroBanner,
  onUploaded,
}: HeroBannerPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadHeroBanner(weddingId);
  const updateSettings = useUpdateWebsiteSettings(weddingId);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be smaller than 5MB');
      return;
    }

    try {
      const result = await upload.mutateAsync(file);
      onUploaded(result.heroBanner);
      toast.success('Hero banner uploaded');
    } catch {
      toast.error('Failed to upload hero banner');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    try {
      await updateSettings.mutateAsync({ heroBanner: null });
      onUploaded(null);
      toast.success('Hero banner removed');
    } catch {
      toast.error('Failed to remove hero banner');
    }
  };

  const isUploading = upload.isPending;
  const isRemoving = updateSettings.isPending;
  const bannerSrc = resolveUploadUrl(heroBanner);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted">Hero Banner</Label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleInputChange}
        className="hidden"
      />

      {bannerSrc ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-border aspect-[16/9]">
            <img
              src={bannerSrc}
              alt="Hero banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 text-xs"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5 mr-1" />
              )}
              Replace
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-xs text-error"
            >
              {isRemoving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          disabled={isUploading}
          className={`
            w-full rounded-lg border-2 border-dashed p-6
            flex flex-col items-center justify-center gap-2
            text-xs text-muted transition-colors cursor-pointer
            hover:border-primary/50 hover:text-foreground
            ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}
            ${isUploading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Drop image or click to upload'}</span>
          <span className="text-[10px]">JPEG, PNG, WebP (max 5MB)</span>
        </button>
      )}

      {/* Preset hero images */}
      <div>
        <p className="text-[10px] text-muted mb-1.5">Or choose a preset image</p>
        <div className="grid grid-cols-5 gap-1">
          {PRESET_HEROES.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onUploaded(src)}
              className={`relative rounded overflow-hidden aspect-[16/9] border-2 transition-colors ${
                heroBanner === src
                  ? 'border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={src}
                alt="Preset hero"
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
