import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import Admin from './models/Admin.js';
import Event from './models/Event.js';
import Review from './models/Review.js';

const app = express();
const port = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/forensic_talents')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ─── Cloudinary & Multer Setup ──────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("WARNING: Cloudinary environment variables are missing!");
}

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, PDF`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ══════════════════════════════════════════════════════════════════════════════
// SCHEMAS & MODELS
// ══════════════════════════════════════════════════════════════════════════════

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: "General Forensics" },
  duration: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  mode: { type: [String], required: true },
  description: { type: String, required: true },
  topics: { type: [String], required: true },
}, { timestamps: true });

const internshipSchema = new mongoose.Schema({
  type: { type: String, enum: ['online', 'offline', 'Online', 'Offline'], required: true },
  duration: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
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

const internshipBenefitSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const internshipAreaSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const InternshipBenefit = mongoose.model('InternshipBenefit', internshipBenefitSchema);
const InternshipArea = mongoose.model('InternshipArea', internshipAreaSchema);

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
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret',
      { expiresIn: '7d' }
    );

    admin.refreshTokens.push(refreshToken);
    await admin.save();

    return res.json({
      success: true,
      token,
      refreshToken,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret');
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    // Token Rotation: Remove the old refresh token
    admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);

    // Generate new tokens
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'forensic_secret',
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret',
      { expiresIn: '7d' }
    );

    admin.refreshTokens.push(newRefreshToken);
    await admin.save();

    return res.json({ success: true, token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret', { ignoreExpiration: true });
    const admin = await Admin.findById(decoded.id);

    if (admin) {
      admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
      await admin.save();
    }

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error during logout' });
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

// DELETE internship (protected)
app.delete('/api/internships/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid internship ID' });
    }
    const deleted = await Internship.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Internship not found' });

    // Cleanup associated benefits and areas
    await InternshipBenefit.deleteMany({ internshipId: id });
    await InternshipArea.deleteMany({ internshipId: id });

    return res.json({ success: true, message: 'Internship and associated data deleted successfully' });
  } catch (err) {
    console.error('Delete internship error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// INTERNSHIP BENEFITS & AREAS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// Benefits
app.get('/api/internships/:id/benefits', async (req, res) => {
  try {
    const benefits = await InternshipBenefit.find({ internshipId: req.params.id }).sort({ order: 1 });
    res.json(benefits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/internships/:id/benefits', protect, async (req, res) => {
  try {
    const benefit = new InternshipBenefit({ ...req.body, internshipId: req.params.id });
    await benefit.save();
    res.status(201).json(benefit);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/benefits/:id', protect, async (req, res) => {
  try {
    const updated = await InternshipBenefit.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Benefit not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/benefits/:id', protect, async (req, res) => {
  try {
    const deleted = await InternshipBenefit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Benefit not found' });
    res.json({ message: 'Benefit deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Areas
app.get('/api/internships/:id/areas', async (req, res) => {
  try {
    const areas = await InternshipArea.find({ internshipId: req.params.id }).sort({ order: 1 });
    res.json(areas);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/internships/:id/areas', protect, async (req, res) => {
  try {
    const area = new InternshipArea({ ...req.body, internshipId: req.params.id });
    await area.save();
    res.status(201).json(area);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/areas/:id', protect, async (req, res) => {
  try {
    const updated = await InternshipArea.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Area not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/areas/:id', protect, async (req, res) => {
  try {
    const deleted = await InternshipArea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Area not found' });
    res.json({ message: 'Area deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
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

// POST upload file to Cloudinary (protected)
app.post('/api/upload', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (req.file) {
      console.log("Upload route hit. File size:", req.file.size, "Mimetype:", req.file.mimetype);
    } else {
      console.log("Upload route hit, but no file received.");
    }

    if (err) {
      console.error("Multer error:", err);
      // Multer / file-filter error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: 'File too large. Maximum size is 10 MB.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    // Determine Cloudinary resource type
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

    // Generate a unique public_id to prevent overwriting
    const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniquePublicId = `${Date.now()}-${sanitizedName.split('.')[0]}`; // Cloudinary adds extension

    // Upload from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'forensic_talents_resources',
        resource_type: resourceType,
        public_id: uniquePublicId,
        overwrite: false
      },
      (error, result) => {
        if (error) {
          console.error(`Cloudinary upload error for ${uniquePublicId}:`, error);
          if (error.message && error.message.includes("already exists")) {
            return res.status(400).json({
              success: false,
              message: "A file with the same name already exists. Please rename the file or try again."
            });
          }
          return res.status(500).json({ success: false, message: 'Failed to upload to Cloudinary' });
        }

        console.log(`Successfully uploaded: ${uniquePublicId}`);
        return res.json({ success: true, url: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);
  });
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

    if (finalNationality === 'India') {
      if (!/^[6-9][0-9]{9}$/.test(phone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number.' });
      }
    } else {
      if (!/^\+?[0-9]{8,15}$/.test(phone)) {
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

// ══════════════════════════════════════════════════════════════════════════════
// EVENTS API
// ══════════════════════════════════════════════════════════════════════════════

// Separate Cloudinary instance for events
const eventCloudinary = cloudinary;
if (process.env.CLOUDINARY_EVENT_CLOUD_NAME) {
  eventCloudinary.config({
    cloud_name: process.env.CLOUDINARY_EVENT_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_EVENT_API_KEY,
    api_secret: process.env.CLOUDINARY_EVENT_API_SECRET
  });
}

const eventStorage = multer.memoryStorage();
const eventUpload = multer({
  storage: eventStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post('/api/events', protect, eventUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 9 }]), async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    let coverImageUrl = "";
    let additionalImageUrls = [];

    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
      const file = req.files.coverImage[0];
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
      coverImageUrl = cldRes.secure_url;
    }

    if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
      for (const file of req.files.additionalImages) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
        additionalImageUrls.push(cldRes.secure_url);
      }
    }

    const newEvent = new Event({
      title,
      description,
      eventDate,
      coverImage: coverImageUrl,
      images: additionalImageUrls
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
});

app.put('/api/events/:id', protect, eventUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 9 }]), async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    let existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.title = title || event.title;
    event.description = description || event.description;
    if (eventDate) event.eventDate = eventDate;

    // Update cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
      const file = req.files.coverImage[0];
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
      event.coverImage = cldRes.secure_url;
    }

    // Update additional images
    let newAdditionalImageUrls = [];
    if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
      for (const file of req.files.additionalImages) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
        newAdditionalImageUrls.push(cldRes.secure_url);
      }
    }

    event.images = [...existingImages, ...newAdditionalImageUrls].slice(0, 9); // Max 9 additional images

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err.message });
  }
});

app.delete('/api/events/:id', protect, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// REVIEWS API
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/reviews', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isApproved: true };
    if (type && ['service', 'education'].includes(type)) {
      query.type = type;
    }
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get('/api/admin/reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post('/api/reviews', eventUpload.single('photo'), async (req, res) => {
  try {
    const { name, email, rating, review, type } = req.body;

    // Validate required type field
    if (!type || !['service', 'education'].includes(type)) {
      return res.status(400).json({ message: 'Review type is required. Must be "service" or "education".' });
    }

    let photoUrl = "";

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "reviews" });
      photoUrl = cldRes.secure_url;
    }

    const newReview = new Review({ name, email, rating, review, type, photo: photoUrl });
    await newReview.save();
    res.status(201).json({ message: "Review submitted for approval" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting review", error: err.message });
  }
});

app.put('/api/reviews/:id/approve', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.isApproved = !review.isApproved;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete('/api/reviews/:id', protect, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

import https from 'https';
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

// --- GAME AGGREGATOR ROUTE ---
app.get('/api/game/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const playedIds = req.query.playedIds ? req.query.playedIds.split(',') : [];

    let Model;
    if (type === 'word-search') Model = WordSearch;
    else if (type === 'crossword') Model = Crossword;
    else if (type === 'jigsaw') Model = Jigsaw;
    else if (type === 'matching') Model = Matching;
    else return res.status(400).json({ message: 'Invalid game type' });

    const activeSets = await Model.find({ isActive: true });
    if (activeSets.length === 0) {
      return res.status(404).json({ message: 'No active sets found' });
    }

    let unplayedSets = activeSets.filter(set => !playedIds.includes(set._id.toString()));

    if (unplayedSets.length === 0) {
      unplayedSets = activeSets;
    }

    const shuffledSets = unplayedSets.sort(() => 0.5 - Math.random());
    const selectedSet = shuffledSets[0];

    // Send a flag indicating if list was reset (optional, but helpful for frontend)
    res.json({ ...selectedSet.toObject(), resetOccurred: unplayedSets.length === activeSets.length && activeSets.length > 0 && playedIds.length > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game data' });
  }
});

// --- WORD SEARCH ROUTES ---
import WordSearch from './models/WordSearch.js';

app.get('/api/word-search', async (req, res) => {
  // Legacy fallback, mostly replaced by /api/game/word-search
  try {
    const activeSet = await WordSearch.findOne({ isActive: true });
    if (!activeSet) return res.status(404).json({ message: 'No active word set found' });
    res.json(activeSet);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch word search' }); }
});

app.get('/api/word-search/admin/all', protect, async (req, res) => {
  try {
    const sets = await WordSearch.find().sort({ createdAt: -1 });
    res.json(sets);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch word sets' }); }
});

app.post('/api/word-search', protect, async (req, res) => {
  try {
    const { title, difficulty, words, isActive } = req.body;
    const newSet = new WordSearch({ title, difficulty, words, isActive });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (error) { res.status(500).json({ message: 'Failed to save word set', error: error.message }); }
});

app.put('/api/word-search/:id', protect, async (req, res) => {
  try {
    const { title, difficulty, words, isActive } = req.body;
    const updatedSet = await WordSearch.findByIdAndUpdate(
      req.params.id,
      { title, difficulty, words, isActive },
      { returnDocument: 'after' }
    );
    res.json(updatedSet);
  } catch (error) { res.status(500).json({ message: 'Failed to update word set', error: error.message }); }
});

app.delete('/api/word-search/:id', protect, async (req, res) => {
  try {
    await WordSearch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Word set deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete word set', error: error.message }); }
});

// --- CROSSWORD ROUTES ---
import Crossword from './models/Crossword.js';

app.get('/api/crossword', async (req, res) => {
  try {
    const activeSet = await Crossword.findOne({ isActive: true });
    if (!activeSet) return res.status(404).json({ message: 'No active crossword found' });
    res.json(activeSet);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch crossword' }); }
});

app.get('/api/crossword/admin/all', protect, async (req, res) => {
  try {
    const sets = await Crossword.find().sort({ createdAt: -1 });
    res.json(sets);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch crosswords' }); }
});

app.post('/api/crossword', protect, async (req, res) => {
  try {
    const { title, difficulty, words, isActive } = req.body;
    const newSet = new Crossword({ title, difficulty, words, isActive });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (error) { res.status(500).json({ message: 'Failed to save crossword', error: error.message }); }
});

app.put('/api/crossword/:id', protect, async (req, res) => {
  try {
    const { title, difficulty, words, isActive } = req.body;
    const updatedSet = await Crossword.findByIdAndUpdate(req.params.id, { title, difficulty, words, isActive }, { returnDocument: 'after' });
    res.json(updatedSet);
  } catch (error) { res.status(500).json({ message: 'Failed to update crossword' }); }
});

app.delete('/api/crossword/:id', protect, async (req, res) => {
  try {
    await Crossword.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete' }); }
});

// --- JIGSAW ROUTES ---
import Jigsaw from './models/Jigsaw.js';

app.get('/api/jigsaw', async (req, res) => {
  try {
    const activeSet = await Jigsaw.findOne({ isActive: true });
    if (!activeSet) return res.status(404).json({ message: 'No active jigsaw found' });
    res.json(activeSet);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch jigsaw' }); }
});

app.get('/api/jigsaw/admin/all', protect, async (req, res) => {
  try {
    const sets = await Jigsaw.find().sort({ createdAt: -1 });
    res.json(sets);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch jigsaws' }); }
});

app.post('/api/jigsaw', protect, async (req, res) => {
  try {
    const { title, difficulty, imageUrl, isActive } = req.body;
    const newSet = new Jigsaw({ title, difficulty, imageUrl, isActive });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (error) { res.status(500).json({ message: 'Failed to save jigsaw' }); }
});

app.put('/api/jigsaw/:id', protect, async (req, res) => {
  try {
    const { title, difficulty, imageUrl, isActive } = req.body;
    const updatedSet = await Jigsaw.findByIdAndUpdate(req.params.id, { title, difficulty, imageUrl, isActive }, { returnDocument: 'after' });
    res.json(updatedSet);
  } catch (error) { res.status(500).json({ message: 'Failed to update jigsaw' }); }
});

app.delete('/api/jigsaw/:id', protect, async (req, res) => {
  try {
    await Jigsaw.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete' }); }
});

// --- MATCHING ROUTES ---
import Matching from './models/Matching.js';

app.get('/api/matching', async (req, res) => {
  try {
    const activeSet = await Matching.findOne({ isActive: true });
    if (!activeSet) return res.status(404).json({ message: 'No active matching game found' });
    res.json(activeSet);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch matching game' }); }
});

app.get('/api/matching/admin/all', protect, async (req, res) => {
  try {
    const sets = await Matching.find().sort({ createdAt: -1 });
    res.json(sets);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch matching games' }); }
});

app.post('/api/matching', protect, async (req, res) => {
  try {
    const { title, difficulty, useIcons, images, isActive } = req.body;
    const newSet = new Matching({ title, difficulty, useIcons, images, isActive });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (error) { res.status(500).json({ message: 'Failed to save matching game' }); }
});

app.put('/api/matching/:id', protect, async (req, res) => {
  try {
    const { title, difficulty, useIcons, images, isActive } = req.body;
    const updatedSet = await Matching.findByIdAndUpdate(req.params.id, { title, difficulty, useIcons, images, isActive }, { returnDocument: 'after' });
    res.json(updatedSet);
  } catch (error) { res.status(500).json({ message: 'Failed to update matching game' }); }
});

app.delete('/api/matching/:id', protect, async (req, res) => {
  try {
    await Matching.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete' }); }
});

// --- PAYMENT SETTINGS ROUTES ---
import PaymentSettings from './models/PaymentSettings.js';

app.get('/api/payment-settings', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings({
        accountName: "Forensic Talents",
        accountNumber: "1234567890",
        ifscCode: "XXXX0000000",
        bankName: "Example Bank",
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch payment settings' }); }
});

app.put('/api/admin/payment-settings', protect, upload.single('qrCode'), async (req, res) => {
  try {
    const { accountName, accountNumber, ifscCode, bankName } = req.body;
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings({ accountName, accountNumber, ifscCode, bankName });
    } else {
      if (accountName) settings.accountName = accountName;
      if (accountNumber) settings.accountNumber = accountNumber;
      if (ifscCode) settings.ifscCode = ifscCode;
      if (bankName) settings.bankName = bankName;
    }

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "forensic_talents_payment" });
      settings.qrCodeUrl = cldRes.secure_url;
    }

    await settings.save();
    res.json(settings);
  } catch (error) { res.status(500).json({ message: 'Failed to update payment settings' }); }
});

// --- ENROLLMENT ROUTES ---
import Enrollment from './models/Enrollment.js';

app.post('/api/enroll', upload.single('paymentProof'), async (req, res) => {
  try {
    const { name, email, phone, nationality, qualification, status, institutionName, organizationName, transactionId, targetType, targetName, mode, additionalInfo } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "forensic_talents_enrollments" });
    const paymentProofUrl = cldRes.secure_url;

    const newEnrollment = new Enrollment({
      name, email, phone, nationality, qualification, status, institutionName, organizationName, transactionId, paymentProofUrl, targetType, targetName, mode, additionalInfo
    });

    await newEnrollment.save();

    // Send email to admin
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Enrollment: ${targetName}`,
      html: `
        <h2>New Enrollment Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Nationality:</strong> ${nationality}</p>
        <p><strong>Qualification:</strong> ${qualification}</p>
        <p><strong>Status:</strong> ${status}</p>
        ${institutionName ? `<p><strong>Institution:</strong> ${institutionName}</p>` : ''}
        ${organizationName ? `<p><strong>Organization:</strong> ${organizationName}</p>` : ''}
        <hr/>
        <h3>Enrollment Details</h3>
        <p><strong>Target Type:</strong> ${targetType}</p>
        <p><strong>Target Name:</strong> ${targetName}</p>
        ${mode ? `<p><strong>Mode:</strong> ${mode}</p>` : ''}
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payment Proof:</strong> <a href="${paymentProofUrl}">View Image</a></p>
        ${additionalInfo ? `<p><strong>Additional Info:</strong> ${additionalInfo}</p>` : ''}
      `
    };

    transporter.sendMail(mailOptions).catch(err => console.error("Admin enrollment email failed", err));

    res.status(201).json({ message: 'Enrollment successful', enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process enrollment', error: error.message });
  }
});

