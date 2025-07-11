import nodemailer from 'nodemailer';

// MODIFIED: Credentials are now defined directly in the code.
const EMAIL_USER = "magazines@itservcs.com";
const EMAIL_PASSWORD = "AB^$%r8wmh1$Kwes"; // This MUST be the App Password
const EMAIL_FROM = "magazines@itservcs.com";

// This is the "transporter" that sends the email
const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "magazines@itservcs.com",
    pass: "AB^$%r8wmh1$Kwes",
  },
});

// This is the function you will call to send the email
export async function sendMail({ to, subject, body }) {
  try {
    await transporter.sendMail({
      from: `Earth by Humans <${EMAIL_FROM}>`,
      to,
      subject,
      html: body,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Nodemailer Error:", error);
    // Re-throw the error so the API route can catch it
    throw new Error("Failed to send email. Please check credentials in mail.js");
  }
}