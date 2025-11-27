import db from '../../../../../../lib/db'
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const query =
      'SELECT `id`, `name`, `email`, `role`, `image`, `bio`, `facebook`, `twitter`, `instagram`,`linkedin` FROM `admin` WHERE `id` = ? LIMIT 1';
    const [rows] = await db.execute(query, [id]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json(
      {
        message: 'User fetched successfully.',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Error fetching user.', error: error.message },
      { status: 500 }
    );
  }
}
