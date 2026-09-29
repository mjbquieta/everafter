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
}: {
  items: NavItem[];
  activeSection: string;
  scrollTo: (id: string) => void;
  useLightText: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1 p-2"
        aria-label="Menu"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-0.5 w-5 rounded-full transition-colors"
            style={{ backgroundColor: useLightText ? '#fff' : 'var(--wedding-foreground)' }}
          />
        ))}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-4 top-14 z-50 min-w-[180px] rounded-lg bg-white shadow-lg border border-neutral-100 py-2">
            {items.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  scrollTo(id);
                  setOpen(false);
                }}
                className="block w-full px-5 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors"
                style={{
                  color: activeSection === id ? 'var(--wedding-primary)' : 'var(--wedding-foreground)',
                  backgroundColor: activeSection === id ? 'var(--wedding-secondary)' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
