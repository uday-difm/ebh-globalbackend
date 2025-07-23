import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

async function getQuizStatsForPeriod(userId, dateCondition = '') {
  const sql = `SELECT 
    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct,
    SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong,
    COUNT(*) AS total
    FROM quiz_analytics
    WHERE userId = ? ${dateCondition}`;
  const [rows] = await db.query(sql, [userId]);
  const correct = rows[0].correct || 0;
  const wrong = rows[0].wrong || 0;
  const total = rows[0].total || 0;
  const percent = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
  return { correct, wrong, total, percent };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  const dateCondition = 'AND YEAR(created_at) = YEAR(CURDATE())';
  const stats = await getQuizStatsForPeriod(userId, dateCondition);
  return NextResponse.json(stats);
} 