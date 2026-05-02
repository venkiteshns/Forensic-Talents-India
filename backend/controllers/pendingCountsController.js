import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';

export const getPendingCounts = async (req, res) => {
  try {
    const [courseEnquiries, internshipEnquiries, reviews] = await Promise.all([
      Enrollment.countDocuments({ statusApproval: 'pending', targetType: 'Course' }),
      Enrollment.countDocuments({ statusApproval: 'pending', targetType: 'Internship' }),
      Review.countDocuments({ status: 'pending' })
    ]);
    res.json({ 
      enquiries: courseEnquiries + internshipEnquiries,
      courseEnquiries,
      internshipEnquiries,
      reviews 
    });
  } catch (error) {
    console.error("Failed to fetch pending counts", error);
    res.status(500).json({ message: "Server error" });
  }
};
