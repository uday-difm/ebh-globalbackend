
import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';

// Utility function to fetch blog by slug using raw SQL query
async function getBlogBySlug(slug) {
  try {
    const [rows] = await db.query('SELECT * FROM blogs WHERE blog_slug = ? LIMIT 1', [slug]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}

export async function GET(request, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching blog', error: error.message },
      { status: 500 }
    );
  }
}

