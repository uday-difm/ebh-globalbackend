import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const toIsoString = (value) => {
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  };

  let blogs = [];

  try {
    const res = await fetch(`${baseUrl}/api/blogs?limit=500`);

    if (res.ok) {
      const data = await res.json();

      if (Array.isArray(data)) {
        blogs = data;
      } else if (Array.isArray(data?.blogs)) {
        blogs = data.blogs;
      } else {
        console.error('Unexpected blogs data format:', data);
      }
    } else {
      console.error('Failed to fetch blogs for sitemap', res.status);
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap', error);
  }

  if (!Array.isArray(blogs)) blogs = [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogs
      .filter((blog) => blog?.blog_slug)
      .map((blog) => {
        const lastmod = toIsoString(blog?.formatted_blog_date || blog?.updated_at || blog?.created_at);
        return `
    <url>
      <loc>${baseUrl}/blogs/${blog.blog_slug}</loc>
      <lastmod>${lastmod}</lastmod>
      <priority>0.8</priority>
    </url>`;
      })
      .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
