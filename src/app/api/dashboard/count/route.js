import db from '@/lib/db';

export async function GET() {
  try {
    const [totalBlogs] = await db.query(`
      SELECT COUNT(*) AS total_blogs
      FROM blogs
      WHERE status = '1'
    `);

    const [totalMagazines] = await db.query(`
      SELECT COUNT(*) AS total_magazines
      FROM magazines
       WHERE status = '1'
    `);

    const totalBlogsCount = totalBlogs[0]?.total_blogs || 0;
    const totalMagazinesCount = totalMagazines[0]?.total_magazines || 0;

    return Response.json({
      total_blogs: totalBlogsCount,
      total_magazines: totalMagazinesCount,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    return new Response(JSON.stringify({
      message: 'Failed to fetch counts',
      error: error.message
    }), { status: 500 });
  }
}
