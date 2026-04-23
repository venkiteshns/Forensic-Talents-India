const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas (matching server.js)
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
  type: { type: String, required: true, enum: ['Online', 'Offline'] },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  formLink: { type: String },
  isVisible: { type: Boolean, default: false }
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Internship = mongoose.models.Internship || mongoose.model('Internship', internshipSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully.');

    // Seed Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding Courses...');
      await Course.insertMany([
        {
          title: "1 Week Certificate Course",
          category: "Fingerprint Analysis",
          duration: "1 Week",
          price: 2500,
          mode: ["Online", "Offline"],
          description: "This short-term course provides a foundational understanding of fingerprint science and its importance in forensic investigations. Ideal for beginners.",
          topics: [
            "Introduction, History, and Principles of Fingerprints",
            "Formation of Friction Ridges & Basic Terminology",
            "Fingerprint Patterns and Classification (basic)",
            "Ridge Characteristics (Minutiae)",
            "Types of Fingerprints & Crime Scene Surfaces",
            "Development, Lifting, and Preservation",
            "ACE-V Method and Identification Basics",
            "Applications of Fingerprinting in Forensics"
          ]
        },
        {
          title: "1 Month Certificate Course",
          category: "Fingerprint Analysis",
          duration: "1 Month",
          price: 8000,
          mode: ["Online", "Offline"],
          description: "This comprehensive program offers in-depth knowledge and practical training in fingerprint examination and identification techniques.",
          topics: [
            "Introduction to Fingerprints", "History & Principles", "Formation of Friction Ridges", "Composition of Sweat", "Fingerprint Patterns & Classification", "Ridge Characteristics (Minutiae)", "Recording & Types of Fingerprints", "Development of Latent Fingerprints", "Lifting & Preservation", "ACE-V Method", "Advanced Modern Applications", "Basic Terminology"
          ]
        },
        {
          title: "1 Week Certificate Course",
          category: "Handwriting & Signature Analysis",
          duration: "1 Week",
          price: 2500,
          mode: ["Online", "Offline"],
          description: "This course introduces the fundamentals of handwriting examination and signature verification.",
          topics: [
            "Principles of Document Examination", "Handwriting Examination and Characteristics", "Handwriting Forgeries and Alterations", "Paper, Ink, and Writing Instruments", "Printing Processes & Font Analysis", "Security Features in Documents", "Document Examination Tools"
          ]
        },
        {
          title: "1 Month Certificate Course",
          category: "Handwriting & Signature Analysis",
          duration: "1 Month",
          price: 8000,
          mode: ["Online", "Offline"],
          description: "An advanced program focusing on detailed examination and forensic analysis of handwriting and signatures.",
          topics: [
            "Introduction & History", "Principles of Document Examination", "Techniques of Photographing Documents", "Factors Affecting Handwriting", "Handwriting Characteristics & Analysis", "Paper & Ink Examination", "Types of Forgeries", "Evaluation of Forged Handwriting", "Alterations in Documents", "Printing Processes & Font Anatomy", "Electronic Signatures & Security Features", "Art Forgery Detection", "Report Writing & Court Testimony"
          ]
        },
        {
          title: "1 Week Certificate Course",
          category: "Cyber Forensics",
          duration: "1 Week",
          price: 2500,
          mode: ["Online", "Offline"],
          description: "This course provides a basic understanding of cybercrime and digital forensic investigation.",
          topics: [
            "Introduction & Legal Framework", "Digital Evidence & First Responder", "Evidence Handling & Chain of Custody", "Data Acquisition & File Systems", "Investigation Process & Tools", "Windows & Deleted Data Forensics", "Network, Web, and Email Forensics", "Mobile Forensics & Court Testimony"
          ]
        },
        {
          title: "1 Month Certificate Course",
          category: "Cyber Forensics",
          duration: "1 Month",
          price: 8000,
          mode: ["Online", "Offline"],
          description: "An advanced course covering digital investigation techniques and practical forensic analysis.",
          topics: [
            "Evolution of Computer Forensics", "Types of Cyber Attacks & Cyber Laws", "Searching and Seizing Digital Evidence", "Hard Disks, File Systems & Windows Forensics", "Data Acquisition & Duplication", "Deleted File Recovery Techniques", "Investigation Toolkits & Software", "Image File Forensics & Steganography", "Password Cracking & Network Forensics", "Web & Wireless Attacks", "Email & Mobile Forensics", "Cloud & Dark Web Forensics", "Report Writing & Setting Up a Lab"
          ]
        },
        {
          title: "1 Week Certificate Course",
          category: "Crime Scene Management",
          duration: "1 Week",
          price: 2500,
          mode: ["Online", "Offline"],
          description: "This course provides basic knowledge of crime scene handling and investigation procedures.",
          topics: [
            "Introduction & Securing the Scene", "Contamination & Preventive Measures", "Search Methods & Evaluation", "Types of Evidence & Processing", "Collection, Packaging & Preservation", "Chain of Custody & Forwarding", "Crime Scene Reconstruction & Report Writing"
          ]
        },
        {
          title: "1 Month Certificate Course",
          category: "Crime Scene Management",
          duration: "1 Month",
          price: 8000,
          mode: ["Online", "Offline"],
          description: "A detailed program focused on professional crime scene investigation and management.",
          topics: [
            "Introduction to Crime Scene", "Crime Scene Contamination", "Securing & Protective Measures", "Search Methods & Evaluation", "Processing & Types of Evidence", "Collection, Packaging & Safety Measures", "Preservation & Handling of Evidence", "Chain of Custody & Forwarding", "Crime Scene Reconstruction", "Investigation Procedure under BNSS", "Criminal Trial & Report Writing"
          ]
        }
      ]);
      console.log('Courses seeded.');
    } else {
      console.log('Courses already exist, skipping...');
    }

    // Seed Internships
    const internshipCount = await Internship.countDocuments();
    if (internshipCount === 0) {
      console.log('Seeding Internships...');
      await Internship.insertMany([
        {
          type: "Online",
          duration: "1 Month",
          price: 6500,
          description: "Virtual Practical Exposure",
          benefits: ["Recognized Certificate of Internship", "Virtual Case Studies & Assignments"],
          isActive: true
        },
        {
          type: "Offline",
          duration: "1 Month",
          price: 8500,
          description: "In-Lab Premium Experience",
          benefits: ["Recognized Certificate of Internship", "Exclusive Welcome Kit & Official T-Shirt", "Field Visits: Mortuary & Police Station"],
          isActive: true
        }
      ]);
      console.log('Internships seeded.');
    } else {
      console.log('Internships already exist, skipping...');
    }

    // Seed Quiz
    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      console.log('Seeding Quiz...');
      await Quiz.create({
        title: "Initial Setup Quiz",
        description: "Placeholder quiz entry to set up the database state.",
        date: new Date("2026-04-01"), // previous date
        formLink: "https://forms.google.com/",
        isVisible: false // Ensure this is false so the "Previous quiz" message is shown
      });
      console.log('Quiz seeded.');
    } else {
      console.log('Quiz already exists, skipping...');
    }

    console.log('Seeding process completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedData();
