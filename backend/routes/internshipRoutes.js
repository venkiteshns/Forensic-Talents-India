import express from 'express';
import * as internshipController from '../controllers/internshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', internshipController.getInternships);
router.post('/', protect, internshipController.createInternship);
router.put('/:id', protect, internshipController.updateInternship);
router.delete('/:id', protect, internshipController.deleteInternship);

export default router;
