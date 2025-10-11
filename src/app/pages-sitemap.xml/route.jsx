import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticPages = [
    '/',
    '/about-us',
    '/blogs',
    '/contact-us',
    '/magazine',
    '/quizzes',
    '/privacy-policy',
    '/information-policy',
    '/terms-and-conditions',
    '/login',
    '/signup',
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
      .map(
        (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${now}</lastmod>
      <priority>0.5</priority>
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
