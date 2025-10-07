// src/app/api/categoriesHome/route.js
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

const isDev = process.env.NODE_ENV !== 'production';

async function getCategoriesWithCounts() {
  const sql = `
    SELECT
      c.category_id,
      c.category_name,
      c.category_slug,
      COUNT(b.blog_id) AS blog_count
    FROM blog_category c
    LEFT JOIN blogs b
      ON b.blog_category_id = c.category_id
      AND b.status = 1
    WHERE c.status = 1
    GROUP BY c.category_id, c.category_name, c.category_slug
    ORDER BY c.category_name ASC
  `;
  const [rows] = await db.query(sql);
  return rows;
}

async function getRecentPublishedBlogs(limit = 9) {
  const sql = `
    SELECT
      b.blog_id,
      b.blog_title,
      b.blog_slug,
      b.blog_feature_image,
      b.blog_description,
      DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
      b.status,
      b.blog_category_id,
      bc.category_name,
      bc.category_slug
    FROM blogs b
    INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
    WHERE b.status = 1
    ORDER BY b.blog_date_time DESC
    LIMIT ?
  `;
  const [rows] = await db.query(sql, [Number(limit)]);
  return rows;
}

async function getTotalPublishedCount() {
  const sql = `SELECT COUNT(*) AS total FROM blogs WHERE status = 1`;
  const [rows] = await db.query(sql);
  return Number(rows?.[0]?.total || 0);
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit') ?? url.searchParams.get('blogsLimit') ?? '9';
    const limit = Math.max(1, Math.min(1000, Number(limitParam || 9)));

    // run queries in parallel
    const [categoriesRows, blogsRows, totalPublished] = await Promise.all([
      getCategoriesWithCounts(),
      getRecentPublishedBlogs(limit),
      getTotalPublishedCount()
    ]);

    const categories = [
      {
        category_id: 'all',
        category_name: 'All',
        category_slug: 'all',
        blog_count: totalPublished
      },
      ...categoriesRows
    ];

    return NextResponse.json({
      categories,
      blogs: blogsRows,
      totalPublished,
    });
  } catch (err) {
    // Log full error for debugging
    console.error('Error in /api/categoriesHome:', err && (err.stack || err));

    // Helpful response during development; hide details in production
    if (isDev) {
      return NextResponse.json(
        { error: 'Internal Server Error', detail: String(err?.message || err) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
