import mongoose from 'mongoose';

const MatchingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Matching Game'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  useIcons: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Matching = mongoose.model('Matching', MatchingSchema);
export default Matching;
