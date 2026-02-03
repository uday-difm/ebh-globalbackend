import formData from 'form-data';
import Mailgun from 'mailgun.js';

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'no-reply@earthbyhumans.com';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: API_KEY,
});

export async function sendMail({ to, subject, body }) {
  if (!to || !subject) {
    throw new Error('Email `to` and `subject` fields are required');
  }

  try {
    const messageData = {
      from: FROM_EMAIL,
      to,
      subject,
      html: body,
    };

    const res = await mg.messages.create(DOMAIN, messageData);
    // console.log('Email sent successfully:', res);
    return res;
  } catch (error) {
    console.error('Mailgun Error:', error);
    throw new Error('Failed to send email via Mailgun.');
  }
}
