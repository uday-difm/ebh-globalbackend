export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  const sitemaps = [
    { url: "/sitemap/pages-sitemap.xml" },
    { url: "/sitemap/blogs-sitemap.xml" },
    { url: "/sitemap/categories-sitemap.xml" },
    { url: "/sitemap/magazines-sitemap.xml" },
    { url: "/sitemap/quizzes-sitemap.xml" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (s) => `
    <sitemap>
      <loc>${baseUrl}${s.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`
      )
      .join("")}
  </sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
