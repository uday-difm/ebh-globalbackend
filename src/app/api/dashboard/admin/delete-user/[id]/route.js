import db from '../../../../../../lib/db'
import { NextResponse } from 'next/server';

export async function PUT(req, context) {
  try {
    // ⛔ context.params is a Promise → MUST await
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check user exists
    const [existing] = await db.execute(
      'SELECT status FROM admin WHERE id = ? LIMIT 1',
      [id]
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const currentStatus = String(existing[0].status);
    const newStatus = currentStatus === '0' ? '1' : '0';

    // Update status
    await db.execute(
      'UPDATE admin SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    return NextResponse.json(
      {
        message: `User Deleted successfully.`,
        newStatus,
        id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { message: 'Error updating status.', error: error.message },
      { status: 500 }
    );
  }
}
