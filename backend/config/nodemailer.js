import nodemailer from 'nodemailer';
import dns from 'dns';

// Force Node.js to use IPv4 instead of IPv6 to resolve DNS.
// This fixes the ENETUNREACH error on platforms like Render that do not support outbound IPv6.
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default transporter;
