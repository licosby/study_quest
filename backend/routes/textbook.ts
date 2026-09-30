import { Router, Request, Response } from 'express';

const router = Router();

// Ingest from Open Textbook APIs (Wikibooks, Gutendex, or Free Dictionary)
router.post('/ingest', async (req: Request, res: Response) => {
  try {
    const { source, title, query } = req.body;

    if (source === 'wikibooks') {
      const bookTitle = query || title || 'US_History';
      // First try direct extract
      let apiUrl = `https://en.wikibooks.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(
        bookTitle
      )}&format=json&origin=*`;

      let response = await fetch(apiUrl);
      let data: any = await response.json();
      let pages = data?.query?.pages || {};
      let pageId = Object.keys(pages)[0];

      // If not found directly, perform a search query
      if (!pageId || pageId === '-1') {
        const searchUrl = `https://en.wikibooks.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
          bookTitle
        )}&gsrlimit=1&prop=extracts&explaintext=1&format=json&origin=*`;
        response = await fetch(searchUrl);
        data = await response.json();
        pages = data?.query?.pages || {};
        pageId = Object.keys(pages)[0];
      }

      if (!pageId || pageId === '-1') {
        return res.status(404).json({ error: `No Wikibooks article found for "${bookTitle}"` });
      }

      const rawExtract = pages[pageId]?.extract || '';
      return res.json({
        success: true,
        source: 'wikibooks',
        title: pages[pageId]?.title || bookTitle,
        content: rawExtract.slice(0, 30000), // Return clean parsed text
      });
    }

    if (source === 'gutendex') {
      const searchUrl = `https://gutendex.com/books/?search=${encodeURIComponent(query || title || 'history')}`;
      const response = await fetch(searchUrl);
      if (!response.ok) {
        return res.status(502).json({ error: `Gutendex API responded with status ${response.status}` });
      }

      const data: any = await response.json();
      const book = data?.results?.[0];
      if (!book) {
        return res.status(404).json({ error: 'No matching book found in Project Gutenberg' });
      }

      // Fetch text version
      const textUrl = book.formats?.['text/plain; charset=utf-8'] || book.formats?.['text/plain; charset=us-ascii'];
      if (!textUrl) {
        return res.status(404).json({ error: 'Plain text format not available for this Gutenberg title' });
      }

      const textResponse = await fetch(textUrl);
      const fullText = await textResponse.text();

      // Clean Gutenberg headers/footers
      const startIdx = fullText.indexOf('*** START OF THE PROJECT GUTENBERG');
      const endIdx = fullText.indexOf('*** END OF THE PROJECT GUTENBERG');
      const cleaned = (startIdx !== -1 && endIdx !== -1)
        ? fullText.substring(startIdx + 60, endIdx).trim()
        : fullText.slice(0, 35000);

      return res.json({
        success: true,
        source: 'gutendex',
        title: book.title,
        authors: book.authors?.map((a: any) => a.name).join(', '),
        content: cleaned.slice(0, 30000),
      });
    }

    if (source === 'wiktionary' || source === 'dictionary') {
      const word = query || title || 'monopoly';
      const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
      const response = await fetch(dictUrl);
      if (!response.ok) {
        return res.status(404).json({ error: `Word definition not found for "${word}"` });
      }

      const entries: any = await response.json();
      const first = entries[0];
      const meanings = first?.meanings?.map((m: any) => ({
        partOfSpeech: m.partOfSpeech,
        definition: m.definitions?.[0]?.definition,
        example: m.definitions?.[0]?.example,
      }));

      return res.json({
        success: true,
        source: 'dictionary',
        word: first?.word,
        phonetic: first?.phonetic,
        meanings,
      });
    }

    return res.status(400).json({ error: 'Invalid source. Supported: wikibooks, gutendex, wiktionary' });
  } catch (err: any) {
    console.error('Textbook ingestion error:', err);
    return res.status(500).json({ error: 'Failed to ingest from API source', details: err?.message });
  }
});

