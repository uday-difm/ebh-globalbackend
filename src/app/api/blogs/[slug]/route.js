// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // adjust if your db path differs

// ---------------- Fetch a Single Blog by Slug (only published) ----------------
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
        b.blog_date_time AS publish_date,
        b.blog_timestamp AS updated_at,
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.blog_slug = ?
        AND b.status = 1
        AND bc.status = 1
      LIMIT 1;
    `;
    const [rows] = await db.query(sql, [slug]);
    return rows?.[0] ?? null;
  } catch (error) {
    console.error("Error fetching single blog:", error);
    throw error;
  }
}

// ---------------- Fetch a Category by Slug (only active categories) ----------------
async function getCategoryBySlugFromDB(slug) {
  try {
    const sql = `
      SELECT category_id, category_name, category_slug
      FROM blog_category
      WHERE category_slug = ?
        AND status = 1
      LIMIT 1;
    `;
    const [rows] = await db.query(sql, [slug]);
    return rows?.[0] ?? null;
  } catch (error) {
    console.error("Error fetching single category:", error);
    throw error;
  }
}

// ---------------- Fetch Blogs in Category (only published blogs) ----------------
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
        b.blog_date_time AS publish_date,
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        b.blog_timestamp AS updated_at,
        bc.category_name,
        bc.category_slug,
        b.blog_category_id
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE bc.category_slug = ?
        AND b.status = 1
        AND bc.status = 1
      ORDER BY b.blog_date_time DESC;
    `;
    const [rows] = await db.query(sql, [categorySlug]);
    return rows ?? [];
  } catch (error) {
    console.error("Error fetching blogs in category:", error);
    throw error;
  }
}

// ---------------- API Route Handler ----------------
export async function GET(request, { params }) {
  try {
    // params.slug may be string or array (catch both)
    let slug = params?.slug;
    if (Array.isArray(slug)) slug = slug[0];
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 1) Try treat slug as a blog post slug (published only)
    const matchedBlog = await getBlogBySlugFromDB(slug);
    if (matchedBlog) {
      return NextResponse.json({ type: 'post', data: matchedBlog });
    }

    // 2) If not a blog, try treat slug as a category slug (active only)
    const category = await getCategoryBySlugFromDB(slug);
    if (category) {
      const blogsInCategory = await getBlogsInCategoryFromDB(slug);
      return NextResponse.json({
        type: 'category',
        data: {
          category,
          blogs: blogsInCategory,
        },
      });
    }

    // 3) Not found
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    console.error("[slug] API Error:", err && (err.stack || err));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
