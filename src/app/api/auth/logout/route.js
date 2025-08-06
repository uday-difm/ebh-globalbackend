import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies(); // ✅ await it here

  cookieStore.set({
    name: 'token',
    value: '',
    expires: new Date(0), // expires now
    path: '/',
  });

  return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
}
