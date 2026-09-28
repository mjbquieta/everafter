'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button, Input, Label } from '@everafter/ui';
import { ChecklistPriority } from '@everafter/types';
import type { ChecklistItemResponse } from '@everafter/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum([ChecklistPriority.HIGH, ChecklistPriority.MEDIUM, ChecklistPriority.LOW]),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  item?: ChecklistItemResponse | null;
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

export function TaskDialog({ open, onClose, onSubmit, item, isSubmitting }: TaskDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '', priority: 'MEDIUM', dueDate: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: item?.title ?? '',
        description: item?.description ?? '',
        priority: (item?.priority as TaskFormData['priority']) ?? 'MEDIUM',
        dueDate: item?.dueDate ? item.dueDate.slice(0, 10) : '',
      });
    }
  }, [open, item, reset]);

  if (!open) return null;

  const title = item ? 'Edit Task' : 'Add Task';

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      ...data,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
          <FormField label="Title" error={errors.title?.message}>
            <Input {...register('title')} placeholder="e.g. Book photographer" error={!!errors.title} autoFocus />
          </FormField>

          <FormField label="Description">
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Optional details..."
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priority">
              <select
                {...register('priority')}
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </FormField>
            <FormField label="Due Date">
              <Input {...register('dueDate')} type="date" />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : item ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
