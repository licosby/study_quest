import { Request, Response } from 'express';
import { dataStore } from '../models/storage.js';
import { processChapterWithGemini } from '../services/geminiService.js';
import { Chapter, SubjectType } from '../models/types.js';

export class ChapterController {
  static getChapters(req: Request, res: Response) {
    try {
      const subject = req.query.subject as string;
      let chapters = dataStore.getChapters();
      if (subject && subject !== 'all') {
        chapters = chapters.filter((c) => c.subject.toLowerCase() === subject.toLowerCase());
      }
      return res.json({ chapters });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch chapters' });
    }
  }

  static getChapterById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const chapter = dataStore.getChapterById(id);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      return res.json({ chapter });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch chapter' });
    }
  }

  static async uploadChapter(req: Request, res: Response) {
    try {
      const { text, title, subject } = req.body;
      if (!text || typeof text !== 'string' || text.trim().length < 50) {
        return res.status(400).json({
          error: 'Please provide at least 50 characters of textbook chapter text or lecture notes.',
        });
      }

      const extracted = await processChapterWithGemini(
        text,
        title || 'Custom Uploaded Chapter',
        subject as SubjectType
      );

      const chapterId = `ch-user-${Date.now()}`;
      const newChapter: Chapter = {
        id: chapterId,
        title: extracted.title || title || 'Custom Textbook Chapter',
        subject: extracted.subject || (subject as SubjectType) || 'General',
        category: extracted.category || 'Uploaded Study Material',
        description: extracted.description || 'Custom uploaded textbook chapter',
        rawText: text,
        summary: extracted.summary,
        keyConcepts: extracted.keyConcepts || [],
        vocabulary: extracted.vocabulary || [],
        grammarRules: extracted.grammarRules || [],
        dialogues: extracted.dialogues || [],
        mnemonics: extracted.mnemonics || [],
        questions: (extracted.questions || []).map((q, idx) => ({
          ...q,
          id: q.id || `q-${chapterId}-${idx}`,
          chapterId,
        })),
        audioQuestions: (extracted.audioQuestions || []).map((aq, idx) => ({
          ...aq,
          id: aq.id || `aq-${chapterId}-${idx}`,
          chapterId,
        })),
        uploadDate: new Date().toISOString().split('T')[0],
      };

      dataStore.addChapter(newChapter);

      return res.status(201).json({
        message: 'Chapter processed successfully!',
        chapter: newChapter,
      });
    } catch (err: any) {
      console.error('Error uploading chapter:', err);
      return res.status(500).json({ error: err.message || 'Failed to process chapter' });
    }
  }
}
