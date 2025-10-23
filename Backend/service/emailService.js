// utils/emailService.js
import nodemailer from "nodemailer";

// Your existing function
export const sendEmailCode = async (email, code) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Smart Marketplace" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email verification code sent to ${email}: ${code}`);
};

// New function for notifications
export const sendNotificationEmail = async (email, subject, message) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Marketplace Admin" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: formatNotificationHTML(subject, message),
    text: message,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Notification email sent to ${email}`);
};

// Send bulk notifications
export const sendBulkNotificationEmails = async (emails, subject, message) => {
  const results = [];

  for (const email of emails) {
    try {
      await sendNotificationEmail(email, subject, message);
      results.push({ email, success: true });
    } catch (error) {
      results.push({ email, success: false, error: error.message });
    }
  }

  return results;
};

// Helper function to create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Helper function to format HTML email
const formatNotificationHTML = (subject, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div class="content">
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Smart Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
