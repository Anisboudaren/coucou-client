// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/v1/login', '/v1/register'];

export function middleware(req: NextRequest) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  const token = req.cookies.get('token');
  console.log('Token:', token);
  const isPublic = publicPaths.includes(req.nextUrl.pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/v1/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/v1/:path*'],
};
