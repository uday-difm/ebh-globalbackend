// --- Code for: src/app/api/categoriesHome/route.js ---

import { NextResponse } from 'next/server';
import db from "../../../lib/db"; // Ensure this path is correct for your database connection

async function getAllCategoriesFromDB() {
  try {
    const sql = `
      SELECT
        category_id,
        category_name,
        category_slug
      FROM blog_category
      ORDER BY category_name ASC;
    `;
    const [rows] = await db.query(sql);

    // Manually add an "All" category at the beginning of the list
    const categoriesWithAll = [{
      category_id: 'all', // A unique ID for "All"
      category_name: 'All',
      category_slug: 'All'
    }, ...rows];

    return categoriesWithAll;
  } catch (error) {
    // console.error("Error fetching all categories from DB in /api/categoriesHome/route.js:", error);
    return []; // Return empty array on error
  }
}

export async function GET() {
  try {
    const categories = await getAllCategoriesFromDB();
    // Return an object with a 'categories' key
    return NextResponse.json({ categories });
  } catch (error) {
    // console.error("API Error (GET /api/categoriesHome):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}