'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWeddingContext } from '@/lib/wedding-context';

export default function WeddingDashboardPage() {
  const params = useParams<{ weddingId: string }>();
  const { weddings, activeWedding, setActiveWedding } = useWeddingContext();

  useEffect(() => {
    if (params.weddingId && weddings.length > 0) {
      const match = weddings.find((w) => w.id === params.weddingId);
      if (match && match.id !== activeWedding?.id) {
        setActiveWedding(match);
      }
    }
  }, [params.weddingId, weddings, activeWedding?.id, setActiveWedding]);

  if (!activeWedding) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading wedding...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {activeWedding.title}
      </h1>
      <p className="mt-1 text-muted">
        Welcome to your wedding dashboard. More features coming soon.
      </p>
    </div>
  );
}
