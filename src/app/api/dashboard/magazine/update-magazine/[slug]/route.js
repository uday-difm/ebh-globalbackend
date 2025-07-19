import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';


//-------------------------UPDATE Magazine-------------------------------
export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
  
    if (!slug) {
      return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
    }
  
    try {
      const formData = await request.formData();
      // Extract all DB columns from formData
      const magazine_id = formData.get('magazine_id');
      const magazine_title = formData.get('magazine_title');
      const magazine_description = formData.get('magazine_description');
      const magazine_tags = formData.get('magazine_tags');
      const magazine_category = formData.get('magazine_category');
      const magazine_cover_image = formData.get('magazine_cover_image');
      const magazine_link = formData.get('magazine_link');
      const magazine_date = formData.get('magazine_date');
      const MagCloudLink = formData.get('MagCloudLink');
      const magazine_slug = formData.get('magazine_slug');
      // idMagazines and magazine_timestamp are not updated directly
  
      const sql = `UPDATE magazines SET 
        magazine_id = ?,
        magazine_title = ?,
        magazine_description = ?,
        magazine_tags = ?,
        magazine_category = ?,
        magazine_cover_image = ?,
        magazine_link = ?,
        magazine_date = ?,
        MagCloudLink = ?,
        magazine_slug = ?
        WHERE magazine_slug = ?`;
      const [result] = await db.query(sql, [
        magazine_id,
        magazine_title,
        magazine_description,
        magazine_tags,
        magazine_category,
        magazine_cover_image,
        magazine_link,
        magazine_date,
        MagCloudLink,
        magazine_slug,
        slug,
      ]);
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Failed to update magazine' }, { status: 500 });
      }
      return NextResponse.json({ message: 'magazine updated successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Error updating magazine', error: error.message }, { status: 500 });
    }
  }