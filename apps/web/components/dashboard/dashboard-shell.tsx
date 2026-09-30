'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">{children}</main>
      </div>
    </div>
  );
}
