import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id query parameter' }, { status: 400 });
  }

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

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);

        // Parse options JSON string if needed
        const parsedRows = rows.map(row => ({
          ...row,
          options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
        }));

        resolve(parsedRows);
      });
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching detailed quiz analytics:', error);
    return NextResponse.json({ error: 'Error in fetching detailed quiz analytics' }, { status: 400 });
  }
}
