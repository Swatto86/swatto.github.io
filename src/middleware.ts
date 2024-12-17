import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  // Handle download routes
  if (request.nextUrl.pathname.startsWith('/static/downloads/')) {
    // Security headers for downloads
    response.headers.set('Content-Type', 'application/octet-stream');
    response.headers.set('Content-Security-Policy', "default-src 'none'");
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Content-Disposition', 'attachment');
    
    return response;
  }

  // Handle Vercel feedback route
  if (request.nextUrl.pathname.includes('feedback')) {
    response = new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://vercel.live',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    });

    // Set the Vercel Live cookie with proper attributes
    response.cookies.set('__vercel_live_token', request.cookies.get('__vercel_live_token')?.value || '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.vercel.live',
      path: '/',
    });

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/static/downloads/:path*',
    '/feedback/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};