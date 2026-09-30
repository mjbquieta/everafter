'use client';

import { Button } from '@everafter/ui';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  description?: string;
  isDeleting: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
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
                This action cannot be undone. Are you sure you want to remove{' '}
                <span className="font-medium">{itemName}</span>?
              </p>
              {description && (
                <p className="mt-1 text-xs text-muted">{description}</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center font-medium transition-colors rounded-md h-10 px-4 text-sm bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
