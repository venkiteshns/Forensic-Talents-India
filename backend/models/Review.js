import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  photo: { type: String }, // Optional Cloudinary image URL for user photo
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  isApproved: { type: Boolean, default: false }, // Must be approved by admin
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
