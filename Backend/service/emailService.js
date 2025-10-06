// utils/emailService.js
import nodemailer from "nodemailer";

export const sendEmailCode = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Smart Marketplace" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email verification code sent to ${email}: ${code}`);
};
