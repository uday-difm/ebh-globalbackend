import db from '../../../../../lib/db';
import { NextResponse } from 'next/server';

function safeFormatDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  // Production Node may not support en-US locale
  try {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return date.toISOString().split('T')[0]; // fallback yyyy-mm-dd
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute(
      'SELECT `id`, `name`, `email`, `role`, `image`, `created_at` FROM `admin` WHERE `status` = "0" ORDER BY created_at DESC'
    );

    const formattedData = rows.map((user) => ({
      ...user,
      formatted_created_date: safeFormatDate(user.created_at),
    }));

    return NextResponse.json(
      { success: true, data: formattedData },
      { status: 200 }
    );

  } catch (error) {
    console.error("ADMIN API ERROR:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again later.",
        error: error.message,  // temporarily show error to debug
      },
      { status: 500 }
    );
  }
}
