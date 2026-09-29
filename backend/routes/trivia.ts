import { Router } from 'express';
import { TriviaController } from '../controllers/triviaController.js';

const router = Router();

router.get('/', TriviaController.getQuiz);
router.get('/explain-more', TriviaController.getExplainMore);
router.post('/evaluate', TriviaController.evaluateSingleAnswer);
router.post('/submit-summary', TriviaController.submitQuizSummary);

export default router;
