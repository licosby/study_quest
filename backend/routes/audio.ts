import { Router } from 'express';
import { AudioController } from '../controllers/audioController.js';

const router = Router();

router.get('/questions', AudioController.getAudioQuestions);
router.post('/synthesize', AudioController.synthesizeSpeech);

export default router;
