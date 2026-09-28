'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWeddingContext } from '@/lib/wedding-context';

export default function WeddingIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ weddingId: string }>();
  const { weddings, isLoading, activeWedding, setActiveWedding } =
    useWeddingContext();

  useEffect(() => {
    if (isLoading) return;

    if (weddings.length === 0) {
      router.replace('/dashboard/new');
      return;
    }

    const match = weddings.find((w) => w.id === params.weddingId);
    if (!match) {
      router.replace('/dashboard');
      return;
    }

    // Sync activeWedding to URL param
    if (activeWedding?.id !== match.id) {
      setActiveWedding(match);
    }
  }, [isLoading, weddings, params.weddingId, activeWedding?.id, setActiveWedding, router]);

  // Don't render children until we've confirmed the wedding belongs to this user
  if (isLoading || !weddings.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading wedding...</p>
      </div>
    );
  }

  const match = weddings.find((w) => w.id === params.weddingId);
  if (!match) {
    return null;
  }

  return <>{children}</>;
}
