import { Question, AudioQuestion, ExplainMoreData, ExploreAnswerData } from '../models/types.js';

export interface AnswerSubmission {
  questionId: string;
  selectedIndex: number;
  timeSpentSeconds: number;
}

export interface EvaluationResult {
  isCorrect: boolean;
  correctIndex: number;
  selectedOption: string;
  correctOption: string;
  xpEarned: number;
  coinsEarned: number;
  exploreAnswer: ExploreAnswerData;
}

export class TriviaEngine {
  static evaluate(
    question: Question | AudioQuestion,
    selectedIndex: number,
    timeSpentSeconds: number = 10
  ): EvaluationResult {
    const isCorrect = selectedIndex === question.correctIndex;
    const baseXP = isCorrect ? 1000 : 150;
    const timeBonus = isCorrect && timeSpentSeconds < 15 ? 250 : 0;
    const coinsEarned = isCorrect ? 250 : 25;

    return {
      isCorrect,
      correctIndex: question.correctIndex,
      selectedOption: question.options[selectedIndex] || 'None',
      correctOption: question.options[question.correctIndex],
      xpEarned: baseXP + timeBonus,
      coinsEarned,
      exploreAnswer: question.exploreAnswer,
    };
  }

  static calculateClepReadiness(accuracyPercent: number): {
    clepScore: number;
    isPassing: boolean;
    status: 'Below Passing' | 'Borderline' | 'Proficient' | 'Mastery';
    passingProbability: number;
  } {
    // CLEP exams are scored on a scaled scale from 20 to 80.
    // The American Council on Education (ACE) recommends 50 as the credit-granting passing score (~60-65% raw score).
    const scaledScore = Math.min(80, Math.max(20, Math.round(20 + (accuracyPercent / 100) * 60)));
    const isPassing = scaledScore >= 50;
    let status: 'Below Passing' | 'Borderline' | 'Proficient' | 'Mastery' = 'Below Passing';
    let passingProbability = Math.min(99, Math.max(5, Math.round((accuracyPercent / 70) * 75)));

    if (scaledScore >= 65) {
      status = 'Mastery';
      passingProbability = 98;
    } else if (scaledScore >= 58) {
      status = 'Proficient';
      passingProbability = 90;
    } else if (scaledScore >= 50) {
      status = 'Borderline';
      passingProbability = 72;
    } else {
      status = 'Below Passing';
      passingProbability = Math.round((accuracyPercent / 55) * 45);
    }

    return {
      clepScore: scaledScore,
      isPassing,
      status,
      passingProbability,
    };
  }
}
