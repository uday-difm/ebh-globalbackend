// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Ensure this path is correct for your database connection

// ---------------- Fetch a Single Blog by Slug ----------------
async function getBlogBySlugFromDB(slug) {
  try {
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time       AS publish_date,   -- ✅ Always use blog_date_time for publish date
        b.blog_timestamp       AS updated_at,     -- ✅ Keep timestamp as updated date
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.blog_slug = ?;
    `;
    const [rows] = await db.query(sql, [slug]);
    return rows[0] || null;
  } catch (error) {
    // console.error("Error fetching single blog:", error);
    return null;
  }
}

// ---------------- Fetch a Category by Slug ----------------
async function getCategoryBySlugFromDB(slug) {
  try {
    const sql = `
      SELECT category_id, category_name, category_slug
      FROM blog_category
      WHERE category_slug = ?;
    `;
    const [rows] = await db.query(sql, [slug]);
    return rows[0] || null;
  } catch (error) {
    // console.error("Error fetching single category:", error);
    return null;
  }
}

// ---------------- Fetch Blogs in Category ----------------
async function getBlogsInCategoryFromDB(categorySlug) {
  try {
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time       AS publish_date,   -- ✅ Consistent publish date
        b.blog_timestamp       AS updated_at,     -- ✅ Updated at for consistency
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE bc.category_slug = ?
      ORDER BY b.blog_date_time DESC;
    `;
    const [rows] = await db.query(sql, [categorySlug]);
    return rows;
  } catch (error) {
    // console.error("Error fetching blogs in category:", error);
    return [];
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
    // 1️⃣ Try fetching as a blog
    const matchedBlog = await getBlogBySlugFromDB(slug);
    if (matchedBlog) {
      return NextResponse.json({ type: 'post', data: matchedBlog });
    }

    // 2️⃣ If not blog, try category
    const category = await getCategoryBySlugFromDB(slug);
    if (category) {
      const blogsInCategory = await getBlogsInCategoryFromDB(slug);
      return NextResponse.json({
        type: 'category',
        data: { category, blogs: blogsInCategory },
      });
    }

    // 3️⃣ Nothing found
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    // console.error("[slug] API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
