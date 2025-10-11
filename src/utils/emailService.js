import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // <-- just the service name
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetCodeEmail = async (email, code) => {
  const mailOptions = {
    from: `"YourAppName" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${code}. It will expire in 15 minutes.`,
    html: `<p>Your password reset code is: <b>${code}</b>. It will expire in 15 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};
