// import { NextResponse } from 'next/server';
// import { verifyToken } from './lib/jwt'; // Make sure this is JS-compatible

// const protectedPaths = ['/dashboard'];

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   const isProtected = protectedPaths.some((path) =>
//     pathname.startsWith(path)
//   );

//   const isLoginPage = pathname === '/dashboard/login';

//   if (!isProtected || isLoginPage) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get('auth_token')?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL('/dashboard/login', request.url));
//   }

//   const verified = await verifyToken(token);

//   if (!verified) {
//     return NextResponse.redirect(new URL('/dashboard/login', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*'], // Apply middleware to /dashboard and all subroutes
// };

                                                

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Middleware handler
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow open access to login page
  if (pathname === '/dashboard/login') {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('auth_token')?.value;

  // If no token, redirect to login
  if (!authToken) {
    console.log('No token found, redirecting to login.');
    const loginUrl = new URL('/dashboard/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not set in environment variables');
    const loginUrl = new URL('/dashboard/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    await jwtVerify(authToken, secret);

    // Valid token, proceed
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);

    // Invalid token, redirect and clear cookie
    const loginUrl = new URL('/dashboard/login', request.url);
    const response = NextResponse.redirect(loginUrl);

    response.cookies.set('auth_token', '', {
      // httpOnly: true,
      httpOnly: false,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return response;
  }
}

// Protect everything under /dashboard, except /dashboard/login
export const config = {
  matcher: ['/dashboard/:path*'],
};
