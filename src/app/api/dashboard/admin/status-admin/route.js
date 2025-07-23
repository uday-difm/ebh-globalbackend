import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');  ////changes

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not set in environment variables');
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY);
    // You can fetch more user details from the DB here if needed
    const user = { id: decoded.userId, name: decoded.name, role: decoded.role };
    return NextResponse.json({ isAuthenticated: true, user: user });
  } catch (error) {
    console.error('JWT verification error:', error);
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
