'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@everafter/ui';
import type { CreateGuestRequest } from '@everafter/types';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (guest: CreateGuestRequest) => Promise<unknown>;
}

const HEADER_MAP: Record<string, keyof CreateGuestRequest> = {
  'firstname': 'firstName',
  'first name': 'firstName',
  'first_name': 'firstName',
  'lastname': 'lastName',
  'last name': 'lastName',
  'last_name': 'lastName',
  'email': 'email',
  'phone': 'phone',
  'side': 'side',
  'group': 'group',
  'tablenumber': 'tableNumber',
  'table number': 'tableNumber',
  'table_number': 'tableNumber',
  'mealpreference': 'mealPreference',
  'meal preference': 'mealPreference',
  'meal_preference': 'mealPreference',
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCsv(text: string): { valid: CreateGuestRequest[]; skipped: number } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { valid: [], skipped: 0 };

  const headerRow = parseCsvLine(lines[0]);
  const colMap: (keyof CreateGuestRequest | null)[] = headerRow.map(
    (h) => HEADER_MAP[h.toLowerCase().trim()] ?? null,
  );

  const valid: CreateGuestRequest[] = [];
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};

    colMap.forEach((key, idx) => {
      if (key && fields[idx]) row[key] = fields[idx];
    });

    if (!row.firstName || !row.lastName) {
      skipped++;
      continue;
    }

    valid.push({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email || undefined,
      phone: row.phone || undefined,
      side: row.side || undefined,
      group: row.group || undefined,
      tableNumber: row.tableNumber || undefined,
      mealPreference: row.mealPreference || undefined,
    });
  }

  return { valid, skipped };
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const [parsed, setParsed] = useState<{ valid: CreateGuestRequest[]; skipped: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setParsed(parseCsv(text));
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    if (!parsed?.valid.length) return;
    setImporting(true);
    let created = 0;
    let failed = 0;

    for (const guest of parsed.valid) {
      try {
        await onImport(guest);
        created++;
      } catch {
        failed++;
      }
    }

    setImporting(false);
    setParsed(null);
    onClose();

    if (failed > 0) {
      toast.success(`Imported ${created} guests (${failed} failed)`);
    } else {
      toast.success(`Imported ${created} guests`);
    }
  };

  const handleClose = () => {
    setParsed(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Import Guests</h2>
          <button onClick={handleClose} className="text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!parsed ? (
          <div>
            <label className="flex flex-col items-center justify-center w-full h-36 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
              <FileSpreadsheet className="h-8 w-8 text-muted mb-2" />
              <span className="text-sm text-muted">Click to select a CSV file</span>
              <span className="text-xs text-muted mt-1">
                Headers: First Name, Last Name, Email, Phone, Side, Group, Table Number
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-background p-4 space-y-2">
              <p className="text-sm text-foreground font-medium">
                Ready to import {parsed.valid.length} guest{parsed.valid.length !== 1 ? 's' : ''}
              </p>
              {parsed.skipped > 0 && (
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-warning" />
                  {parsed.skipped} row{parsed.skipped !== 1 ? 's' : ''} skipped (missing first or last name)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClose} disabled={importing}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={importing || parsed.valid.length === 0}
              >
                <Upload className="h-4 w-4 mr-1.5" />
                {importing ? 'Importing...' : `Import ${parsed.valid.length}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
