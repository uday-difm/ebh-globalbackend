import bcrypt from 'bcryptjs';
import db from '../../../../../lib/db';
import nodemailer from 'nodemailer';

// Allowed roles to prevent injection of arbitrary values
const ALLOWED_ROLES = [
  'Administrator',
  'Subscriber',
  'SEO Editor',
  'SEO Manager',
  'Contributor',
  'Author',
  'Editor',
];

// Handle POST /api/dashboard/admin/add-user
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, image } = body || {};

    // === VALIDATION ===
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json({ message: 'Invalid name.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: 'Invalid email.' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return Response.json(
        { message: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return Response.json({ message: 'Invalid role.' }, { status: 400 });
    }

    // === CHECK IF EMAIL ALREADY EXISTS ===
    const [existing] = await db.execute('SELECT id FROM admin WHERE email = ?', [
      email,
    ]);

    if (existing.length > 0) {
      return Response.json({ message: 'Email already in use.' }, { status: 400 });
    }

    // === HASH PASSWORD ===
    const hashedPassword = await bcrypt.hash(password, 10);

    // === INSERT NEW ADMIN ===
    const [result] = await db.execute(
      'INSERT INTO admin (name, email, password, role, image, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, role, image || null]
    );

    try {
      // === SET UP TRANSPORTER ===
      const transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com', // Use your SMTP host (e.g., IONOS, Gmail, etc.)
        port: 587,
        secure: false,  // true for 465, false for other ports
        requireTLS: true,
        auth: {
          user: 'magazines@itservcs.com',        // Replace with your SMTP user
          pass: 'AB^$%r8wmh1$Kwes',  // Replace with your SMTP app password
        },
      });

      // === EMAIL TEMPLATE ===
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <!-- Welcome Message -->
            <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 10px;">Welcome, ${name}!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center;">
              Your admin account has been successfully created. You have been assigned the <strong>${role}</strong> role.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center; margin-top: 20px;">
              Your login password is: <strong>${password}</strong>
            </p>
            <!-- Call to Action -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://www.earthbyhumans.com/dashboard/login" 
                style="display: inline-block; background-color: #008000; color: white; padding: 12px 25px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s;">
                Login to Dashboard
              </a>
            </div>
            <!-- Secondary Text -->
            <p style="color: #777; font-size: 14px; line-height: 1.5; text-align: center; margin-top: 30px;">
              If you did not expect this or have any questions, please contact our support team.
            </p>
            <!-- Footer Section -->
            <div style="text-align: center; color: #777; font-size: 12px; margin-top: 30px;">
              <p>Best regards,<br/><strong>The Admin Team</strong></p>
              <p style="margin-top: 10px;">
                <a href="https://www.earthbyhumans.com/" style="color: #008000; text-decoration: none;">Visit our website</a>
              </p>
            </div>
          </div>
        </div>
      `;

      // === SEND THE EMAIL ===
      await transporter.sendMail({
        from: 'magazines@itservcs.com', // sender address
        to: email, // recipient address (user's email)
        subject: 'Welcome to the Admin Panel!', // subject line
        html: emailTemplate, // HTML content of the email
      });

      return Response.json(
        { message: 'Admin created successfully and email sent!', id: result.insertId },
        { status: 201 }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return Response.json({ message: 'Admin created, but email sending failed.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in POST /add-user:', error);
    return Response.json(
      { message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
