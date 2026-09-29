import { useStudyQuest } from '../context/StudyQuestContext.js';

export function useQuizEngine() {
  const {
    currentQuestions,
    currentQuestionIndex,
    currentQuestion,
    selectedOptionIndex,
    answeredState,
    quizScore,
    quizCompleted,
    selectOption,
    submitCurrentAnswer,
    nextQuestion,
    prevQuestion,
    openExplainMore,
    openExploreAnswer,
  } = useStudyQuest();

  return {
    questions: currentQuestions,
    currentIndex: currentQuestionIndex,
    currentQuestion,
    selectedOptionIndex,
    answeredState,
    score: quizScore,
    isComplete: quizCompleted,
    selectOption,
    submitAnswer: submitCurrentAnswer,
    nextQuestion,
    prevQuestion,
    openExplainMore,
    openExploreAnswer,
  };
}

