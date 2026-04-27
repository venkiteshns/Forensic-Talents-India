import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'image', 'youtube'], required: true },
  fileUrl: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
