export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  let categories = [];

  try {
    const res = await fetch(`${baseUrl}/api/categoriesHome`);
    if (res.ok) {
      const data = await res.json();
      categories = Array.isArray(data) ? data : [];
    }
  } catch (e) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${categories
      .map(
        (c) => `
        <url>
          <loc>${baseUrl}/blogs/category/${c.category_slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
