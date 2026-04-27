import * as gameService from '../services/gameService.js';

export const getGame = async (req, res, next) => {
  try {
    const { type } = req.params;
    const playedIds = req.query.playedIds ? req.query.playedIds.split(',') : [];
    const gameData = await gameService.getGameData(type, playedIds);
    res.json(gameData);
  } catch (err) { next(err); }
};

export const getAllGameSets = async (req, res, next) => {
  try {
    const { type } = req.params;
    const sets = await gameService.getAllSets(type);
    res.json(sets);
  } catch (err) { next(err); }
};

export const createGameSet = async (req, res, next) => {
  try {
    const { type } = req.params;
    const newSet = await gameService.createSet(type, req.body);
    res.status(201).json(newSet);
  } catch (err) { next(err); }
};

export const updateGameSet = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const updatedSet = await gameService.updateSet(type, id, req.body);
    res.json(updatedSet);
  } catch (err) { next(err); }
};

export const deleteGameSet = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    await gameService.deleteSet(type, id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};
