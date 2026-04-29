import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to use IPv4 instead of IPv6 to resolve DNS.
// This is critical for Render deployments as outbound IPv6 is often unsupported.
dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // MUST be true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // MUST be App Password
  },

  // Stability settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  // Force IPv4 (Render sometimes has IPv6 issues)
  family: 4
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error.message);
  } else {
    console.log("SMTP server is ready");
  }
});

export const sendMailWithRetry = async (mailOptions, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(`Email attempt ${i + 1} failed:`, {
        code: err.code,
        command: err.command,
        message: err.message
      });
      if (i === retries - 1) throw err;
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export default transporter;
