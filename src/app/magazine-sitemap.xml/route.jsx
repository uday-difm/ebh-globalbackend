import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/magazine`);
  let magazines = [];

  if (res.ok) {
    const data = await res.json();
    magazines = data || []; // Adjust this based on your API shape
  } else {
    console.error('Failed to fetch magazines for sitemap');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${magazines
    .map(
      (magazine) => `
    <url>
      <loc>${baseUrl}/magazine/${magazine.magazine_slug}</loc>
      <lastmod>${magazine.magazine_timestamp}</lastmod>
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
