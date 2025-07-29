// ✅ Correct API for dynamic slug
import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, context) {
  // ⚠️ Properly extract params
  const { params } = context;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  try {
    const blogsSql = `
      SELECT b.*, DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
             bc.category_name, bc.category_slug
      FROM blogs b
      INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.status = 1 ORDER BY b.blog_date_time DESC`;
    const [allBlogs] = await db.query(blogsSql);

    const categoriesSql = 'SELECT * FROM `blog_category`';
    const [allCategories] = await db.query(categoriesSql);

    // Blog match
    const matchedBlog = allBlogs.find(b => b.blog_slug === slug);
    if (matchedBlog) {
      return NextResponse.json({ type: 'post', data: matchedBlog });
    }

    // Category match
    const category = allCategories.find(c => c.category_slug === slug);
    if (category) {
      const blogsInCategory = allBlogs.filter(b => b.category_slug === slug);
      return NextResponse.json({
        type: 'category',
        data: { category, blogs: blogsInCategory },
      });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    console.error('[slug] API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}