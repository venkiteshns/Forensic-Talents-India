import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crossword from './models/Crossword.js';

dotenv.config();

async function clean() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Using regex to find words longer than 12 characters inside the words array
    const result = await Crossword.deleteMany({
      "words.word": { $regex: /^.{13,}$/ }
    });
    
    console.log(`Cleanup complete. Deleted ${result.deletedCount} crossword(s) with words > 12 characters.`);
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

clean();
