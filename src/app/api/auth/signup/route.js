import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const data = await request.json();
    const { firstName, lastName, username, email, password } = data;

    // Check if user already exists
    const userExists = await db.query(
      "SELECT * FROM auth WHERE email = ? OR username = ?",
      [email, username]
    );

    if (userExists[0].length > 0) {
      return NextResponse.json({ message: "User with this email or username already exists." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    // Insert new user into the database
    await db.query(
      "INSERT INTO auth (name, username, email, password, role, date) VALUES (?, ?, ?, ?, 'user', NOW())",
      [fullName, username, email, hashedPassword]
    );

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}