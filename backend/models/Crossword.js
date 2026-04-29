import mongoose from 'mongoose';

const LEVEL_RULES = {
  easy: { min: 4, max: 5 },
  medium: { min: 6, max: 7 },
  hard: { min: 8, max: 9 },
  pro: { min: 10, max: 15 }
};

const CrosswordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Crossword'
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'pro'],
    default: 'easy'
  },
  words: [{
    word: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Word must be at least 3 characters long'],
      maxlength: [15, 'Word must be at most 15 characters long'],
      match: [/^[A-Z]+$/, 'Word must contain only letters']
    },
    clue: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'Clue must be at least 5 characters long'],
      maxlength: [120, 'Clue must be at most 120 characters long']
    }
  }],
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

function hasCommonLetter(a, b) {
  return [...a].some(letter => b.includes(letter));
}

CrosswordSchema.pre('validate', function(next) {
  const { level, words } = this;
  if (!words || words.length === 0) return next(new Error("Crossword must have words"));

  const rule = LEVEL_RULES[level];
  if (!rule) {
    return next(new Error("Invalid level"));
  }

  if (words.length < rule.min || words.length > rule.max) {
    return next(
      new Error(`For ${level}, words must be between ${rule.min} and ${rule.max}`)
    );
  }

  const wordStrings = words.map(w => w.word);
  const unique = new Set(wordStrings);
  if (unique.size !== wordStrings.length) {
    return next(new Error("Duplicate words are not allowed"));
  }

  for (const w of words) {
    if (w.word === w.clue.toUpperCase().replace(/[^A-Z]/g, '')) {
      return next(new Error(`Clue cannot be identical to the word: ${w.word}`));
    }
    // ensure clue is not just one word (check for spaces)
    if (w.clue.trim().split(/\s+/).length < 2) {
      return next(new Error(`Clue must be more than one word: ${w.clue}`));
    }
  }

  let validConnections = 0;
  for (let i = 0; i < wordStrings.length; i++) {
    for (let j = i + 1; j < wordStrings.length; j++) {
      if (hasCommonLetter(wordStrings[i], wordStrings[j])) {
        validConnections++;
      }
    }
  }

  if (validConnections < wordStrings.length - 1) {
    return next(new Error("Words do not have enough intersections to form a grid"));
  }

  next();
});

const Crossword = mongoose.model('Crossword', CrosswordSchema);
export default Crossword;
