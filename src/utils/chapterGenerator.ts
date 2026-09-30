import { Chapter, KeyConcept, VocabularyItem, Question, QuestionDiagram } from '../types/quest.js';

interface GenerateChapterOptions {
  title: string;
  text: string;
  courseId: string;
  courseTitle?: string;
  chapterNumber?: number;
}

export function generateChapterFromText(options: GenerateChapterOptions): Chapter {
  const { title, text, courseId, courseTitle = 'Subject', chapterNumber = 1 } = options;
  const cleanText = text.trim();
  const chapterId = `chapter-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Break text into paragraphs
  const paragraphs = cleanText
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 25);

  const primaryParagraph = paragraphs[0] || cleanText.substring(0, 300);
  const secondaryParagraph = paragraphs[1] || primaryParagraph;

  // Extract candidate sentences for concepts and questions
  const sentences = cleanText
    .replace(/--- Page \d+ ---/g, '')
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 250);

  // 1. Synthesize Summary
  const summaryParagraphs = paragraphs.slice(0, 3).join(' ');
  const summary =
    summaryParagraphs.length > 320
      ? summaryParagraphs.substring(0, 320) + '...'
      : summaryParagraphs || `Comprehensive academic overview of ${title}.`;

  // 2. Synthesize Key Concepts
  const keyConcepts: KeyConcept[] = [];
  const conceptCandidates = sentences.slice(0, 4);

  if (conceptCandidates.length > 0) {
    conceptCandidates.forEach((sent, idx) => {
      // Pick key words or first clause
      const words = sent.split(' ');
      const candidateTerm = words.slice(0, 3).join(' ').replace(/[^\w\s]/gi, '');
      keyConcepts.push({
        term: candidateTerm || `Core Concept ${idx + 1}`,
        definition: sent,
        exactParagraph: primaryParagraph,
        mnemonic: `Remember ${candidateTerm}: Key to mastering ${title}!`,
        mnemonicExplanation: `Anchors the conceptual relationship described in the chapter text.`,
      });
    });
  } else {
    keyConcepts.push({
      term: title,
      definition: cleanText.substring(0, 150),
      exactParagraph: primaryParagraph,
      mnemonic: `Master the Foundation First!`,
      mnemonicExplanation: `Anchors core terms before taking the trivia quiz.`,
    });
  }

  // 3. Synthesize Vocabulary
  const vocabulary: VocabularyItem[] = [];
  const wordsInText = cleanText.match(/\b[A-Z][a-z]{4,}\b|\b[a-z]{6,}\b/g) || [];
  const uniqueWords = Array.from(new Set(wordsInText)).slice(0, 4);

  uniqueWords.forEach((word) => {
    const matchingSentence = sentences.find((s) => s.toLowerCase().includes(word.toLowerCase())) || `Essential term in ${title}.`;
    vocabulary.push({
      word,
      definition: `Fundamental concept or terminology utilized in ${title}.`,
      contextSentence: matchingSentence,
      mnemonic: `${word}: Remember its function in this context!`,
    });
  });

  // 4. Synthesize Catchy Rhyming / Acronym Mnemonics
  const mnemonics = [
    {
      id: `m-${Date.now()}-1`,
      target: title,
      phrase: `Read the Line, Anchor the Sign, Exam Victory is Thine!`,
      rhymeOrAcronym: `Rhyme: Sign with Thine: Connect key chapter statements to retrieval cues.`,
      explanation: `By rhyming the core focus with its real-world function, your brain encodes the material much faster.`,
    },
    {
      id: `m-${Date.now()}-2`,
      target: keyConcepts[0]?.term || 'Core Mechanism',
      phrase: `F-A-C-T-S: Focus, Anchor, Connect, Test, Succeed!`,
      rhymeOrAcronym: `Acronym: F-A-C-T-S: The active retrieval method for textbook mastery.`,
      explanation: `Using the FACTS framework turns passive textbook reading into active test recall.`,
    },
  ];

  // 5. Subject Classification: Strictly isolate History vs Biology vs Ethics vs General
  const lowerMeta = `${courseId} ${courseTitle} ${title}`.toLowerCase();
  const isHistory = /history|government|constitution|congress|parliament|civics|war|president|treaty|rebellion|revolution|colonial|federal|legislat|amendment|confederation|monarchy|republic|democracy|frontier|statesman|declaration/i.test(lowerMeta);
  const isEthicsOrLaw = /ethics|law|legal|moral|kant|justice|philosophy|virtue/i.test(lowerMeta);
  const isLanguage = /spanish|french|german|grammar|dialogue|vocab/i.test(lowerMeta);

  // Biology is ONLY recognized if courseTitle/courseId explicitly references biology AND it is NOT a history/humanities subject
  const isExplicitBiologyCourse =
    !isHistory &&
    !isEthicsOrLaw &&
    (courseId === 'biology' || /biology|biochemistry|microbiology|cellular/i.test(courseTitle));

  // 6. Attach science diagrams ONLY for bona fide cellular biology courses with explicit organelle text
  let diagram1: QuestionDiagram | undefined;
  if (isExplicitBiologyCourse) {
    if (/\b(mitochondri|cristae|cellular respiration|atp synthase)\b/i.test(cleanText)) {
      diagram1 = {
        type: 'mitochondria',
        title: 'Mitochondrial Inner Membrane Architecture',
        caption: 'Marker [A] highlights the deep cristae infoldings where ATP synthesis occurs.',
        markedPoint: 'Marker [A]',
        targetName: 'Inner Mitochondrial Membrane (Cristae)',
      };
    } else if (/\b(chloroplast|thylakoid|photosynthesis|grana|stroma)\b/i.test(cleanText)) {
      diagram1 = {
        type: 'chloroplast',
        title: 'Chloroplast Thylakoid Architecture',
        caption: 'Marker [A] points to the thylakoid grana stacks responsible for light reactions.',
        markedPoint: 'Marker [A]',
        targetName: 'Thylakoid Grana',
      };
    } else if (/\b(eukaryotic|organelle|nucleus|cytoplasm)\b/i.test(cleanText)) {
      diagram1 = {
        type: 'cell',
        title: 'Eukaryotic Cell Organelle Anatomy',
        caption: 'Marker [A] points to the double-membraned organelle producing cellular energy.',
        markedPoint: 'Marker [A]',
        targetName: 'Mitochondrion',
      };
    }
  }

  // 7. Synthesize 100% Multiple Choice Questions from the text
  const questions: Question[] = [];

  // Question 1: Based on primary sentence / paragraph
  const q1Sentence = sentences[0] || cleanText.substring(0, 120);
  const q1Words = q1Sentence.split(' ');
  const q1Focus = q1Words.slice(0, 5).join(' ');

  let q1QuestionText = '';
  let q1Distractors: [string, string, string];

  if (diagram1) {
    q1QuestionText = `Examine the biological diagram below. Which key structure indicated by ${diagram1.markedPoint} plays the central role discussed in "${title}"?`;
    q1Distractors = [
      'Outer Plasma Membrane phospholipid bilayer',
      'Endoplasmic Reticulum protein export vesicles',
      'Ribosomal Large Subunit translation complex',
    ];
  } else if (isHistory) {
    q1QuestionText = `Based on the historical record in "${title}", which key principle or development regarding "${q1Focus}..." is accurately established?`;
    q1Distractors = [
      'The development occurred without any preceding political tension, economic crisis, or governance dispute',
      'The historical outcome produced no lasting constitutional, institutional, or societal consequence',
      'The recorded outcome is strictly the opposite of what primary documentary sources establish',
    ];
  } else if (isEthicsOrLaw) {
    q1QuestionText = `In the philosophical analysis of "${title}", which ethical doctrine or premise regarding "${q1Focus}..." is upheld?`;
    q1Distractors = [
      'The moral agents acted solely on arbitrary impulse without normative justification',
      'The argument asserts that ethical duties are entirely relative and carry no binding obligation',
      'The conclusion dismisses all philosophical reasoning in favor of pure skepticism',
    ];
  } else {
    q1QuestionText = `According to the chapter text in "${title}", what is the central principle regarding "${q1Focus}..."?`;
    q1Distractors = [
      'It operates independently of any surrounding contextual mechanisms',
      'It completely eliminates the necessity for empirical verification or evidence',
      'It serves solely as an ornamental term with no functional impact',
    ];
  }

  questions.push({
    id: `q-${Date.now()}-1`,
    chapterId,
    courseId,
    type: diagram1 ? 'diagram' : 'concept',
    question: q1QuestionText,
    options: [
      q1Sentence.length > 100 ? q1Sentence.substring(0, 95) + '...' : q1Sentence,
      q1Distractors[0],
      q1Distractors[1],
      q1Distractors[2],
    ],
    correctIndex: 0,
    difficulty: 'easy',
    diagram: diagram1,
    explainMore: {
      summaryOfQuestion: `Identifies the core assertion established in "${title}".`,
      fullSectionHeading: `${isHistory ? 'Historical Foundations' : 'Core Principles'}: ${title}`,
      exactTextSnippet: q1Sentence,
      deepContextualBreakdown: `The chapter directly establishes this principle as the bedrock for understanding related events and mechanisms. Analyzing this relationship is critical for mastery.`,
      simplifiedExplanation: `The text highlights this principle as the primary takeaway of the opening section.`,
      hint: `Look for the statement directly stated in the text.`,
      mnemonic: {
        hook: `Know the Core, Score More: Text Facts Open the Door!`,
        rhymeOrAcronymExplanation: `Rhymes Core with Door: Focus on foundational assertions.`,
        whyItWorks: `Anchors the main thesis in long-term memory.`,
      },
    },
    exploreAnswer: {
      exactParagraph: primaryParagraph,
      paragraphSummary: `Establishes the foundational context and analytical framework.`,
      whyCorrect: `The text explicitly states: "${q1Sentence.substring(0, 100)}..."`,
      whyWrong: [
        `CORRECT CHOICE.`,
        `Incorrect: Contradicts the documented evidence in the chapter text.`,
        `Incorrect: The phenomenon carried direct and lasting significance.`,
        `Incorrect: Academic sources directly support the primary conclusion.`,
      ],
      mnemonic: {
        hook: `Statement in Text = Correct and Best!`,
        rhymeOrAcronymExplanation: `Textual match gives 100% confidence.`,
        whyItWorks: `Prevents second-guessing on reading-comprehension questions.`,
      },
    },
  });

  // Question 2: Based on secondary sentence / key concept
  const q2Sentence = sentences[1] || sentences[0] || 'Key operational mechanism in the text.';
  const q2Words = q2Sentence.split(' ');
  const q2Focus = q2Words.slice(0, 5).join(' ');

  let q2QuestionText = '';
  let q2Distractors: [string, string, string];

  if (isHistory) {
    q2QuestionText = `According to "${title}", how did key participants or institutional structures respond to the events surrounding "${q2Focus}..."?`;
    q2Distractors = [
      'All participants unconditionally disbanded without enacting any political or legal measures',
      'The governing authorities permanently repealed all constitutional and legal charters',
      'No contemporary records or witnesses noted any response to this development',
    ];
  } else if (isEthicsOrLaw) {
    q2QuestionText = `Which analytical distinction is emphasized in "${title}" regarding "${q2Focus}..."?`;
    q2Distractors = [
      'The principle applies only in hypothetical scenarios with no real-world relevance',
      'All ethical considerations are considered invalid and discarded',
      'Moral action is determined exclusively by random unprincipled chance',
    ];
  } else {
    q2QuestionText = `Which statement accurately reflects the analysis presented in "${title}" regarding "${q2Focus}..."?`;
    q2Distractors = [
      'The mechanism is universally random without governing rules',
      'The outcome is strictly opposed to what the text observes',
      'No further inquiry or application is ever permitted in this field',
    ];
  }

  questions.push({
    id: `q-${Date.now()}-2`,
    chapterId,
    courseId,
    type: 'concept',
    question: q2QuestionText,
    options: [
      q2Distractors[0],
      q2Sentence.length > 100 ? q2Sentence.substring(0, 95) + '...' : q2Sentence,
      q2Distractors[1],
      q2Distractors[2],
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explainMore: {
      summaryOfQuestion: `Evaluates comprehension of the secondary concepts discussed in the chapter.`,
      fullSectionHeading: `Section 1.2: Deep Conceptual Analysis`,
      exactTextSnippet: q2Sentence,
      deepContextualBreakdown: `The author provides this specific analytical distinction to prevent confusing the primary mechanism with secondary effects.`,
      simplifiedExplanation: `This concept explains how the elements interact and produce observable results.`,
      hint: `Recall the supporting argument from the second part of the excerpt.`,
      mnemonic: {
        hook: `Link the Cause to the Effect: Get Your Answers All Correct!`,
        rhymeOrAcronymExplanation: `Rhymes Effect with Correct: Identify causal chains in the chapter.`,
        whyItWorks: `Strengthens logical deduction on CLEP-style questions.`,
      },
    },
    exploreAnswer: {
      exactParagraph: secondaryParagraph,
      paragraphSummary: `Explains the analytical reasoning and core interactions.`,
      whyCorrect: `Directly supported by the chapter text: "${q2Sentence.substring(0, 100)}..."`,
      whyWrong: [
        `Incorrect: Contradicts the documented evidence in the chapter text.`,
        `CORRECT CHOICE.`,
        `Incorrect: Directly contradicts the evidence provided.`,
        `Incorrect: Inquiry and analysis continue to build upon this foundation.`,
      ],
    },
  });

  // Question 3: Synthesis question
  const q3Sentence = sentences[2] || sentences[0] || 'Synthesized conclusion of the text.';
  let q3QuestionText = '';
  let q3Distractors: [string, string, string];

  if (isHistory) {
    q3QuestionText = `What major historical conclusion or institutional precedent emerges from "${title}"?`;
    q3Distractors = [
      'All previously established constitutional precedents were dissolved permanently',
      'The crisis had zero influence on the drafting of future laws or national policy',
      'The events proved that sovereign government authority cannot exist in human society',
    ];
  } else if (isEthicsOrLaw) {
    q3QuestionText = `What overarching philosophical conclusion is synthesized in "${title}"?`;
    q3Distractors = [
      'Reasoning provides no guidance for human moral decision-making',
      'The dilemma was deemed completely unsolvable by any ethical system',
      'Personal whim is recognized as the only standard of justice',
    ];
  } else {
    q3QuestionText = `What primary conclusion or practical application follows from the text in "${title}"?`;
    q3Distractors = [
      'All previously established principles must be discarded',
      'The findings apply only in fictional scenarios',
      'Measurement is impossible in this subject area',
    ];
  }

  questions.push({
    id: `q-${Date.now()}-3`,
    chapterId,
    courseId,
    type: 'concept',
    question: q3QuestionText,
    options: [
      q3Distractors[0],
      q3Distractors[1],
      q3Sentence.length > 100 ? q3Sentence.substring(0, 95) + '...' : q3Sentence,
      q3Distractors[2],
    ],
    correctIndex: 2,
    difficulty: 'medium',
    explainMore: {
      summaryOfQuestion: `Assesses overall synthesis of the chapter's implications.`,
      fullSectionHeading: `Section 1.3: Synthesis and Application`,
      exactTextSnippet: q3Sentence,
      deepContextualBreakdown: `This concluding insight connects theoretical concepts to empirical application and problem-solving.`,
      simplifiedExplanation: `Applying this principle allows you to solve advanced scenario-based questions.`,
      hint: `Think about what conclusion ties the entire chapter together.`,
      mnemonic: {
        hook: `Synthesize to Realize: See the Truth Before Your Eyes!`,
        rhymeOrAcronymExplanation: `Rhymes Realize with Eyes: Look at the overarching theme of the text.`,
        whyItWorks: `Encourages holistic understanding rather than rote memorization.`,
      },
    },
    exploreAnswer: {
      exactParagraph: paragraphs[paragraphs.length - 1] || primaryParagraph,
      paragraphSummary: `Synthesizes the overarching conclusions of the chapter.`,
      whyCorrect: `Directly backed by the text conclusion: "${q3Sentence.substring(0, 100)}..."`,
      whyWrong: [
        `Incorrect: The chapter builds on past foundations rather than discarding them.`,
        `Incorrect: The findings apply to real-world academic phenomena.`,
        `CORRECT CHOICE.`,
        `Incorrect: Precision measurement and verification are emphasized throughout.`,
      ],
    },
  });

  return {
    id: chapterId,
    courseId,
    title,
    chapterNumber,
    completed: false,
    masteryPercentage: 0,
    description: summary.substring(0, 120) + '...',
    rawText: cleanText,
    summary,
    keyConcepts,
    vocabulary,
    mnemonics,
    questions,
    audioQuestions: [],
  };
}
