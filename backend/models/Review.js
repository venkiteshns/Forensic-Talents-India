import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  profileImage: { type: String }, // Optional Cloudinary image URL for user photo
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  type: { type: String, enum: ['service', 'education'], required: true }, // Categorizes where review appears
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
