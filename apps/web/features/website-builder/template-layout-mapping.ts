/**
 * Maps template IDs to their corresponding layout types
 * This determines which layout component to render for each template
 */
export const TEMPLATE_TO_LAYOUT_MAP: Record<string, string> = {
  'midnight-editorial': 'minimalist',
  'moody-plum': 'asymmetric',
  'warm-linen': 'classic',
  'coastal-slate': 'photo-focused',
  'dusty-rose': 'storybook',
};

export function getLayoutForTemplate(templateId: string): string {
  return TEMPLATE_TO_LAYOUT_MAP[templateId] || 'classic';
}
