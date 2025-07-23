// src/app/api/home-magazine/route.js
import { NextResponse } from 'next/server';
import db from "../../../lib/db"; // Ensure this path is correct relative to this file

// This function fetches all magazines and sorts them, then the GET handler will slice it.
// This is done to keep the database query simple and consistent.
async function getAllMagazinesForHome() {
  try {
    const sql = `SELECT * FROM magazines ORDER BY magazine_date DESC`;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    console.error("Error in getAllMagazinesForHome:", error);
    return []; // Return empty array on error
  }
}

export async function GET() {
  try {
    const allMagazines = await getAllMagazinesForHome();
    // Slice the array to get only the latest 1 magazine
    const latest1Magazine = allMagazines.slice(0, 1);

    return NextResponse.json(latest1Magazine);
  } catch (error) {
    console.error("API Error (GET /api/home-magazine):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
