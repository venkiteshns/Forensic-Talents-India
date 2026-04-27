import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  type: { type: String, enum: ['online', 'offline', 'Online', 'Offline'], required: true },
  duration: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Internship', internshipSchema);
