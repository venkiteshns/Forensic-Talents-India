import express from 'express';
import * as resourceController from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/', resourceController.getResources);
router.post('/', protect, resourceController.createResource);
router.put('/:id', protect, resourceController.updateResource);
router.delete('/:id', protect, resourceController.deleteResource);
router.post('/upload', protect, upload.single('file'), resourceController.uploadFile);

export default router;
