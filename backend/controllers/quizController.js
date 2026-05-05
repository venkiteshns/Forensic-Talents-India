import * as quizService from '../services/quizService.js';

// Legacy endpoint for public frontend compatibility
export const getLatestQuiz = async (req, res, next) => {
  try {
    const state = await quizService.getQuizState();
    res.json({
      title: state.currentQuiz?.name || '',
      description: state.currentQuiz?.description || '',
      date: state.currentQuiz?.conductedDate || null,
      formLink: state.currentQuiz?.link || '',
      isVisible: state.currentQuiz?.status === 'ACTIVE',
      registrationEnabled: state.registration?.enabled || false,
      registrationLink: state.registration?.link || '',
      status: state.currentQuiz?.status || 'HIDDEN',
      upcomingQuizDate: state.upcomingQuiz?.scheduledDateTime || null
    });
  } catch (err) { next(err); }
};

// Admin endpoints
export const getQuizState = async (req, res, next) => {
  try {
    const state = await quizService.getQuizState();
    res.json(state);
  } catch (err) { next(err); }
};

export const updateQuizState = async (req, res, next) => {
  try {
    const updated = await quizService.updateQuizState(req.body);
    res.json(updated);
  } catch (err) { next(err); }
};
