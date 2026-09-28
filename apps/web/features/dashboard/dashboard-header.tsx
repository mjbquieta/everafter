'use client';

import Link from 'next/link';
import { Globe, UserPlus, Pencil } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { WeddingResponse, WeddingProfileResponse } from '@everafter/types';
import { useAuth } from '@/lib/auth-context';
import { Countdown } from './countdown';
import { HeaderSkeleton } from './skeleton';

interface DashboardHeaderProps {
  wedding: WeddingResponse;
  profile?: WeddingProfileResponse;
  isLoading: boolean;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader({
  wedding,
  profile,
  isLoading,
}: DashboardHeaderProps) {
  const { user } = useAuth();

  if (isLoading) return <HeaderSkeleton />;

  const coupleNames =
    profile?.brideName && profile?.groomName
      ? `${profile.brideName} & ${profile.groomName}`
      : user?.firstName ?? 'there';

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {getGreeting()}, {coupleNames}
      </h1>

      <div className="mt-3">
        <Countdown
          weddingDate={wedding.weddingDate}
          timezone={wedding.timezone}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/${wedding.slug}`} target="_blank">
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-1.5" />
            View Public Website
          </Button>
        </Link>
        <Link href={`/dashboard/${wedding.id}/guests`}>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add Guest
          </Button>
        </Link>
        <Link href={`/dashboard/${wedding.id}/settings`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
