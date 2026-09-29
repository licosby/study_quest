import { Chapter, Question, AudioQuestion, UserProgress, SubjectType, DifficultyLevel } from '../../backend/models/types.js';

export interface QuizSessionResponse {
  questions: (Question | AudioQuestion)[];
  total: number;
  mode: string;
}

export interface EvaluationResponse {
  evaluation: {
    isCorrect: boolean;
    correctIndex: number;
    selectedOption: string;
    correctOption: string;
    xpEarned: number;
    coinsEarned: number;
    exploreAnswer: Question['exploreAnswer'];
  };
}

export interface DashboardResponse {
  progress: UserProgress;
  clepOverview: {
    averageClepScore: number;
    isPassingOverall: boolean;
    status: string;
    passingProbability: number;
  };
  categoryBreakdown: Array<{
    subject: string;
    clepScore: number;
    accuracy: number;
    questionsAttempted: number;
    status: string;
  }>;
  topWeakAreas: any[];
}

export const api = {
  async getChapters(subject?: string): Promise<{ chapters: Chapter[] }> {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    const res = await fetch(`/api/chapters${query}`);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  },

  async getChapterById(id: string): Promise<{ chapter: Chapter }> {
    const res = await fetch(`/api/chapters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return res.json();
  },

  async uploadChapter(payload: {
    text: string;
    title?: string;
    subject?: SubjectType;
  }): Promise<{ message: string; chapter: Chapter }> {
    const res = await fetch('/api/chapters/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload chapter');
    }
    return res.json();
  },

  async getQuiz(params: {
    chapterId?: string;
    mode?: 'solo' | 'audio' | 'mnemonic' | 'blitz' | 'weak-areas';
    difficulty?: DifficultyLevel;
    limit?: number;
  }): Promise<QuizSessionResponse> {
    const query = new URLSearchParams();
    if (params.chapterId) query.set('chapterId', params.chapterId);
    if (params.mode) query.set('mode', params.mode);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`/api/trivia?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
  },

  async getExplainMore(chapterId: string, questionId: string) {
    const res = await fetch(`/api/trivia/explain-more?chapterId=${chapterId}&questionId=${questionId}`);
    if (!res.ok) throw new Error('Failed to fetch explain more data');
    return res.json();
  },

  async evaluateAnswer(payload: {
    chapterId: string;
    questionId: string;
    selectedIndex: number;
    timeSpentSeconds?: number;
  }): Promise<EvaluationResponse> {
    const res = await fetch('/api/trivia/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to evaluate answer');
    return res.json();
  },

  async submitQuizSummary(payload: {
    chapterId: string;
    subject: string;
    score: number;
    total: number;
    missedQuestions?: Array<{ concept: string; questionText: string }>;
  }) {
    const res = await fetch('/api/trivia/submit-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit quiz summary');
    return res.json();
  },

  async getAudioQuestions(language: string = 'Spanish', difficulty?: string) {
    const query = new URLSearchParams({ language });
    if (difficulty) query.set('difficulty', difficulty);
    const res = await fetch(`/api/audio/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch audio questions');
    return res.json();
  },

  async synthesizeSpeech(text: string, voice?: string) {
    const res = await fetch('/api/audio/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) throw new Error('Failed to synthesize speech');
    return res.json();
  },

  async getMnemonics(subject?: string) {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    const res = await fetch(`/api/mnemonics${query}`);
    if (!res.ok) throw new Error('Failed to fetch mnemonics');
    return res.json();
  },

  async generateMnemonic(term: string, context?: string, subject?: string) {
    const res = await fetch('/api/mnemonics/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term, context, subject }),
    });
    if (!res.ok) throw new Error('Failed to generate mnemonic');
    return res.json();
  },

  async getDashboard(): Promise<DashboardResponse> {
    const res = await fetch('/api/analytics/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  async resetProgress() {
    const res = await fetch('/api/analytics/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset progress');
    return res.json();
  },
};
