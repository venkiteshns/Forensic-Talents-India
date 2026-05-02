import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';

export const getPendingCounts = async (req, res) => {
  try {
    const [enquiries, reviews] = await Promise.all([
      Enrollment.countDocuments({ statusApproval: 'pending' }),
      Review.countDocuments({ status: 'pending' })
    ]);
    res.json({ enquiries, reviews });
  } catch (error) {
    console.error("Failed to fetch pending counts", error);
    res.status(500).json({ message: "Server error" });
  }
};
