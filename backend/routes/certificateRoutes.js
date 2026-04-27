import express from 'express';
import { createCertificate, getCertificates } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/', createCertificate);
router.get('/', getCertificates);

export default router;
