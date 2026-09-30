'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import type { ChecklistItemResponse } from '@everafter/types';

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH: { label: 'High', className: 'bg-error/10 text-error' },
  MEDIUM: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  LOW: { label: 'Low', className: 'bg-border/40 text-muted' },
};

interface TaskItemProps {
  item: ChecklistItemResponse;
  onToggle: (itemId: string, completed: boolean) => void;
  onEdit: (item: ChecklistItemResponse) => void;
  onDelete: (itemId: string) => void;
}

export function TaskItem({ item, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompleted = !!item.completedAt;
  const priority = priorityConfig[item.priority] ?? priorityConfig.MEDIUM;

  const now = new Date();
  const dueDate = item.dueDate ? new Date(item.dueDate) : null;
  const isOverdue = !isCompleted && dueDate && dueDate < now;
  const isDueSoon =
    !isCompleted &&
    dueDate &&
    !isOverdue &&
    dueDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000;

  return (
    <div className={`checklist-print-item flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
      isCompleted
        ? 'border-border/60 bg-stone-50/50 opacity-70'
        : isOverdue
          ? 'border-red-200 bg-red-50/30'
          : 'border-border bg-surface'
    }`}>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => onToggle(item.id, !isCompleted)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary accent-primary cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted' : 'text-foreground'}`}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-muted mt-0.5 truncate">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${priority.className}`}>
            {priority.label}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Done
            </span>
          )}
          {isOverdue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </span>
          )}
          {isDueSoon && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              <AlertCircle className="h-3 w-3" />
              Due soon
            </span>
          )}
          {dueDate && (
            <span className={`inline-flex items-center gap-1 text-[11px] ${isOverdue ? 'text-red-600' : 'text-muted'}`}>
              <Calendar className="h-3 w-3" />
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="relative shrink-0 print:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-primary/5 hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-border bg-surface py-1 shadow-lg">
              <button
                onClick={() => { setMenuOpen(false); onEdit(item); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-primary/5"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(item.id); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-error hover:bg-error/5"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
