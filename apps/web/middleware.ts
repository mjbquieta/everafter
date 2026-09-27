import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password'];
const PROTECTED_PREFIX = '/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshCookie = request.cookies.has('ea_refresh');

  if (pathname.startsWith(PROTECTED_PREFIX) && !hasRefreshCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (AUTH_PAGES.includes(pathname) && hasRefreshCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
};
