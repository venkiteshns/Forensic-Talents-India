import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Word must be at least 3 characters long'],
    maxlength: [12, 'Word must be at most 12 characters long']
  },
  clue: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const CrosswordSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'pro'],
    required: true,
    unique: true
  },
  words: {
    type: [WordSchema],
    validate: [
      {
        validator: function(val) {
          return val.length >= 10;
        },
        message: 'A crossword set must have at least 10 words.'
      },
      {
        validator: function(val) {
          return val.length <= 20;
        },
        message: 'A crossword set cannot have more than 20 words.'
      }
    ]
  }
}, {
  timestamps: true
});

const Crossword = mongoose.model('Crossword', CrosswordSchema);
export default Crossword;
