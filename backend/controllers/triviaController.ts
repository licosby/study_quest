import { Request, Response } from 'express';
import { dataStore } from '../models/storage.js';
import { AdaptiveEngine } from '../game-engine/adaptiveEngine.js';
import { TriviaEngine } from '../game-engine/triviaEngine.js';
import { Question, AudioQuestion, DifficultyLevel } from '../models/types.js';

export class TriviaController {
  static getQuiz(req: Request, res: Response) {
    try {
      const chapterId = req.query.chapterId as string;
      const mode = (req.query.mode as any) || 'solo';
      const difficulty = req.query.difficulty as DifficultyLevel;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = AdaptiveEngine.getQuestionsForMode({
        chapterId,
        mode,
        difficulty,
        limit,
      });

      return res.json({
        questions: result.questions,
        total: result.questions.length,
        mode: result.mode,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to generate quiz session' });
    }
  }

  static getExplainMore(req: Request, res: Response) {
    try {
      const { questionId, chapterId } = req.query;
      const chapter = dataStore.getChapterById(chapterId as string);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      const q =
        chapter.questions.find((x) => x.id === questionId) ||
        chapter.audioQuestions.find((x) => x.id === questionId);

      if (!q) {
        return res.status(404).json({ error: 'Question not found' });
      }

      return res.json({ explainMore: q.explainMore });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch explanation' });
    }
  }

  static evaluateSingleAnswer(req: Request, res: Response) {
    try {
      const { questionId, chapterId, selectedIndex, timeSpentSeconds } = req.body;
      const chapter = dataStore.getChapterById(chapterId);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      const q =
        chapter.questions.find((x) => x.id === questionId) ||
        chapter.audioQuestions.find((x) => x.id === questionId);

      if (!q) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const evaluation = TriviaEngine.evaluate(q, selectedIndex, timeSpentSeconds || 10);
      return res.json({ evaluation });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to evaluate answer' });
    }
  }

  static submitQuizSummary(req: Request, res: Response) {
    try {
      const { chapterId, subject, score, total, missedQuestions } = req.body;
      const updatedProgress = dataStore.recordQuizResult({
        chapterId: chapterId || 'general',
        subject: subject || 'General',
        score: score || 0,
        total: total || 1,
        missedQuestions: missedQuestions || [],
      });

      const readiness = TriviaEngine.calculateClepReadiness(
        total > 0 ? Math.round((score / total) * 100) : 0
      );

      return res.json({
        progress: updatedProgress,
        readiness,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to record quiz results' });
    }
  }
}
