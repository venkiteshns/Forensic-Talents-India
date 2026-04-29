import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,           // Use 587 (TLS) instead of 465 (SSL)
  secure: false,       // true for 465, false for 587
  family: 4,           // Force IPv4 specifically for Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // MUST be App Password
  },
  // Stability settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
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
