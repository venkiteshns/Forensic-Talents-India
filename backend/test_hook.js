import mongoose from 'mongoose';
import Matching from './models/Matching.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const set = await Matching.findOne();
    if (!set) {
      console.log('No set found');
      process.exit(0);
    }

    console.log('Updating set:', set._id);
    const result = await Matching.findByIdAndUpdate(set._id, { isActive: true }, { new: true });
    console.log('Result:', result);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

test();
