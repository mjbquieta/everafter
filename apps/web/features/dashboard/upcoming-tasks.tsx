'use client';

import { useMemo } from 'react';
import { Circle, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ChecklistItemResponse } from '@everafter/types';
import { SectionSkeleton } from './skeleton';

interface UpcomingTasksProps {
  items?: ChecklistItemResponse[];
  isLoading: boolean;
}

function priorityColor(priority: string) {
  switch (priority) {
    case 'HIGH':
      return 'text-error';
    case 'MEDIUM':
      return 'text-warning';
    default:
      return 'text-muted';
  }
}

export function UpcomingTasks({ items, isLoading }: UpcomingTasksProps) {
  const upcoming = useMemo(() => {
    if (!items) return [];
    return items
      .filter((t) => !t.completedAt)
      .sort((a, b) => {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        const pa = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
        const pb = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;
        if (pa !== pb) return pa - pb;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      })
      .slice(0, 5);
  }, [items]);

  if (isLoading) return <SectionSkeleton rows={4} />;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Next Up</h3>

      {upcoming.length === 0 ? (
        <p className="text-sm text-muted">
          No upcoming tasks. Add items to your checklist to see them here.
        </p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((task) => (
            <li key={task.id} className="flex items-start gap-3">
              <span className={`mt-0.5 ${priorityColor(task.priority)}`}>
                {task.priority === 'HIGH' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : task.completedAt ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-muted mt-0.5">
                    Due{' '}
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-medium ${priorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
