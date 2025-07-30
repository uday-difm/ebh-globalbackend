import { NextResponse } from 'next/server';
import { getBlogBySlug, updateBlogBySlug, deleteBlogBySlug } from '../../../../../lib/data.js';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

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
    return NextResponse.json({ message: 'Error fetching blog', error: error.message }, { status: 500 });
  }
}




//-------------------------update-blog-------------------------------
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    // Extract fields from formData
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

    // You need to implement updateBlogBySlug in your data layer
    const updated = await updateBlogBySlug(slug, {
      blogTitle,
      blogTag,
      blogCategory,
      blogDescription,
      blogContent,
      blogDate,
      blogTime,
      blogSlug,
      image,
      existingImageUrl,
    });
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update blog' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating blog', error: error.message }, { status: 500 });
  }
}



