import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPath = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';
  const isApiAuth = path.startsWith('/api/auth');
  
  // Skip middleware for non-admin routes and API auth endpoints
  if (!isAdminPath || isApiAuth) {
    return NextResponse.next();
  }
  
  // Get the auth token from cookies
  const token = request.cookies.get('adminToken')?.value;
  
  // If on login page and already logged in, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  // If not on login page and no token, redirect to login
  if (!isLoginPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    // Add the current URL as a query parameter so we can redirect back after login
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // For authenticated requests, add security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};
