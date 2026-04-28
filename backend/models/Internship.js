import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  type: { type: String, required: true },        // display label e.g. "Online", "Offline"
  mode: { type: String, enum: ['online', 'offline'], required: true }, // system-controlled source of truth
  duration: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Internship', internshipSchema);
