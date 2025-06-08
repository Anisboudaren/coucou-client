import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('Middleware triggered for:', pathname);

  const token = req.cookies.get('token');
  console.log('Token:', token);

  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/v1/login') ||
    pathname.startsWith('/v1/register') ||
    pathname.startsWith('/v1/bubble') ||
    pathname.startsWith('/v1/bubble-window');

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/v1/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/v1/:path*'],
};
