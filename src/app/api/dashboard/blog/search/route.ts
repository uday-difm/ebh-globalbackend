// src/app/api/blogs/search/route.js
import { NextResponse } from 'next/server';
import db from '../../../../../lib/db'; // adjust path if needed

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('discover') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Number(url.searchParams.get('limit') || '9'));
    const offset = (page - 1) * limit;

    // If no query provided, return empty result (or you could return recent published posts)
    if (!q) {
      return NextResponse.json({ blogs: [], total: 0, page, limit });
    }

    // Use parameterized LIKE query to avoid injection (wrap wildcard in param)
    const likeQ = `%${q.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;

    // Count total matches
    const countSql = `
      SELECT COUNT(*) AS total
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1
        AND bc.status = 1
        AND (
          b.blog_title LIKE ? OR
          b.blog_description LIKE ? OR
          b.blog_content LIKE ?
        )
    `;
    const [countRows] = await db.query(countSql, [likeQ, likeQ, likeQ]);
    const total = Number(countRows?.[0]?.total || 0);

    // Fetch paginated matches
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        b.blog_category_id,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1
        AND bc.status = 1
        AND (
          b.blog_title LIKE ? OR
          b.blog_description LIKE ? OR
          b.blog_content LIKE ?
        )
      ORDER BY b.blog_date_time DESC
      LIMIT ? OFFSET ?
    `;
    const params = [likeQ, likeQ, likeQ, limit, offset];
    const [rows] = await db.query(sql, params);

    return NextResponse.json({
      blogs: rows || [],
      total,
      page,
      limit,
      query: q,
    });
  } catch (err) {
    console.error('API Error /api/blogs/search:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
