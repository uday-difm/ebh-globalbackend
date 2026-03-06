export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  let magazines = [];

  try {
    const res = await fetch(`${baseUrl}/api/magazine?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      magazines = Array.isArray(data.magazines) ? data.magazines : [];
    }
  } catch (e) { }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${magazines
      .map(
        (m) => `
        <url>
          <loc>${baseUrl}/magazine/${m.slug}</loc>
          <lastmod>${m.updated_at || new Date().toISOString()}</lastmod>
        </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
