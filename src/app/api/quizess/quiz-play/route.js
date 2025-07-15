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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    console.log('Received userId:', userId);
    let sql, params;

    if (userId) {
      sql = `SELECT COUNT(*) as count FROM quiz_analytics WHERE userId = ?`;
      params = [userId];
    } else {
      const ip = getClientIp(req);
      sql = `SELECT played FROM ip_quiz_analytic WHERE user_ip = ?`;
      params = [ip];
    }

    const [result] = await db.query(sql, params);
    console.log('Query result:', result);

    if (!result || result.length === 0) {
      return NextResponse.json({ played: false }, { status: 200 });
    }
    // Assuming max 5 quizzes allowed
    if (result[0].count >= 5) {
      return NextResponse.json({ played: true }, { status: 200 });
    }
    return NextResponse.json({ played: false }, { status: 200 });
  } catch (error) {
    console.error('Error checking quiz play status:', error);
    return NextResponse.json({ error: 'Failed to check quiz play status' }, { status: 400 });
  }
}
