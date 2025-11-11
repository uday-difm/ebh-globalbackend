import nodemailer from 'nodemailer';

const emailHost = process.env.EMAIL_SMTP_HOST ?? 'smtp.ionos.com';
const emailPort = Number.parseInt(process.env.EMAIL_SMTP_PORT ?? '587', 10);
const emailSecure = String(process.env.EMAIL_SMTP_SECURE ?? '').toLowerCase() === 'true';
const emailRequireTLS = String(process.env.EMAIL_SMTP_REQUIRE_TLS ?? 'true').toLowerCase() !== 'false';
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || emailUser || 'no-reply@example.com';

let cachedTransporter;

const createTransporter = () => {
  if (!emailUser || !emailPassword) {
    throw new Error('Email credentials are not configured');
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: Number.isNaN(emailPort) ? 587 : emailPort,
    secure: emailSecure,
    requireTLS: emailRequireTLS,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter();
  }
  return cachedTransporter;
};

export async function sendMail({ to, subject, body }) {
  if (!to || !subject) {
    throw new Error('Email `to` and `subject` fields are required');
  }

  try {
    await getTransporter().sendMail({
      from: `Earth by Humans <${emailFrom}>`,
      to,
      subject,
      html: body,
    });
    // console.log('Email sent successfully');
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw new Error('Failed to send email. Please check the SMTP environment variables.');
  }
}