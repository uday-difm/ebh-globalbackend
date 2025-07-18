import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const data = await request.json();
    const { emailOrUsername, password } = data;

    // Find user by email or username
    const [userRows] = await db.query(
      "SELECT * FROM auth WHERE email = ? OR username = ?",
      [emailOrUsername, emailOrUsername]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const user = userRows[0];

    // Compare provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.idauth, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY, // Make sure to set this in your .env.local file
      { expiresIn: '1d' }
    );

    // Set the token in a secure, httpOnly cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({ message: "Login successful." }, { status: 200 });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ message: "An error occurred during login." }, { status: 500 });
  }
}