import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/sendMail';
import { EmailOtpTemplate } from '../../../../lib/EmailOtpTemplate';

export async function POST(request) {
  try {
    const { emailOrUsername } = await request.json();

    const [userRows] = await db.query(
      "SELECT * FROM auth WHERE email = ? OR username = ?",
      [emailOrUsername, emailOrUsername]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ message: "If an account with this email exists, an OTP has been sent." });
    }

    const user = userRows[0];
    const otp = crypto.randomInt(100000, 999999).toString();
    
    await db.query(
      "UPDATE auth SET otp = ?, otpCreatedAt = NOW() WHERE idauth = ?",
      [otp, user.idauth]
    );
    
    await sendMail({
      to: user.email,
      subject: "Your Password Reset Code",
      body: EmailOtpTemplate(otp),
    });

    return NextResponse.json({ message: "An OTP has been sent to your email address.", email: user.email });

  } catch (error) {
    console.error("REQUEST-OTP-ERROR:", error);
    return NextResponse.json({ message: "An error occurred while sending the OTP." }, { status: 500 });
  }
}