'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useWeddingContext } from '@/lib/wedding-context';

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { weddings, activeWedding, setActiveWedding } = useWeddingContext();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWeddingMenu, setShowWeddingMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const weddingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        weddingMenuRef.current &&
        !weddingMenuRef.current.contains(e.target as Node)
      ) {
        setShowWeddingMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-surface px-6">
      <span className="text-primary font-semibold text-lg">EverAfter</span>

      <div className="flex-1 flex justify-center">
        {activeWedding && (
          <div ref={weddingMenuRef} className="relative">
            <button
              onClick={() => setShowWeddingMenu(!showWeddingMenu)}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground cursor-pointer hover:text-primary"
            >
              {activeWedding.title}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showWeddingMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-md border border-border bg-surface shadow-lg py-1 z-50">
                {weddings.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActiveWedding(w);
                      setShowWeddingMenu(false);
                      router.push(`/dashboard/${w.id}`);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      w.id === activeWedding.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-primary/5'
                    }`}
                  >
                    {w.title}
                  </button>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowWeddingMenu(false);
                      router.push('/dashboard/new');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Wedding
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={userMenuRef} className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground"
        >
          {initials}
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-border bg-surface shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
