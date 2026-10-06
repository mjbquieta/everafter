'use client';

import type { WeddingResponse } from '@everafter/types';
import {
  AsymmetricLayout,
  PhotoFocusedLayout,
  ClassicLayout,
  StorybookLayout,
  MinimalistLayout,
} from './layouts';
import type { WebsiteLayoutType } from '../website-builder/theme-presets';

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

// Extended wedding type with optional profile/settings properties
type WeddingData = WeddingResponse & {
  bride?: { name?: string } | null;
  groom?: { name?: string } | null;
  venue?: {
    name?: string | null;
    address?: string | null;
  } | null;
  tagline?: string | null;
  story?: string | null;
  rsvpDeadline?: string | null;
};

interface LayoutRendererProps {
  layout: WebsiteLayoutType;
  wedding: WeddingData;
  photos: Photo[];
  onRsvpClick: () => void;
}

export function LayoutRenderer({
  layout,
  wedding,
  photos,
  onRsvpClick,
}: LayoutRendererProps) {
  const layoutProps = { wedding, photos, onRsvpClick };

  switch (layout) {
    case 'asymmetric':
      return <AsymmetricLayout {...layoutProps} />;
    case 'photo_focused':
      return <PhotoFocusedLayout {...layoutProps} />;
    case 'classic':
      return <ClassicLayout {...layoutProps} />;
    case 'storybook':
      return <StorybookLayout {...layoutProps} />;
    case 'minimalist':
      return <MinimalistLayout {...layoutProps} />;
    default:
      return <ClassicLayout {...layoutProps} />;
  }
}
