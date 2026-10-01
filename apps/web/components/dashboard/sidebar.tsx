'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Users,
  DollarSign,
  CheckSquare,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useWeddingContext } from '@/lib/wedding-context';
import { useChecklistItems } from '@/lib/hooks/use-dashboard';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'Wedding Website', icon: Globe, path: '/website' },
  { label: 'Guests & RSVP', icon: Users, path: '/guests' },
  { label: 'Budget', icon: DollarSign, path: '/budget' },
  { label: 'Checklist', icon: CheckSquare, path: '/checklist' },
  { label: 'Gallery', icon: Image, path: '/gallery' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { activeWedding } = useWeddingContext();
  const { data: checklistItems } = useChecklistItems(activeWedding?.id ?? '');

  const urgentTaskCount = useMemo(() => {
    if (!checklistItems) return 0;
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return checklistItems.filter((item) => {
      if (item.completedAt) return false;
      if (!item.dueDate) return false;
      const dueDate = new Date(item.dueDate);
      return dueDate <= sevenDaysFromNow;
    }).length;
  }, [checklistItems]);

  if (!activeWedding) {
    return (
      <aside
        className={`min-h-screen h-full flex flex-col border-r border-stone-200/80 bg-white transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <nav className="flex flex-col gap-2 p-3">
          {navItems.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted/50 cursor-default transition-colors"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </span>
          ))}
        </nav>
        <div className="mt-auto p-3 border-t border-stone-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-muted hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>
    );
  }

  const basePath = `/dashboard/${activeWedding.id}`;

  return (
    <aside
      className={`min-h-screen h-full flex flex-col border-r border-stone-200/80 bg-white transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive =
            item.path === ''
              ? pathname === basePath
              : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-rose-50/80 text-rose-950 font-semibold'
                  : 'text-muted hover:bg-stone-100/60 hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === 'Checklist' && urgentTaskCount > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-800 text-[11px] font-medium px-1.5 py-0.5 rounded-full">
                  {urgentTaskCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 border-t border-stone-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
