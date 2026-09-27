'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@everafter/ui';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.firstName}!
        </h1>
        <p className="mt-2 text-muted">
          You&apos;re signed in as {user?.email}
        </p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Sign out
      </Button>
    </main>
  );
}
