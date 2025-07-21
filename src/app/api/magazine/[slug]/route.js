// app/api/magazines/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Ensure this path is correct relative to this file

export async function GET(request, context) {
  // Extract the slug from the context.params object
  // Next.js App Router automatically provides dynamic segments in context.params
  const { slug } = context.params;

  // Basic validation for slug presence
  if (!slug) {
    return NextResponse.json({ message: 'Slug parameter is missing' }, { status: 400 });
  }

  try {
    // Fetch the main magazine data using the slug
    const [magazines] = await db.query(
      `SELECT
         magazine_id, magazine_title, magazine_slug, magazine_cover_image,
         DATE_FORMAT(magazine_date, "%d %M %Y") AS formatted_date,
         magazine_description, magazine_tags, magazine_link, MagCloudLink,
         magazine_timestamp
       FROM magazines WHERE magazine_slug = ?`,
      [slug] // Pass slug as a parameter to prevent SQL injection
    );

    // If no magazine is found with the given slug, return 404
    if (!magazines || magazines.length === 0) {
      return NextResponse.json({ message: 'Magazine not found' }, { status: 404 });
    }

    const magazine = magazines[0]; // Get the first (and only) matching magazine

    // Fetch credits for this magazine using its magazine_id
    let credits = [];
    try {
      const [creditRows] = await db.query(
        `SELECT sno, instalink, image, credits FROM magazine_credits WHERE magazine_id = ? ORDER BY sno ASC`,
        [magazine.magazine_id] // Use the ID from the fetched magazine
      );
      credits = creditRows;
    } catch (err) {
      // If there's an error fetching credits, log it but don't fail the main request
      console.error("Error fetching magazine credits:", err);
      credits = []; // Ensure credits array is empty on error
    }

    // Construct the final response object
    const response = {
      magazine_title: magazine.magazine_title,
      magazine_slug: magazine.magazine_slug,
      magazine_cover_image: magazine.magazine_cover_image,
      formatted_date: magazine.formatted_date,
      magazine_description: magazine.magazine_description,
      magazine_tags: magazine.magazine_tags,
      magazine_link: magazine.magazine_link,
      MagCloudLink: magazine.MagCloudLink,
      // Note: magazine_timestamp was formatted_date in your original code,
      // which might be a logical error if timestamp is meant to be different.
      // I've kept it as formatted_date as per your original, but review this.
      magazine_timestamp: magazine.formatted_date,
      credits, // Include the fetched credits
    };

    // Return the magazine data with credits
    return NextResponse.json(response);
  } catch (error) {
    // Log the database error
    console.error('DB error in /api/magazines/[slug]:', error);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
