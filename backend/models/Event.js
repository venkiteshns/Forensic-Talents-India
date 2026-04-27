import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  coverImage: { type: String, required: true },
  images: [{ type: String }], // Array of Cloudinary image URLs
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Event', eventSchema);
