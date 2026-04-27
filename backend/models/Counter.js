import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, required: true }
});

export default mongoose.model('Counter', counterSchema);
