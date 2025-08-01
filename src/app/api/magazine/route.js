// app/api/magazines/route.js
import { NextResponse } from 'next/server';
import db from "../../../lib/db"; // Ensure this path is correct relative to this file

export async function GET(request) {
  try {
    const sql = `SELECT * FROM magazines WHERE status = 1 ORDER BY magazine_date DESC`;
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in GET /api/magazines:", error);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ error: "Error fetching magazines" }, { status: 500 });
  }
}

// // New API: /api/magazine/magazineFetch
// export async function magazineFetch(request) {
//   try {
//     const sql = `SELECT * FROM magazines WHERE status = 1 ORDER BY magazine_date DESC`;
//     const [rows] = await db.query(sql);
//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error("Error in magazineFetch /api/magazine:", error);
//     return NextResponse.json({ error: "Error fetching magazines" }, { status: 500 });
//   }
// }


