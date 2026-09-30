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
  // ── Magazine: side-by-side grid when both present, stacked on mobile ──
  if (layout === 'magazine') {
    const hasBoth = showStory && showDetails;
    return (
      <>
        {hasBoth ? (
          <div className="grid md:grid-cols-2">
            <div>{storySection}</div>
            <div>{detailsSection}</div>
          </div>
        ) : (
          <>
            {showStory && storySection}
            {showDetails && detailsSection}
          </>
        )}
      </>
    );
  }

  // ── Editorial: alternating left/right offset with generous whitespace ──
  if (layout === 'editorial') {
    return (
      <>
        {showStory && (
          <div className="md:mr-[20%]">
            {storySection}
          </div>
        )}
        {showDetails && (
          <div className="md:ml-[20%]">
            {detailsSection}
          </div>
        )}
      </>
    );
  }

  // ── Classic: vertical stack with dividers ──
  return (
    <>
      {showStory && (
        <>
          <FloralDivider className="py-4" style={dividerStyle} size={dividerSize} />
          {storySection}
        </>
      )}
      {showDetails && (
        <div style={{ backgroundColor: 'var(--wedding-secondary)' }}>
          <FloralDivider className="py-4" style={dividerStyle} size={dividerSize} />
          {detailsSection}
        </div>
      )}
    </>
  );
}
