'use client';

import { useParams } from 'next/navigation';
import { useWeddingContext } from '@/lib/wedding-context';
import {
  useGuestSummary,
  useBudgetSummary,
  useChecklistSummary,
  useChecklistItems,
  useGuests,
  useWeddingProfile,
} from '@/lib/hooks/use-dashboard';
import {
  DashboardHeader,
  GuestsCard,
  RSVPCard,
  BudgetCard,
  ChecklistCard,
  UpcomingTasks,
  RecentRSVPs,
} from '@/features/dashboard';

export default function WeddingDashboardPage() {
  const params = useParams<{ weddingId: string }>();
  const { activeWedding } = useWeddingContext();

  const weddingId = params.weddingId;

  const profile = useWeddingProfile(weddingId);
  const guestSummary = useGuestSummary(weddingId);
  const budgetSummary = useBudgetSummary(weddingId);
  const checklistSummary = useChecklistSummary(weddingId);
  const checklistItems = useChecklistItems(weddingId);
  const guests = useGuests(weddingId);

  if (!activeWedding) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading wedding...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DashboardHeader
        wedding={activeWedding}
        profile={profile.data}
        isLoading={profile.isLoading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GuestsCard
          data={guestSummary.data}
          isLoading={guestSummary.isLoading}
        />
        <RSVPCard
          data={guestSummary.data}
          isLoading={guestSummary.isLoading}
        />
        <BudgetCard
          data={budgetSummary.data}
          isLoading={budgetSummary.isLoading}
        />
        <ChecklistCard
          data={checklistSummary.data}
          isLoading={checklistSummary.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingTasks
          items={checklistItems.data}
          isLoading={checklistItems.isLoading}
        />
        <RecentRSVPs
          guests={guests.data}
          isLoading={guests.isLoading}
        />
      </div>
    </div>
  );
}
