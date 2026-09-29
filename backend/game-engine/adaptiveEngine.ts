import { Chapter, Question, AudioQuestion, DifficultyLevel } from '../models/types.js';
import { dataStore } from '../models/storage.js';

export class AdaptiveEngine {
  static getQuestionsForMode(params: {
    chapterId?: string;
    mode: 'solo' | 'audio' | 'mnemonic' | 'blitz' | 'weak-areas';
    difficulty?: DifficultyLevel;
    limit?: number;
  }): { questions: (Question | AudioQuestion)[]; mode: string } {
    const chapters = dataStore.getChapters();
    const limit = params.limit || 10;

    let targetChapter: Chapter | undefined;
    if (params.chapterId && params.chapterId !== 'all') {
      targetChapter = chapters.find((c) => c.id === params.chapterId);
    }

    if (params.mode === 'audio') {
      let pool: AudioQuestion[] = [];
      if (targetChapter) {
        pool = [...targetChapter.audioQuestions];
      } else {
        chapters.forEach((c) => pool.push(...c.audioQuestions));
      }

      if (params.difficulty) {
        pool = pool.filter((q) => q.difficulty === params.difficulty || pool.length <= 2);
      }
      return {
        questions: pool.slice(0, limit),
        mode: 'audio',
      };
    }

    if (params.mode === 'mnemonic') {
      let pool: Question[] = [];
      const sourceChapters = targetChapter ? [targetChapter] : chapters;
      sourceChapters.forEach((ch) => {
        const withMnemonics = ch.questions.filter((q) => q.explainMore.mnemonic || q.exploreAnswer.mnemonic);
        pool.push(...withMnemonics);
      });
      return {
        questions: (pool.length > 0 ? pool : chapters[0]?.questions || []).slice(0, limit),
        mode: 'mnemonic',
      };
    }

    if (params.mode === 'weak-areas') {
      const progress = dataStore.getProgress();
      const missedConcepts = progress.weakAreas.map((w) => w.concept.toLowerCase());
      let pool: Question[] = [];

      chapters.forEach((ch) => {
        ch.questions.forEach((q) => {
          const matches = missedConcepts.some(
            (c) =>
              q.question.toLowerCase().includes(c) ||
              q.explainMore.summaryOfQuestion.toLowerCase().includes(c)
          );
          if (matches) pool.push(q);
        });
      });

      if (pool.length === 0) {
        // Fallback to harder questions
        chapters.forEach((ch) => {
          pool.push(...ch.questions.filter((q) => q.difficulty === 'hard' || q.difficulty === 'medium'));
        });
      }

      return {
        questions: pool.slice(0, limit),
        mode: 'weak-areas',
      };
    }

    // Default / Solo Quest: Mix of concept, vocabulary, grammar, and audio
    let pool: (Question | AudioQuestion)[] = [];
    if (targetChapter) {
      pool = [...targetChapter.questions, ...targetChapter.audioQuestions];
    } else {
      chapters.forEach((c) => {
        pool.push(...c.questions);
        if (c.audioQuestions.length > 0) {
          pool.push(c.audioQuestions[0]);
        }
      });
    }

    return {
      questions: pool.slice(0, limit),
      mode: 'solo',
    };
  }
}
