'use client';

import { Button } from '@everafter/ui';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  guestName: string;
  isDeleting: boolean;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  guestName,
  isDeleting,
}: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Delete Guest
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-foreground">
                Are you sure you want to delete{' '}
                <span className="font-medium">{guestName}</span>?
              </p>
              <p className="mt-1 text-xs text-muted">
                This action cannot be undone. Any RSVP data for this guest will
                also be removed.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
