import mongoose from 'mongoose';

const JigsawSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Jigsaw'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Jigsaw = mongoose.model('Jigsaw', JigsawSchema);
export default Jigsaw;
