import db from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/jwt';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Get auth_token cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication token missing' }), { status: 401 });
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 });
    }

    const userId = payload.id;

    const sql = `
      SELECT id as Id, name, email, image, number, bio 
      FROM admin
      WHERE id = ?
    `;          

    const [rows] = await db.query(sql, [userId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
