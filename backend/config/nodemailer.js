import nodemailer from "nodemailer";
import dns from "dns/promises";

export const sendMailWithRetry = async (mail, retries = 3) => {
  for (let i = 0; i <= retries; i++) {
    try {
      // 1. Get all raw IPv4 addresses for Gmail SMTP
      const records = await dns.resolve4("smtp.gmail.com");
      
      // 2. Pick a random IP to avoid hitting a blocked/throttled node
      const randomIp = records[Math.floor(Math.random() * records.length)];
      
      console.log(`[Email Attempt ${i + 1}] Connecting to IP: ${randomIp}`);
      
      // 3. Create a dynamic transporter for this IP
      const dynamicTransporter = nodemailer.createTransport({
        host: randomIp,
        port: 587,
        secure: false, // TLS via STARTTLS
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          // MUST provide servername when connecting via raw IP for SSL cert validation
          servername: "smtp.gmail.com"
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });

      // 4. Send the email
      const result = await dynamicTransporter.sendMail(mail);
      console.log(`[Email Success] Sent via ${randomIp}`);
      return result;

    } catch (err) {
      console.error(`[Email Attempt ${i + 1} Failed]`, err.message);
      if (i === retries) {
        throw err; // All retries exhausted
      }
      // Wait 1.5 seconds before retrying
      await new Promise(res => setTimeout(res, 1500));
    }
  }
};

// Dummy default export to satisfy any files expecting a default transporter
export default {
  verify: () => console.log("Transporter verification bypassed for dynamic IP routing")
};

