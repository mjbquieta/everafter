'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeddingContext } from '@/lib/wedding-context';

export default function DashboardPage() {
  const router = useRouter();
  const { activeWedding, isLoading, weddings } = useWeddingContext();

  useEffect(() => {
    if (!isLoading && activeWedding) {
      router.replace(`/dashboard/${activeWedding.id}`);
    }
  }, [isLoading, activeWedding, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!isLoading && weddings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to EverAfter
        </h1>
        <p className="text-muted">
          You don&apos;t have any weddings yet. Create one to get started.
        </p>
      </div>
    );
  }

  return null;
}
