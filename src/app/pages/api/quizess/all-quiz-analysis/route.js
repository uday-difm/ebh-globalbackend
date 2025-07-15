import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '../../../../lib/db';

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get('token');

  // Fallback: check Authorization header for Bearer token
  if (!token) {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = { value: authHeader.substring(7) };
    }
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    console.log('Decoded userId:', userId);

    const sql = `
      SELECT 
        qa.quizId, 
        qa.choose_option, 
        qa.created_at, 
        q.question, 
        q.options, 
        q.correctAnswer, 
        q.explanation 
      FROM quiz_analytics qa
      JOIN quizzes q ON qa.quizId = q._id
      WHERE qa.userId = ?
      ORDER BY qa.created_at DESC
    `;

    // Safe JSON parse helper
    const safeParse = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error('Failed to parse options JSON:', str, e);
        return [];
      }
    };

    // Use promise-based db.query
    const [results] = await db.query(sql, [userId]);
    console.log('DB query results count:', results.length);

    // Parse options safely
    const parsedResults = results.map(row => ({
      ...row,
      options: typeof row.options === 'string' ? safeParse(row.options) : row.options
    }));

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('Authentication or database error:', error);
    return NextResponse.json({ error: 'Unauthorized or internal error' }, { status: 401 });
  }
}
