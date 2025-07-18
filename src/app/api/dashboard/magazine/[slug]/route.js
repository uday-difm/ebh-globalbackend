import { NextResponse } from 'next/server';
import { deleteMagazineBySlug,updateMagazineBySlug ,getMagazineBySlug} from '../.../../../../../../lib/data';

export async function DELETE(request, { params }) {
    const slug = params.slug;
  
    if (!slug) {
      return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
    }
  
    try {
      const deleted = await deleteMagazineBySlug(slug);
      if (!deleted) {
        return NextResponse.json({ message: 'Failed to delete Magazine' }, { status: 500 });
      }
      return NextResponse.json({ message: 'Magazine deleted successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting Magazine', error: error.message }, { status: 500 });
    }
  } 


//-------------------------update-Magazine-------------------------------
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

    const updated = await updateMagazineBySlug(slug, {
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
     
    });
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update magazine' }, { status: 500 });
    }
    return NextResponse.json({ message: 'magazine updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating magazine', error: error.message }, { status: 500 });
  }
}


//-------------fetch all magazine---------------------------------

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const magazine = await getMagazineBySlug(slug);
    if (!magazine) {
      return NextResponse.json({ message: 'magazine not found' }, { status: 404 });
    }
    return NextResponse.json(magazine);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching magazine', error: error.message }, { status: 500 });
  }
}
