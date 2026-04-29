import transporter, { sendMailWithRetry } from '../config/nodemailer.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, company, phone, email, enquiryType, enquiryCategory, educationType, customRequirement, professionalService, cyberSubService, message, age, professionStatus, courseDetails, nationality, mode } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    if (age) {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
        return res.status(400).json({ error: 'Invalid age provided' });
      }
    }

    if (mode && !['online', 'offline'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode of learning provided' });
    }

    const finalNationality = nationality || 'India';

    // Strip spaces, dashes, parentheses to get clean digits
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    if (finalNationality === 'India') {
      // Remove all non-digits (like '+') to handle +91
      const phoneDigits = cleanPhone.replace(/\D/g, '');
      // If it starts with country code '91' and has 12 digits, strip '91'
      const nationalPhone = phoneDigits.startsWith('91') && phoneDigits.length === 12 ? phoneDigits.slice(2) : phoneDigits;

      if (!/^[6-9][0-9]{9}$/.test(nationalPhone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number.' });
      }
    } else {
      if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
        return res.status(400).json({ error: 'Please enter a valid international phone number.' });
      }
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: req.body.subject || (courseDetails ? `New Course Enrollment: ${name}` : `New Enquiry from ${name} (Forensic Talents India)`),
      html: `
        <h2>${courseDetails ? 'Course Enrollment Request' : 'New Enquiry'}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${mode ? `<p><strong>Mode:</strong> ${mode.charAt(0).toUpperCase() + mode.slice(1)}</p>` : ''}
        <p><strong>Nationality:</strong> ${finalNationality}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${enquiryType ? `<p><strong>Enquiry Type:</strong> ${enquiryType}</p>` : ''}
        ${enquiryCategory ? `<p><strong>Enquiry Category:</strong> ${enquiryCategory}</p>` : ''}
        ${educationType ? `<p><strong>Education Type:</strong> ${educationType}</p>` : ''}
        ${customRequirement ? `<p><strong>Custom Requirement:</strong> ${customRequirement}</p>` : ''}
        ${professionalService ? `<p><strong>Professional Service:</strong> ${professionalService}</p>` : ''}
        ${cyberSubService ? `<p><strong>Cyber Service:</strong> ${cyberSubService}</p>` : ''}
        ${courseDetails ? `<h3>Enrollment Details</h3>` : ''}
        ${courseDetails ? `<p><strong>Course:</strong> ${courseDetails}</p>` : ''}
        ${age ? `<p><strong>Age:</strong> ${age}</p>` : ''}
        ${professionStatus ? `<p><strong>Current Status:</strong> ${professionStatus}</p>` : ''}
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br/>') : 'No additional message provided.'}</p>
      `
    };

    // Non-blocking fire-and-forget with retry
    try {
      sendMailWithRetry(mailOptions).catch(err => {
        console.error("Contact form email failed:", err.message);
      });
    } catch (err) {
      console.error("Email system error:", err.message);
    }

    res.status(200).json({ success: 'Message sent successfully. Email will be sent shortly.' });
  } catch (error) {
    next(error);
  }
};
