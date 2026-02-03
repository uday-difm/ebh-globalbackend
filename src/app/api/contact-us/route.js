export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { sendMail } from '../../../lib/mail';
import axios from 'axios';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, textArea, recaptchaToken } = data;

    // Basic validation
    if (!name || !email || !phone || !subject || !textArea) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json({ message: "reCAPTCHA token is missing." }, { status: 400 });
    }

    try {
    const response = await axios.post(
  "https://www.google.com/recaptcha/api/siteverify",
  new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: recaptchaToken,
  }).toString(),
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }
);

      if (!response.data.success) {
        return NextResponse.json({ message: "reCAPTCHA verification failed." }, { status: 400 });
      }
    } catch (error) {
      console.error("reCAPTCHA Error:", error);
      return NextResponse.json({ message: "Failed to verify reCAPTCHA." }, { status: 500 });
    }

    // Save to database
    const sql = "INSERT INTO contact_us (name, email, number, subject, message) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [name, email, phone, subject, textArea]);

    // --- IMPROVED EMAIL TEMPLATES ---
    const LOGO_URL = "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif";

    // Send the actual user message to the admin
    const adminSubject = `New Contact Form: ${subject} from ${name}`;
    const adminBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee;">
          <div style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <img src="${LOGO_URL}" alt="Earth by Humans" style="max-width: 180px; margin-bottom: 20px;">
            <h2 style="color: #16a34a; margin: 0; font-weight: 700; font-size: 24px;">New Inquiry Received</h2>
          </div>
          <div style="padding: 40px;">
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">You have received a new message through the Contact Us form on <strong>Earth by Humans</strong>.</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; width: 100px; font-size: 14px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #16a34a; font-weight: 500;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Subject</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-weight: 600;">${subject}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #16a34a;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Message Content</p>
              <p style="margin: 0; color: #444; line-height: 1.6; font-size: 15px;">${textArea}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8;">
            Sent automatically from Earth by Humans Web Portal
          </div>
        </div>
      </div>
    `;

    await sendMail({
      to: process.env.ADMIN_EMAIL || "earthbyhumans@gmail.com",
      subject: adminSubject,
      body: adminBody,
    });

    // Send welcome email to the user
    const userSubject = "Thanks for reaching out to Earth by Humans!";
    const userBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
          <div style="padding: 40px 40px 20px 40px; text-align: center;">
            <img src="${LOGO_URL}" alt="Earth by Humans" style="max-width: 150px; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">Hello ${name}!</h1>
          </div>
          <div style="padding: 0 40px 40px 40px; text-align: center;">
            <p style="color: #4b5563; font-size: 17px; line-height: 1.8; margin-bottom: 30px;">
              Thank you for contacting <strong>Earth by Humans</strong>. We've received your inquiry regarding <strong>"${subject}"</strong> and our team is already on it!
            </p>
            
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; margin-bottom: 35px;">
              <p style="color: #166534; font-size: 16px; margin: 0; font-weight: 500;">
                "We usually respond within 24-48 business hours. We appreciate your patience!"
              </p>
            </div>

            <p style="color: #6b7280; font-size: 15px; margin-bottom: 25px;">
              In the meantime, why not explore our latest stories?
            </p>

            <a href="https://earthbyhumans.com/blogs" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 14px 0 rgba(22, 163, 74, 0.39); transition: all 0.2s ease;">
              Explore Our Blogs
            </a>

            <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 30px;">
              <p style="color: #9ca3af; font-size: 14px; margin-bottom: 15px;">Stay connected with us</p>
              <div style="display: flex; justify-content: center; gap: 15px;">
                <a href="https://instagram.com/earth_by_humans" style="text-decoration: none; color: #16a34a; font-weight: 600;">Instagram</a> • 
                <a href="https://facebook.com/earthbyhumans" style="text-decoration: none; color: #16a34a; font-weight: 600;">Facebook</a> • 
      
              </div>
            </div>
          </div>
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} Earth by Humans. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
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

