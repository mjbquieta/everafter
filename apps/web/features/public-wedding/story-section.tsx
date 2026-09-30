interface StorySectionProps {
  proposalStory: string | null;
  loveStory: string | null;
  layout?: string;
}

export function StorySection({ proposalStory, loveStory, layout }: StorySectionProps) {
  if (!proposalStory && !loveStory) return null;

  const isMagazine = layout === 'magazine';
  const isEditorial = layout === 'editorial';

  // ── Magazine: newspaper-column feel, bold headline, compact text ──
  if (isMagazine) {
    return (
      <section id="story" className="px-8 md:px-16 py-16 md:py-24">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          Our Story
        </h2>
        <div
          className="h-0.5 w-16 mb-10"
          style={{ backgroundColor: 'var(--wedding-primary)' }}
        />

        <div className={loveStory && proposalStory ? 'columns-1 md:columns-2 gap-10' : ''}>
          {loveStory && (
            <div className="mb-8 break-inside-avoid">
              <h3
                className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--wedding-primary)' }}
              >
                How We Met
              </h3>
              <p
                className="font-serif text-base md:text-lg leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}
              >
                {loveStory}
              </p>
            </div>
          )}

          {proposalStory && (
            <div className="break-inside-avoid">
              <h3
                className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--wedding-primary)' }}
              >
                The Proposal
              </h3>
              <p
                className="font-serif text-base md:text-lg leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}
              >
                {proposalStory}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── Editorial: large italic pull-quote style, left-aligned, generous space ──
  if (isEditorial) {
    return (
      <section id="story" className="px-8 md:px-20 py-20 md:py-32">
        <p
          className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
          style={{ color: 'var(--wedding-primary)' }}
        >
          Our Story
        </p>

        <div className="max-w-3xl">
          {loveStory && (
            <div className="mb-16">
              <h3
                className="text-2xl md:text-3xl font-serif font-medium tracking-tight mb-6"
                style={{ color: 'var(--wedding-foreground)' }}
              >
                How We Met
              </h3>
              <p
                className="font-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.75 }}
              >
                {loveStory}
              </p>
            </div>
          )}

          {proposalStory && (
            <div>
              <h3
                className="text-2xl md:text-3xl font-serif font-medium tracking-tight mb-6"
                style={{ color: 'var(--wedding-foreground)' }}
              >
                The Proposal
              </h3>
              <p
                className="font-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.75 }}
              >
                {proposalStory}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── Classic: centered, elegant ──
  return (
    <section id="story" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-10"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          Our Story
        </h2>

        {loveStory && (
          <div className="mb-12">
            <h3
              className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--wedding-primary)' }}
            >
              How We Met
            </h3>
            <p
              className="font-serif italic text-lg md:text-xl leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}
            >
              {loveStory}
            </p>
          </div>
        )}

        {proposalStory && (
          <div>
            <h3
              className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--wedding-primary)' }}
            >
              The Proposal
            </h3>
            <p
              className="font-serif italic text-lg md:text-xl leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}
            >
              {proposalStory}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
