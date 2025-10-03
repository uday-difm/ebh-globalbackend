import { NextResponse } from 'next/server';
import db from '../../../../../../../lib/db';
import { uploadToS3 } from '../../../../../../../utils/s3Utility';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Utility function to update blog by slug using raw SQL query
async function updateBlogBySlug(slug, data) {
  try {
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
    // Combine blogDate and blogTime into a single datetime string if both exist
    let blogDateTime = null;
    if (data.blogDate && data.blogTime) {
      blogDateTime = new Date(data.blogDate + 'T' + data.blogTime);
    } else if (data.blogDate) {
      blogDateTime = new Date(data.blogDate);
    }

    const params = [
      data.blogTitle,
      data.blogTag,
      data.blogCategory, // Assuming this is the correct value for blog_category_id (json)
      data.blogDescription,
      data.blogContent,
      blogDateTime,
      data.blogSlug,
      data.image,
      slug,
    ];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Update failed:', error);
    return null;
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
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
    const image = formData.get('blog_feature_image'); // Might be File or string
    const existingImageUrl = formData.get('existing_image_url');

    let imageUrl = existingImageUrl;

    // If a new image is uploaded (File type), upload it and get a URL
    if (image instanceof File) {
      const buffer = await image.arrayBuffer();
      const ext = image.name.split('.').pop().toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!allowedTypes.includes(ext)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp' 
        }, { status: 400 });
      }
      // Upload to S3
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
    return NextResponse.json(
      { message: 'Error updating blog', error: error.message },
      { status: 500 }
    );
  }
}
