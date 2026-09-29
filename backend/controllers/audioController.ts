import { Request, Response } from 'express';
import { dataStore } from '../models/storage.js';
import { generateSpeechAudio } from '../services/geminiService.js';
import { AudioQuestion } from '../models/types.js';

export class AudioController {
  static getAudioQuestions(req: Request, res: Response) {
    try {
      const language = (req.query.language as string) || 'Spanish';
      const difficulty = req.query.difficulty as string;
      const chapterId = req.query.chapterId as string;

      const chapters = dataStore.getChapters();
      let pool: AudioQuestion[] = [];

      if (chapterId && chapterId !== 'all') {
        const ch = chapters.find((c) => c.id === chapterId);
        if (ch) pool = [...ch.audioQuestions];
      } else {
        chapters.forEach((c) => pool.push(...c.audioQuestions));
      }

      if (language && language !== 'all') {
        pool = pool.filter((q) => q.language.toLowerCase() === language.toLowerCase());
      }

      if (difficulty && difficulty !== 'all') {
        pool = pool.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }

      return res.json({
        questions: pool,
        total: pool.length,
        language,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch audio questions' });
    }
  }

  static async synthesizeSpeech(req: Request, res: Response) {
    try {
      const { text, voice } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text prompt is required for audio synthesis' });
      }

      const audioBase64 = await generateSpeechAudio(text, voice || 'Kore');
      if (audioBase64) {
        return res.json({
          audioBase64,
          format: 'audio/wav',
          speed: '1.0x (CLEP Native Speed)',
        });
      }

      // If Gemini TTS is unavailable (e.g. no key), let the client know to use SpeechSynthesis fallback
      return res.json({
        audioBase64: null,
        useClientFallback: true,
        text,
        speed: 1.0,
      });
    } catch (err: any) {
      console.warn('Speech synthesis route warning:', err);
      return res.json({
        audioBase64: null,
        useClientFallback: true,
        text: req.body?.text || '',
        speed: 1.0,
      });
    }
  }
}
