import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';
import {uploadToS3} from '../../../../../../utils/s3Utility';

const generateSlug = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const magazine_id = formData.get('magazine_id');
    const magazine_title = formData.get('magazine_title');
    const magazine_description = formData.get('magazine_description');
    const magazine_tags = formData.get('magazine_tags');
    const magazine_cover_image = formData.get('magazine_cover_image'); // File
    const magazine_link = formData.get('magazine_link');
    const magazine_date = formData.get('magazine_date');
    const magazine_category = formData.get('magazine_category');
    const MagCloudLink = formData.get('MagCloudLink');
    const magazine_slug = formData.get('magazine_slug') || generateSlug(magazine_title);

    // Basic validation
    if (!magazine_id || !magazine_title || !magazine_description || !magazine_tags || !magazine_cover_image || !magazine_link || !magazine_date || !magazine_category || !MagCloudLink || !magazine_slug) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    // Handle image upload
    let imageUrl = '';
    if (magazine_cover_image && typeof magazine_cover_image === 'object' && 'arrayBuffer' in magazine_cover_image) {
      try {
        const buffer = Buffer.from(await magazine_cover_image.arrayBuffer());
        const ext = magazine_cover_image.name.split('.').pop().toLowerCase();
        const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!allowedTypes.includes(ext)) {
          return NextResponse.json({ 
            error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp' 
          }, { status: 400 });
        }
        imageUrl = await uploadToS3('magazines', {
          originalname: magazine_cover_image.name,
          buffer,
          mimetype: magazine_cover_image.type
        });
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Insert into the magazines table
    const sql = `INSERT INTO magazines (magazine_id, magazine_title, magazine_description, magazine_tags, magazine_cover_image, magazine_link, magazine_date, magazine_category, MagCloudLink, magazine_slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      magazine_id,
      magazine_title,
      magazine_description,
      magazine_tags,
      imageUrl,
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
