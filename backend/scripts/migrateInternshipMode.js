/**
 * PART 8 — Data Integrity Migration
 * ──────────────────────────────────
 * Run once after deploying the mode refactor:
 *
 *   node backend/scripts/migrateInternshipMode.js
 *
 * What it does:
 *   1. For every Internship document that lacks a `mode` field, derives
 *      mode from the existing `type` field ('Online' → 'online', etc.)
 *   2. For every Enrollment whose `mode` differs from its linked internship's
 *      mode (or is missing), corrects the value.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const INTERNSHIP_SCHEMA = new mongoose.Schema({
  type: String,
  mode: String,
}, { strict: false, timestamps: true });

const ENROLLMENT_SCHEMA = new mongoose.Schema({
  targetType:   String,
  internshipId: mongoose.Schema.Types.ObjectId,
  mode:         String,
}, { strict: false, timestamps: true });

const Internship = mongoose.model('Internship', INTERNSHIP_SCHEMA);
const Enrollment  = mongoose.model('Enrollment',  ENROLLMENT_SCHEMA);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // ── Step 1: Backfill mode on Internship documents ────────────────────────
  const internships = await Internship.find({});
  let intFixed = 0;

  for (const doc of internships) {
    const derived = doc.type?.toLowerCase() === 'offline' ? 'offline' : 'online';
    if (!doc.mode || doc.mode !== derived) {
      await Internship.updateOne({ _id: doc._id }, { $set: { mode: derived } });
      console.log(`  [Internship] ${doc._id}  type="${doc.type}"  → mode set to "${derived}"`);
      intFixed++;
    }
  }
  console.log(`\n✅  Internships updated: ${intFixed} / ${internships.length}`);

  // ── Step 2: Fix mismatched Enrollment.mode records ────────────────────────
  const enrollments = await Enrollment.find({ targetType: 'Internship' });
  let enrFixed = 0;

  for (const enr of enrollments) {
    if (!enr.internshipId) continue;

    const internship = await Internship.findById(enr.internshipId).lean();
    if (!internship) {
      console.warn(`  [Enrollment] ${enr._id}  ⚠️  internship ${enr.internshipId} not found — skipping`);
      continue;
    }

    const correctMode = internship.mode;
    if (enr.mode !== correctMode) {
      await Enrollment.updateOne({ _id: enr._id }, { $set: { mode: correctMode } });
      console.log(`  [Enrollment] ${enr._id}  mode "${enr.mode}" → "${correctMode}"`);
      enrFixed++;
    }
  }
  console.log(`\n✅  Enrollments corrected: ${enrFixed} / ${enrollments.length}`);

  await mongoose.disconnect();
  console.log('\n🎉  Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
