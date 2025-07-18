import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title');
    const tag = formData.get('tag');
    const date = formData.get('date');
    const category = formData.get('category');
    const description = formData.get('description');
    const content = formData.get('content');
    const slug = formData.get('slug');
    const image = formData.get('image');

    // Validate required fields
    if (!title || !date || !category || !description || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload
    let imageUrl = '';
    if (image && typeof image === 'object' && 'arrayBuffer' in image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${ext}`;
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(uploadPath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // Insert into database
    const sql = `INSERT INTO blogs (blog_title, blog_tag, blog_feature_image, blog_date_time, blog_category_id, blog_description, blog_content, blog_slug, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    const values = [title, tag, imageUrl, date, category, description, content, slug];
    await db.query(sql, values);

    return NextResponse.json({ message: 'Blog posted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/dashboard/blog/add-blog:', error);
    return NextResponse.json({ error: 'Failed to post blog' }, { status: 500 });
  }
} 