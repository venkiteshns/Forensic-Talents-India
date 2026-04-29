import nodemailer from "nodemailer";
import dns from "dns";

// Manually resolve the IPv4 address for smtp.gmail.com.
// This completely bypasses Node's faulty IPv6 resolution on Render.
const resolveIPv4 = (hostname) => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, { family: 4 }, (err, address) => {
      if (err) reject(err);
      else resolve(address);
    });
  });
};

const hostIp = await resolveIPv4("smtp.gmail.com");

export const transporter = nodemailer.createTransport({
  host: hostIp,
  port: 465,
  secure: true, // MUST be true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // MUST be App Password
  },
  tls: {
    servername: "smtp.gmail.com" // Important so TLS doesn't fail when connecting via IP
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
