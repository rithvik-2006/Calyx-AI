import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/dashboard', '/search', '/favorites', '/ai', '/progress', '/analytics', '/settings'];
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const token = request.cookies.get('auth_token')?.value;
  const payload = token ? await verifyToken(token) : null;

  if (isProtectedRoute && !payload) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && payload) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname === '/') {
    const destUrl = payload ? new URL('/dashboard', request.url) : new URL('/login', request.url);
    return NextResponse.redirect(destUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
