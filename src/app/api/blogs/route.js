// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import db from "../../../lib/db"; // Ensure this path is correct for your database connection

async function getAllBlogsFromDB() {
  try {
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        DATE_FORMAT(b.blog_timestamp, "%Y-%m-%d") AS date,
        DATE_FORMAT(b.blog_timestamp, "%d %M %Y") AS formatted_date,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      ORDER BY b.blog_timestamp DESC;
    `;
    const [rows] = await db.query(sql); // db.query typically returns [rows, fields]
    return rows;
  } catch (error) {
    console.error("Error fetching blogs from DB in /api/blogs/route.js:", error);
    return []; // Return empty array on error
  }
}

async function getAllCategoriesFromDB() {
  try {
    const sql = `SELECT category_id, category_name, category_slug FROM blog_category ORDER BY category_name ASC;`;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    console.error("Error fetching categories from DB in /api/blogs/route.js:", error);
    return []; // Return empty array on error
  }
}

export async function GET() {
  try {
    const blogs = await getAllBlogsFromDB();
    const categories = await getAllCategoriesFromDB();

    return NextResponse.json({
      blogs,
      categories,
    });
  } catch (error) {
    console.error("API Error (GET /api/blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
