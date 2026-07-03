const nodemailer = require("nodemailer");

// Simple reusable email sender used for password reset & notifications.
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "SevaSaathi <noreply@sevasaathi.in>",
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
