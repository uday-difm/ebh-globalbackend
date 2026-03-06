export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  let blogs = [];

  try {
    const res = await fetch(`${baseUrl}/api/blogs?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      blogs = Array.isArray(data.blogs) ? data.blogs : [];
    }
  } catch (e) { }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${blogs
      .map(
        (b) => `
        <url>
          <loc>${baseUrl}/blogs/${b.blog_slug}</loc>
          <lastmod>${b.updated_at || new Date().toISOString()}</lastmod>
        </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
