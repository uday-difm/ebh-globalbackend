import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the token cookie
  cookies().set('token', '', { expires: new Date(0), path: '/' });
  return NextResponse.json({ message: "Logout successful." });
}