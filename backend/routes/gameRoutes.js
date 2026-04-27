import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:type', gameController.getGame);
router.get('/:type/admin/all', protect, gameController.getAllGameSets);
router.post('/:type', protect, gameController.createGameSet);
router.put('/:type/:id', protect, gameController.updateGameSet);
router.delete('/:type/:id', protect, gameController.deleteGameSet);

export default router;
