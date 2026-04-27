import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', paymentController.getPaymentSettings);

export default router;
