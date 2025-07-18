import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      magazine_id,
      magazine_title,
      magazine_description,
      magazine_tags,
      magazine_cover_image,
      magazine_link,
      magazine_date,
      magazine_category,
      MagCloudLink,
      magazine_slug,
    } = data;

    // Basic validation
    if (!magazine_id || !magazine_title || !magazine_description || !magazine_tags || !magazine_cover_image || !magazine_link || !magazine_date || !magazine_category || !MagCloudLink || !magazine_slug) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    // Insert into the magazines table
    const sql = `INSERT INTO magazines (magazine_id, magazine_title, magazine_description, magazine_tags, magazine_cover_image, magazine_link, magazine_date, magazine_category, MagCloudLink, magazine_slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      magazine_id,
      magazine_title,
      magazine_description,
      magazine_tags,
      magazine_cover_image,
      magazine_link,
      magazine_date,
      magazine_category,
      MagCloudLink,
      magazine_slug,
    ];

    await db.query(sql, values);

    return NextResponse.json({ success: true, message: 'Magazine added and saved to database!' }, { status: 200 });
  } catch (error) {
    console.error('Error saving magazine:', error);
    return NextResponse.json({ success: false, message: 'Failed to save magazine.' }, { status: 500 });
  }
} 