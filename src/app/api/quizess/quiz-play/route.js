// app/api/ip-quiz-checker/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function GET(req) {
  try {
    const ip = getClientIp(req);

    const sql = `SELECT played FROM ip_quiz_analytic WHERE user_ip = ?`;
    const [result] = await db.query(sql, [ip]);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error checking IP quiz play:', error);
    return NextResponse.json({ error: 'Failed to check quiz play status' }, { status: 400 });
  }
}
