import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const [rows] = await db.query(
      'SELECT * FROM `admin` WHERE `email` = ?',
      [email]
    );

    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await signToken({ id: admin.id, email: admin.email });

    // Set cookie using Next.js cookies API
    cookies().set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 3, // 3 hours
      // secure: process.env.NODE_ENV === 'production', // Uncomment for prod
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
