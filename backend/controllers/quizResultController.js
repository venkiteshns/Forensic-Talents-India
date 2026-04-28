import Certificate from '../models/Certificate.js';

/**
 * GET /api/admin/quiz-results
 * Query params: quizName, startDate, endDate
 * Returns quiz results sorted newest first.
 */
export const getQuizResults = async (req, res, next) => {
  try {
    const { quizName, startDate, endDate } = req.query;
    const filter = {};

    if (quizName) {
      filter.quizName = { $regex: quizName, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        // Include the full end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const results = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(results);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/quiz-results/quiz-names
 * Returns a distinct list of quiz names for the filter dropdown.
 */
export const getDistinctQuizNames = async (req, res, next) => {
  try {
    const names = await Certificate.distinct('quizName');
    res.json(names.sort());
  } catch (err) {
    next(err);
  }
};
