import { NextResponse } from "next/server";
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM blogs ORDER BY blog_timestamp DESC"
    );
    if (rows.length === 0) {
      return NextResponse.json({ message: "No blogs found" }, { status: 404 });
    }
    return NextResponse.json({ blogs: rows, total_blogs: rows.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Database error", error: error.message }, { status: 500 });
  }
}
