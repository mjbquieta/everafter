'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Plus, Link2 } from 'lucide-react';
import { toast } from 'sonner';
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

  const handleCopySiteLink = async () => {
    if (!activeWedding) return;
    const url = `${window.location.origin}/${activeWedding.slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success('Wedding link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-surface px-6">
      <span className="text-xl font-serif font-medium tracking-tight text-neutral-900">EverAfter</span>

      <div className="flex-1 flex justify-center items-center gap-3">
        {activeWedding && (
          <>
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

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                activeWedding.status === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-stone-50 text-stone-600 border-stone-200/60'
              }`}
            >
              {activeWedding.status === 'PUBLISHED' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {activeWedding.status === 'PUBLISHED' ? 'Published' : 'Draft'}
            </span>

            {/* Copy Link Button */}
            <button
              onClick={handleCopySiteLink}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Copy site link"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Copy Link</span>
            </button>
          </>
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
