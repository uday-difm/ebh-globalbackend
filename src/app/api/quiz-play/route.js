// app/api/ip-quiz-checker/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
  try {
    // Extract IP address safely
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    const sql = `SELECT played FROM ip_quiz_analytic WHERE user_ip = ?`;
    const [result] = await db.query(sql, [ip]);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error checking IP quiz play:', error);
    return NextResponse.json({ error: 'Failed to check quiz play status' }, { status: 400 });
  }
}
