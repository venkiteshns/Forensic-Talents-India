require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const app = express();
const port = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/forensic_talents')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ══════════════════════════════════════════════════════════════════════════════
// SCHEMAS & MODELS
// ══════════════════════════════════════════════════════════════════════════════

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: "General Forensics" },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  mode: { type: [String], required: true },
  description: { type: String, required: true },
  topics: { type: [String], required: true },
}, { timestamps: true });

const internshipSchema = new mongoose.Schema({
  type: { type: String, enum: ['online', 'offline', 'Online', 'Offline'], required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  formLink: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
const Internship = mongoose.model('Internship', internshipSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'image', 'youtube'], required: true },
  fileUrl: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

// ══════════════════════════════════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ══════════════════════════════════════════════════════════════════════════════
const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    try {
      const token = auth.split(' ')[1];
      req.admin = jwt.verify(token, process.env.JWT_SECRET || 'forensic_secret');
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'forensic_secret',
      { expiresIn: '1d' }
    );
    return res.json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// COURSE ROUTES
// ══════════════════════════════════════════════════════════════════════════════
// GET all courses (public)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create course (protected)
app.post('/api/courses', protect, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update course (protected)
app.put('/api/courses/:id', protect, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE course (protected)
app.delete('/api/courses/:id', protect, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// INTERNSHIP ROUTES
// ══════════════════════════════════════════════════════════════════════════════
// GET all internships (public)
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create internship (protected)
app.post('/api/internships', protect, async (req, res) => {
  try {
    const intern = new Internship(req.body);
    await intern.save();
    res.status(201).json(intern);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update internship (protected)
app.put('/api/internships/:id', protect, async (req, res) => {
  try {
    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Internship not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// QUIZ ROUTES
// ══════════════════════════════════════════════════════════════════════════════
// GET latest quiz (public)
app.get('/api/quiz/latest', async (req, res) => {
  try {
    const quiz = await Quiz.findOne().sort({ createdAt: -1 });
    if (!quiz) return res.status(404).json({ message: 'No quiz found' });
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create quiz (protected)
app.post('/api/quiz', protect, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update quiz (protected)
app.put('/api/quiz/:id', protect, async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Quiz not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT toggle quiz visibility (protected)
app.put('/api/quiz/:id/toggle', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    quiz.isVisible = !quiz.isVisible;
    await quiz.save();
    res.json(quiz);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// RESOURCE ROUTES
// ══════════════════════════════════════════════════════════════════════════════
// GET all resources (public)
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create resource (protected)
app.post('/api/resources', protect, async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update resource (protected)
app.put('/api/resources/:id', protect, async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Resource not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE resource (protected)
app.delete('/api/resources/:id', protect, async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// EXISTING: CONTACT FORM ROUTE
// ══════════════════════════════════════════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, phone, email, enquiryType, enquiryCategory, educationType, customRequirement, professionalService, cyberSubService, message, age, professionStatus, courseDetails } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Message sent successfully' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ error: 'Failed to send the email' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// EXISTING: KEEP-ALIVE PING
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/ping', (req, res) => {
  res.status(200).send('Server is alive.');
});

const https = require('https');
const pingInterval = 14 * 60 * 1000;
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
  console.log(`Backend server is running on http://localhost:${port}`);
});
