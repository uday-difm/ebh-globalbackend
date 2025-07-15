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
    if (result.length > 0) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json([{ played: false }], { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching IP play status:', error);
    return NextResponse.json({ error: 'Failed to fetch IP play status' }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const checkSql = `SELECT played FROM ip_quiz_analytic WHERE user_ip = ?`;
    const [existing] = await db.query(checkSql, [ip]);
    if (existing.length > 0) {
      // Update played status if needed
      const updateSql = `UPDATE ip_quiz_analytic SET played = 1 WHERE user_ip = ?`;
      await db.query(updateSql, [ip]);
    } else {
      // Insert new record
      const insertSql = `INSERT INTO ip_quiz_analytic (user_ip, played) VALUES (?, 1)`;
      await db.query(insertSql, [ip]);
    }
    return NextResponse.json({ message: 'IP play status saved' }, { status: 200 });
  } catch (error) {
    console.error('Error saving IP play status:', error);
    return NextResponse.json({ error: 'Failed to save IP play status' }, { status: 400 });
  }
}
