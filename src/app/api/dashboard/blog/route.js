import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { uploadToS3 } from '../../../../../utils/s3Utility';

// GET: Fetch all active blogs
export async function GET(request) {
  try {
    const sql = `SELECT * FROM blogs WHERE status = 1 ORDER BY blog_date_time DESC`;
    const [rows] = await db.query(sql);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error in GET /api/dashboard/blog:', error);
    return NextResponse.json({ error: 'Error fetching blogs' }, { status: 500 });
  }
}

// POST: Add a new blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const tag = formData.get('tag');
    const date = formData.get('date');
    const category = formData.get('category');
    const description = formData.get('description');
    const content = formData.get('content');
    const slug = formData.get('slug');
    const image = formData.get('image');

    // Required field validation
    if (!title || !date || !category || !description || !content || !slug) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['title', 'date', 'category', 'description', 'content', 'slug']
      }, { status: 400 });
    }

    // Upload image if provided
    let imageUrl = '';
    if (image && typeof image === 'object' && 'arrayBuffer' in image) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = image.name.split('.').pop().toLowerCase();

        const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!allowedTypes.includes(ext)) {
          return NextResponse.json({
            error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp'
          }, { status: 400 });
        }

        imageUrl = await uploadToS3('blogs', {
          originalname: image.name,
          buffer,
          mimetype: image.type
        });
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Check if slug already exists
    const [existingBlog] = await db.query('SELECT blog_id FROM blogs WHERE blog_slug = ?', [slug]);
    if (existingBlog.length > 0) {
      return NextResponse.json({ error: 'Blog with this slug already exists' }, { status: 409 });
    }

    // Insert blog into DB
    const insertSql = `
      INSERT INTO blogs (
        blog_title, blog_tag, blog_feature_image,
        blog_date_time, blog_category_id,
        blog_description, blog_content, blog_slug, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    const values = [title, tag, imageUrl, date, category, description, content, slug];
    const [result] = await db.query(insertSql, values);

    return NextResponse.json({
      message: 'Blog posted successfully!',
      blogId: result.insertId,
      slug: slug
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/dashboard/blog:', error);
    return NextResponse.json({ error: 'Failed to post blog' }, { status: 500 });
  }
}
