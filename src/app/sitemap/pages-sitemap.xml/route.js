export const dynamic = "force-static";

export  function GET() {
  const baseUrl = "https://www.earthbyhumans.com";

  const staticUrls = [
    `${baseUrl}/`,
    `${baseUrl}/about-us`,
    `${baseUrl}/blogs`,
    `${baseUrl}/magazine`,
    `${baseUrl}/quizzes`,
    `${baseUrl}/contact-us`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls
      .map(
        (u) => `
      <url>
        <loc>${u}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
