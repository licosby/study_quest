import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/weak-areas', AnalyticsController.getWeakAreas);
router.post('/reset', AnalyticsController.resetProgress);

export default router;
