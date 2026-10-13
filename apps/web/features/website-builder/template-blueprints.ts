export interface PhotoSlot {
  id: string;
  name: string;
  aspectRatio: string;
  description: string;
  placement: string;
  optional?: boolean;
}

export interface TemplateBlueprint {
  id: string;
  name: string;
  slots: PhotoSlot[];
}

export const TEMPLATE_BLUEPRINTS: Record<string, TemplateBlueprint> = {
  'midnight-editorial': {
    id: 'midnight-editorial',
    name: 'Midnight Editorial',
    slots: [
      {
        id: 'hero',
        name: 'Hero Full-Bleed Portrait',
        aspectRatio: '3:4 or 16:9',
        description: 'Main landing portrait',
        placement: 'Top banner',
      },
      {
        id: 'story',
        name: 'Story Feature',
        aspectRatio: '1:1 or 3:4',
        description: 'Story section highlight',
        placement: 'Mid-page feature',
      },
      {
        id: 'backdrop',
        name: 'Reception / Monogram Backdrop',
        aspectRatio: '16:9',
        description: 'Wide atmospheric shot',
        placement: 'Lower section',
      },
    ],
  },
  'moody-plum': {
    id: 'moody-plum',
    name: 'Moody Plum',
    slots: [
      {
        id: 'hero',
        name: 'Split Hero Portrait',
        aspectRatio: '3:4',
        description: 'Primary couple portrait',
        placement: 'Top split layout',
      },
      {
        id: 'story-landscape',
        name: 'Story Landscape',
        aspectRatio: '16:9',
        description: 'Wide story moment',
        placement: 'Story section',
      },
      {
        id: 'detail-square',
        name: 'Detail Frame',
        aspectRatio: '1:1',
        description: 'Detail or ring shot',
        placement: 'Collage grid',
      },
      {
        id: 'portrait-accent',
        name: 'Portrait Accent',
        aspectRatio: '3:4',
        description: 'Vertical accent photo',
        placement: 'Staggered layout',
      },
      {
        id: 'panoramic',
        name: 'Panoramic Break',
        aspectRatio: '21:9',
        description: 'Ultra-wide scene',
        placement: 'Full-width break',
      },
    ],
  },
  'warm-linen': {
    id: 'warm-linen',
    name: 'Warm Linen',
    slots: [
      {
        id: 'hero',
        name: 'Centered Hero Portrait',
        aspectRatio: '3:4 or 4:5',
        description: 'Classic couple portrait',
        placement: 'Center stage',
      },
      {
        id: 'vignette',
        name: 'Vignette Frame',
        aspectRatio: '1:1',
        description: 'Decorative detail',
        placement: 'Story accent',
        optional: true,
      },
    ],
  },
  'coastal-slate': {
    id: 'coastal-slate',
    name: 'Coastal Slate',
    slots: [
      {
        id: 'hero',
        name: 'Hero Landscape',
        aspectRatio: '16:9',
        description: 'Wide scenic opener',
        placement: 'Top banner',
      },
      {
        id: 'portrait-1',
        name: 'Portrait Feature 1',
        aspectRatio: '3:4',
        description: 'Vertical moment',
        placement: 'Masonry grid',
      },
      {
        id: 'portrait-2',
        name: 'Portrait Feature 2',
        aspectRatio: '3:4',
        description: 'Vertical moment',
        placement: 'Masonry grid',
      },
      {
        id: 'square-1',
        name: 'Square Detail 1',
        aspectRatio: '1:1',
        description: 'Detail shot',
        placement: 'Masonry grid',
      },
      {
        id: 'square-2',
        name: 'Square Detail 2',
        aspectRatio: '1:1',
        description: 'Detail shot',
        placement: 'Masonry grid',
      },
      {
        id: 'landscape',
        name: 'Landscape Break',
        aspectRatio: '16:9',
        description: 'Wide scene',
        placement: 'Masonry grid',
        optional: true,
      },
    ],
  },
  'dusty-rose': {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    slots: [
      {
        id: 'hero',
        name: 'Romantic Hero',
        aspectRatio: '4:5',
        description: 'Soft couple portrait',
        placement: 'Main card',
      },
      {
        id: 'story-left',
        name: 'Story Left Frame',
        aspectRatio: '3:4',
        description: 'Left overlapping card',
        placement: 'Storybook layout',
      },
      {
        id: 'story-right',
        name: 'Story Right Frame',
        aspectRatio: '1:1',
        description: 'Right overlapping card',
        placement: 'Storybook layout',
      },
      {
        id: 'detail',
        name: 'Botanical Detail',
        aspectRatio: '4:3',
        description: 'Decorative accent',
        placement: 'Lower section',
        optional: true,
      },
    ],
  },
};

export function getTemplateBlueprint(templateId: string): TemplateBlueprint | null {
  return TEMPLATE_BLUEPRINTS[templateId] || null;
}
