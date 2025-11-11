import { sendMail } from './mail';

export const sendEmail = async (email) => {
  const mailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="background-color: #ffffff; padding: 20px; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333333; text-align: center;">Thank You for Subscribing!</h2>
            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
              Hi there,
            </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
              🎉 Thank you for subscribing to our newsletter! We're thrilled to have you as part of our community.
            </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
              From now on, you'll receive the latest updates, special offers, and exciting news directly in your inbox. We aim to provide you with valuable content, so stay tuned!
            </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
              If you have any questions, need support, or just want to say hello, don't hesitate to reach out to us. We're here to help!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 16px; color: #333333;">Best regards,</p>
              <p style="font-size: 16px; color: #333333;">The Team</p>
              <p style="font-size: 14px; color: #777777;">
                <a href="https://www.earthbyhumans.com/" style="color: #777777; text-decoration: none; font-weight: bold;">
                   Earth By Human
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

  try {
    // console.log('Attempting to send email to:', email);
    await sendMail({
      to: email,
      subject: 'Thank you for subscribing!',
      body: mailBody,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
