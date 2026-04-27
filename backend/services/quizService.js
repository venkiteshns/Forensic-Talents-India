import Quiz from '../models/Quiz.js';

export const getLatestQuiz = async () => {
  const quiz = await Quiz.findOne().sort({ createdAt: -1 });
  if (!quiz) throw new Error('No quiz found');
  return quiz;
};

export const createQuiz = async (data) => {
  const quiz = new Quiz(data);
  return await quiz.save();
};

export const updateQuiz = async (id, data) => {
  const updated = await Quiz.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updated) throw new Error('Quiz not found');
  return updated;
};

export const toggleQuizVisibility = async (id) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new Error('Quiz not found');
  quiz.isVisible = !quiz.isVisible;
  return await quiz.save();
};
