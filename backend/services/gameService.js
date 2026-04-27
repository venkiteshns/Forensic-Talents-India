import WordSearch from '../models/WordSearch.js';
import Crossword from '../models/Crossword.js';
import Jigsaw from '../models/Jigsaw.js';
import Matching from '../models/Matching.js';

const getModel = (type) => {
  if (type === 'word-search') return WordSearch;
  if (type === 'crossword') return Crossword;
  if (type === 'jigsaw') return Jigsaw;
  if (type === 'matching') return Matching;
  return null;
};

export const getGameData = async (type, playedIds) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');

  const activeSets = await Model.find({ isActive: true });
  if (activeSets.length === 0) {
    throw new Error('No active sets found');
  }

  let unplayedSets = activeSets.filter(set => !playedIds.includes(set._id.toString()));

  if (unplayedSets.length === 0) {
    unplayedSets = activeSets;
  }

  const shuffledSets = unplayedSets.sort(() => 0.5 - Math.random());
  const selectedSet = shuffledSets[0];

  return {
    ...selectedSet.toObject(),
    resetOccurred: unplayedSets.length === activeSets.length && activeSets.length > 0 && playedIds.length > 0
  };
};

export const getAllSets = async (type) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');
  return await Model.find().sort({ createdAt: -1 });
};

export const createSet = async (type, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');
  const newSet = new Model(data);
  return await newSet.save();
};

export const updateSet = async (type, id, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');
  const updatedSet = await Model.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updatedSet) throw new Error('Set not found');
  return updatedSet;
};

export const deleteSet = async (type, id) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');
  const deleted = await Model.findByIdAndDelete(id);
  if (!deleted) throw new Error('Set not found');
  return deleted;
};
