export type SubjectType =
  | 'Spanish'
  | 'Biology'
  | 'US History'
  | 'Psychology'
  | 'Microeconomics'
  | 'General';

export type QuestionType =
  | 'concept'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'history'
  | 'audio';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ExplainMoreData {
  summaryOfQuestion: string;
  exactTextSnippet: string;
  simplifiedExplanation: string;
  hint: string;
  mnemonic?: string;
}

export interface ExploreAnswerData {
  exactParagraph: string;
  paragraphSummary: string;
  whyCorrect: string;
  whyWrong: [string, string, string, string];
  mnemonic: string;
}

export interface Question {
  id: string;
  chapterId: string;
  type: QuestionType;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: DifficultyLevel;
  explainMore: ExplainMoreData;
  exploreAnswer: ExploreAnswerData;
}

export interface AudioQuestion {
  id: string;
  chapterId: string;
  language: 'Spanish' | 'French' | 'German';
  audioPrompt: string; // The spoken text (dialogue or paragraph)
  audioTranscript: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: DifficultyLevel;
  speaker?: string;
  dialogueContext?: string;
  explainMore: ExplainMoreData;
  exploreAnswer: ExploreAnswerData;
}

export interface KeyConcept {
  term: string;
  definition: string;
  exactParagraph: string;
  mnemonic?: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  contextSentence: string;
  mnemonic?: string;
  audioText?: string;
}

export interface GrammarRule {
  rule: string;
  explanation: string;
  example: string;
  mnemonic?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  translation?: string;
}

export interface DialogueItem {
  id: string;
  title: string;
  speakers: string[];
  lines: DialogueLine[];
}

export interface HistoricalEvent {
  yearOrEra: string;
  event: string;
  significance: string;
  mnemonic?: string;
}

export interface MnemonicItem {
  id: string;
  target: string;
  phrase: string;
  explanation: string;
  subject: string;
}

export interface Chapter {
  id: string;
  title: string;
  subject: SubjectType;
  category: string;
  description: string;
  rawText: string;
  summary: string;
  keyConcepts: KeyConcept[];
  vocabulary: VocabularyItem[];
  grammarRules?: GrammarRule[];
  dialogues?: DialogueItem[];
  historicalEvents?: HistoricalEvent[];
  mnemonics: MnemonicItem[];
  questions: Question[];
  audioQuestions: AudioQuestion[];
  uploadDate: string;
}

export interface WeakAreaItem {
  id: string;
  chapterId: string;
  subject: string;
  concept: string;
  questionText: string;
  missedCount: number;
  lastMissedAt: string;
}

export interface UserProgress {
  energy: number;
  coins: number;
  campaignProgress: number;
  taskCompleted: number;
  streak: number;
  totalQuizzesTaken: number;
  totalCorrect: number;
  totalQuestions: number;
  subjectMastery: Record<
    string,
    { attempted: number; correct: number; percentage: number; clepScore: number }
  >;
  weakAreas: WeakAreaItem[];
  recentActivity: Array<{
    id: string;
    timestamp: string;
    chapterTitle: string;
    subject: string;
    score: number;
    total: number;
    xpEarned: number;
  }>;
}
