import { updateBlogStatusBySlug } from '../../../../../../lib/blogUtils';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const updated = await updateBlogStatusBySlug(slug, 0); // Soft delete
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update blog status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog marked as deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting blog', error: error.message }, { status: 500 });
  }
}
