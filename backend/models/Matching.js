import mongoose from 'mongoose';

const MatchingSchema = new mongoose.Schema({
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
