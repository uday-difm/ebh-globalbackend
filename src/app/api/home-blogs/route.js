// --- MODIFIED Code for: src/app/api/home-blogs/route.js ---

import { NextResponse } from 'next/server';
import db from "../../../lib/db"; // Ensure this path is correct for your database connection

async function getLatestBlogsFromDB({ categorySlug = null, limit = 4, sortBy = 'blog_timestamp', order = 'DESC' }) {
  try {
    let sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        DATE_FORMAT(b.blog_timestamp, "%Y-%m-%d") AS date,
        DATE_FORMAT(b.blog_timestamp, "%d %M %Y") AS formatted_date,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1
    `;

    const queryParams = [];

    // If category filter is applied (and not "All"), add to WHERE clause
    if (categorySlug && categorySlug !== "All") {
      sql += ` AND bc.category_slug = ?`;
      queryParams.push(categorySlug);
    }

    // Add ORDER BY and LIMIT
    sql += ` ORDER BY b.${sortBy} ${order} LIMIT ?`;
    queryParams.push(limit);

    const [rows] = await db.query(sql, queryParams);
    return rows;
  } catch (error) {
    console.error("Error fetching latest blogs from DB in /api/home-blogs/route.js:", error);
    return [];
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category'); // Get category slug from URL
    const limit = parseInt(searchParams.get('limit') || '4', 10); // Get limit, default to 4
    const sortBy = searchParams.get('sortBy') || 'blog_timestamp';
    const order = searchParams.get('order') || 'DESC';

    const latestBlogs = await getLatestBlogsFromDB({ categorySlug, limit, sortBy, order });
    return NextResponse.json({ blogs: latestBlogs }); // Wrap in 'blogs' key for consistency
  } catch (error) {
    console.error("API Error (GET /api/home-blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}