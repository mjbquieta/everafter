'use client';

import { useState, useEffect, useCallback } from 'react';

interface NavItem {
  id: string;
  label: string;
}

export type NavLayout = 'left' | 'center' | 'right';

interface NavigationBarProps {
  items: NavItem[];
  coupleNames: string;
  hasBanner: boolean;
  layout?: NavLayout;
}

export function NavigationBar({ items, coupleNames, hasBanner, layout = 'left' }: NavigationBarProps) {
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? '');
  const [isScrolled, setIsScrolled] = useState(false);

  const useLightText = hasBanner && !isScrolled;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 80);

    const offsets = items.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return { id, top: Infinity };
      return { id, top: el.getBoundingClientRect().top };
    });

    const current = offsets.reduce((closest, item) => {
      if (item.top <= 120 && item.top > closest.top) return item;
      return closest;
    }, { id: items[0]?.id ?? '', top: -Infinity });

    if (current.id) setActiveSection(current.id);
  }, [items]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const textColor = (active: boolean) =>
    active
      ? useLightText ? '#fff' : 'var(--wedding-primary)'
      : useLightText ? 'rgba(255,255,255,0.7)' : 'var(--wedding-foreground)';

  const brandColor = useLightText ? '#fff' : 'var(--wedding-foreground)';
  const accentColor = useLightText ? '#fff' : 'var(--wedding-primary)';

  const navLinks = (
    <ul className="hidden md:flex items-center gap-8">
      {items.map(({ id, label }) => (
        <li key={id}>
          <button
            onClick={() => scrollTo(id)}
            className="relative font-sans text-xs font-semibold uppercase tracking-[0.15em] py-1 transition-colors"
            style={{ color: textColor(activeSection === id) }}
          >
            {label}
            {activeSection === id && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-colors"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  const brand = (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="font-serif text-lg font-medium tracking-tight transition-colors"
      style={{ color: brandColor }}
    >
      {coupleNames}
    </button>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className={`mx-auto max-w-5xl flex items-center px-6 h-16 ${layout === 'center' ? 'justify-center' : 'justify-between'}`}>
        {layout === 'left' && (
          <>
            {navLinks}
            {brand}
          </>
        )}
        {layout === 'center' && navLinks}
        {layout === 'right' && (
          <>
            {brand}
            {navLinks}
          </>
        )}

        {/* Mobile menu */}
        <MobileMenu
          items={items}
          activeSection={activeSection}
          scrollTo={scrollTo}
          useLightText={useLightText}
          coupleNames={coupleNames}
        />
      </div>
    </nav>
  );
}

function MobileMenu({
  items,
  activeSection,
  scrollTo,
  useLightText,
  coupleNames,
}: {
  items: NavItem[];
  activeSection: string;
  scrollTo: (id: string) => void;
  useLightText: boolean;
  coupleNames: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    // Small delay so the overlay unmounts and body scroll restores before scrolling
    setTimeout(() => scrollTo(id), 50);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2"
        aria-label="Open menu"
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
          <line x1="0" y1="1" x2="22" y2="1" stroke={useLightText ? '#fff' : 'var(--wedding-foreground)'} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="8" x2="22" y2="8" stroke={useLightText ? '#fff' : 'var(--wedding-foreground)'} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="15" x2="22" y2="15" stroke={useLightText ? '#fff' : 'var(--wedding-foreground)'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-[#FAF9F7]/95 backdrop-blur-md flex flex-col">
          {/* Close button */}
          <div className="flex items-center justify-end px-6 h-16 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-stone-800"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1 -mt-16">
            {items.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="font-serif text-2xl py-3 transition-colors"
                style={{
                  color: activeSection === id ? 'var(--wedding-primary)' : '#292524',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Couple names at bottom */}
          <div className="shrink-0 pb-10 text-center">
            <p className="font-serif text-sm tracking-wide text-stone-400">
              {coupleNames}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
