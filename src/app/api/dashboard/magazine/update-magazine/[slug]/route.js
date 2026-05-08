import { NextResponse } from 'next/server';
import db from '../../../../../../lib/db';
import {uploadToS3} from '../../../../../../../utils/s3Utility';

const generateSlug = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

//-------------------------UPDATE Magazine-------------------------------
export async function PUT(request, context) {
    const { searchParams } = new URL(request.url);
    const routeParams = await context?.params;
    const routeSlug = Array.isArray(routeParams?.slug) ? routeParams.slug[0] : routeParams?.slug;
    const querySlug = searchParams.get('slug');
  
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
      const magazine_slug = formData.get('magazine_slug') || generateSlug(magazine_title);
      const slug = routeSlug || querySlug || magazine_id;

      if (!slug) {
        return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
      }

      if (!magazine_slug) {
        return NextResponse.json({ message: 'Magazine title is required to generate a slug' }, { status: 400 });
      }
      // idMagazines and magazine_timestamp are not updated directly
  
      // Handle image upload
      let imageUrl = magazine_cover_image;
      if (magazine_cover_image && typeof magazine_cover_image === 'object' && 'arrayBuffer' in magazine_cover_image) {
        try {
          const buffer = Buffer.from(await magazine_cover_image.arrayBuffer());
          const ext = magazine_cover_image.name.split('.').pop().toLowerCase();
          const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
          if (!allowedTypes.includes(ext)) {
            return NextResponse.json({ 
              error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp' 
            }, { status: 400 });
          }
          imageUrl = await uploadToS3('magazines', {
            originalname: magazine_cover_image.name,
            buffer,
            mimetype: magazine_cover_image.type
          });
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }
      }
  
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
        imageUrl,
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
