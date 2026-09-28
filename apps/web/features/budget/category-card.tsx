'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@everafter/ui';
import type { BudgetCategoryResponse, BudgetItemResponse } from '@everafter/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Paid', className: 'bg-success/10 text-success' },
  PARTIAL: { label: 'Partial', className: 'bg-warning/10 text-warning' },
  PENDING: { label: 'Unpaid', className: 'bg-border/40 text-muted' },
  CANCELLED: { label: 'Cancelled', className: 'bg-error/10 text-error' },
};

function ItemActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-primary/5 hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-border bg-surface py-1 shadow-lg">
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-primary/5"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-error hover:bg-error/5"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: BudgetCategoryResponse;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: BudgetItemResponse) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoryCard({
  category,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteCategory,
}: CategoryCardProps) {
  const [expanded, setExpanded] = useState(true);

  const totalEstimated = category.items.reduce((s, i) => s + i.estimatedCost, 0);
  const totalActual = category.items.reduce((s, i) => s + i.actualCost, 0);
  const totalPaid = category.items.reduce((s, i) => s + i.amountPaid, 0);
  const paidPct = totalActual > 0 ? Math.min(100, Math.round((totalPaid / totalActual) * 100)) : 0;

  return (
    <div className="rounded-lg border border-border bg-surface">
      {/* Category header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {category.name}
          <span className="text-xs text-muted font-normal">
            ({category.items.length} item{category.items.length !== 1 ? 's' : ''})
          </span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{formatCurrency(totalActual)}</span>
          <Button variant="ghost" size="sm" onClick={() => onAddItem(category.id)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="text-muted hover:text-error transition-colors"
            title="Delete category"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center justify-between text-[11px] text-muted mb-1">
          <span>Paid: {formatCurrency(totalPaid)}</span>
          <span>{paidPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border/60">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${paidPct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      {expanded && (
        <div>
          {category.items.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted">No items yet.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onAddItem(category.id)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Expense
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-4 py-2 text-left font-medium">Vendor</th>
                  <th className="px-4 py-2 text-right font-medium hidden sm:table-cell">Estimated</th>
                  <th className="px-4 py-2 text-right font-medium">Actual</th>
                  <th className="px-4 py-2 text-right font-medium hidden md:table-cell">Paid</th>
                  <th className="px-4 py-2 text-center font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium hidden lg:table-cell">Due</th>
                  <th className="px-4 py-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {category.items.map((item) => {
                  const cfg = statusConfig[item.paymentStatus] ?? statusConfig.PENDING;
                  return (
                    <tr key={item.id} className="border-t border-border hover:bg-primary/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-foreground">
                        {item.vendorName || '—'}
                        {item.notes && (
                          <p className="text-[11px] text-muted truncate max-w-[200px]">{item.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted hidden sm:table-cell">
                        {formatCurrency(item.estimatedCost)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-foreground">
                        {formatCurrency(item.actualCost)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted hidden md:table-cell">
                        {formatCurrency(item.amountPaid)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.className}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted text-xs hidden lg:table-cell">
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <ItemActions
                          onEdit={() => onEditItem(category.id, item)}
                          onDelete={() => onDeleteItem(category.id, item.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
