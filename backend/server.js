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
    const { name, company, phone, email, service, enquiryType, message, age, professionStatus, courseDetails } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Sends the email TO yourself
      subject: courseDetails ? `New Course Enrollment: ${name}` : `New Enquiry from ${name} (Forensic Talents India)`,
      html: `
        <h2>${courseDetails ? 'Course Enrollment Request' : 'New Enquiry'}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
        ${enquiryType ? `<p><strong>Enquiry Type:</strong> ${enquiryType}</p>` : ''}
        
        ${courseDetails ? `<h3>Enrollment Details</h3>` : ''}
        ${courseDetails ? `<p><strong>Course:</strong> ${courseDetails}</p>` : ''}
        ${age ? `<p><strong>Age:</strong> ${age}</p>` : ''}
        ${professionStatus ? `<p><strong>Current Status:</strong> ${professionStatus}</p>` : ''}

        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br/>') : 'No additional message provided.'}</p>
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

// Keep-alive route
app.get('/api/ping', (req, res) => {
  res.status(200).send('Server is alive.');
});

const https = require('https');
const pingInterval = 14 * 60 * 1000; // 14 minutes
const backendUrl = "https://forensic-talents-india.onrender.com/api/ping";

setInterval(() => {
  https.get(backendUrl, (response) => {
    if (response.statusCode === 200) {
      console.log('Keep-alive ping successful:', new Date().toISOString());
    } else {
      console.log('Keep-alive ping failed with status code:', response.statusCode);
    }
  }).on('error', (error) => {
    console.error('Keep-alive ping error:', error.message);
  });
}, pingInterval);

app.listen(port, () => {
  console.log(`Backend server is running correctly on http://localhost:${port}`);
});
