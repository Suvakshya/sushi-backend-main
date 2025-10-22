// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // <-- just the service name
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendResetCodeEmail = async (email, code) => {
//   const mailOptions = {
//     from: `"YourAppName" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Password Reset Code',
//     text: `Your password reset code is: ${code}. It will expire in 15 minutes.`,
//     html: `<p>Your password reset code is: <b>${code}</b>. It will expire in 15 minutes.</p>`
//   };

//   await transporter.sendMail(mailOptions);
// };

import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetCodeEmail = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code - Sushi Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF5350; text-align: center;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the following code to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #EF5350; background: #f5f5f5; padding: 15px; border-radius: 8px; display: inline-block;">
              ${resetCode}
            </div>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Sushi Restaurant Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset code sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset code email');
  }
};