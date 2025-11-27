import db from '../../../../../../lib/db'
import { NextResponse } from 'next/server';

export async function PUT(req, context) {
  try {
    // context.params can be a Promise in route handlers — await it:
    const params = await context.params;
    console.log('resolved params:', params);

    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      role,
      bio,
      facebook,
      twitter,
      instagram,
      linkedin,
      status,
      image
    } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existing] = await db.execute(
      'SELECT id FROM admin WHERE id = ? LIMIT 1',
      [id]
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Normalize optional fields to NULL
    const safeBio = bio ?? null;
    const safeFacebook = facebook ?? null;
    const safeTwitter = twitter ?? null;
    const safeInstagram = instagram ?? null;
    const safeLinkedin = linkedin ?? null;

    // normalize status – ensure 0 or 1 (numeric)
    const safeStatus =
      status === '0' || status === 0 ? 0 :
      status === '1' || status === 1 ? 1 :
      1; // default to 1 if not provided/invalid

    const safeImage = image ?? null;

    // Update query
    const query = `
      UPDATE admin
      SET name = ?, email = ?, role = ?, bio = ?, facebook = ?, twitter = ?, 
          instagram = ?, linkedin = ?, status = ?, image = ?
      WHERE id = ?
    `;

    const values = [
      name,
      email,
      role,
      safeBio,
      safeFacebook,
      safeTwitter,
      safeInstagram,
      safeLinkedin,
      safeStatus,
      safeImage,
      id
    ];

    await db.execute(query, values);

    return NextResponse.json(
      { message: 'User updated successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user.', error: error.message },
      { status: 500 }
    );
  }
}
