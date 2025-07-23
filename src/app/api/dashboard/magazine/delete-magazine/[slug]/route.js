import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';

//-------------------------DELETE Magazine-------------------------------
export async function DELETE(request, { params }) {
    const slug = params.slug;
  
    if (!slug) {
      return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
    }
  
    try {
      // Set status = 0 instead of deleting
      const sql = 'UPDATE magazines SET status = 0 WHERE magazine_slug = ?';
      const [result] = await db.query(sql, [slug]);
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Failed to delete Magazine' }, { status: 500 });
      }
      return NextResponse.json({ message: 'Magazine deleted (status set to 0) successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting Magazine', error: error.message }, { status: 500 });
    }
} 