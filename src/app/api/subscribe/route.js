import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { sendEmail } from '../../../lib/subscribeEmail';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Check if the email already exists
    const checkSql = "SELECT * FROM `subscribers` WHERE `email` = ?";
    const [existing] = await db.query(checkSql, [email]);

    if (existing.length > 0) {
      return NextResponse.json({ message: "You have already subscribed." }, { status: 409 });
    }

    // Insert the new subscriber
    const insertSql = "INSERT INTO `subscribers` (`email`) VALUES (?)";
    await db.query(insertSql, [email]);

    // Send thank you email asynchronously, handle errors gracefully
    sendEmail(email).then(() => {
      // console.log(`Subscription email sent to ${email}`);
    }).catch((err) => {
      console.error(`Failed to send subscription email to ${email}:`, err);
    });

    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 200 });

  } catch (error) {
    console.error("API Subscribe Error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}
