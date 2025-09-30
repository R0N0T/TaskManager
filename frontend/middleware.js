import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Handle auth pages (login, signup)
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check auth for other pages
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add token to API requests
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${token}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}