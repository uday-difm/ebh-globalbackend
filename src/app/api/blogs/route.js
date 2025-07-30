// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const blogsSql = `
      SELECT b.*, DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
             bc.category_name, bc.category_slug
      FROM blogs b
      INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1 ORDER BY b.blog_date_time DESC`;
    const [blogs] = await db.query(blogsSql);

    const categoriesSql = 'SELECT * FROM `blog_category`';
    const [categories] = await db.query(categoriesSql);

    return NextResponse.json({
      blogs,
      categories,
    });
  } catch (error) {
    console.error("API Error (GET /api/blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
