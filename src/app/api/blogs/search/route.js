import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('discover');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const sql = `
      SELECT blog_id, blog_slug, blog_title, blog_feature_image,
             DATE_FORMAT(blog_date_time, '%e %M %Y') AS formatted_date
      FROM blogs 
      WHERE (blog_title LIKE ? OR blog_tag LIKE ?) AND status = 1`;
      
    const searchTerm = `%${query}%`;
    const [blogs] = await db.query(sql, [searchTerm, searchTerm]);
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}