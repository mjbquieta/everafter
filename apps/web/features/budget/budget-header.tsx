import type { BudgetSummaryResponse } from '@everafter/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}

export function BudgetHeader({
  summary,
  isLoading,
}: {
  summary?: BudgetSummaryResponse;
  isLoading: boolean;
}) {
  if (isLoading || !summary) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="h-3 w-16 bg-border/60 rounded animate-pulse mb-2" />
              <div className="h-6 w-24 bg-border/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="h-3 w-32 bg-border/60 rounded animate-pulse mb-2" />
          <div className="h-2 w-full bg-border/60 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  const remaining = summary.totalEstimated - summary.totalActual;
  const pct =
    summary.totalEstimated > 0
      ? Math.round((summary.totalPaid / summary.totalEstimated) * 100)
      : 0;
  const clampedPct = Math.min(pct, 100);

  const isOver = pct > 100;
  const isNear = pct >= 90 && pct <= 100;

  const barColor = isOver
    ? 'bg-red-500'
    : isNear
      ? 'bg-amber-500'
      : 'bg-primary';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Estimated" value={formatCurrency(summary.totalEstimated)} />
        <Stat label="Actual Spent" value={formatCurrency(summary.totalActual)} accent />
        <Stat label="Total Paid" value={formatCurrency(summary.totalPaid)} />
        <Stat
          label="Remaining"
          value={formatCurrency(remaining)}
          accent={remaining < 0}
        />
      </div>

      {/* Utilization bar */}
      {summary.totalEstimated > 0 && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-muted">
              Budget Utilization &mdash;{' '}
              <span className="font-medium text-foreground">{pct}%</span> paid
            </p>
            {isOver && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
                Exceeded by {formatCurrency(summary.totalPaid - summary.totalEstimated)}
              </span>
            )}
            {isNear && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                Approaching Limit
              </span>
            )}
          </div>
          <div className="h-2 w-full rounded-full bg-border/60">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${clampedPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
