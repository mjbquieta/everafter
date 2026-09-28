import type { ChecklistSummaryResponse } from '@everafter/types';

export function ChecklistHeader({
  summary,
  isLoading,
}: {
  summary?: ChecklistSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading || !summary) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-32 bg-border/60 rounded animate-pulse" />
          <div className="h-4 w-10 bg-border/60 rounded animate-pulse" />
        </div>
        <div className="h-2 w-full bg-border/60 rounded-full animate-pulse" />
      </div>
    );
  }

  const pct = summary.totalItems > 0
    ? Math.round((summary.completedItems / summary.totalItems) * 100)
    : 0;

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-foreground font-medium">
            {summary.completedItems} of {summary.totalItems} tasks completed
          </span>
          {summary.overdueItems > 0 && (
            <span className="text-error text-xs">
              {summary.overdueItems} overdue
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-primary">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-border/60">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
