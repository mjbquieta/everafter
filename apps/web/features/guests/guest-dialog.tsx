'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button, Input, Label } from '@everafter/ui';
import type { GuestResponse } from '@everafter/types';

const guestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  side: z.string().optional(),
  group: z.string().optional(),
  tableNumber: z.string().optional(),
  mealPreference: z.string().optional(),
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;

interface GuestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormData) => Promise<void>;
  guest?: GuestResponse | null;
  isSubmitting: boolean;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export function GuestDialog({
  open,
  onClose,
  onSubmit,
  guest,
  isSubmitting,
}: GuestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      side: '',
      group: '',
      tableNumber: '',
      mealPreference: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: guest?.firstName ?? '',
        lastName: guest?.lastName ?? '',
        email: guest?.email ?? '',
        phone: guest?.phone ?? '',
        side: guest?.side ?? '',
        group: guest?.group ?? '',
        tableNumber: guest?.tableNumber ?? '',
        mealPreference: guest?.mealPreference ?? '',
        notes: guest?.notes ?? '',
      });
    }
  }, [open, guest, reset]);

  if (!open) return null;

  const title = guest ? 'Edit Guest' : 'Add Guest';

  const handleFormSubmit = async (data: GuestFormData) => {
    const cleaned = {
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
      side: data.side || undefined,
      group: data.group || undefined,
      tableNumber: data.tableNumber || undefined,
      mealPreference: data.mealPreference || undefined,
      notes: data.notes || undefined,
    };
    await onSubmit(cleaned);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-6 py-5 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" error={errors.firstName?.message}>
              <Input
                {...register('firstName')}
                error={!!errors.firstName}
                placeholder="First name"
              />
            </FormField>
            <FormField label="Last Name" error={errors.lastName?.message}>
              <Input
                {...register('lastName')}
                error={!!errors.lastName}
                placeholder="Last name"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" error={errors.email?.message}>
              <Input
                {...register('email')}
                type="email"
                error={!!errors.email}
                placeholder="email@example.com"
              />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input
                {...register('phone')}
                placeholder="+63 912 345 6789"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Side">
              <select
                {...register('side')}
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="">None</option>
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </FormField>
            <FormField label="Group">
              <Input {...register('group')} placeholder="e.g. Family, VIP" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Table Number">
              <Input
                {...register('tableNumber')}
                placeholder="e.g. Table 1"
              />
            </FormField>
            <FormField label="Meal Preference">
              <Input
                {...register('mealPreference')}
                placeholder="e.g. Vegetarian"
              />
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : guest ? 'Save Changes' : 'Add Guest'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
