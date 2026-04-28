import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import * as paymentController from '../controllers/paymentController.js';
import * as enrollmentController from '../controllers/enrollmentController.js';
import * as quizResultController from '../controllers/quizResultController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/reviews', protect, reviewController.getAdminReviews);
router.put('/payment-settings', protect, upload.single('qrCode'), paymentController.updatePaymentSettings);
router.get('/enrollments', protect, enrollmentController.getEnrollments);
router.put('/enrollments/:id/approve', protect, enrollmentController.approveEnrollment);
router.put('/enrollments/:id/reject', protect, enrollmentController.rejectEnrollment);
router.delete('/enrollments/:id', protect, enrollmentController.deleteEnrollment);

// Quiz Results
router.get('/quiz-results', protect, quizResultController.getQuizResults);
router.get('/quiz-results/quiz-names', protect, quizResultController.getDistinctQuizNames);

export default router;
