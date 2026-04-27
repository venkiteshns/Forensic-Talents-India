import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  formLink: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
