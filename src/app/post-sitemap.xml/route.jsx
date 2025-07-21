import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let blogs = [];

  try {
    const res = await fetch(`${baseUrl}/api/blogs`);

    if (res.ok) {
      const data = await res.json();

      // ✅ FIX: Ensure blogs is an array
      if (Array.isArray(data)) {
        blogs = data;
      } else if (Array.isArray(data.blogs)) {
        blogs = data.blogs;
      } else {
        console.error('Unexpected blogs data format:', data);
      }
    } else {
      console.error('Failed to fetch blogs for sitemap');
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  // Fallback if blogs is still not an array
  if (!Array.isArray(blogs)) blogs = [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogs
    .map(
      (blog) => `
    <url>
      <loc>${baseUrl}/blog/${blog.blog_slug}</loc>
      <lastmod>${blog.formatted_blog_date}</lastmod>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
