// /app/api/blogs/route.js
import { NextResponse } from 'next/server';
import { getAllBlogs, getAllCategories } from '../../../lib/data';

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    const categories = await getAllCategories();

    return NextResponse.json({
      blogs,
      categories,
    });
  } catch (error) {
    console.error("API Error (GET /api/blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}