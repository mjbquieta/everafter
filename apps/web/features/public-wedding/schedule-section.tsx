'use client';

interface ScheduleEvent {
  time: string;
  title: string;
  description?: string;
}

interface ScheduleSectionProps {
  events: ScheduleEvent[];
  layout?: string;
}

export function ScheduleSection({ events, layout }: ScheduleSectionProps) {
  if (!events.length) return null;

  const isMagazine = layout === 'magazine';
  const isEditorial = layout === 'editorial';

  // ── Magazine ──
  if (isMagazine) {
    return (
      <section id="schedule" className="px-4 md:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2
            className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            Programme
          </h2>
          <div
            className="h-0.5 w-16 mb-10"
            style={{ backgroundColor: 'var(--wedding-primary)' }}
          />
          <div className="space-y-0">
            {events.map((event, i) => (
              <div
                key={i}
                className="py-5 border-t"
                style={{ borderColor: 'var(--wedding-primary)' }}
              >
                <p
                  className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                  style={{ color: 'var(--wedding-primary)' }}
                >
                  {event.time}
                </p>
                <h3
                  className="text-xl md:text-2xl font-serif font-bold tracking-tight"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Editorial ──
  if (isEditorial) {
    return (
      <section id="schedule" className="px-4 md:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p
            className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            style={{ color: 'var(--wedding-primary)' }}
          >
            Programme
          </p>
          <div className="space-y-10">
            {events.map((event, i) => (
              <div key={i}>
                <p
                  className="text-base md:text-lg font-serif mb-1"
                  style={{ color: 'var(--wedding-foreground)', opacity: 0.5 }}
                >
                  {event.time}
                </p>
                <h3
                  className="text-2xl md:text-3xl font-serif font-medium tracking-tight"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p
                    className="mt-2 text-base md:text-lg font-serif"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Classic — centered vertical timeline ──
  return (
    <section id="schedule" className="px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        <h2
          className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-center mb-12"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          Programme
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--wedding-primary)', opacity: 0.3 }}
          />
          <div className="space-y-8">
            {events.map((event, i) => (
              <div key={i} className="relative pl-12">
                {/* Dot */}
                <div
                  className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2"
                  style={{
                    borderColor: 'var(--wedding-primary)',
                    backgroundColor: 'var(--wedding-background)',
                  }}
                />
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-1"
                  style={{ color: 'var(--wedding-primary)' }}
                >
                  {event.time}
                </p>
                <h3
                  className="text-lg font-serif font-medium tracking-tight"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
