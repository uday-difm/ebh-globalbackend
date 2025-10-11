import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const toIsoString = (value) => {
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  };

  let magazines = [];

  try {
    const res = await fetch(`${baseUrl}/api/magazine`);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        magazines = data;
      } else if (Array.isArray(data?.magazines)) {
        magazines = data.magazines;
      } else {
        magazines = data ? [data].flat() : [];
      }
    } else {
      console.error('Failed to fetch magazines for sitemap', res.status);
    }
  } catch (error) {
    console.error('Error fetching magazines for sitemap', error);
  }

  if (!Array.isArray(magazines)) magazines = [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${magazines
    .filter((magazine) => magazine?.magazine_slug)
    .map((magazine) => {
      const lastmod = toIsoString(
        magazine?.magazine_timestamp || magazine?.updated_at || magazine?.created_at
      );
      return `
    <url>
      <loc>${baseUrl}/magazine/${magazine.magazine_slug}</loc>
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
