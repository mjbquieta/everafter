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

  const barColor =
    summary.overdueItems > 0
      ? 'bg-red-500'
      : pct >= 100
        ? 'bg-emerald-500'
        : 'bg-primary';

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="text-foreground font-medium">
            {summary.completedItems} of {summary.totalItems} tasks completed ({pct}%)
          </span>
          {summary.overdueItems > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
              {summary.overdueItems} overdue
            </span>
          )}
          {pct >= 100 && summary.totalItems > 0 && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              All done!
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-primary">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-border/60">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
