import mongoose from 'mongoose';

const quizStateSchema = new mongoose.Schema({
  currentQuiz: {
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
    conductedDate: { type: Date, default: null },
    status: { type: String, enum: ["ACTIVE", "HIDDEN", "FINISHED"], default: "HIDDEN" }
  },
  upcomingQuiz: {
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
    scheduledDateTime: { type: Date, default: null },
    visibility: { type: Boolean, default: false }
  },
  registration: {
    link: { type: String, default: "" },
    enabled: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model('QuizState', quizStateSchema);
