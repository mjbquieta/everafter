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
      <section id="story">
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

        <div className="space-y-8">
          {loveStory && (
            <div>
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
            <div>
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

  // ── Editorial: large italic pull-quote style ──
  if (isEditorial) {
    return (
      <section id="story">
        <p
          className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
          style={{ color: 'var(--wedding-primary)' }}
        >
          Our Story
        </p>

        <div className="max-w-2xl">
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

  // ── Classic: centered, elegant, constrained reading width ──
  return (
    <section id="story">
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
