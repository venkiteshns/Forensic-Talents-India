import * as gameService from '../services/gameService.js';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getGame = async (req, res, next) => {
  try {
    const { type } = req.params;
    const level = req.query.level || 'easy';
    const gameData = await gameService.getGameData(type, level);
    res.json(gameData);
  } catch (err) {
    console.error("GAME CONTROLLER ERROR:", err.stack);
    next(err);
  }
};

export const getCrosswordByLevel = async (req, res, next) => {
  try {
    const { level } = req.params;
    const document = await gameService.getCrosswordDataByLevel(level);
    if (!document) {
      return res.status(404).json({ message: 'No crossword data found for this level.' });
    }
    res.json({ level: document.level, words: document.words });
  } catch (err) {
    console.error("GAME CONTROLLER ERROR:", err.stack);
    next(err);
  }
};

export const getAllGameSets = async (req, res, next) => {
  try {
    const { type } = req.params;
    const sets = await gameService.getAllSets(type);
    res.json(sets);
  } catch (err) { console.error("GAME CONTROLLER ERROR:", err.stack); next(err); }
};

export const createGameSet = async (req, res, next) => {
  try {
    const { type } = req.params;
    const newSet = await gameService.createSet(type, req.body);
    res.status(201).json(newSet);
  } catch (err) { console.error("GAME CONTROLLER ERROR:", err.stack); next(err); }
};

export const updateGameSet = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const updatedSet = await gameService.updateSet(type, id, req.body);
    res.json(updatedSet);
  } catch (err) { 
    fs.writeFileSync(path.join(__dirname, '..', 'error.log'), err.stack || err.message);
    if (err.message && err.message.startsWith('Cannot change level')) res.status(400);
    console.error("GAME CONTROLLER ERROR:", err.stack); 
    next(err); 
  }
};

export const deleteGameSet = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    await gameService.deleteSet(type, id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { 
    if (err.message && err.message.startsWith('Cannot delete')) res.status(400);
    console.error("GAME CONTROLLER ERROR:", err.stack); 
    next(err); 
  }
};
