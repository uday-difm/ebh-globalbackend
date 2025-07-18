// ✅ Correct API for dynamic slug
import { NextResponse } from 'next/server';
import { getAllBlogs, getAllCategories } from '../../../../lib/data';

export async function GET(request, context) {
  // ⚠️ Properly extract params
  const { params } = context;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  try {
    const allBlogs = await getAllBlogs();
    const allCategories = await getAllCategories();

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
