import { NextResponse } from 'next/server';
import db from '../../../../../lib/db.js';

export async function GET(request, context) {
  let params;
  try {
    // Try both ways for maximum compatibility
    if (context && typeof context.then === 'function') {
      // context is a promise
      const awaited = await context;
      params = awaited.params;
      console.log('Params from awaited context:', params);
    } else if (context && context.params) {
      // context is a plain object
      params = context.params;
      console.log('Params from context.params:', params);
    } else {
      console.log('Context is:', context);
      return NextResponse.json({ error: 'No params found in context' }, { status: 400 });
    }
  } catch (err) {
    console.error('Error extracting params:', err);
    return NextResponse.json({ error: 'Error extracting params' }, { status: 500 });
  }

  const { slug } = params || {};
  if (!slug) {
    return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
  }

  const sql = `
    SELECT 
      magazine_id,
      magazine_slug,
      magazine_title,
      magazine_description,
      magazine_tags,
      magazine_cover_image,
      magazine_link,
      DATE_FORMAT(magazine_date, '%Y-%m-%d') AS formatted_date, 
      magazine_category,
      MagCloudLink
    FROM magazines 
    WHERE magazine_slug = ?
  `;

  try {
    const [results] = await db.query(sql, [slug]);
    if (results.length > 0) {
      return NextResponse.json(results, { status: 200 });
    } else {
      return NextResponse.json({ error: "Blog Not Found" }, { status: 404 });
    }
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
