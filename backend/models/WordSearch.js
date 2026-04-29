import mongoose from 'mongoose';

const wordSearchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Word Search'
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'pro'],
    default: 'easy'
  },
  words: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 15'],
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 15;
}

const WordSearch = mongoose.model('WordSearch', wordSearchSchema);
export default WordSearch;
