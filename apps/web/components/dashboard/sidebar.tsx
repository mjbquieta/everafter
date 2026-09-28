'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Users,
  Mail,
  DollarSign,
  CheckSquare,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useWeddingContext } from '@/lib/wedding-context';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'Wedding Website', icon: Globe, path: '/website' },
  { label: 'Guests', icon: Users, path: '/guests' },
  { label: 'RSVP', icon: Mail, path: '/rsvp' },
  { label: 'Budget', icon: DollarSign, path: '/budget' },
  { label: 'Checklist', icon: CheckSquare, path: '/checklist' },
  { label: 'Gallery', icon: Image, path: '/gallery' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { activeWedding } = useWeddingContext();

  if (!activeWedding) {
    return (
      <aside
        className={`flex flex-col border-r border-border bg-surface transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <span
              key={item.label}
              className="relative flex items-center gap-3 px-4 py-2.5 text-sm text-muted/50 cursor-default"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </span>
          ))}
        </nav>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center border-t border-border py-3 text-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </aside>
    );
  }

  const basePath = `/dashboard/${activeWedding.id}`;

  return (
    <aside
      className={`flex flex-col border-r border-border bg-surface transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="flex-1 py-4">
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
              className={`relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:bg-primary/5 hover:text-foreground'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-primary" />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-border py-3 text-muted hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
