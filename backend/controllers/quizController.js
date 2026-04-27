import * as quizService from '../services/quizService.js';

export const getLatestQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.getLatestQuiz();
    res.json(quiz);
  } catch (err) { next(err); }
};

export const createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (err) { next(err); }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const updated = await quizService.updateQuiz(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const toggleQuizVisibility = async (req, res, next) => {
  try {
    const quiz = await quizService.toggleQuizVisibility(req.params.id);
    res.json(quiz);
  } catch (err) { next(err); }
};
