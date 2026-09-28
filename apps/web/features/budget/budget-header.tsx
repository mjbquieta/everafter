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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4">
            <div className="h-3 w-16 bg-border/60 rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-border/60 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const remaining = summary.totalEstimated - summary.totalActual;

  return (
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
  );
}
