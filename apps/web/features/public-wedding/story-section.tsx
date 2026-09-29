interface StorySectionProps {
  proposalStory: string | null;
  loveStory: string | null;
}

export function StorySection({ proposalStory, loveStory }: StorySectionProps) {
  if (!proposalStory && !loveStory) return null;

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
