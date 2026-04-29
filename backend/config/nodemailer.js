export const sendMailWithRetry = async (mailOptions, retries = 3) => {
  // Brevo requires the sender to be a verified email on your Brevo account.
  // We force the sender to be your env email (which should be your Brevo login email).
  const senderEmail = process.env.EMAIL_USER || "venkiteshns2001@gmail.com";
  const senderName = "Forensic Talents";

  // We take the user's input 'from' (e.g. contact form submitter) and set it as the Reply-To.
  let replyToEmail = senderEmail;
  let replyToName = senderName;

  if (mailOptions.from) {
    const match = mailOptions.from.match(/"?([^"]*)"?\s*<([^>]+)>/);
    if (match) {
      replyToName = match[1];
      replyToEmail = match[2];
    } else {
      replyToEmail = mailOptions.from;
    }
  }

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      { email: mailOptions.to }
    ],
    replyTo: {
      name: replyToName,
      email: replyToEmail
    },
    subject: mailOptions.subject,
    htmlContent: mailOptions.html || "<p>No content provided</p>"
  };

  // Hardcoded as requested, but best practice is to put this in process.env.BREVO_API_KEY
  const apiKey = process.env.BREVO_API_KEY;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": apiKey,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo HTTP Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[Email Success] Sent to ${mailOptions.to} via Brevo HTTP API`);
      return data;
    } catch (err) {
      console.error(`[Email Attempt ${i + 1} Failed]`, err.message);
      if (i === retries) throw err;
      await new Promise(res => setTimeout(res, 1500));
    }
  }
};

export default {
  verify: () => console.log("Verification bypassed. Using Brevo HTTP API.")
};

