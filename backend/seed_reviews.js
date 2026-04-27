import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Review from './models/Review.js';

const reviews = [
  // --- STUDENT REVIEWS (Education) - 15 Total ---
  {
    name: "Aman Singh",
    email: "aman@example.com",
    rating: 5,
    review: "Excellent internship program! The practical experience in CSI was eye-opening. The mentors were very helpful throughout the process.",
    type: "education",
    isApproved: true
  },
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    rating: 4,
    review: "Great course on Digital Forensics. The topics covered were very relevant and the practical assignments were challenging yet rewarding.",
    type: "education",
    isApproved: true
  },
  {
    name: "Vikram Joshi",
    email: "vikram@example.com",
    rating: 5,
    review: "The mentorship was top-notch. I feel much more confident in my forensic skills now. The curriculum is perfectly structured for career growth.",
    type: "education",
    isApproved: true
  },
  {
    name: "Anjali Gupta",
    email: "anjali@example.com",
    rating: 5,
    review: "The 1-month Fingerprint Analysis course was very detailed. I learned a lot about ridge characteristics and latent development.",
    type: "education",
    isApproved: true
  },
  {
    name: "Karan Malhotra",
    email: "karan@example.com",
    rating: 5,
    review: "Forensic Talents India provided me with the best platform to start my career. The lab facilities and guidance are exceptional.",
    type: "education",
    isApproved: true
  },
  {
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    rating: 5,
    review: "Best forensic training institute in the country. The internship allowed me to work on real-world case simulations.",
    type: "education",
    isApproved: true
  },
  {
    name: "Amit Patel",
    email: "amit.p@example.com",
    rating: 4,
    review: "The Handwriting analysis module was fascinating. I appreciate the depth of knowledge the trainers shared during the sessions.",
    type: "education",
    isApproved: true
  },
  {
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    rating: 5,
    review: "Highly interactive monthly quizzes! They keep us updated with the latest trends in forensic science and law.",
    type: "education",
    isApproved: true
  },
  {
    name: "Siddharth Rao",
    email: "sid.r@example.com",
    rating: 5,
    review: "The online certificate course was very convenient and informative. The video lectures were clear and the materials provided were helpful.",
    type: "education",
    isApproved: true
  },
  {
    name: "Divya Nair",
    email: "divya@example.com",
    rating: 5,
    review: "I completed my summer internship here and it was the most productive month of my college life. Great learning environment.",
    type: "education",
    isApproved: true
  },
  {
    name: "Arjun Khanna",
    email: "arjun@example.com",
    rating: 4,
    review: "Good balance of theory and practice. The document examination course helped me understand the intricacies of signature verification.",
    type: "education",
    isApproved: true
  },
  {
    name: "Megha Desai",
    email: "megha@example.com",
    rating: 5,
    review: "The faculty is very experienced. They provide individual attention which is very rare in such specialized courses.",
    type: "education",
    isApproved: true
  },
  {
    name: "Rohan Kapoor",
    email: "rohan@example.com",
    rating: 5,
    review: "Excellent resources and reference materials. The forensic insights blog is a great way to stay informed about the field.",
    type: "education",
    isApproved: true
  },
  {
    name: "Tanya Sen",
    email: "tanya@example.com",
    rating: 5,
    review: "The certification has really added value to my CV. I was able to secure a job shortly after completing the advanced cyber forensics course.",
    type: "education",
    isApproved: true
  },
  {
    name: "Nikhil Bose",
    email: "nikhil@example.com",
    rating: 4,
    review: "A very professional approach to forensic education. The course on Questioned Documents was particularly enlightening.",
    type: "education",
    isApproved: true
  },

  // --- CLIENT REVIEWS (Service) - 15 Total ---
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    rating: 5,
    review: "Direct and professional fingerprint analysis. Highly recommended for legal matters. Their attention to detail is truly impressive.",
    type: "service",
    isApproved: true
  },
  {
    name: "Sneha Patel",
    email: "sneha@example.com",
    rating: 5,
    review: "Very reliable document examination service. They helped us clear a complex case with their expert analysis. Very professional team.",
    type: "service",
    isApproved: true
  },
  {
    name: "Meera Reddy",
    email: "meera@example.com",
    rating: 5,
    review: "Forensic Talents India provided exceptional support for our verification needs. Their reports are thorough and easy to understand.",
    type: "service",
    isApproved: true
  },
  {
    name: "Sanjay Gupta",
    email: "sanjay@example.com",
    rating: 5,
    review: "Extremely fast and reliable PCC service. They guided us through the entire process and delivered ahead of schedule.",
    type: "service",
    isApproved: true
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    rating: 4,
    review: "Highly competent in handwriting verification. Their expert opinion was crucial for our legal documentation.",
    type: "service",
    isApproved: true
  },
  {
    name: "Anita Verma",
    email: "anita@example.com",
    rating: 5,
    review: "Professional and ethical service. Their cyber forensic investigation helped us recover critical data that was thought to be lost.",
    type: "service",
    isApproved: true
  },
  {
    name: "Sunil Menon",
    email: "sunil@example.com",
    rating: 5,
    review: "A top-notch forensic consultancy. They provided expert cross-examination support that significantly strengthened our case.",
    type: "service",
    isApproved: true
  },
  {
    name: "Kavita Iyer",
    email: "kavita@example.com",
    rating: 5,
    review: "The workplace assessment service was very comprehensive. They helped us identify and mitigate internal risks effectively.",
    type: "service",
    isApproved: true
  },
  {
    name: "Deepak Chawla",
    email: "deepak@example.com",
    rating: 5,
    review: "Excellent response time. We needed urgent fingerprinting for international documentation and they handled it flawlessly.",
    type: "service",
    isApproved: true
  },
  {
    name: "Geeta Rao",
    email: "geeta@example.com",
    rating: 4,
    review: "Very knowledgeable team. Their financial forensic audit was instrumental in resolving our internal dispute.",
    type: "service",
    isApproved: true
  },
  {
    name: "Arvind Saxena",
    email: "arvind@example.com",
    rating: 5,
    review: "Reliable and precise. Their document analysis report was accepted in court without any issues. Highly professional.",
    type: "service",
    isApproved: true
  },
  {
    name: "Swati Mishra",
    email: "swati@example.com",
    rating: 5,
    review: "Great experience with their PCC services. They handled all the paperwork and made the process stress-free for us.",
    type: "service",
    isApproved: true
  },
  {
    name: "Vivek Oberoi",
    email: "vivek@example.com",
    rating: 5,
    review: "The best in the business for fingerprinting. They use advanced techniques and provide clear, undeniable results.",
    type: "service",
    isApproved: true
  },
  {
    name: "Nisha Taneja",
    email: "nisha@example.com",
    rating: 4,
    review: "Very professional approach to corporate investigations. Their discreet handling of the matter was much appreciated.",
    type: "service",
    isApproved: true
  },
  {
    name: "Manish Agarwal",
    email: "manish@example.com",
    rating: 5,
    review: "Exceptional service for signature verification. Their experts are highly qualified and their findings are very detailed.",
    type: "service",
    isApproved: true
  }
];

const seedReviews = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('Clearing existing reviews...');
    await Review.deleteMany({});

    console.log('Seeding ' + reviews.length + ' reviews...');
    await Review.insertMany(reviews);

    console.log('Reviews seeded successfully!');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedReviews();
