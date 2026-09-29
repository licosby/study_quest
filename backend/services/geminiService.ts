import { GoogleGenAI } from '@google/genai';
import { Chapter, Question, AudioQuestion, KeyConcept, VocabularyItem, GrammarRule, DialogueItem, MnemonicItem, SubjectType } from '../models/types.js';

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface ExtractedChapterContent {
  title: string;
  subject: SubjectType;
  category: string;
  description: string;
  summary: string;
  keyConcepts: KeyConcept[];
  vocabulary: VocabularyItem[];
  grammarRules: GrammarRule[];
  dialogues: DialogueItem[];
  mnemonics: MnemonicItem[];
  questions: Question[];
  audioQuestions: AudioQuestion[];
}

export async function processChapterWithGemini(
  rawText: string,
  suggestedTitle?: string,
  suggestedSubject?: SubjectType
): Promise<ExtractedChapterContent> {
  const ai = getGeminiClient();

  if (!ai) {
    return fallbackExtraction(rawText, suggestedTitle, suggestedSubject);
  }

  const prompt = `You are the core analysis engine for Study Quest, an academic study app designed for CLEP exams and college courses.
The user has uploaded a textbook chapter or notes. Your task is to perform an exhaustive, high-yield academic extraction.

Subject Hint: ${suggestedSubject || 'Infer from text (Spanish, Biology, US History, Psychology, Microeconomics, or General)'}
Title Hint: ${suggestedTitle || 'Infer from text'}

CRITICAL LEARNING MODEL RULES:
1. Everything must be 100% multiple-choice (4 choices: options array of 4 items, correctIndex 0-3).
2. NO fill-in-the-blanks, NO flashcards, NO drag-and-drop.
3. Every question MUST include:
   - "explainMore" (used BEFORE answering: summary of what question asks, exact snippet from text, simplified explanation, hint, mnemonic)
   - "exploreAnswer" (used AFTER answering: exact paragraph from text, paragraph summary, whyCorrect, whyWrong array with explanation for all 4 choices, mnemonic)
4. Mnemonic Engine: Generate memorable, catchy mnemonic devices (e.g. "If the p is low, the null must go", "Mito = Might = Powerhouse", "WEIRDOS", "OIL RIG").
5. Audio Comprehension: Generate 2-3 native-speed audio dialogue or lecture comprehension questions (100% multiple choice) with Spanish/foreign language audio prompt or English lecture prompt.

Uploaded Textbook Text:
"""
${rawText.slice(0, 15000)}
"""

Respond ONLY with valid JSON conforming to this structure:
{
  "title": "string",
  "subject": "Spanish | Biology | US History | Psychology | Microeconomics | General",
  "category": "string",
  "description": "string (1-2 sentences)",
  "summary": "string (comprehensive academic summary)",
  "keyConcepts": [
    {
      "term": "string",
      "definition": "string",
      "exactParagraph": "string",
      "mnemonic": "string"
    }
  ],
  "vocabulary": [
    {
      "word": "string",
      "definition": "string",
      "contextSentence": "string",
      "mnemonic": "string"
    }
  ],
  "grammarRules": [
    {
      "rule": "string",
      "explanation": "string",
      "example": "string",
      "mnemonic": "string"
    }
  ],
  "dialogues": [
    {
      "id": "string",
      "title": "string",
      "speakers": ["string", "string"],
      "lines": [
        {
          "speaker": "string",
          "text": "string",
          "translation": "string"
        }
      ]
    }
  ],
  "mnemonics": [
    {
      "id": "string",
      "target": "string",
      "phrase": "string",
      "explanation": "string",
      "subject": "string"
    }
  ],
  "questions": [
    {
      "id": "string",
      "chapterId": "string",
      "type": "concept | vocabulary | grammar | reading | history",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "difficulty": "easy | medium | hard",
      "explainMore": {
        "summaryOfQuestion": "string",
        "exactTextSnippet": "string",
        "simplifiedExplanation": "string",
        "hint": "string",
        "mnemonic": "string"
      },
      "exploreAnswer": {
        "exactParagraph": "string",
        "paragraphSummary": "string",
        "whyCorrect": "string",
        "whyWrong": ["string", "string", "string", "string"],
        "mnemonic": "string"
      }
    }
  ],
  "audioQuestions": [
    {
      "id": "string",
      "chapterId": "string",
      "language": "Spanish | French | German",
      "audioPrompt": "string (the natural dialogue or lecture to be spoken aloud)",
      "audioTranscript": "string",
      "question": "string (comprehension question based on the audio)",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "difficulty": "easy | medium | hard",
      "speaker": "string",
      "dialogueContext": "string",
      "explainMore": {
        "summaryOfQuestion": "string",
        "exactTextSnippet": "string",
        "simplifiedExplanation": "string",
        "hint": "string",
        "mnemonic": "string"
      },
      "exploreAnswer": {
        "exactParagraph": "string",
        "paragraphSummary": "string",
        "whyCorrect": "string",
        "whyWrong": ["string", "string", "string", "string"],
        "mnemonic": "string"
      }
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.questions || parsed.questions.length === 0) {
      return fallbackExtraction(rawText, suggestedTitle, suggestedSubject);
    }
    return parsed;
  } catch (err) {
    console.error('Gemini extraction failed, using fallback:', err);
    return fallbackExtraction(rawText, suggestedTitle, suggestedSubject);
  }
}

export async function generateSpeechAudio(text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Kore'): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Clear, natural speed academic speaker',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.warn('Gemini TTS generation error:', error);
    return null;
  }
}

export async function generateMnemonicForTerm(term: string, context: string, subject: string): Promise<{ phrase: string; explanation: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      phrase: `Remember ${term}: The Key to Success!`,
      explanation: `Associate ${term} with its core function: ${context.slice(0, 100)}`,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create an unforgettable, clever, and catchy mnemonic device for the academic term "${term}" in ${subject}.
Context: "${context}"
Return JSON:
{
  "phrase": "Clever catchy rhyme or acronym",
  "explanation": "Why this mnemonic helps remember the concept"
}`,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
      phrase: `Remember ${term}!`,
      explanation: context.slice(0, 120),
    };
  }
}

