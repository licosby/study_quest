import { Router } from 'express';
import { ChapterController } from '../controllers/chapterController.js';

const router = Router();

router.get('/', ChapterController.getChapters);
router.get('/:id', ChapterController.getChapterById);
router.post('/upload', ChapterController.uploadChapter);

export default router;
