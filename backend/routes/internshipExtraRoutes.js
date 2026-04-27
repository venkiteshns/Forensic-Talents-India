import express from 'express';
import * as internshipController from '../controllers/internshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Benefits
router.get('/internship-benefits', internshipController.getBenefits);
router.post('/internship-benefits', protect, internshipController.createBenefit);
router.put('/benefits/:id', protect, internshipController.updateBenefit);
router.delete('/benefits/:id', protect, internshipController.deleteBenefit);

// Areas
router.get('/internship-areas', internshipController.getAreas);
router.post('/internship-areas', protect, internshipController.createArea);
router.put('/areas/:id', protect, internshipController.updateArea);
router.delete('/areas/:id', protect, internshipController.deleteArea);

export default router;
