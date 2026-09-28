'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, AlertCircle, Calendar } from 'lucide-react';
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

  const isOverdue = !isCompleted && item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <div className={`flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors ${
      isCompleted ? 'opacity-60' : ''
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
          {item.dueDate && (
            <span className={`inline-flex items-center gap-1 text-[11px] ${isOverdue ? 'text-error' : 'text-muted'}`}>
              {isOverdue && <AlertCircle className="h-3 w-3" />}
              <Calendar className="h-3 w-3" />
              {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
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
