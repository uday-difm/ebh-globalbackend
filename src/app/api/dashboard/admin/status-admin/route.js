import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '../../../../../lib/db';  // Make sure this points to your database connection

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

    // Fetch user details from the admin table
    const [userFromDb] = await db.query('SELECT * FROM `admin` WHERE `id` = ?', [decoded.id]);
       console.log('User fetched from DB:', userFromDb);

    if (!userFromDb) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    // You can map the fields you want to return from the database
    const user = {
      id: userFromDb.id,
      name: userFromDb.name,
      role: userFromDb.role,
      email: userFromDb.email,  // Include additional fields if necessary
    };

    return NextResponse.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error('JWT verification error:', error);
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
