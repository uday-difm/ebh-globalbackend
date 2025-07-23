import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';

//-------------------------GET Magazine by Slug-------------------------------

export async function GET(request, { params }) {
    const { slug } = params;
  
    if (!slug) {
      return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
    }
  
    try {
      const sql = `
        SELECT *, DATE_FORMAT(Magazine_date, '%e %M %Y') AS formatted_date
        FROM Magazines
        WHERE Magazine_slug = ?
      `;
      const [data] = await db.query(sql, [slug]);
      const magazine = data[0] || null;
      if (!magazine) {
        return NextResponse.json({ message: 'magazine not found' }, { status: 404 });
      }
      return NextResponse.json(magazine);
    } catch (error) {
      return NextResponse.json({ message: 'Error fetching magazine', error: error.message }, { status: 500 });
    }
} 