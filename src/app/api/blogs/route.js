// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInteger(searchParams.get('page'), 1);
    const limitParam = parseInteger(searchParams.get('limit'), 9);
    const limit = Math.min(Math.max(limitParam, 1), 50); // clamp to reasonable size
    const offset = (page - 1) * limit;

    const blogsSql = `
      SELECT 
        b.*, 
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        bc.category_name, 
        bc.category_slug
      FROM blogs b
      INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1
      ORDER BY b.blog_date_time DESC
      LIMIT ? OFFSET ?;
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM blogs
      WHERE status = 1;
    `;

    const categoriesSql = `
      SELECT 
        category_id,
        category_name,
        category_slug
      FROM blog_category
      WHERE status = 1
      ORDER BY category_name ASC;
    `;

  const [countRows] = await db.query(countSql);
  const total = countRows?.[0]?.total ?? 0;

  const [blogs] = await db.query(blogsSql, [limit, offset]);
  const [categories] = await db.query(categoriesSql);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
      },
      categories,
    });
  } catch (error) {
    console.error('API Error (GET /api/blogs):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
