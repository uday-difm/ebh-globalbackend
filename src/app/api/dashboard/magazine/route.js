import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const sql = `SELECT * FROM magazines WHERE status = 1 ORDER BY magazine_date DESC`;  //status add
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error in GET /api/dashboard/magazine:', error);
    return NextResponse.json({ error: 'Error fetching magazines' }, { status: 500 });
  }
}
