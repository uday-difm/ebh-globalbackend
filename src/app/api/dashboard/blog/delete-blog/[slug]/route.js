import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';

// Utility function to soft-delete blog by slug using raw SQL
async function deleteBlogBySlug(slug) {
  try {
    const sql = 'UPDATE blogs SET status = 0 WHERE blog_slug = ?';
    const [result] = await db.query(sql, [slug]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Soft delete failed:', error);
    return null;
  }
}

//-------------------------DELETE Blog (Soft Delete)-------------------------------
export async function DELETE(request, { params }) {
  const slug = params?.slug;

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
    return NextResponse.json(
      { message: 'Error deleting blog', error: error.message },
      { status: 500 }
    );
  }
}