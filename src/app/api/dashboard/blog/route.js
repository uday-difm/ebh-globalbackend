import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const sql = `SELECT * FROM blogs ORDER BY blog_date_time DESC`;
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error in GET /api/dashboard/blog:', error);
    return NextResponse.json({ error: 'Error fetching blogs' }, { status: 500 });
  }
}
