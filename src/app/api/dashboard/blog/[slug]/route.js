// File: /api/dashboard/blog/[slug]/route.js

import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';
import { uploadToS3 } from '../../../../../../utils/s3Utility';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";
// ==========================
// Get Blog by Slug
// ==========================
async function getBlogBySlug(slug) {
  const [rows] = await db.query(
    'SELECT * FROM blogs WHERE blog_slug = ? AND status = 1 LIMIT 1',
    [slug]
  );
  return rows.length ? rows[0] : null;
}

// ==========================
// Update Blog by Slug
// ==========================
async function updateBlogBySlug(slug, data) {
  // Check if new slug already exists and is different from current
  if (data.blogSlug !== slug) {
    const [existing] = await db.query('SELECT blog_id FROM blogs WHERE blog_slug = ? AND status = 1', [data.blogSlug]);
    if (existing.length > 0) {
      throw new Error('Blog with this slug already exists');
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
  if (data.blogDate && data.blogTime) {
    blogDateTime = new Date(`${data.blogDate}T${data.blogTime}`);
  } else if (data.blogDate) {
    blogDateTime = new Date(data.blogDate);
  }

  const params = [
    data.blogTitle,
    data.blogTag,
    data.blogCategory,
    data.blogDescription,
    data.blogContent,
    blogDateTime,
    data.blogSlug,
    data.image,
    slug,
  ];

  const [result] = await db.query(sql, params);
  return result.affectedRows > 0;
}

// ==========================
// Soft Delete Blog
// ==========================
async function deleteBlogBySlug(slug) {
  const sql = 'UPDATE blogs SET status = 0 WHERE blog_slug = ?';
  const [result] = await db.query(sql, [slug]);
  return result.affectedRows > 0;
}

// ==========================
// GET Handler
// ==========================


export async function GET(_, { params }) {
  const slug = await params?.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Error fetching blog', error: error.message }, { status: 500 });
  }
}

// ==========================
// PUT Handler
// ==========================
export async function PUT(request, { params }) {
  const slug = await params?.slug;

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

    const updated = await updateBlogBySlug(slug, {
      blogTitle,
      blogTag,
      blogCategory,
      blogDescription,
      blogContent,
      blogDate,
      blogTime,
      blogSlug,
      image: imageUrl,
    });

    if (!updated) {
      return NextResponse.json({ message: 'Failed to update blog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Error updating blog', error: error.message }, { status: 500 });
  }
}

// ==========================
// DELETE Handler
// ==========================
export async function DELETE(_, { params }) {
  const slug = await params?.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const deleted = await deleteBlogBySlug(slug);

    if (!deleted) {
      return NextResponse.json({ message: 'Failed to delete blog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog soft-deleted (status set to 0)' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Error deleting blog', error: error.message }, { status: 500 });
  }
}
