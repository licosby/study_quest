export type SubjectIconType =
  | 'scroll'      // History
  | 'dome'        // Government / Capitol
  | 'scales'      // Ethics / Law
  | 'star'        // TX Gov
  | 'flask'       // Biology / Chemistry
  | 'calculator'  // Algebra / Math
  | 'brain'       // Psychology
  | 'books';      // Information Science / Literature

export interface QuestionDiagram {
  type: 'cell' | 'mitochondria' | 'photosynthesis' | 'respiration' | 'chloroplast';
  title: string;
  caption: string;
  markedPoint: string; // e.g., "Marker [A]"
  targetName: string;  // e.g., "Mitochondria"
}

export interface ExplainMoreData {
  summaryOfQuestion: string;
  fullSectionHeading: string;
  exactTextSnippet: string;
  deepContextualBreakdown: string;
  simplifiedExplanation: string;
  hint: string;
  mnemonic?: {
    hook: string;
    rhymeOrAcronymExplanation: string;
    whyItWorks: string;
  };
}

export interface ExploreAnswerData {
  exactParagraph: string;
  paragraphSummary: string;
  whyCorrect: string;
  whyWrong: [string, string, string, string];
  mnemonic?: {
    hook: string;
    rhymeOrAcronymExplanation: string;
    whyItWorks: string;
  };
}

export interface Question {
  id: string;
  chapterId: string;
  courseId: string;
  type: 'concept' | 'vocabulary' | 'grammar' | 'reading' | 'history' | 'audio' | 'diagram';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  diagram?: QuestionDiagram;
  explainMore: ExplainMoreData;
  exploreAnswer: ExploreAnswerData;
}

export interface AudioQuestion {
  id: string;
  chapterId: string;
  courseId: string;
  language: 'Spanish' | 'French' | 'German';
  audioPrompt: string;
  audioTranscript: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
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
  mnemonicExplanation?: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  contextSentence: string;
  mnemonic?: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  chapterNumber: number;
  completed: boolean;
  description: string;
  rawText: string;
  summary: string;
  keyConcepts: KeyConcept[];
  vocabulary: VocabularyItem[];
  mnemonics: Array<{
    id: string;
    target: string;
    phrase: string;
    rhymeOrAcronym: string;
    explanation: string;
  }>;
  questions: Question[];
  audioQuestions: AudioQuestion[];
}

export interface DestinationLandmark {
  name: string;
  description: string;
  landmarkType: 'citadel' | 'dome' | 'temple' | 'fortress' | 'observatory' | 'tower' | 'sanctum' | 'archive';
}

export interface Course {
  id: string;
  title: string;
  icon: SubjectIconType;
  chaptersCount: number;
  completedPercentage: number;
  colorTheme?: string;
  description: string;
  destination: DestinationLandmark;
  chapters: Chapter[];
  isLocked?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  streak: number;
  starsFilled: number; // 0 to 4
  coursesCount: number;
  chaptersCompleted: number;
  clepReadiness: number; // 20 - 80 scale
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}
