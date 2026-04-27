import express from 'express';
import { createCertificate, getCertificates, verifyCertificate, resendCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/', createCertificate);
router.get('/', getCertificates);
router.post('/verify', verifyCertificate);
router.post('/resend', resendCertificate);

export default router;
