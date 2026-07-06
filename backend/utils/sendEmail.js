const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing in the server's environment (.env file). Please set EMAIL_USER and EMAIL_PASS.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use direct SSL connection for highest trust rating
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ShopSphere Verification" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    headers: {
      "X-Priority": "1", // High Priority
      "X-MSMail-Priority": "High",
      "Importance": "high",
      "Priority": "urgent"
    }
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
