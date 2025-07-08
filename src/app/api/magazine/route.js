import { NextResponse } from 'next/server';

import db from "../../../../lib/db.js";

export async function GET(request) {
  try {
    const sql = `SELECT * FROM magazines ORDER BY magazine_date DESC`;
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error in GET /api/magazine:", error);
    return NextResponse.json({ error: "Error fetching magazines" }, { status: 500 });
  }
}


