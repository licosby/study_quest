import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Chapter, Question, AudioQuestion, UserProfile, Achievement, SubjectIconType, ExplainMoreData, ExploreAnswerData, DestinationLandmark } from '../types/quest.js';
import { initialCourses } from '../data/defaultCourses.js';
import { initialAchievements } from '../data/achievements.js';
import { EducationalContentService } from '../services/educationalContentService.js';
import { shuffleQuestionOptions } from '../utils/shuffleOptions.js';

export type ActiveView = 'map' | 'trivia' | 'summaries' | 'progress' | 'achievements';

export interface TravelAnimationEvent {
  courseId: string;
  courseTitle: string;
  destinationName: string;
  fromChapterTitle: string;
  toChapterTitle?: string;
  fromPercentage: number;
  toPercentage: number;
  timestamp: number;
}

interface StudyQuestContextType {
  courses: Course[];
  activeCourse: Course | null;
  activeChapter: Chapter | null;
  activeView: ActiveView;
  profile: UserProfile;
  achievements: Achievement[];
  selectedRouteId: string | 'all';
  travelEvent: TravelAnimationEvent | null;
  clearTravelEvent: () => void;
  recentlyUnlockedExpertBadge: {
    courseId: string;
    courseTitle: string;
    icon: SubjectIconType;
    date: string;
  } | null;
  clearExpertBadgeCelebration: () => void;

  // Modals
  isUploadModalOpen: boolean;
  isCourseModalOpen: boolean;
  isStreakModalOpen: boolean;
  isAchievementsModalOpen: boolean;
  isCourseEditorModalOpen: boolean;
  isNewQuestModalOpen: boolean;
  editingCourse: Course | null;

  // Quiz State
  currentQuestions: (Question | AudioQuestion)[];
  currentQuestionIndex: number;
  currentQuestion: Question | AudioQuestion | null;
  selectedOptionIndex: number | null;
  answeredState: {
    answered: boolean;
    isCorrect: boolean;
    correctIndex: number;
    exploreAnswer: ExploreAnswerData;
  } | null;
  quizScore: number;
  quizCompleted: boolean;
  missedQuestions: Question[];
  targetPassingRate: number;
  minRequiredQuestions: number;
  isLoadingNextQuestion: boolean;
  timerMode: 'untimed' | 'timed';
  setTimerMode: (mode: 'untimed' | 'timed') => void;
  timeRemaining: number;
  isTimerPaused: boolean;
  togglePauseTimer: () => void;
  isExplainMoreOpen: boolean;
  isExploreAnswerOpen: boolean;
  activeExplainData: ExplainMoreData | null;
  activeExploreData: ExploreAnswerData | null;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setActiveCourse: (course: Course | null) => void;
  setActiveChapter: (chapter: Chapter | null) => void;
  setSelectedRouteId: (id: string | 'all') => void;
  openCourseModal: (course: Course) => void;
  closeCourseModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openStreakModal: () => void;
  closeStreakModal: () => void;
  openAchievementsModal: () => void;
  closeAchievementsModal: () => void;
  openCourseEditor: (course?: Course) => void;
  closeCourseEditor: () => void;
  openNewQuestModal: () => void;
  closeNewQuestModal: () => void;

  // Course Management
  addCourse: (courseData: {
    title: string;
    icon: SubjectIconType;
    chaptersCount: number;
    description: string;
    destinationName?: string;
    destinationDesc?: string;
  }) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addNewChapterToCourse: (courseId: string, chapter: Chapter) => void;

  // Quiz Actions
  startTrivia: (course?: Course, chapter?: Chapter) => void;
  startQuickSprint: () => void;
  selectOption: (index: number) => void;
  submitCurrentAnswer: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  openExplainMore: () => void;
  closeExplainMore: () => void;
  openExploreAnswer: () => void;
  closeExploreAnswer: () => void;
  exitQuiz: () => void;
}

