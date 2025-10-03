import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';
import { uploadToS3 } from '../../../../../../../utils/s3Utility';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const slug =await params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not set in environment variables');
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const blogTitle = formData.get('blogTitle');
    const blogTag = formData.get('blogTag');
    const blogCategory = formData.get('blogCategory');
    const blogDescription = formData.get('blogDescription');
    const blogContent = formData.get('blogContent');
    const blogDate = formData.get('blogDate');
    const blogTime = formData.get('blogTime');
    const blogSlug = formData.get('blog_slug');
    const image = formData.get('blog_feature_image');
    const existingImageUrl = formData.get('existing_image_url');

    let imageUrl = existingImageUrl;

    if (image instanceof File) {
      const buffer = await image.arrayBuffer();
      const ext = image.name.split('.').pop().toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      if (!allowedTypes.includes(ext)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp' },
          { status: 400 }
        );
      }

      const uploadedImageUrl = await uploadToS3('blogs', {
        originalname: image.name,
        buffer: Buffer.from(buffer),
        mimetype: image.type
      });

      imageUrl = uploadedImageUrl;
    }

    // Check if new slug already exists and is different from current
    if (blogSlug !== slug) {
      const [existing] = await db.query('SELECT blog_id FROM blogs WHERE blog_slug = ? AND status = 1', [blogSlug]);
      if (existing.length > 0) {
        return NextResponse.json({ message: 'Blog with this slug already exists' }, { status: 409 });
      }
    }

    const sql = `
      UPDATE blogs SET
        blog_title = ?,
        blog_tag = ?,
        blog_category_id = ?,
        blog_description = ?,
        blog_content = ?,
        blog_date_time = ?,
        blog_slug = ?,
        blog_feature_image = ?
      WHERE blog_slug = ?
    `;

    let blogDateTime = null;
    if (blogDate && blogTime) {
      blogDateTime = new Date(`${blogDate}T${blogTime}`);
    } else if (blogDate) {
      blogDateTime = new Date(blogDate);
    }

    const params = [
      blogTitle,
      blogTag,
      blogCategory,
      blogDescription,
      blogContent,
      blogDateTime,
      blogSlug,
      imageUrl,
      slug,
    ];

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Failed to update blog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Error updating blog', error: error.message }, { status: 500 });
  }
}
