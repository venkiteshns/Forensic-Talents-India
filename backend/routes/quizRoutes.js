import express from 'express';
import * as quizController from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/latest', quizController.getLatestQuiz);
router.post('/', protect, quizController.createQuiz);
router.put('/:id', protect, quizController.updateQuiz);
router.put('/:id/toggle', protect, quizController.toggleQuizVisibility);

export default router;
