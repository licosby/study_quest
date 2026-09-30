import { Question, AudioQuestion } from '../types/quest.js';

/**
 * Shuffles the 4 options of a multiple choice question using Fisher-Yates,
 * calculates the new correctIndex, and updates whyWrong explanations to match the new option order.
 * Guarantees that correct answers are uniformly distributed across A, B, C, and D (indices 0, 1, 2, 3).
 */
export function shuffleQuestionOptions<T extends Question | AudioQuestion>(q: T): T {
  if (!q.options || q.options.length !== 4) return q;

  const originalOptions = [...q.options];
  const correctText = originalOptions[q.correctIndex];
  const oldWhyWrong = q.exploreAnswer?.whyWrong;

  // Build mapping from option text to its whyWrong explanation
  const explanationMap = new Map<string, string>();
  if (oldWhyWrong && oldWhyWrong.length === 4) {
    originalOptions.forEach((opt, idx) => {
      explanationMap.set(opt, oldWhyWrong[idx]);
    });
  }

  // Permute [0, 1, 2, 3] with Fisher-Yates
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Form newly randomized options
  const newOptions = indices.map((idx) => originalOptions[idx]) as [string, string, string, string];
  const newCorrectIndex = newOptions.indexOf(correctText);

  // Form matching whyWrong explanations
  const newWhyWrong = newOptions.map((opt, i) => {
    if (i === newCorrectIndex) {
      return 'CORRECT CHOICE.';
    }
    return explanationMap.get(opt) || `${opt} is not the correct response for this concept.`;
  }) as [string, string, string, string];

  return {
    ...q,
    options: newOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    exploreAnswer: q.exploreAnswer
      ? {
          ...q.exploreAnswer,
          whyWrong: newWhyWrong,
        }
      : q.exploreAnswer,
  };
}
