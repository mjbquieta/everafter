import Link from 'next/link';

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Log In', href: '/login' },
  { label: 'Register', href: '/register' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <span className="text-xl font-serif font-medium tracking-tight text-neutral-900">EverAfter</span>
            <p className="mt-1 text-sm text-muted">
              Plan your wedding. Share your story. Celebrate forever.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} EverAfter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
