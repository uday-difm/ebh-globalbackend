export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://www.earthbyhumans.com";
  const sitemaps = [
    { name: "Static Pages", url: "/sitemap/pages-sitemap.xml" },
    { name: "Blogs", url: "/sitemap/blogs-sitemap.xml" },
    { name: "Blog Categories", url: "/sitemap/categories-sitemap.xml" },
    { name: "Magazines", url: "/sitemap/magazines-sitemap.xml" },
    { name: "Quizzes", url: "/sitemap/quizzes-sitemap.xml" },
  ];

  const html = `
    <html>
      <head>
        <title>Sitemap Index</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 p-10">
        <h1 class="text-3xl font-bold mb-6">Sitemap Index</h1>
        <table class="min-w-full bg-white shadow border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 text-left font-semibold border-b">URL</th>
              <th class="p-3 text-left font-semibold border-b">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            ${sitemaps
      .map(
        (s) => `
              <tr class="hover:bg-gray-50">       
                <td class="p-3 border-b text-blue-600 underline">
                  <a href="${baseUrl + s.url}">${baseUrl + s.url}</a>
                </td>
                <td class="p-3 border-b">${new Date().toISOString()}</td>
              </tr>`
      )
      .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}