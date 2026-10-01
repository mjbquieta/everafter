'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RSVPRedirectPage() {
  const params = useParams<{ weddingId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/${params.weddingId}/guests?tab=rsvp`);
  }, [params.weddingId, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted">Redirecting to RSVP tab...</p>
    </div>
  );
}
