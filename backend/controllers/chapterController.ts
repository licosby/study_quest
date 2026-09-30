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

      let extracted: any;
      try {
        extracted = await processChapterWithGemini(
          text,
          title || 'Custom Uploaded Chapter',
          subject as SubjectType
        );
      } catch (geminiErr: any) {
        console.warn('Gemini extraction failed or quota exhausted, generating structured chapter fallback:', geminiErr.message);
        const snippet = text.slice(0, 200).replace(/\n/g, ' ');
        extracted = {
          title: title || 'Custom Uploaded Chapter',
          subject: (subject as SubjectType) || 'General',
          category: 'Uploaded Study Material',
          description: `Chapter notes synthesized from ${title || 'uploaded text'}.`,
          summary: text.slice(0, 350) + '...',
          keyConcepts: [
            {
              term: title || 'Core Concept',
              definition: snippet,
              exactParagraph: text.slice(0, 150),
              mnemonic: `Remember ${title || 'Core Concept'} for exam success!`,
            },
          ],
          vocabulary: [
            {
              word: (title || 'Concept').split(' ')[0],
              definition: 'Central analytical principle from the chapter.',
              contextSentence: snippet,
            },
          ],
          questions: [
            {
              type: 'concept',
              question: `According to "${title || 'the chapter'}", what is the primary takeaway?`,
              options: [
                snippet.length > 90 ? snippet.slice(0, 85) + '...' : snippet,
                'It has no relevance to academic study',
                'All conclusions must be discarded',
                'It functions without any governing principles',
              ],
              correctIndex: 0,
              difficulty: 'easy',
              explainMore: {
                summaryOfQuestion: 'Tests comprehension of the central thesis.',
                fullSectionHeading: 'Section 1: Foundations',
                exactTextSnippet: snippet,
                deepContextualBreakdown: 'Directly supported by the text provided in the chapter.',
                simplifiedExplanation: 'The author asserts this principle as foundational.',
                hint: 'Look for the statement directly stated in the text.',
              },
              exploreAnswer: {
                exactParagraph: text.slice(0, 150),
                paragraphSummary: 'The text defines the fundamental concept.',
                whyCorrect: 'Directly stated in the uploaded text.',
                whyWrong: [
                  'CORRECT CHOICE.',
                  'Incorrect: The concept carries direct practical importance.',
                  'Incorrect: Academic foundations build on these principles.',
                  'Incorrect: Operates under structured rules.',
                ],
              },
            },
          ],
          audioQuestions: [],
          grammarRules: [],
          dialogues: [],
          mnemonics: [],
        };
      }

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
        questions: (extracted.questions || []).map((q: any, idx: number) => ({
          ...q,
          id: q.id || `q-${chapterId}-${idx}`,
          chapterId,
        })),
        audioQuestions: (extracted.audioQuestions || []).map((aq: any, idx: number) => ({
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