function fallbackExtraction(
  rawText: string,
  suggestedTitle?: string,
  suggestedSubject?: SubjectType
): ExtractedChapterContent {
  const isSpanish = /el |la |los |las |que |en |de |por |para |aeropuerto|español/i.test(rawText);
  const isBiology = /cell|mitochondria|atp|respiration|dna|biology|organism/i.test(rawText);
  const isHistory = /constitution|rebellion|war|congress|president|amendment|treaty/i.test(rawText);

  let detectedSubject: SubjectType = suggestedSubject || 'General';
  if (!suggestedSubject) {
    if (isSpanish) detectedSubject = 'Spanish';
    else if (isBiology) detectedSubject = 'Biology';
    else if (isHistory) detectedSubject = 'US History';
  }

  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const title = suggestedTitle || lines[0]?.slice(0, 60) || 'Uploaded Textbook Chapter';

  return {
    title,
    subject: detectedSubject,
    category: `CLEP & College Course in ${detectedSubject}`,
    description: `Academic synthesis of ${title}, covering key definitions, reading comprehension, and CLEP-aligned multiple choice questions.`,
    summary: rawText.slice(0, 600) + '...',
    keyConcepts: [
      {
        term: 'Core Subject Thesis',
        definition: 'The primary theoretical framework presented in this section.',
        exactParagraph: rawText.slice(0, 200),
        mnemonic: 'Focus First on the Foundation.'
      },
      {
        term: 'Applied Mechanism',
        definition: 'The operational procedure or contextual application detailed in the text.',
        exactParagraph: rawText.slice(200, 400) || rawText.slice(0, 200),
        mnemonic: 'Mechanism Moves the Meaning.'
      }
    ],
    vocabulary: [
      {
        word: 'Primary Term',
        definition: 'Crucial academic terminology highlighted in the chapter.',
        contextSentence: rawText.slice(0, 100),
        mnemonic: 'Link sound to image!'
      }
    ],
    grammarRules: detectedSubject === 'Spanish' ? [
      {
        rule: 'Subjunctive Influence Rule',
        explanation: 'Verbs of command, influence, or wish require the subjunctive when subjects change.',
        example: 'Recomiendo que estudies con constancia.',
        mnemonic: 'Different Subjects + "Que" = Subjunctive Mood'
      }
    ] : [],
    dialogues: detectedSubject === 'Spanish' ? [
      {
        id: `dial-${Date.now()}`,
        title: 'Diálogo de Comprensión Práctica',
        speakers: ['Profesor', 'Estudiante'],
        lines: [
          { speaker: 'Profesor', text: '¿Comprende la importancia de este concepto?', translation: 'Do you understand the importance of this concept?' },
          { speaker: 'Estudiante', text: 'Sí, profesor. He tomado notas detalladas para el examen.', translation: 'Yes, professor. I have taken detailed notes for the exam.' }
        ]
      }
    ] : [],
    mnemonics: [
      {
        id: `mnem-${Date.now()}-1`,
        target: 'Chapter Anchor',
        phrase: 'Connect, Recall, Dominate the Exam!',
        explanation: 'Transforming passive reading into active 100% multiple-choice recall cements long-term memory.',
        subject: detectedSubject
      }
    ],
    questions: [
      {
        id: `q-${Date.now()}-1`,
        chapterId: 'uploaded-ch',
        type: 'concept',
        question: `Based on the uploaded chapter "${title}", what is the central premise established by the text?`,
        options: [
          'The fundamental conceptual framework and its analytical implications',
          'A superficial overview with no systematic application',
          'A historical rejection of all experimental methodology',
          'An irrelevant discussion unrelated to academic evaluation'
        ],
        correctIndex: 0,
        difficulty: 'medium',
        explainMore: {
          summaryOfQuestion: 'The question evaluates the main argument outlined in the opening section of the text.',
          exactTextSnippet: rawText.slice(0, 180),
          simplifiedExplanation: 'The author establishes the primary conceptual foundation right away.',
          hint: 'Look for the option describing the core analytical framework.',
          mnemonic: 'Main Idea = First Principle.'
        },
        exploreAnswer: {
          exactParagraph: rawText.slice(0, 250),
          paragraphSummary: 'The introductory section establishes the academic principles governing this topic.',
          whyCorrect: 'The text directly introduces this foundational framework as its primary thesis.',
          whyWrong: [
            'CORRECT CHOICE.',
            'The text provides detailed systematic treatment, not a superficial overview.',
            'No rejection of methodology is stated.',
            'The material is directly relevant to standard exam objectives.'
          ],
          mnemonic: 'Thesis = Target.'
        }
      },
      {
        id: `q-${Date.now()}-2`,
        chapterId: 'uploaded-ch',
        type: 'vocabulary',
        question: 'How does the author characterize the key mechanisms discussed in this chapter?',
        options: [
          'As outdated and obsolete concepts',
          'As structured, interrelated processes with concrete applications',
          'As random events with no discernible pattern',
          'As purely fictional theoretical constructs'
        ],
        correctIndex: 1,
        difficulty: 'easy',
        explainMore: {
          summaryOfQuestion: 'Identify how the mechanisms in the text are classified.',
          exactTextSnippet: rawText.slice(100, 300) || rawText.slice(0, 150),
          simplifiedExplanation: 'The text describes these concepts as interconnected mechanisms.',
          hint: 'Select the choice highlighting structured processes.',
          mnemonic: 'Order and structure prevail.'
        },
        exploreAnswer: {
          exactParagraph: rawText.slice(100, 300) || rawText.slice(0, 150),
          paragraphSummary: 'The mechanisms function as an organized system.',
          whyCorrect: 'The author emphasizes systemic organization and real-world applicability.',
          whyWrong: [
            'The concepts are presented as current, not obsolete.',
            'CORRECT CHOICE.',
            'The processes follow strict logical patterns, not randomness.',
            'They are empirical and academic, not fictional.'
          ],
          mnemonic: 'Structure = Strength.'
        }
      }
    ],
    audioQuestions: [
      {
        id: `aq-${Date.now()}-1`,
        chapterId: 'uploaded-ch',
        language: detectedSubject === 'Spanish' ? 'Spanish' : 'Spanish',
        audioPrompt: detectedSubject === 'Spanish'
          ? 'Profesor: "Es imprescindible que los estudiantes repasen los conceptos clave antes de la prueba final."'
          : 'Instructor: "Keep in mind that high-yield recall requires active multiple-choice practice rather than passive re-reading."',
        audioTranscript: detectedSubject === 'Spanish'
          ? 'Profesor: "Es imprescindible que los estudiantes repasen los conceptos clave antes de la prueba final."'
          : 'Instructor: "Keep in mind that high-yield recall requires active multiple-choice practice rather than passive re-reading."',
        question: detectedSubject === 'Spanish'
          ? '¿Qué recomienda enfáticamente el profesor a los estudiantes?'
          : 'What does the instructor emphasize regarding study methodology?',
        options: detectedSubject === 'Spanish' ? [
          'Que descansen sin leer los libros',
          'Que repasen los conceptos clave antes de la prueba',
          'Que cancelen su inscripción al curso',
          'Que escriban ensayos de diez páginas'
        ] : [
          'Passive reading is superior to active testing',
          'Active multiple-choice retrieval practice leads to high-yield recall',
          'Students should memorize without understanding',
          'All exams should be completed without preparation'
        ],
        correctIndex: 1,
        difficulty: 'medium',
        speaker: 'Academic Instructor',
        dialogueContext: 'Audio comprehension listening drill',
        explainMore: {
          summaryOfQuestion: 'Determine the main instruction delivered in the audio clip.',
          exactTextSnippet: detectedSubject === 'Spanish'
            ? 'Es imprescindible que los estudiantes repasen los conceptos clave'
            : 'active multiple-choice practice rather than passive re-reading',
          simplifiedExplanation: 'The speaker advises targeted review and active practice.',
          hint: 'Listen for the core recommendation.',
          mnemonic: 'Active Practice Wins.'
        },
        exploreAnswer: {
          exactParagraph: 'Textbook dialogue audio segment',
          paragraphSummary: 'The instructor advises focused study behavior for upcoming assessments.',
          whyCorrect: 'Option 2 directly quotes the speaker’s instruction.',
          whyWrong: [
            'Contradicts the speaker’s advice.',
            'CORRECT CHOICE.',
            'Not mentioned in the audio.',
            'Irrelevant to the prompt.'
          ],
          mnemonic: 'Listen & Pick the Core Fact.'
        }
      }
    ]
  };
}
