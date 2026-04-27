import express from 'express';
import * as eventController from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { eventUpload } from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/', eventController.getEvents);
router.post('/', protect, eventUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 9 }]), eventController.createEvent);
router.put('/:id', protect, eventUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 9 }]), eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

export default router;
