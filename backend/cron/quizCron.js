import cron from 'node-cron';
import { autoTransitionQuiz } from '../services/quizService.js';

export const startQuizCron = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      await autoTransitionQuiz();
    } catch (error) {
      console.error("[CRON ERROR] Error in quiz transition cron:", error);
    }
  });
  console.log("Quiz cron job initialized.");
};
