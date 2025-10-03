// app/api/magazines/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Make sure this path is correct

export async function GET(request, context) {
  const { slug } =await context.params;

  if (!slug) {
    return NextResponse.json({ message: 'Slug parameter is missing' }, { status: 400 });
  }

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
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('DB error in /api/magazines/[slug]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
