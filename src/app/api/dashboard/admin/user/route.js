import db from '../../../../../lib/db';

export async function GET(request) {
  try {
    // For simplicity, get userId from query param (in real app, get from auth token/session)
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

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
