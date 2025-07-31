import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // Using our shared database connection
import { sendMail } from '../../../lib/mail';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, textArea } = data;

    // Basic validation
    if (!name || !email || !phone || !subject || !textArea) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }


    const sql = "INSERT INTO contact_us (name, email, number, subject, message) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [name, email, phone, subject, textArea]);

    // Send confirmation email to user
    const emailSubject = "Thank you for contacting Earth by Humans";
    const emailBody = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; padding: 10px;">
    <p style="margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>

    <p style="margin-bottom: 16px;">
      Thank you for getting in touch with <strong>Earth by Humans</strong>. We’ve received your message and our team will get back to you shortly.
    </p>

    <p style="margin-bottom: 10px;"><strong>Your message:</strong></p>
    <div style="background-color: #f6f6f6; padding: 12px 16px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
      <p style="margin: 0;">${textArea}</p>
    </div>

    <p style="margin-bottom: 20px;">
      In the meantime, feel free to explore our <a href="https://earthbyhumans.com/blogs" style="color: #16a34a; text-decoration: none;">blogs</a>,
      <a href="https://earthbyhumans.com/magazine" style="color: #16a34a; text-decoration: none;">magazines</a>, or connect with us on social media.
    </p>

    <p style="margin-bottom: 30px;">
      Best regards,<br/>
      <strong>Earth by Humans Team</strong><br/>
      <a href="https://earthbyhumans.com" style="color: #16a34a; text-decoration: none;">www.earthbyhumans.com</a>
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

    <p style="font-size: 13px; color: #888;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
`;


    try {
      await sendMail({ to: email, subject: emailSubject, body: emailBody });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Optionally, you can return a different response or ignore email errors
      return NextResponse.json({ message: "Message saved but failed to send confirmation email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Your message has been saved successfully and a confirmation email has been sent." }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}
