import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '../../../../../lib/db';

export async function GET() {
  try {
    const cookieStore = cookies(); // ✅ no await
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not set');
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY);

    // ✅ Fix DB query shape
    const [rows] = await db.query('SELECT * FROM `admin` WHERE `id` = ?', [decoded.id]);
    const userFromDb = rows[0];
    // console.log('User fetched from DB:', userFromDb);

    if (!userFromDb) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const user = {
      id: userFromDb.id,
      name: userFromDb.name,
      role: userFromDb.role,
      email: userFromDb.email,
    };

    return NextResponse.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error('Error in status-admin route:', error);
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
