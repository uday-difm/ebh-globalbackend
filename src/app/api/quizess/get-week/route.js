import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const sql = `
    SELECT
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count,
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      (SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percent
    FROM quiz_analytics
    WHERE userId = ?
      AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
  `;
  try {
    const [result] = await db.query(sql, [userId]);
    return NextResponse.json(result[0] || { correct_count: 0, wrong_count: 0, percent: 0 });
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
