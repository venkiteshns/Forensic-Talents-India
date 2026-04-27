import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', courseController.getCourses);
router.post('/', protect, courseController.createCourse);
router.put('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

export default router;
