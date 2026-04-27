import express from 'express';
import * as enrollmentController from '../controllers/enrollmentController.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router();

router.post('/', upload.single('paymentProof'), enrollmentController.enroll);

export default router;
