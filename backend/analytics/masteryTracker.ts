import { UserProgress, WeakAreaItem } from '../models/types.js';
import { dataStore } from '../models/storage.js';
import { TriviaEngine } from '../game-engine/triviaEngine.js';

export class MasteryTracker {
  static getDashboardSummary(): {
    progress: UserProgress;
    clepOverview: {
      averageClepScore: number;
      isPassingOverall: boolean;
      status: string;
      passingProbability: number;
    };
    categoryBreakdown: Array<{
      subject: string;
      clepScore: number;
      accuracy: number;
      questionsAttempted: number;
      status: string;
    }>;
    topWeakAreas: WeakAreaItem[];
  } {
    const progress = dataStore.getProgress();
    const subjects = Object.entries(progress.subjectMastery);

    let totalClep = 0;
    const categoryBreakdown = subjects.map(([subject, data]) => {
      const evaluation = TriviaEngine.calculateClepReadiness(data.percentage);
      totalClep += evaluation.clepScore;
      return {
        subject,
        clepScore: evaluation.clepScore,
        accuracy: data.percentage,
        questionsAttempted: data.attempted,
        status: evaluation.status,
      };
    });

    const averageClep = subjects.length > 0 ? Math.round(totalClep / subjects.length) : 50;
    const overallEval = TriviaEngine.calculateClepReadiness(
      progress.totalQuestions > 0 ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100) : 75
    );

    return {
      progress,
      clepOverview: {
        averageClepScore: averageClep,
        isPassingOverall: averageClep >= 50,
        status: overallEval.status,
        passingProbability: overallEval.passingProbability,
      },
      categoryBreakdown,
      topWeakAreas: progress.weakAreas.sort((a, b) => b.missedCount - a.missedCount),
    };
  }
}
