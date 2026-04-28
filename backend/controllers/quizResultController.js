import Certificate from '../models/Certificate.js';

/**
 * GET /api/admin/quiz-results
 * Query params: quizName, startDate, endDate
 * Returns quiz results sorted newest first.
 */
export const getQuizResults = async (req, res, next) => {
  try {
    const { quizName, date } = req.query;
    const query = {};

    if (quizName) {
      query.quizName = { $regex: quizName, $options: 'i' };
    }

    if (date) {
      // quizDate is stored in mixed formats across records:
      //   New records: "2026-04-18"  (ISO, from certificateService)
      //   Old records: "18 April 2026" (human-readable, legacy)
      // Match BOTH so filtering works regardless of which format a record uses.
      const [year, month, day] = date.split('-');
      const months = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
      const humanFormat = `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
      // date itself is already the ISO format e.g. "2026-04-18"
      query.quizDate = { $in: [date, humanFormat] };
    }

    const results = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .lean();

    if (date) {
      console.log("Selected date (raw):", date);
      console.log("Filtering quizDate ==", query.quizDate);
      console.log("Results count:", results.length);
    }

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
