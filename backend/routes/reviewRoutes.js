import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { eventUpload } from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/', reviewController.getReviews);
router.post('/', eventUpload.single('photo'), reviewController.submitReview);
router.put('/:id/approve', protect, reviewController.approveReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
