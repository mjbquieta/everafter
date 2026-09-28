'use client';

import { Image } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Image className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Photo Gallery</h1>
      <p className="text-muted max-w-md">
        Photo gallery and media management coming soon. Upload and organize
        your wedding photos to share with guests.
      </p>
    </div>
  );
}