app.get('/api/admin/enrollments', protect, async (req, res) => {
  try {
    const { targetType, statusApproval } = req.query;
    let filter = {};
    if (targetType && targetType !== 'All') filter.targetType = targetType;
    if (statusApproval && statusApproval !== 'All') filter.statusApproval = statusApproval;

    const enrollments = await Enrollment.find(filter).sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch enrollments' }); }
});

app.put('/api/admin/enrollments/:id/approve', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.statusApproval = 'approved';
    await enrollment.save();

    // Send Approval Email to User
    const mailOptions = {
      from: `"Forensic Talents" <${process.env.EMAIL_USER}>`,
      to: enrollment.email,
      subject: `Enrollment Approved - ${enrollment.targetName}`,
      html: `
        <h2>Congratulations ${enrollment.name}!</h2>
        <p>Your enrollment for <strong>${enrollment.targetName}</strong> has been successfully approved.</p>
        <p>Our team will contact you shortly with further updates and instructions.</p>
        <p>If you have any queries, feel free to reply to this email or contact us.</p>
        <br/>
        <p>Best regards,<br/>Forensic Talents Team</p>
      `
    };

    transporter.sendMail(mailOptions).catch(err => console.error("User approval email failed", err));

    res.json(enrollment);
  } catch (error) { res.status(500).json({ message: 'Failed to approve enrollment' }); }
});

app.put('/api/admin/enrollments/:id/reject', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Rejection reason is required' });

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.statusApproval = 'rejected';
    enrollment.rejectionReason = reason;
    await enrollment.save();

    // Send Rejection Email to User
    const mailOptions = {
      from: `"Forensic Talents" <${process.env.EMAIL_USER}>`,
      to: enrollment.email,
      subject: `Enrollment Update - Application Status`,
      html: `
        <p>Dear ${enrollment.name},</p>
        <p>Thank you for your interest in <strong>${enrollment.targetName}</strong>.</p>
        <p>Your enrollment request has been reviewed and was not approved.</p>
        <p><strong>Reason:</strong><br/>${reason}</p>
        <br/>
        <p>For further clarification, please contact us at ${process.env.EMAIL_USER} or +91 9089674532</p>
        <br/>
        <p>Best regards,<br/>Forensic Talents Team</p>
      `
    };

    transporter.sendMail(mailOptions).catch(err => console.error("User rejection email failed", err));

    res.json(enrollment);
  } catch (error) { res.status(500).json({ message: 'Failed to reject enrollment' }); }
});

// Add generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start Server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
