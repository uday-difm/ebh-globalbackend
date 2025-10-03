import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '../../../../lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token'); 

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not set in environment variables');
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY);
    // Fetch full user details from the DB
    const [rows] = await db.query(
      `SELECT idauth as id, name, role, profile, username, profession, email, bio FROM auth WHERE idauth = ?`,
      [decoded.userId]
    );
    if (rows.length === 0) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }
    const user = rows[0];
    return NextResponse.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error('JWT verification error:', error);
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
