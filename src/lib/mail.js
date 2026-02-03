import formData from 'form-data';
import Mailgun from 'mailgun.js';

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'no-reply@earthbyhumans.com';

let mg;

function getMailgunClient() {
  if (!mg) {
    if (!API_KEY) {
      // During build time, environment variables might be missing.
      // We log a warning instead of crashing.
      console.warn("Warning: MAILGUN_API_KEY is missing. Email functionality will not work until it's provided.");
      return null;
    }
    const mailgun = new Mailgun(formData);
    mg = mailgun.client({
      username: 'api',
      key: API_KEY,
    });
  }
  return mg;
}

export async function sendMail({ to, subject, body }) {
  const client = getMailgunClient();
  if (!client) {
    throw new Error('Mailgun client is not initialized. Check your MAILGUN_API_KEY.');
  }
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

    const res = await client.messages.create(DOMAIN, messageData);
    // console.log('Email sent successfully:', res);
    return res;
  } catch (error) {
    console.error('Mailgun Error:', error);
    throw new Error('Failed to send email via Mailgun.');
  }
}
