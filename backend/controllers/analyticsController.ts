import { Request, Response } from 'express';
import { MasteryTracker } from '../analytics/masteryTracker.js';
import { dataStore } from '../models/storage.js';

export class AnalyticsController {
  static getDashboard(req: Request, res: Response) {
    try {
      const summary = MasteryTracker.getDashboardSummary();
      return res.json(summary);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch dashboard metrics' });
    }
  }

  static getWeakAreas(req: Request, res: Response) {
    try {
      const progress = dataStore.getProgress();
      return res.json({ weakAreas: progress.weakAreas });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch weak areas' });
    }
  }

  static resetProgress(req: Request, res: Response) {
    try {
      dataStore.updateProgress({
        energy: 250,
        coins: 25000,
        campaignProgress: 0,
        taskCompleted: 0,
        totalQuizzesTaken: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        subjectMastery: {},
        weakAreas: [],
        recentActivity: [],
      });
      return res.json({ message: 'Progress reset successfully', progress: dataStore.getProgress() });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to reset progress' });
    }
  }
}
