import { NextResponse } from 'next/server';
import { verifyToken } from '../lib/jwt'; // Make sure this is JS-compatible

const protectedPaths = ['/dashboard'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isLoginPage = pathname === '/dashboard/login';

  if (!isProtected || isLoginPage) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  const verified = await verifyToken(token);

  if (!verified) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to /dashboard and all subroutes
};
