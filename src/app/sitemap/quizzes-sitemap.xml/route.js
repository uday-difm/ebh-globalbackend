export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  let quizzes = [];

  try {
    const res = await fetch(`${baseUrl}/api/quizzes?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      quizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
    }
  } catch (e) { }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${quizzes
      .map(
        (q) => `
        <url>
          <loc>${baseUrl}/quizzes/${q.slug}</loc>
          <lastmod>${q.updated_at || new Date().toISOString()}</lastmod>
        </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}