import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: "General Forensics" },
  duration: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  mode: { type: [String], required: true },
  description: { type: String, required: true },
  topics: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
