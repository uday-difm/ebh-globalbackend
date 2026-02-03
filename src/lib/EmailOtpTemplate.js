export const EmailOtpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Earth by Humans - Password Reset</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; }
            h1 { color: #2d3748; text-align: center; }
            p { color: #4a5568; font-size: 16px; line-height: 1.5; text-align: center; }
            .otp-code { font-size: 32px; text-align: center; color: #2c5282; margin: 30px 0; font-weight: bold; letter-spacing: 4px; }
            .validity { color: #718096; text-align: center; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif" alt="Earth by Humans" style="max-width: 150px;">
            </div>
            <p>Your One-Time Password (OTP) to reset your password is:</p>
            <div class="otp-code">${otp}</div>
            <p class="validity">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
    </body>
    </html>
  `;
};