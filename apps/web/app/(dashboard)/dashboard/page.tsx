'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeddingContext } from '@/lib/wedding-context';

export default function DashboardPage() {
  const router = useRouter();
  const { activeWedding, isLoading, weddings } = useWeddingContext();

  useEffect(() => {
    if (isLoading) return;

    if (activeWedding) {
      router.replace(`/dashboard/${activeWedding.id}`);
    } else if (weddings.length === 0) {
      router.replace('/dashboard/new');
    }
  }, [isLoading, activeWedding, weddings, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted">Loading...</p>
    </div>
  );
}
