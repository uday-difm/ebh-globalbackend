import db from '../../../../lib/db'; // Update if path differs

export async function GET() {
  try {
    const query = `
      SELECT 
        category_id,
        category_name
      FROM 
        blog_category
      ORDER BY 
        category_id ASC
    `;

    const [rows] = await db.query(query);

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || 'Unknown error occurred'
      }),
      { status: 500 }
    );
  }
}
