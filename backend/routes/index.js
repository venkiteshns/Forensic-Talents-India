import express from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import internshipRoutes from './internshipRoutes.js';
import internshipExtraRoutes from './internshipExtraRoutes.js';
import quizRoutes from './quizRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import eventRoutes from './eventRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import gameRoutes from './gameRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import contactRoutes from './contactRoutes.js';
import pingRoutes from './pingRoutes.js';
import adminRoutes from './adminRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import * as resourceController from '../controllers/resourceController.js';
import { upload } from '../middleware/multerMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/internships', internshipRoutes);
router.use('/', internshipExtraRoutes); // Benefits and Areas are top-level /api/benefits etc.
router.use('/quiz', quizRoutes);
router.use('/resources', resourceRoutes);
router.use('/events', eventRoutes);
router.use('/reviews', reviewRoutes);
router.use('/game', gameRoutes);
router.use('/payment-settings', paymentRoutes);
router.use('/enroll', enrollmentRoutes);
router.use('/contact', contactRoutes);
router.use('/ping', pingRoutes);
router.use('/admin', adminRoutes);
router.use('/certificates', certificateRoutes);

// Top level upload route
router.post('/upload', protect, upload.single('file'), resourceController.uploadFile);

// Compatibility with old /api/word-search etc routes if needed, 
// but most are covered by /api/game/:type
// I'll add the specific word-search routes as well just in case.

import * as gameController from '../controllers/gameController.js';
router.get('/word-search', (req, res, next) => { req.params.type = 'word-search'; gameController.getGame(req, res, next); });
router.get('/crossword', (req, res, next) => { req.params.type = 'crossword'; gameController.getGame(req, res, next); });
router.get('/jigsaw', (req, res, next) => { req.params.type = 'jigsaw'; gameController.getGame(req, res, next); });
router.get('/matching', (req, res, next) => { req.params.type = 'matching'; gameController.getGame(req, res, next); });

export default router;
