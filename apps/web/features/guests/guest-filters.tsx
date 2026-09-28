'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@everafter/ui';
import type { GuestSummaryResponse } from '@everafter/types';

interface GuestFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  rsvpStatus: string;
  onRsvpStatusChange: (value: string) => void;
  side: string;
  onSideChange: (value: string) => void;
  group: string;
  onGroupChange: (value: string) => void;
  groups: string[];
  summary?: GuestSummaryResponse;
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
      <span className="font-medium text-foreground">{value}</span>
      {label}
    </span>
  );
}

export function GuestFilters({
  search,
  onSearchChange,
  rsvpStatus,
  onRsvpStatusChange,
  side,
  onSideChange,
  group,
  onGroupChange,
  groups,
  summary,
}: GuestFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="space-y-4">
      {summary && (
        <div className="flex flex-wrap gap-2">
          <StatPill label="Invited" value={summary.totalGuests} />
          <StatPill label="Attending" value={summary.totalAttending} />
          <StatPill label="Pending" value={summary.rsvpPending} />
          <StatPill label="Declined" value={summary.rsvpDeclined} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterSelect
          label="RSVP Status"
          value={rsvpStatus}
          onChange={onRsvpStatusChange}
          options={[
            { value: '', label: 'All RSVP' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'DECLINED', label: 'Declined' },
            { value: 'PENDING', label: 'Pending' },
          ]}
        />

        <FilterSelect
          label="Side"
          value={side}
          onChange={onSideChange}
          options={[
            { value: '', label: 'All Sides' },
            { value: 'Bride', label: 'Bride' },
            { value: 'Groom', label: 'Groom' },
          ]}
        />

        {groups.length > 0 && (
          <FilterSelect
            label="Group"
            value={group}
            onChange={onGroupChange}
            options={[
              { value: '', label: 'All Groups' },
              ...groups.map((g) => ({ value: g, label: g })),
            ]}
          />
        )}
      </div>
    </div>
  );
}
