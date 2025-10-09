import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { sendMail } from '../../../lib/mail';

const ADMIN_EMAIL = 'earthbyhumans@gmail.com'; // Replace with actual admin email if needed

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, textArea } = data;

    // Basic validation
    if (!name || !email || !phone || !subject || !textArea) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Save to database
    const sql = "INSERT INTO contact_us (name, email, number, subject, message) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [name, email, phone, subject, textArea]);

    // Send the actual user message to the admin
    const adminSubject = `New Contact Form Submission from ${name}`;
    const adminBody = `
      <h3>New Message Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${textArea}</p>
    `;
    await sendMail({
      to: ADMIN_EMAIL,
      subject: adminSubject,
      body: adminBody,
    });

    // Send welcome email to the user
    const userSubject = "Thank you for contacting Earth by Humans";
    const userBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; padding: 10px;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to <strong>Earth by Humans</strong>. We’ve received your message and will get back to you shortly.</p>
        <p>Meanwhile, check out our <Link href="https://earthbyhumans.com/blogs" style="color: #16a34a;">blogs</Link> or follow us on social media!</p>
        <p>Warm regards,<br/>The Earth by Humans Team</p>
        <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
      </div>
    `;
    await sendMail({
      to: email,
      subject: userSubject,
      body: userBody,
    });

    return NextResponse.json({
      message: "Message submitted successfully. Confirmation sent to user and message sent to admin.",
    }, { status: 200 });

  } catch (error) {
    // console.error("Contact form error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}
