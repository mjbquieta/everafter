'use client';

import { useState, useEffect } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Input } from '@everafter/ui';
import type { GuestSummaryResponse, GuestResponse } from '@everafter/types';

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
  tableFilter: string;
  onTableFilterChange: (value: string) => void;
  tables: string[];
  summary?: GuestSummaryResponse;
  guests?: GuestResponse[];
  slug?: string;
  onImportClick?: () => void;
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
  tableFilter,
  onTableFilterChange,
  tables,
  summary,
  guests,
  slug,
  onImportClick,
}: GuestFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const hasActiveFilter = !!(localSearch || rsvpStatus || side || group || tableFilter);

  const handleClearAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onRsvpStatusChange('');
    onSideChange('');
    onGroupChange('');
    onTableFilterChange('');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search by name, email, or phone..."
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
          { value: 'ACCEPTED', label: 'Attending' },
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

      <FilterSelect
        label="Table"
        value={tableFilter}
        onChange={onTableFilterChange}
        options={[
          { value: '', label: 'All Tables' },
          { value: 'unassigned', label: 'Unassigned' },
          ...tables.map((t) => ({ value: t, label: t })),
        ]}
      />

      {hasActiveFilter && (
        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
