interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${fmt(event.startDate)}/${fmt(event.endDate)}`,
  });

  if (event.location) params.set('location', event.location);
  if (event.description) params.set('details', event.description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent(event: CalendarEvent): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EverAfter//Wedding//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(event.startDate)}`,
    `DTEND:${fmt(event.endDate)}`,
    `SUMMARY:${event.title}`,
  ];

  if (event.location) lines.push(`LOCATION:${event.location}`);
  if (event.description) lines.push(`DESCRIPTION:${event.description}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcsFile(event: CalendarEvent): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildCalendarEvent(opts: {
  weddingDate: string | null;
  venueTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
}): CalendarEvent | null {
  if (!opts.weddingDate) return null;

  const base = new Date(opts.weddingDate);
  if (isNaN(base.getTime())) return null;

  // If venue has a time, use it
  if (opts.venueTime) {
    const t = new Date(opts.venueTime);
    if (!isNaN(t.getTime())) {
      base.setUTCHours(t.getUTCHours(), t.getUTCMinutes(), 0, 0);
    }
  }

  const endDate = new Date(base.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  const location = [opts.venueName, opts.venueAddress]
    .filter(Boolean)
    .join(', ');

  return {
    title: opts.venueName
      ? `Wedding — ${opts.venueName}`
      : 'Wedding Celebration',
    startDate: base,
    endDate,
    location: location || undefined,
  };
}
