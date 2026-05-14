import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CrosswordModel from './models/Crossword.js';
import fs from 'fs';
import rawData from './rawData.js';

dotenv.config();

function validateWord(item) {
  return (
    item.word.length >= 3 &&
    item.word.length <= 12 &&
    item.clue
  );
}

async function updateCrosswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const documents = [];
    for (const [level, items] of Object.entries(rawData)) {
      const validWords = items.filter(validateWord).map(item => ({
        word: item.word.trim().toUpperCase(),
        clue: item.clue.trim()
      }));

      const wordsToInsert = validWords.slice(0, 20);
      
      if (wordsToInsert.length < 10) {
        throw new Error(`Level ${level} has only ${wordsToInsert.length} valid words, minimum 10 required.`);
      }
      
      documents.push({
        level,
        words: wordsToInsert
      });
    }

    // Delete
    const deleteResult = await CrosswordModel.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing crosswords`);

    // Insert
    const insertResult = await CrosswordModel.insertMany(documents);
    console.log(`Inserted ${insertResult.length} new grouped crosswords`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateCrosswords();
