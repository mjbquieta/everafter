'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@everafter/ui';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
}

export function UploadZone({ onFilesSelected, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }

      // Reset input
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-surface/50'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
          {isDragging ? (
            <Upload className="h-7 w-7 text-primary" />
          ) : (
            <ImageIcon className="h-7 w-7 text-primary" />
          )}
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1">
          {isDragging ? 'Drop photos here' : 'Upload photos'}
        </h3>
        <p className="text-sm text-muted mb-4">
          Drag and drop images, or click to browse
        </p>

        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          size="sm"
          disabled={isUploading}
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose Files'}
        </Button>

        <p className="text-xs text-muted mt-3">
          Supports JPG, PNG, WebP, and GIF up to 10MB
        </p>
      </div>
    </div>
  );
}
