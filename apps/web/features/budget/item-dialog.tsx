'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button, Input, Label } from '@everafter/ui';
import type { BudgetItemResponse } from '@everafter/types';

const itemSchema = z.object({
  vendorName: z.string().optional(),
  estimatedCost: z.number().min(0, 'Must be 0 or more'),
  actualCost: z.number().min(0, 'Must be 0 or more'),
  amountPaid: z.number().min(0, 'Must be 0 or more'),
  paymentStatus: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  item?: BudgetItemResponse | null;
  isSubmitting: boolean;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export function ItemDialog({ open, onClose, onSubmit, item, isSubmitting }: ItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      vendorName: '',
      estimatedCost: 0,
      actualCost: 0,
      amountPaid: 0,
      paymentStatus: 'PENDING',
      dueDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        vendorName: item?.vendorName ?? '',
        estimatedCost: item?.estimatedCost ?? 0,
        actualCost: item?.actualCost ?? 0,
        amountPaid: item?.amountPaid ?? 0,
        paymentStatus: item?.paymentStatus ?? 'PENDING',
        dueDate: item?.dueDate ? item.dueDate.slice(0, 10) : '',
        notes: item?.notes ?? '',
      });
    }
  }, [open, item, reset]);

  if (!open) return null;

  const title = item ? 'Edit Expense' : 'Add Expense';

  const handleFormSubmit = async (data: ItemFormData) => {
    await onSubmit({
      ...data,
      vendorName: data.vendorName || undefined,
      dueDate: data.dueDate || undefined,
      notes: data.notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
          <FormField label="Vendor Name" error={errors.vendorName?.message}>
            <Input {...register('vendorName')} placeholder="e.g. Grand Hyatt Manila" />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Estimated (₱)" error={errors.estimatedCost?.message}>
              <Input {...register('estimatedCost', { valueAsNumber: true })} type="number" min={0} step="0.01" />
            </FormField>
            <FormField label="Actual (₱)" error={errors.actualCost?.message}>
              <Input {...register('actualCost', { valueAsNumber: true })} type="number" min={0} step="0.01" />
            </FormField>
            <FormField label="Paid (₱)" error={errors.amountPaid?.message}>
              <Input {...register('amountPaid', { valueAsNumber: true })} type="number" min={0} step="0.01" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Payment Status">
              <select
                {...register('paymentStatus')}
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="PENDING">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </FormField>
            <FormField label="Due Date">
              <Input {...register('dueDate')} type="date" />
            </FormField>
          </div>

          <FormField label="Notes">
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Additional notes..."
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : item ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
