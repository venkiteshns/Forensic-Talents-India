import mongoose from 'mongoose';

const MatchingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
    default: 'Untitled Matching Game'
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'pro'],
    required: true
  },
  images: {
    type: [String],
    validate: [
      arr => arr.length > 0,
      "At least one image is required"
    ]
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

MatchingSchema.pre('save', async function() {
  if (this.isActive) {
    await mongoose.model('Matching').updateMany(
      { level: this.level, _id: { $ne: this._id } },
      { isActive: false }
    );
  }
});

MatchingSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  const isActive = update.isActive !== undefined ? update.isActive : (update.$set && update.$set.isActive);

  if (isActive === true) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      const targetLevel = (update.$set && update.$set.level) || update.level || docToUpdate.level;
      await this.model.updateMany(
        { level: targetLevel, _id: { $ne: docToUpdate._id } },
        { isActive: false }
      );
    }
  }
});

const Matching = mongoose.model('Matching', MatchingSchema);
export default Matching;
