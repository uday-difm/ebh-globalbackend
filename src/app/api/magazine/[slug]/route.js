import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, context) {
  const { slug } = await context.params;

  try {
    const [magazines] = await db.query(
      `SELECT 
        magazine_id, magazine_title, magazine_slug, magazine_cover_image, 
        DATE_FORMAT(magazine_date, "%d %M %Y") AS formatted_date, 
        magazine_description, magazine_tags, magazine_link, MagCloudLink,
        magazine_timestamp
      FROM magazines WHERE magazine_slug = ?`,
      [slug]
    );

    if (!magazines || magazines.length === 0) {
      return NextResponse.json({ message: 'Magazine not found' }, { status: 404 });
    }

    const magazine = magazines[0];

    // Fetch credits for this magazine (if table exists)
    let credits = [];
    try {
      const [creditRows] = await db.query(
        `SELECT sno, instalink, image, credits FROM magazine_credits WHERE magazine_id = ? ORDER BY sno ASC`,
        [magazine.magazine_id]
      );
      credits = creditRows;
    } catch (err) {
      credits = [];
    }

    const response = {
      magazine_title: magazine.magazine_title,
      magazine_slug: magazine.magazine_slug,
      magazine_cover_image: magazine.magazine_cover_image,
      formatted_date: magazine.formatted_date,
      magazine_description: magazine.magazine_description,
      magazine_tags: magazine.magazine_tags,
      magazine_link: magazine.magazine_link,
      MagCloudLink: magazine.MagCloudLink,
      magazine_timestamp: magazine.formatted_date,
      credits,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 