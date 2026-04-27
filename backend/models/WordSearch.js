import mongoose from 'mongoose';

const wordSearchSchema = new mongoose.Schema({
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
