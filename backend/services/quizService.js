import QuizState from '../models/QuizState.js';

export const getQuizState = async () => {
  let state = await QuizState.findOne();
  if (!state) {
    state = new QuizState();
    await state.save();
  }
  return state;
};

export const updateQuizState = async (data) => {
  let state = await QuizState.findOne();
  if (!state) {
    state = new QuizState(data);
  } else {
    state.set(data);
  }
  return await state.save();
};

export const autoTransitionQuiz = async () => {
  const state = await QuizState.findOne();
  if (!state) return;

  const now = new Date();
  
  if (
    state.currentQuiz?.status === "FINISHED" &&
    state.upcomingQuiz?.scheduledDateTime &&
    now >= new Date(state.upcomingQuiz.scheduledDateTime)
  ) {
    // Promote upcoming quiz to current quiz
    state.currentQuiz = {
      name: state.upcomingQuiz.name,
      description: state.upcomingQuiz.description,
      link: state.upcomingQuiz.link,
      conductedDate: state.upcomingQuiz.scheduledDateTime,
      status: "ACTIVE"
    };

    // Reset upcoming quiz
    state.upcomingQuiz = {
      name: "",
      description: "",
      link: "",
      scheduledDateTime: null,
      visibility: false
    };

    await state.save();
    console.log("[CRON] Promoted upcoming quiz to current active quiz.");
  }
};