const StudyQuestContext = createContext<StudyQuestContextType | undefined>(undefined);

export const StudyQuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const sanitizeCourses = (list: Course[]): Course[] => {
      const seenIds = new Set<string>();
      const deduplicated: Course[] = [];
      for (const c of list) {
        if (!c || !c.id) continue;
        if (!seenIds.has(c.id)) {
          seenIds.add(c.id);
          deduplicated.push(c);
        } else {
          // If a course with this ID already existed, merge any missing chapters into the existing one
          const existing = deduplicated.find((d) => d.id === c.id);
          if (existing && Array.isArray(c.chapters)) {
            const existingChapterIds = new Set(existing.chapters.map((ch) => ch.id));
            for (const ch of c.chapters) {
              if (!existingChapterIds.has(ch.id)) {
                existing.chapters.push(ch);
                existingChapterIds.add(ch.id);
              }
            }
          }
        }
      }

      return deduplicated.map((c) => {
        const isBio = c.id === 'biology' || /biology|biochem/i.test(c.title);
        if (!isBio) {
          return {
            ...c,
            chapters: c.chapters.map((ch) => ({
              ...ch,
              questions: ch.questions.map((q) => {
                if (q.diagram) {
                  const cleaned = { ...q };
                  delete cleaned.diagram;
                  cleaned.type = 'concept';
                  if (cleaned.question.includes('scientific diagram') || cleaned.question.includes('Marker [A]')) {
                    cleaned.question = `According to the chapter analysis in "${ch.title}", which statement accurately describes the primary principle established in the text?`;
                  }
                  return cleaned;
                }
                return q;
              }),
            })),
          };
        }
        return c;
      });
    };

    const saved = localStorage.getItem('studyquest_courses_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return sanitizeCourses(parsed);
      } catch (e) { /* ignore */ }
    }
    return sanitizeCourses(initialCourses);
  });

  const [activeCourse, setActiveCourse] = useState<Course | null>(courses[0] || null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(courses[0]?.chapters[0] || null);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [selectedRouteId, setSelectedRouteId] = useState<string | 'all'>('all');

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Lindsey',
    role: 'Student',
    streak: 3,
    starsFilled: 2,
    coursesCount: courses.length,
    chaptersCompleted: 34,
    clepReadiness: 68,
  });

  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isCourseEditorModalOpen, setIsCourseEditorModalOpen] = useState(false);
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Quiz State
  const [currentQuestions, setCurrentQuestions] = useState<(Question | AudioQuestion)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<{
    answered: boolean;
    isCorrect: boolean;
    correctIndex: number;
    exploreAnswer: ExploreAnswerData;
  } | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState<Question[]>([]);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  const targetPassingRate = 85;
  const minRequiredQuestions = 12;
  const [timerMode, setTimerMode] = useState<'untimed' | 'timed'>('untimed');
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const togglePauseTimer = () => setIsTimerPaused((prev) => !prev);
  const [travelEvent, setTravelEvent] = useState<TravelAnimationEvent | null>(null);
  const clearTravelEvent = () => setTravelEvent(null);
  const [recentlyUnlockedExpertBadge, setRecentlyUnlockedExpertBadge] = useState<{
    courseId: string;
    courseTitle: string;
    icon: SubjectIconType;
    date: string;
  } | null>(null);
  const clearExpertBadgeCelebration = () => setRecentlyUnlockedExpertBadge(null);
  const [isExplainMoreOpen, setIsExplainMoreOpen] = useState(false);
  const [isExploreAnswerOpen, setIsExploreAnswerOpen] = useState(false);
  const [activeExplainData, setActiveExplainData] = useState<ExplainMoreData | null>(null);
  const [activeExploreData, setActiveExploreData] = useState<ExploreAnswerData | null>(null);

  // Keep localStorage synced
  useEffect(() => {
    localStorage.setItem('studyquest_courses_v2', JSON.stringify(courses));
    setProfile((prev) => ({ ...prev, coursesCount: courses.length }));
  }, [courses]);

  const currentQuestion = currentQuestions[currentQuestionIndex] || null;

  // Countdown timer effect for timed mode
  useEffect(() => {
    if (timerMode !== 'timed' || isTimerPaused || answeredState?.answered || quizCompleted || activeView !== 'trivia') {
      return;
    }

    if (timeRemaining <= 0) {
      if (!answeredState?.answered && currentQuestion) {
        submitCurrentAnswer();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMode, isTimerPaused, timeRemaining, answeredState, quizCompleted, activeView, currentQuestion]);

  // Course Management
  const addCourse = (courseData: {
    title: string;
    icon: SubjectIconType;
    chaptersCount: number;
    description: string;
    destinationName?: string;
    destinationDesc?: string;
  }): Course => {
    const courseId = `course-${Date.now()}`;
    const newCourse: Course = {
      id: courseId,
      title: courseData.title,
      icon: courseData.icon,
      chaptersCount: courseData.chaptersCount,
      completedPercentage: 0,
      description: courseData.description,
      destination: {
        name: courseData.destinationName || `The Citadel of ${courseData.title}`,
        description: courseData.destinationDesc || `The landmark destination for mastery of ${courseData.title}.`,
        landmarkType: 'citadel',
      },
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          courseId,
          title: `Chapter 1: Foundations of ${courseData.title}`,
          chapterNumber: 1,
          completed: false,
          description: `Core principles and essential concepts for ${courseData.title}.`,
          rawText: `Foundations of ${courseData.title}. This introductory chapter introduces the essential framework, definitions, and operational mechanisms necessary for mastery.`,
          summary: `Overview of foundational principles, definitions, and applications for ${courseData.title}.`,
          keyConcepts: [
            {
              term: `Core Principle of ${courseData.title}`,
              definition: `The fundamental axiom governing ${courseData.title}.`,
              exactParagraph: `This introductory chapter introduces the essential framework, definitions, and operational mechanisms necessary for mastery.`,
              mnemonic: `Master the Foundation First!`,
              mnemonicExplanation: `Anchor the core terms before advancing down the quest route.`,
            },
          ],
          vocabulary: [
            {
              word: 'Axiom',
              definition: 'A statement regarded as being established, accepted, or self-evidently true.',
              contextSentence: 'The foundational axiom anchors the entire theoretical model.',
              mnemonic: 'Axiom = Accepted truth.',
            },
          ],
          mnemonics: [
            {
              id: `m-${Date.now()}`,
              target: courseData.title,
              phrase: `Learn, Play, Conquer: Foundations Pave the Way!`,
              rhymeOrAcronym: `Rhyme: Play with Way: Foundational understanding unlocks advanced problem solving.`,
              explanation: `Active multiple-choice retrieval anchors long-term academic recall.`,
            },
          ],
          questions: [
            {
              id: `q-${Date.now()}-1`,
              chapterId: `ch-${Date.now()}-1`,
              courseId,
              type: 'concept',
              question: `What is the primary role of foundational principles in the study of ${courseData.title}?`,
              options: [
                'To replace all future empirical observations with rigid assumptions',
                'To establish the core framework and definitions required for systematic analysis',
                'To eliminate the necessity for further testing and review',
                'To complicate basic concepts without practical utility',
              ],
              correctIndex: 1,
              difficulty: 'easy',
              explainMore: {
                summaryOfQuestion: `The question asks why foundational principles are essential in ${courseData.title}.`,
                fullSectionHeading: `Section 1.1: The Role of Foundational Axioms`,
                exactTextSnippet: 'This introductory chapter introduces the essential framework, definitions, and operational mechanisms necessary for mastery.',
                deepContextualBreakdown: `Every academic discipline rests upon a set of foundational axioms that provide common vocabulary and analytical standards. Without understanding the primary framework, students cannot synthesize complex relationships in subsequent chapters.`,
                simplifiedExplanation: 'Foundations provide the analytical scaffold for everything that follows.',
                hint: 'Look for establishing the core framework and definitions.',
                mnemonic: {
                  hook: 'Foundations Frame the Future: Learn the Base to Conquer the Place!',
                  rhymeOrAcronymExplanation: 'Rhymes Base with Place: Master the core rules before solving higher-order questions.',
                  whyItWorks: 'Pairs the foundational phase with subsequent exam victory.',
                },
              },
              exploreAnswer: {
                exactParagraph: 'This introductory chapter introduces the essential framework, definitions, and operational mechanisms necessary for mastery.',
                paragraphSummary: 'Foundational axioms enable structured, repeatable reasoning.',
                whyCorrect: 'Foundational principles create the conceptual structure required for academic mastery.',
                whyWrong: [
                  'Foundations guide empirical observation, never replace it.',
                  'CORRECT CHOICE.',
                  'Testing remains essential at every level.',
                  'Principles simplify and clarify complex phenomena.',
                ],
              },
            },
          ],
          audioQuestions: [],
        },
      ],
    };

    setCourses((prev) => [...prev, newCourse]);
    setActiveCourse(newCourse);
    setIsCourseEditorModalOpen(false);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    setIsCourseEditorModalOpen(false);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeCourse?.id === id) {
        setActiveCourse(remaining[0] || null);
      }
      return remaining;
    });
    setIsCourseModalOpen(false);
  };

  const addNewChapterToCourse = (courseId: string, chapter: Chapter) => {
    // 1. Save directly under "chapters" key in localStorage per requirement
    try {
      const existingChaptersJson = localStorage.getItem('chapters');
      const existingChapters: Chapter[] = existingChaptersJson ? JSON.parse(existingChaptersJson) : [];
      const updatedChaptersList = [chapter, ...existingChapters.filter((c) => c.id !== chapter.id)];
      localStorage.setItem('chapters', JSON.stringify(updatedChaptersList));
    } catch (e) {
      console.warn('Could not save to localStorage under chapters key:', e);
    }

    // 2. Update courses state and studyquest_courses_v2
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          const updatedChapters = [chapter, ...c.chapters.filter((ch) => ch.id !== chapter.id)];
          return {
            ...c,
            chapters: updatedChapters,
            chaptersCount: Math.max(updatedChapters.length, c.chaptersCount),
          };
        }
        return c;
      });
      localStorage.setItem('studyquest_courses_v2', JSON.stringify(updated));
      return updated;
    });
  };

  // Modal handlers
  const openCourseModal = (course: Course) => {
    setActiveCourse(course);
    setIsCourseModalOpen(true);
  };
  const closeCourseModal = () => setIsCourseModalOpen(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openStreakModal = () => setIsStreakModalOpen(true);
  const closeStreakModal = () => setIsStreakModalOpen(false);

  const openAchievementsModal = () => setIsAchievementsModalOpen(true);
  const closeAchievementsModal = () => setIsAchievementsModalOpen(false);

  const openCourseEditor = (course?: Course) => {
    setEditingCourse(course || null);
    setIsCourseEditorModalOpen(true);
  };
  const closeCourseEditor = () => {
    setEditingCourse(null);
    setIsCourseEditorModalOpen(false);
  };

  const openNewQuestModal = () => setIsNewQuestModalOpen(true);
  const closeNewQuestModal = () => setIsNewQuestModalOpen(false);

  // Quiz Handling
  const startTrivia = (course?: Course, chapter?: Chapter) => {
    const targetCourse = course || activeCourse || courses[0];
    if (!targetCourse) return;

    let pool: (Question | AudioQuestion)[] = [];

    if (chapter) {
      pool = [...chapter.questions, ...chapter.audioQuestions];
    } else {
      targetCourse.chapters.forEach((ch) => {
        pool.push(...ch.questions, ...ch.audioQuestions);
      });
    }

    if (pool.length === 0 && targetCourse.chapters[0]) {
      pool = [...targetCourse.chapters[0].questions, ...targetCourse.chapters[0].audioQuestions];
    }

    const isBiologyCourse = targetCourse.id === 'biology' || /biology|biochem/i.test(targetCourse.title);
    pool = pool.map((q) => {
      if (!isBiologyCourse && 'diagram' in q && q.diagram) {
        const cleaned = { ...q };
        delete cleaned.diagram;
        cleaned.type = 'concept';
        if (cleaned.question.includes('scientific diagram') || cleaned.question.includes('Marker [A]')) {
          cleaned.question = `According to the chapter analysis in "${chapter?.title || targetCourse.title}", which statement accurately describes the primary principle established in the text?`;
        }
        return cleaned;
      }
      return q;
    });

    // Shuffle pool
    pool = [...pool].sort(() => 0.5 - Math.random());

    // Pre-seed up to at least 12 questions INSTANTLY using synchronous OpenStax & curriculum pool!
    const existingIds = new Set(pool.map((q) => q.id));
    while (pool.length < 12) {
      const dynamicQ = EducationalContentService.generateDynamicQuestionSync(
        targetCourse.title,
        targetCourse.id,
        existingIds,
        []
      );
      existingIds.add(dynamicQ.id);
      existingIds.add(dynamicQ.question);
      pool.push(dynamicQ);
    }

    setMissedQuestions([]);
    setActiveCourse(targetCourse);
    setActiveChapter(chapter || targetCourse.chapters[0] || null);
    
    // Randomize options for EVERY question using Fisher-Yates so answers are uniformly distributed across A, B, C, D
    const randomizedPool = pool.map(shuffleQuestionOptions);
    setCurrentQuestions(randomizedPool);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setAnsweredState(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setTimeRemaining(60);
    setIsTimerPaused(false);
    setIsExplainMoreOpen(false);
    setIsExploreAnswerOpen(false);

    setIsCourseModalOpen(false);
    setIsNewQuestModalOpen(false);
    setActiveView('trivia');
  };

  const startQuickSprint = () => {
    const allQuestions: (Question | AudioQuestion)[] = [];
    courses.forEach((c) => {
      c.chapters.forEach((ch) => {
        allQuestions.push(...ch.questions);
      });
    });

    const shuffled = [...allQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(shuffleQuestionOptions);
    setCurrentQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setAnsweredState(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setIsExplainMoreOpen(false);
    setIsExploreAnswerOpen(false);

    setIsNewQuestModalOpen(false);
    setActiveView('trivia');
  };

  const selectOption = (index: number) => {
    if (answeredState?.answered) return;
    setSelectedOptionIndex(index);
  };

  const submitCurrentAnswer = () => {
    if (selectedOptionIndex === null || !currentQuestion || answeredState?.answered) return;

    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    } else {
      // Track missed question for spaced-repetition reinforcement
      if ('options' in currentQuestion) {
        setMissedQuestions((prev) => [...prev, currentQuestion as Question]);
      }
    }

    setAnsweredState({
      answered: true,
      isCorrect,
      correctIndex: currentQuestion.correctIndex,
      exploreAnswer: currentQuestion.exploreAnswer,
    });
    setActiveExploreData(currentQuestion.exploreAnswer);
  };

  const nextQuestion = async () => {
    const totalAnswered = currentQuestionIndex + 1;
    const accuracy = Math.round((quizScore / totalAnswered) * 100);
    const metMin12 = totalAnswered >= 12;
    const passed85 = accuracy >= 85;

    // Requirement: Generate questions until 85% passing rate is reached, with a minimum of 12 questions
    if (!metMin12 || !passed85) {
      if (currentQuestionIndex + 1 >= currentQuestions.length) {
        setIsLoadingNextQuestion(true);
        try {
          const existingIds = new Set(currentQuestions.map((q) => q.id));
          const nextQ = shuffleQuestionOptions(
            await EducationalContentService.generateDynamicQuestion(
              activeCourse?.title || 'Biology',
              activeCourse?.id || 'biology',
              existingIds,
              missedQuestions
            )
          );
          setCurrentQuestions((prev) => [...prev, nextQ]);
        } finally {
          setIsLoadingNextQuestion(false);
        }
      }
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setAnsweredState(null);
      setTimeRemaining(60);
      setIsTimerPaused(false);
      setIsExplainMoreOpen(false);
      setIsExploreAnswerOpen(false);
      return;
    }

    // If both metMin12 and passed85 are satisfied:
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setAnsweredState(null);
      setTimeRemaining(60);
      setIsTimerPaused(false);
      setIsExplainMoreOpen(false);
      setIsExploreAnswerOpen(false);
      return;
    }

    // Complete the quest with 85%+ passing rate!
    setQuizCompleted(true);

      // Create visual travel animation event towards the next chapter or landmark destination
      if (activeCourse && activeChapter) {
        const fromPct = activeCourse.completedPercentage || 0;
        const totalCh = Math.max(activeCourse.chapters.length, 1);
        const chIndex = activeCourse.chapters.findIndex((c) => c.id === activeChapter.id);
        const nextChapter = chIndex >= 0 && chIndex + 1 < activeCourse.chapters.length ? activeCourse.chapters[chIndex + 1] : null;

        const completedCount = activeCourse.chapters.filter((c) => c.completed || c.id === activeChapter.id).length;
        const newPct = Math.min(100, Math.max(fromPct + 15, Math.round((completedCount / totalCh) * 100)));

        const travelInfo: TravelAnimationEvent = {
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          destinationName: activeCourse.destination?.name || `The Citadel of ${activeCourse.title}`,
          fromChapterTitle: activeChapter.title.split(':')[1] || activeChapter.title,
          toChapterTitle: nextChapter
            ? nextChapter.title.split(':')[1] || nextChapter.title
            : activeCourse.destination?.name || 'Academic Citadel',
          fromPercentage: fromPct,
          toPercentage: newPct,
          timestamp: Date.now(),
        };

        setTravelEvent(travelInfo);

        // Update chapter mastery percentage based on quiz accuracy and check for Subject Expert Badge
        const accuracy = Math.round((quizScore / currentQuestions.length) * 100);
        let courseUnlockedExpert = false;
        const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        setCourses((prev) => {
          const updated = prev.map((c) => {
            if (c.id === activeCourse.id) {
              const updatedChapters = c.chapters.map((ch) => {
                if (ch.id === activeChapter.id) {
                  const newMastery = Math.max(ch.masteryPercentage || 0, accuracy);
                  return {
                    ...ch,
                    completed: true,
                    masteryPercentage: newMastery,
                  };
                }
                return ch;
              });

              // Check if subject qualifies for Expert Badge (chapters have 80%+ mastery)
              const completedChs = updatedChapters.filter((ch) => ch.completed || ch.id === activeChapter.id);
              const highMasteryChs = updatedChapters.filter((ch) => (ch.masteryPercentage || 0) >= 80);
              const qualifiesForExpert = highMasteryChs.length >= 1 && (highMasteryChs.length >= Math.min(2, updatedChapters.length) || (accuracy >= 80 && updatedChapters.length === 1));

              if (qualifiesForExpert && !c.expertBadgeUnlocked) {
                courseUnlockedExpert = true;
              }

              const newExpertStatus = c.expertBadgeUnlocked || qualifiesForExpert;

              return {
                ...c,
                completedPercentage: newPct,
                expertBadgeUnlocked: newExpertStatus,
                expertBadgeDate: c.expertBadgeDate || (newExpertStatus ? todayDate : undefined),
                chapters: updatedChapters,
              };
            }
            return c;
          });
          localStorage.setItem('studyquest_courses_v2', JSON.stringify(updated));
          return updated;
        });

        if (courseUnlockedExpert) {
          setRecentlyUnlockedExpertBadge({
            courseId: activeCourse.id,
            courseTitle: activeCourse.title,
            icon: activeCourse.icon,
            date: todayDate,
          });

          // Also add to Achievements
          setAchievements((prev) => {
            const achTitle = `${activeCourse.title} Expert`;
            if (prev.some((a) => a.title === achTitle)) return prev;
            return [
              ...prev,
              {
                id: `ach-expert-${activeCourse.id}`,
                title: achTitle,
                description: `Achieved 80%+ mastery on chapters in ${activeCourse.title}.`,
                icon: '👑',
                unlocked: true,
                unlockedDate: todayDate,
              },
            ];
          });
        }
      }

      setProfile((prev) => ({
        ...prev,
        chaptersCompleted: prev.chaptersCompleted + 1,
        clepReadiness: Math.min(80, prev.clepReadiness + 1),
      }));
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOptionIndex(null);
      setAnsweredState(null);
      setTimeRemaining(60);
      setIsTimerPaused(false);
      setIsExplainMoreOpen(false);
      setIsExploreAnswerOpen(false);
    }
  };

  const openExplainMore = () => {
    if (!currentQuestion) return;
    setActiveExplainData(currentQuestion.explainMore);
    setIsExplainMoreOpen(true);
  };
  const closeExplainMore = () => setIsExplainMoreOpen(false);

  const openExploreAnswer = () => {
    if (!currentQuestion) return;
    setActiveExploreData(currentQuestion.exploreAnswer);
    setIsExploreAnswerOpen(true);
  };
  const closeExploreAnswer = () => setIsExploreAnswerOpen(false);

  const exitQuiz = () => {
    setActiveView('map');
  };

  return (
    <StudyQuestContext.Provider
      value={{
        courses,
        activeCourse,
        activeChapter,
        activeView,
        profile,
        achievements,
        selectedRouteId,
        travelEvent,
        clearTravelEvent,
        recentlyUnlockedExpertBadge,
        clearExpertBadgeCelebration,
        isUploadModalOpen,
        isCourseModalOpen,
        isStreakModalOpen,
        isAchievementsModalOpen,
        isCourseEditorModalOpen,
        isNewQuestModalOpen,
        editingCourse,
        currentQuestions,
        currentQuestionIndex,
        currentQuestion,
        selectedOptionIndex,
        answeredState,
        quizScore,
        quizCompleted,
        missedQuestions,
        targetPassingRate,
        minRequiredQuestions,
        isLoadingNextQuestion,
        timerMode,
        setTimerMode,
        timeRemaining,
        isTimerPaused,
        togglePauseTimer,
        isExplainMoreOpen,
        isExploreAnswerOpen,
        activeExplainData,
        activeExploreData,
        setActiveView,
        setActiveCourse,
        setActiveChapter,
        setSelectedRouteId,
        openCourseModal,
        closeCourseModal,
        openUploadModal,
        closeUploadModal,
        openStreakModal,
        closeStreakModal,
        openAchievementsModal,
        closeAchievementsModal,
        openCourseEditor,
        closeCourseEditor,
        openNewQuestModal,
        closeNewQuestModal,
        addCourse,
        updateCourse,
        deleteCourse,
        addNewChapterToCourse,
        startTrivia,
        startQuickSprint,
        selectOption,
        submitCurrentAnswer,
        nextQuestion,
        prevQuestion,
        openExplainMore,
        closeExplainMore,
        openExploreAnswer,
        closeExploreAnswer,
        exitQuiz,
      }}
    >
      {children}
    </StudyQuestContext.Provider>
  );
};

export const useStudyQuest = () => {
  const context = useContext(StudyQuestContext);
  if (!context) {
    throw new Error('useStudyQuest must be used within a StudyQuestProvider');
  }
  return context;
};
