import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  family: 4 // force IPv4 (important for Render)
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP error:", err.message);
  } else {
    console.log("SMTP ready");
  }
});

import dns from "dns";
dns.lookup("smtp.gmail.com", { all: true }, (err, addrs) => {
  if (err) {
    console.error("DNS Lookup error:", err);
  } else {
    console.log("Resolved smtp.gmail.com to:", addrs);
  }
});

export const sendMailWithRetry = async (mail, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await transporter.sendMail(mail);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
};

export default transporter;

