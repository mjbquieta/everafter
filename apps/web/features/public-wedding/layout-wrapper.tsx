import type { ReactNode } from 'react';
import { FloralDivider } from './floral-divider';
import type { DividerStyle, DividerSize } from './floral-divider';

interface LayoutWrapperProps {
  layout: string;
  dividerStyle: DividerStyle;
  dividerSize: DividerSize;
  storySection: ReactNode;
  detailsSection: ReactNode;
  showStory: boolean;
  showDetails: boolean;
}

export function LayoutWrapper({
  layout,
  dividerStyle,
  dividerSize,
  storySection,
  detailsSection,
  showStory,
  showDetails,
}: LayoutWrapperProps) {
  // ── Magazine: 12-column grid, story col-span-5, details col-span-7 ──
  if (layout === 'magazine') {
    const hasBoth = showStory && showDetails;
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
        {hasBoth ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5">{storySection}</div>
            <div className="md:col-span-7">{detailsSection}</div>
          </div>
        ) : (
          <>
            {showStory && storySection}
            {showDetails && detailsSection}
          </>
        )}
      </div>
    );
  }

  // ── Editorial: staggered offsets with generous vertical rhythm ──
  if (layout === 'editorial') {
    return (
      <div className="mx-auto max-w-5xl px-4 md:px-8 space-y-20 md:space-y-28 py-20 md:py-28">
        {showStory && (
          <div className="lg:w-2/3 mr-auto">
            {storySection}
          </div>
        )}
        {showDetails && (
          <div className="lg:w-4/5 ml-auto">
            {detailsSection}
          </div>
        )}
      </div>
    );
  }

  // ── Classic: single-column centered flow with dividers ──
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16 md:py-24">
      {showStory && (
        <>
          <FloralDivider className="py-4" style={dividerStyle} size={dividerSize} />
          {storySection}
        </>
      )}
      {showDetails && (
        <>
          <FloralDivider className="py-4" style={dividerStyle} size={dividerSize} />
          {detailsSection}
        </>
      )}
    </div>
  );
}
