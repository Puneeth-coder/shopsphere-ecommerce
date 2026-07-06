const nodemailer = require("nodemailer");
const axios = require("axios");

const sendEmail = async ({ to, subject, text, html }) => {
  // 1. If Brevo API key is available, use HTTPS API (Highly recommended for Render + Inbox delivery)
  if (process.env.BREVO_API_KEY) {
    try {
      console.log("📨 Sending email via Brevo HTTPS API...");
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "ShopSphere", email: "puneethm240@gmail.com" },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html || text,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Email sent successfully via Brevo!");
      return;
    } catch (apiError) {
      console.error("❌ Brevo API failed, falling back to SMTP:", apiError.response?.data || apiError.message);
    }
  }

  // 2. Fallback to standard SMTP (Gmail App Password)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing in the server's environment (.env file).");
  }

  console.log("📧 Sending email via Gmail SMTP...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
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
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "Importance": "high",
      "Priority": "urgent"
    }
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully via SMTP!");
};

module.exports = sendEmail;