// Live question generation using Open APIs (Wikibooks, Wiktionary, Open Library)
router.post('/random-questions', async (req: Request, res: Response) => {
  try {
    const { subject = 'biology', courseId = 'biology', count = 5, chapterTitle = '' } = req.body;

    const subjectTerms: Record<string, string[]> = {
      biology: ['mitochondria', 'chloroplast', 'ribosome', 'enzyme', 'osmosis', 'meiosis', 'glycolysis', 'allele', 'nucleotide', 'homeostasis', 'cytoplasm', 'vacuole', 'fermentation'],
      history: ['constitution', 'amendment', 'federalist', 'monopoly', 'confederation', 'boycott', 'reconstruction', 'homestead', 'sovereignty', 'treaty', 'suffrage', 'nullification'],
      ethics: ['virtue', 'utilitarianism', 'deontology', 'eudaimonia', 'categorical', 'altruism', 'hedonism', 'morality', 'justice', 'consequentialism'],
      spanish: ['aeropuerto', 'pasaporte', 'billete', 'embarque', 'estación', 'equipaje', 'viaje', 'aduana', 'vuelo'],
      general: ['hypothesis', 'empirical', 'variable', 'synthesis', 'correlation', 'paradigm', 'analysis'],
    };

    const key = Object.keys(subjectTerms).find((k) => subject.toLowerCase().includes(k) || courseId.toLowerCase().includes(k)) || 'general';
    const terms = subjectTerms[key] || subjectTerms.general;

    // Shuffle terms and pick
    const selectedTerms = [...terms].sort(() => 0.5 - Math.random()).slice(0, Math.min(count, 8));

    const generatedQuestions: any[] = [];

    // Attempt to fetch definitions from Wiktionary/Dictionary API for real academic questions
    for (const term of selectedTerms) {
      try {
        const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`;
        const dictRes = await fetch(dictUrl, { signal: AbortSignal.timeout(1500) });
        if (dictRes.ok) {
          const dictData: any = await dictRes.json();
          const first = dictData[0];
          const meaning = first?.meanings?.[0]?.definitions?.[0]?.definition;
          const partOfSpeech = first?.meanings?.[0]?.partOfSpeech || 'noun';

          if (meaning && meaning.length > 15) {
            // Find 3 plausible distractors from the other terms
            const otherTerms = terms.filter((t) => t !== term).sort(() => 0.5 - Math.random()).slice(0, 3);
            const rawOptions = [
              term.charAt(0).toUpperCase() + term.slice(1),
              ...otherTerms.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
            ];

            // Shuffle options
            const shuffled = [...rawOptions].sort(() => 0.5 - Math.random());
            const correctIndex = shuffled.indexOf(term.charAt(0).toUpperCase() + term.slice(1));

            generatedQuestions.push({
              id: `api-q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              chapterId: 'api-stream',
              courseId,
              type: 'concept',
              question: `In the study of ${subject}, which academic term is accurately defined as: "${meaning.replace(/\.$/, '')}"?`,
              options: shuffled,
              correctIndex: correctIndex >= 0 ? correctIndex : 0,
              difficulty: generatedQuestions.length % 3 === 0 ? 'hard' : generatedQuestions.length % 2 === 0 ? 'medium' : 'easy',
              explainMore: {
                summaryOfQuestion: `Identify the scientific or academic term matching the verified definition.`,
                fullSectionHeading: `${subject.toUpperCase()} Foundational Glossary & Lexicon`,
                exactTextSnippet: `${term}: ${meaning}`,
                deepContextualBreakdown: `In academic curriculum, "${term}" represents a primary foundational concept. Understanding its exact definition ensures precision when tackling higher-order synthesis questions.`,
                simplifiedExplanation: `The definition describes ${term}.`,
                hint: `Consider the ${partOfSpeech} associated with this biological/historical principle.`,
                mnemonic: {
                  hook: `Remember ${term.toUpperCase()}: The core pillar of ${subject}!`,
                  rhymeOrAcronymExplanation: `Anchors the terminology directly to ${subject} mastery.`,
                  whyItWorks: `Links the academic term to its dictionary definition.`,
                },
              },
              exploreAnswer: {
                exactParagraph: `Verified definition from academic open lexicons: ${term} is "${meaning}".`,
                paragraphSummary: `Precision in vocabulary is essential for mastering ${subject}.`,
                whyCorrect: `The definition precisely matches ${term}.`,
                whyWrong: shuffled.map((opt, i) =>
                  i === correctIndex ? 'CORRECT CHOICE.' : `${opt} is a distinct concept with an alternate definition in ${subject}.`
                ),
              },
            });
          }
        }
      } catch (e) {
        // Continue if single word fetch fails
      }
    }

    // If external dictionary/Wiktionary API didn't return questions, provide guaranteed OpenStax questions
    if (generatedQuestions.length === 0) {
      const fallbackBanks: Record<string, any[]> = {
        biology: [
          {
            question: 'During glycolysis in the cytoplasm, what is the net gain of ATP molecules produced per single molecule of glucose catabolized?',
            options: ['2 net ATP', '4 net ATP', '32 net ATP', '36 net ATP'],
            correctIndex: 0,
            difficulty: 'easy',
            topic: 'Glycolysis Net Yield',
            explainMore: {
              summaryOfQuestion: 'Determine the net ATP yield of cytoplasmic glycolysis.',
              fullSectionHeading: 'OpenStax Biology 7.2: Glycolysis',
              exactTextSnippet: 'Glycolysis yields 4 ATP but consumes 2 ATP, resulting in a net gain of 2 ATP per glucose.',
              deepContextualBreakdown: 'Although 4 ATP are generated by substrate-level phosphorylation, 2 ATP are consumed during the preparatory phase.',
              simplifiedExplanation: '4 ATP made minus 2 ATP used equals 2 net ATP.',
              hint: 'Subtract the initial energy investment.',
              mnemonic: {
                hook: 'Invest Two, Harvest Four: Two Net ATP Out the Door!',
                rhymeOrAcronymExplanation: 'Net yield formula in a memorable rhyme.',
                whyItWorks: 'Anchors the distinction between gross and net yield.',
              },
            },
            exploreAnswer: {
              exactParagraph: 'The net yield from one glucose molecule in glycolysis is 2 pyruvate, 2 NADH, and 2 ATP.',
              paragraphSummary: 'Substrate-level phosphorylation yields a net return of 2 ATP.',
              whyCorrect: 'Two ATP are used and four are produced, leaving a net gain of 2 ATP.',
              whyWrong: [
                'CORRECT CHOICE.',
                '4 ATP is the gross production before subtracting the 2 ATP invested.',
                '32 ATP is the total theoretical yield of eukaryotic aerobic respiration.',
                '36 ATP is an older estimate of total aerobic catabolism.',
              ],
            },
          },
          {
            question: 'Which component of the eukaryotic cytoskeleton is primarily composed of actin polymers and mediates cytoplasmic streaming, cell motility, and cytokinesis furrow formation?',
            options: ['Microfilaments (Actin filaments)', 'Microtubules', 'Intermediate filaments', 'Collagen fibrils'],
            correctIndex: 0,
            difficulty: 'medium',
            topic: 'Cytoskeleton & Microfilaments',
            explainMore: {
              summaryOfQuestion: 'Identify the cytoskeletal element formed by actin.',
              fullSectionHeading: 'OpenStax Biology 4.5: The Cytoskeleton',
              exactTextSnippet: 'Microfilaments (7 nm diameter) are composed of two intertwined strands of actin and participate in cellular movement and division.',
              deepContextualBreakdown: 'Microfilaments work with myosin motor proteins to drive amoeboid movement, muscle contraction, and cleavage furrow constriction.',
              simplifiedExplanation: 'Microfilaments are made of actin and power cell movement and division.',
              hint: 'Think of the narrowest filaments composed of actin.',
              mnemonic: {
                hook: 'Actin in Action: Microfilaments Move the Cell!',
                rhymeOrAcronymExplanation: 'Alliteration connecting Actin to Action.',
                whyItWorks: 'Pairs actin directly with cellular motion.',
              },
            },
            exploreAnswer: {
              exactParagraph: 'Microfilaments function in cellular movement, have a diameter of about 7 nm, and are made of two intertwined strands of actin.',
              paragraphSummary: 'Actin microfilaments enable dynamic cell motility and furrow contraction.',
              whyCorrect: 'Microfilaments are made of actin monomers and form the contractile ring during cytokinesis.',
              whyWrong: [
                'CORRECT CHOICE.',
                'Microtubules are composed of tubulin dimers (25 nm) and form the mitotic spindle and flagella.',
                'Intermediate filaments (8-12 nm) provide structural tensile strength (e.g. keratin).',
                'Collagen is an extracellular matrix glycoprotein, not an intracellular cytoskeletal filament.',
              ],
            },
          },
          {
            question: 'Which enzyme is responsible for unwinding the double-stranded DNA helix at the replication fork during DNA synthesis?',
            options: ['DNA Helicase', 'DNA Ligase', 'RNA Primase', 'Topoisomerase II'],
            correctIndex: 0,
            difficulty: 'easy',
            topic: 'DNA Replication Fork',
            explainMore: {
              summaryOfQuestion: 'Identify the enzyme that unzips the DNA double helix.',
              fullSectionHeading: 'OpenStax Biology 14.4: DNA Replication in Eukaryotes',
              exactTextSnippet: 'DNA Helicase unwinds the double helix by breaking hydrogen bonds between complementary base pairs at the replication fork.',
              deepContextualBreakdown: 'Helicase uses ATP hydrolysis to travel along the phosphodiester backbone and separate the two strands.',
              simplifiedExplanation: 'Helicase unzips DNA.',
              hint: 'Helicase acts on the helix.',
              mnemonic: {
                hook: 'Helicase = Unzips the Helix!',
                rhymeOrAcronymExplanation: 'Helicase breaks the bonds of the helix like a zipper.',
                whyItWorks: 'Direct association with unzipping.',
              },
            },
            exploreAnswer: {
              exactParagraph: 'Helicase separates the two DNA strands at the origin of replication, allowing replication machinery access.',
              paragraphSummary: 'Helicase unwinds the double helix at the replication fork.',
              whyCorrect: 'Helicase breaks hydrogen bonds to unwind and unzip double-stranded DNA.',
              whyWrong: [
                'CORRECT CHOICE.',
                'DNA Ligase catalyzes phosphodiester bonds to join Okazaki fragments.',
                'RNA Primase synthesizes short RNA primers required by DNA polymerases.',
                'Topoisomerase relieves supercoiling tension ahead of the replication fork.',
              ],
            },
          },
        ],
        history: [
          {
            question: 'Under the OpenStax U.S. History framework, what was the primary aim of the Pacific Railway Acts passed by Congress in 1862 and 1864?',
            options: [
              'To subsidize transcontinental rail construction with checkerboard federal land grants and low-interest treasury bonds',
              'To place all western rail lines under direct cabinet-level military management',
              'To mandate that all railroad corporations hire only Union Army veterans',
              'To establish uniform national passenger ticket rates across all states',
            ],
            correctIndex: 0,
            difficulty: 'medium',
            topic: 'Transcontinental Railroad Subsidies',
            explainMore: {
              summaryOfQuestion: 'Identify the federal subsidies created by the Pacific Railway Acts.',
              fullSectionHeading: 'OpenStax U.S. History 17.1: The Westward Spirit',
              exactTextSnippet: 'The Pacific Railway Act granted millions of acres of public domain land in alternating sections along right-of-ways to rail companies.',
              deepContextualBreakdown: 'Congress gave rail corporations alternating square-mile sections of public land for every mile of track completed, which railroads sold to finance construction.',
              simplifiedExplanation: 'Federal land grants and loans funded the transcontinental railroad.',
              hint: 'Land grants and treasury loans.',
              mnemonic: {
                hook: 'Pacific Rail: Land and Bonds Across the Trail!',
                rhymeOrAcronymExplanation: 'Land grants financed the railroad.',
                whyItWorks: 'Anchors the dual incentive model.',
              },
            },
            exploreAnswer: {
              exactParagraph: 'The Pacific Railway Act authorized land grants and government bonds to the Union Pacific and Central Pacific companies.',
              paragraphSummary: 'Federal land grants created the financial foundation for transcontinental rail transit.',
              whyCorrect: 'The acts provided checkerboard public land grants and federal bond loans.',
              whyWrong: [
                'CORRECT CHOICE.',
                'The railroads remained privately owned corporations, not nationalized military lines.',
                'Companies employed Chinese and Irish immigrant labor and were not restricted to veterans.',
                'Uniform rate regulation came decades later with the 1887 Interstate Commerce Act.',
              ],
            },
          },
        ],
      };

      const fallbackList = fallbackBanks[key] || fallbackBanks.biology;
      for (const item of fallbackList) {
        const origOptions = [...item.options];
        const correctText = origOptions[item.correctIndex];
        const whyWrong = item.exploreAnswer?.whyWrong;
        const explanationMap = new Map<string, string>();
        if (whyWrong) {
          origOptions.forEach((opt: string, i: number) => explanationMap.set(opt, whyWrong[i]));
        }

        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const newOptions = indices.map((idx) => origOptions[idx]);
        const newCorrectIndex = newOptions.indexOf(correctText);
        const newWhyWrong = newOptions.map((opt: string, i: number) => {
          if (i === newCorrectIndex) return 'CORRECT CHOICE.';
          return explanationMap.get(opt) || `${opt} is not the correct response.`;
        });

        generatedQuestions.push({
          id: `openstax-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
          chapterId: 'openstax-curriculum',
          courseId,
          type: 'concept',
          ...item,
          options: newOptions,
          correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
          exploreAnswer: item.exploreAnswer ? {
            ...item.exploreAnswer,
            whyWrong: newWhyWrong,
          } : undefined,
        });
      }
    }

    return res.json({
      success: true,
      count: generatedQuestions.length,
      questions: generatedQuestions,
    });
  } catch (err: any) {
    console.error('Error generating random questions:', err);
    return res.status(500).json({ error: 'Failed to generate random questions', details: err.message });
  }
});

export default router;
