// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Ensure this path is correct for your database connection

// Function to fetch a single blog by slug from the database
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
        DATE_FORMAT(b.blog_timestamp, "%Y-%m-%d") AS date,
        DATE_FORMAT(b.blog_timestamp, "%d %M %Y") AS formatted_date,
        -- b.blog_views_count AS views, -- Removed as per your instruction
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.blog_slug = ?;
    `;
    const [rows] = await db.query(sql, [slug]);
    return rows[0] || null; // Return the first matching blog or null if not found
  } catch (error) {
    console.error("Error fetching single blog from DB in /api/blogs/[slug]/route.js:", error);
    return null;
  }
}

// Function to fetch a single category by slug from the database
async function getCategoryBySlugFromDB(slug) {
  try {
    const sql = `SELECT category_id, category_name, category_slug FROM blog_category WHERE category_slug = ?;`;
    const [rows] = await db.query(sql, [slug]);
    return rows[0] || null; // Return the first matching category or null
  } catch (error) {
    console.error("Error fetching single category from DB in /api/blogs/[slug]/route.js:", error);
    return null;
  }
}

// Function to get blogs within a specific category from the database
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
        DATE_FORMAT(b.blog_timestamp, "%Y-%m-%d") AS date,
        DATE_FORMAT(b.blog_timestamp, "%d %M %Y") AS formatted_date,
        -- b.blog_views_count AS views, -- Removed as per your instruction
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE bc.category_slug = ?
      ORDER BY b.blog_timestamp DESC;
    `;
    const [rows] = await db.query(sql, [categorySlug]);
    return rows;
  } catch (error) {
    console.error("Error fetching blogs in category from DB in /api/blogs/[slug]/route.js:", error);
    return [];
  }
}


export async function GET(request, context) {
  const { params } = context;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    // Attempt to fetch as a blog post first
    const matchedBlog = await getBlogBySlugFromDB(slug);
    if (matchedBlog) {
      return NextResponse.json({ type: 'post', data: matchedBlog });
    }

    // If not a blog post, attempt to fetch as a category
    const category = await getCategoryBySlugFromDB(slug);
    if (category) {
      const blogsInCategory = await getBlogsInCategoryFromDB(slug);
      return NextResponse.json({
        type: 'category',
        data: { category, blogs: blogsInCategory },
      });
    }

    // If neither a blog nor a category matches the slug
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    console.error('[slug] API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
