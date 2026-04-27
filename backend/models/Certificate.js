import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  quizName: { type: String, required: true },
  quizDate: { type: String, required: true },
  marksScored: { type: String, default: 'N/A' },
  certificateNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
