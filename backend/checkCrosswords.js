import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crossword from './models/Crossword.js';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const docs = await Crossword.find();
    let count = 0;
    docs.forEach(doc => {
      const invalid = doc.words.some(w => w.word.length > 12);
      if (invalid) count++;
    });
    
    console.log(`Found ${count} crosswords with words > 12 characters via manual JS check.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
