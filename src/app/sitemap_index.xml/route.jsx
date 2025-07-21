// app/sitemap/route.js

import { baseUrl } from '../../lib/config'; // Adjust path if needed

export async function GET() {
  const sitemapLinks = [
    'post-sitemap.xml',
    'magazine-sitemap.xml',
    // 'shows-sitemap.xml',
    'pages-sitemap.xml',
  ];

  const now = new Date().toISOString();

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapLinks
  .map(
    (link) => `
  <sitemap>
    <loc>${baseUrl}/${link}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
