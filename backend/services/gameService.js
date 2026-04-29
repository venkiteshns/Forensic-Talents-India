import WordSearch from '../models/WordSearch.js';
import Crossword from '../models/Crossword.js';
import Jigsaw from '../models/Jigsaw.js';
import Matching from '../models/Matching.js';
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

const getModel = (type) => {
  if (type === 'word-search') return WordSearch;
  if (type === 'crossword') return Crossword;
  if (type === 'jigsaw') return Jigsaw;
  if (type === 'matching') return Matching;
  return null;
};

export const getGameData = async (type, level) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');

  const activeSets = await Model.find({ isActive: true, level });
  if (activeSets.length === 0) {
    // Graceful fallback to prevent 500 errors when DB is empty for a level
    if (type === 'matching') {
      if (level === 'easy') {
        const defaultImages = [
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400&auto=format&fit=crop"
        ];
        // Bootstrap temporary set
        const bootstrapSet = new Model({
          title: 'Bootstrap Easy Set',
          level: 'easy',
          images: defaultImages,
          isActive: true
        });
        await bootstrapSet.save();
        return bootstrapSet.toObject();
      } else {
         return { images: [], level };
      }
    }
    if (type === 'word-search') {
      const fallbackWords = {
        easy: ["DNA", "LAW", "BONE", "HAIR", "BLOOD"],
        medium: ["FORENSIC", "CRIME", "EVIDENCE", "WITNESS", "VICTIM"],
        hard: ["MICROSCOPE", "FINGERPRINT", "TOXICOLOGY", "PATHOLOGY", "AUTOPSY"],
        pro: ["CHROMATOGRAPHY", "SPECTROSCOPY", "ELECTROPHORESIS", "SEROLOGY", "BALLISTICS"]
      };
      return { words: fallbackWords[level] || fallbackWords.easy, level };
    }
    if (type === 'crossword') {
      const fallbackPairs = {
        easy: [
          { word: "DNA", clue: "Genetic code" },
          { word: "LAW", clue: "Legal rule" },
          { word: "CELL", clue: "Biological unit" },
          { word: "CLUE", clue: "Hint for a case" }
        ],
        medium: [
          { word: "CRIME", clue: "Illegal act" },
          { word: "SCENE", clue: "Location of crime" },
          { word: "BLOOD", clue: "Red vital fluid" },
          { word: "GUILTY", clue: "Culpable person" },
          { word: "VICTIM", clue: "Harmed person" },
          { word: "TRIAL", clue: "Court hearing" }
        ],
        hard: [
          { word: "FORENSIC", clue: "Scientific investigation" },
          { word: "EVIDENCE", clue: "Proof of fact" },
          { word: "SUSPECT", clue: "Person of interest" },
          { word: "WEAPON", clue: "Tool of harm" },
          { word: "AUTOPSY", clue: "Post-mortem examination" },
          { word: "WITNESS", clue: "Observer of event" },
          { word: "DETECTIVE", clue: "Investigator" },
          { word: "COURT", clue: "Legal tribunal" }
        ],
        pro: [
          { word: "TOXICOLOGY", clue: "Study of poisons" },
          { word: "PATHOLOGY", clue: "Study of disease" },
          { word: "BALLISTICS", clue: "Study of projectiles" },
          { word: "FINGERPRINT", clue: "Unique skin pattern" },
          { word: "SEROLOGY", clue: "Study of bodily fluids" },
          { word: "ODONTOLOGY", clue: "Dental forensics" },
          { word: "ENTOMOLOGY", clue: "Insect study" },
          { word: "ANTHROPOLOGY", clue: "Study of human bones" },
          { word: "MICROSCOPE", clue: "Magnifying instrument" },
          { word: "SPECTROSCOPY", clue: "Light interaction study" }
        ]
      };
      return { words: fallbackPairs[level] || fallbackPairs.easy, level };
    }
    if (type === 'jigsaw') {
      return { imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop', level };
    }
    throw new Error(`No active sets found for level ${level}`);
  }

  // Pick a random set from the pool for this level
  const shuffledSets = activeSets.sort(() => 0.5 - Math.random());
  const selectedSet = shuffledSets[0];

  return selectedSet.toObject();
};

export const getAllSets = async (type) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');
  return await Model.find().sort({ createdAt: -1 });
};

export const createSet = async (type, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');

  if (type === 'matching') {
    const requiredPairs = { easy: 2, medium: 4, hard: 8, pro: 12 };
    const required = requiredPairs[data.level || 'easy'] || 2;
    if (!data.images || data.images.length < required) {
      throw new Error(`Not enough images for this level. Required: ${required}`);
    }
  }

  const newSet = new Model(data);
  return await newSet.save();
};

export const updateSet = async (type, id, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');

  // Fetch the existing set before updating so we can clean up old images
  const existing = await Model.findById(id);
  if (!existing) throw new Error('Set not found');

  if (type === 'jigsaw') {
    // If the imageUrl is being replaced, delete the old one from Cloudinary
    if (data.imageUrl && data.imageUrl !== existing.imageUrl && existing.imageUrl) {
      await deleteFromCloudinary(existing.imageUrl, 'image');
    }
  }

  if (type === 'matching') {
    if (data.level && existing.level && data.level !== existing.level) {
      const sourceCount = await Model.countDocuments({ level: existing.level });
      const destCount = await Model.countDocuments({ level: data.level });
      // Only block if source level would become empty AND destination already has datasets
      // (i.e. you're creating an empty level, not filling one)
      if (sourceCount <= 1 && destCount >= 1) {
        throw new Error(`Cannot change level: At least one dataset for level '${existing.level}' is required. Please create a new dataset for '${existing.level}' first, then reassign this one.`);
      }
    }
    
    // If images array is being updated, delete any old images no longer present
    if (data.images && Array.isArray(data.images) && existing.images && existing.images.length > 0) {
      const newImageSet = new Set(data.images);
      const removedImages = existing.images.filter(img => !newImageSet.has(img));
      for (const imgUrl of removedImages) {
        await deleteFromCloudinary(imgUrl, 'image');
      }
    }
  }

  let updatedSet;
  try {
    updatedSet = await Model.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  } catch (err) {
    console.error('FIND_BY_ID_AND_UPDATE ERROR:', err);
    throw err;
  }
  return updatedSet;
};

export const deleteSet = async (type, id) => {
  const Model = getModel(type);
  if (!Model) throw new Error('Invalid game type');

  if (type === 'matching') {
    const setToDelete = await Model.findById(id);
    if (!setToDelete) throw new Error('Set not found');
    
    const count = await Model.countDocuments({ level: setToDelete.level });
    if (count <= 1) {
      throw new Error(`Cannot delete: At least one dataset for level '${setToDelete.level}' is required.`);
    }
  }

  const deleted = await Model.findByIdAndDelete(id);
  if (!deleted) throw new Error('Set not found');

  // Clean up Cloudinary assets
  if (type === 'jigsaw' && deleted.imageUrl) {
    await deleteFromCloudinary(deleted.imageUrl, 'image');
  }

  if (type === 'matching' && deleted.images && deleted.images.length > 0) {
    for (const imgUrl of deleted.images) {
      await deleteFromCloudinary(imgUrl, 'image');
    }
  }

  return deleted;
};
