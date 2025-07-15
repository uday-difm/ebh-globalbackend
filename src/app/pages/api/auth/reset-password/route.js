import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, otp, password } = await request.json();

    const [userRows] = await db.query(
      "SELECT otp, TIMESTAMPDIFF(SECOND, otpCreatedAt, NOW()) AS otpAgeInSeconds FROM auth WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ message: "Invalid email or OTP." }, { status: 400 });
    }

    const user = userRows[0];

    if (user.otpAgeInSeconds > 600) { // 10 minute validity
      return NextResponse.json({ message: "Your OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "The OTP you entered is incorrect." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE auth SET password = ?, otp = NULL, otpCreatedAt = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    return NextResponse.json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("RESET-PASSWORD-ERROR:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}