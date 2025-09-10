// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

// ---------------- Fetch Blog or Category Data ----------------
async function getContentBySlug(slug) {
  try {
    // Try fetching the blog by slug
    const blogSql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time       AS publish_date,
        b.blog_timestamp       AS updated_at,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.blog_slug = ?
      LIMIT 1;
    `;

    // Try fetching category and its blogs
    const categorySql = `
      SELECT
        c.category_id,
        c.category_name,
        c.category_slug,
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time       AS publish_date,
        b.blog_timestamp       AS updated_at
      FROM blog_category c
      LEFT JOIN blogs b ON c.category_id = b.blog_category_id
      WHERE c.category_slug = ?;
    `;

    // Run both in parallel
    const [[blogResult], [categoryResult]] = await Promise.all([
      db.query(blogSql, [slug]),
      db.query(categorySql, [slug]),
    ]);

    // If blog found, return it
    if (blogResult.length > 0) {
      return { type: 'post', data: blogResult[0] };
    }

    // If category found (non-empty result), extract category and blogs
    if (categoryResult.length > 0) {
      const { category_id, category_name, category_slug } = categoryResult[0];
      const blogs = categoryResult
        .filter(b => b.blog_id !== null) // Remove rows without blog data
        .map(b => ({
          blog_id: b.blog_id,
          blog_title: b.blog_title,
          blog_slug: b.blog_slug,
          blog_description: b.blog_description,
          blog_feature_image: b.blog_feature_image,
          blog_content: b.blog_content,
          blog_tag: b.blog_tag,
          publish_date: b.publish_date,
          updated_at: b.updated_at,
        }));

      return {
        type: 'category',
        data: {
          category: { category_id, category_name, category_slug },
          blogs,
        },
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching blog or category:", error);
    throw error;
  }
}

// ---------------- API Route ----------------
export async function GET(request, context) {
  const params = await context.params;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const result = await getContentBySlug(slug);

    if (!result) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[slug] API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
