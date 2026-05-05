import express from 'express';
import * as quizController from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route mapping to current active/legacy quiz shape
router.get('/latest', quizController.getLatestQuiz);

// Admin routes for complete state management
router.get('/state', protect, quizController.getQuizState);
router.put('/state', protect, quizController.updateQuizState);

export default router;
