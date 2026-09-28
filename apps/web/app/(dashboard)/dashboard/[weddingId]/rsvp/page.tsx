'use client';

import { Mail } from 'lucide-react';

export default function RSVPPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">RSVP Management</h1>
      <p className="text-muted max-w-md">
        RSVP tracking and invitation management coming soon. In the meantime,
        guests can RSVP through your published wedding website.
      </p>
    </div>
  );
}
