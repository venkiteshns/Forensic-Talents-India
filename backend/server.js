require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from the React frontend
app.use(express.json());

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard configuration for Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // MUST be a 16-character App Password, NOT standard google password
  }
});

// Configure endpoint for contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, phone, email, service, enquiryType, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Sends the email TO yourself
      subject: `New Enquiry from ${name} (Forensic Talents India)`,
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service || 'None specified'}</p>
        <p><strong>Course Enquiry:</strong> ${enquiryType || 'None specified'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message sent successfully' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ error: 'Failed to send the email' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running correctly on http://localhost:${port}`);
});
