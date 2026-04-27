import mongoose from 'mongoose';

const JigsawSchema = new mongoose.Schema({
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
