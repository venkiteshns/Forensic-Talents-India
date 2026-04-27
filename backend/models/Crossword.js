import mongoose from 'mongoose';

const CrosswordSchema = new mongoose.Schema({
  words: [{
    word: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Word must be at least 3 characters long']
    },
    clue: {
      type: String,
      required: true,
      trim: true
    }
  }],
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Crossword = mongoose.model('Crossword', CrosswordSchema);
export default Crossword;
