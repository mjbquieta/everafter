'use client';

import { useState, useEffect } from 'react';
import { Search, X, Download, Upload, RotateCcw } from 'lucide-react';
import { Input, Button } from '@everafter/ui';
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
  summary?: GuestSummaryResponse;
  guests?: GuestResponse[];
  slug?: string;
  onImportClick?: () => void;
}

function escapeCsvField(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportGuestsCsv(guests: GuestResponse[], slug: string) {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Side', 'Group',
    'Table Number', 'RSVP Status', 'Meal Preference', 'Dietary Notes', 'Companions',
  ];

  const rows = guests.map((g) => [
    g.firstName,
    g.lastName,
    g.email,
    g.phone,
    g.side,
    g.group,
    g.tableNumber,
    g.rsvp?.status ?? 'PENDING',
    g.rsvp?.mealPreference ?? g.mealPreference,
    g.rsvp?.notes ?? g.notes,
    String(g.rsvp?.companionCount ?? 0),
  ].map(escapeCsvField).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `guests-${slug || 'export'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
  guests,
  slug,
  onImportClick,
}: GuestFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const hasActiveFilter = !!(localSearch || rsvpStatus || side || group);

  const handleClearAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onRsvpStatusChange('');
    onSideChange('');
    onGroupChange('');
  };

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

        {hasActiveFilter && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        )}

        {onImportClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onImportClick}
            className="shrink-0"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Import CSV
          </Button>
        )}

        {guests && guests.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportGuestsCsv(guests, slug ?? 'export')}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
}
