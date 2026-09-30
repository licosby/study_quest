import { Question } from '../types/quest.js';
import { shuffleQuestionOptions } from '../utils/shuffleOptions.js';

export interface OpenEducationalSource {
  name: string;
  sourceType: 'openstax' | 'gutenberg' | 'wikibooks' | 'openlibrary' | 'wiktionary';
  title: string;
  snippet: string;
}

export class EducationalContentService {
  /**
   * Fetch educational content from Project Gutenberg API (Gutendex)
   */
  public static async fetchGutenbergContent(query: string): Promise<{ title: string; authors: string; snippet: string } | null> {
    try {
      const searchUrl = `https://gutendex.com/books/?search=${encodeURIComponent(query)}`;
      const res = await fetch(searchUrl);
      if (!res.ok) return null;

      const data = await res.json();
      const book = data?.results?.[0];
      if (!book) return null;

      const title = book.title || query;
      const authors = book.authors?.map((a: any) => a.name).join(', ') || 'Public Domain Author';

      // Try fetching plain text snippet if available
      const textUrl = book.formats?.['text/plain; charset=utf-8'] || book.formats?.['text/plain; charset=us-ascii'];
      let snippet = `Excerpts from "${title}" by ${authors}, preserved in the Project Gutenberg archive.`;

      if (textUrl) {
        try {
          const textRes = await fetch(textUrl);
          if (textRes.ok) {
            const raw = await textRes.text();
            // Find content between header and footer
            const start = raw.indexOf('*** START OF THE PROJECT GUTENBERG');
            const sub = start !== -1 ? raw.substring(start + 50, start + 3000) : raw.slice(1000, 4000);
            const cleaned = sub.replace(/\r?\n+/g, ' ').trim();
            if (cleaned.length > 100) {
              snippet = cleaned.slice(0, 500) + '...';
            }
          }
        } catch {
          // If direct text fetch hits CORS, keep metadata snippet
        }
      }

      return { title, authors, snippet };
    } catch (err) {
      console.warn('Gutenberg fetch error:', err);
      return null;
    }
  }

  /**
   * Fetch educational content from Wikibooks API
   */
  public static async fetchWikibooksContent(bookTitle: string): Promise<{ title: string; content: string } | null> {
    try {
      const apiUrl = `https://en.wikibooks.org/w/api.php?action=query&prop=extracts&explaintext=1&generator=search&gsrsearch=${encodeURIComponent(
        bookTitle
      )}&gsrlimit=1&format=json&origin=*`;

      const res = await fetch(apiUrl);
      if (!res.ok) return null;

      const data = await res.json();
      const pages = data?.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      if (!pageId || pageId === '-1') return null;

      const extract = pages[pageId]?.extract || '';
      return {
        title: pages[pageId]?.title || bookTitle,
        content: extract.slice(0, 4000),
      };
    } catch (err) {
      console.warn('Wikibooks fetch error:', err);
      return null;
    }
  }

  /**
   * Fetch dictionary definitions from Free Dictionary API (Wiktionary backed)
   */
  public static async fetchDefinition(word: string): Promise<{ word: string; partOfSpeech: string; definition: string } | null> {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      const entry = data[0];
      const meaning = entry?.meanings?.[0];
      const def = meaning?.definitions?.[0]?.definition;

      if (def) {
        return {
          word: entry.word,
          partOfSpeech: meaning.partOfSpeech || 'noun',
          definition: def,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch Open Library subject data
   */
  public static async fetchOpenLibrarySubject(subject: string): Promise<string[]> {
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(subject)}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const docs = data?.docs || [];
      return docs.map((d: any) => d.title).filter(Boolean);
    } catch {
      return [];
    }
  }

  /**
   * High-yield open educational textbook curricula database
   * OpenStax Biology, OpenStax U.S. History, OpenStax Principles of Economics, Project Gutenberg Classics
   */
  private static readonly OPENSTAX_CURRICULUM: Record<string, Partial<Question>[]> = {
    biology: [
      {
        question: 'Which component of the eukaryotic cytoskeleton is primarily composed of actin polymers and mediates cytoplasmic streaming, cell motility, and cytokinesis furrow formation?',
        options: ['Microfilaments (Actin filaments)', 'Microtubules', 'Intermediate filaments', 'Collagen fibrils'],
        correctIndex: 0,
        difficulty: 'medium',
        topic: 'OpenStax Biology: Cytoskeleton',
        explainMore: {
          summaryOfQuestion: 'Identify the cytoskeletal element formed by actin.',
          fullSectionHeading: 'OpenStax Biology 4.5: The Cytoskeleton',
          exactTextSnippet: 'Microfilaments (7 nm diameter) are composed of two intertwined strands of actin and participate in cellular movement and division.',
          deepContextualBreakdown: 'Microfilaments are the narrowest elements of the cytoskeleton. Powered by ATP and myosin motor proteins, they drive amoeboid movement, muscle contraction, and cleavage furrow constriction.',
          simplifiedExplanation: 'Microfilaments are made of actin and power cell movement and division.',
          hint: 'Think of the narrowest filaments composed of actin.',
          mnemonic: {
            hook: 'Actin in Action: Microfilaments Move the Cell!',
            rhymeOrAcronymExplanation: 'Alliteration of Actin and Action.',
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
        question: 'In cell membrane transport, what term describes the movement of small nonpolar molecules directly across the phospholipid bilayer down their concentration gradient without transport proteins?',
        options: ['Simple diffusion', 'Facilitated diffusion', 'Primary active transport', 'Receptor-mediated endocytosis'],
        correctIndex: 0,
        difficulty: 'easy',
        topic: 'OpenStax Biology: Passive Membrane Transport',
        explainMore: {
          summaryOfQuestion: 'Identify unassisted passive diffusion across the lipid bilayer.',
          fullSectionHeading: 'OpenStax Biology 5.2: Passive Transport',
          exactTextSnippet: 'Simple diffusion is the unassisted movement of small, nonpolar solutes (such as O2 and CO2) directly across the hydrophobic core of the bilayer.',
          deepContextualBreakdown: 'Because the interior of the lipid membrane is hydrophobic, only nonpolar or lipophilic molecules (like steroid hormones, O2, and CO2) can dissolve and cross freely down their chemical gradient.',
          simplifiedExplanation: 'Simple diffusion requires no channels, carriers, or energy.',
          hint: 'Unassisted downhill movement.',
          mnemonic: {
            hook: 'Simple is Free: Down the Gradient Naturally!',
            rhymeOrAcronymExplanation: 'Simple diffusion needs no helper proteins.',
            whyItWorks: 'Distinguishes simple from facilitated transport.',
          },
        },
        exploreAnswer: {
          exactParagraph: 'Small nonpolar molecules pass readily through the lipid bilayer by simple diffusion down concentration gradients.',
          paragraphSummary: 'Hydrophobic molecules permeate membranes without protein assistance.',
          whyCorrect: 'Simple diffusion is the direct, unassisted passive transport across the phospholipid bilayer.',
          whyWrong: [
            'CORRECT CHOICE.',
            'Facilitated diffusion requires transmembrane protein channels or carrier permeases.',
            'Primary active transport uses ATP hydrolysis to pump solutes against their gradient.',
            'Receptor-mediated endocytosis involves clathrin-coated vesicle internalization.',
          ],
        },
      },
      {
        question: 'Which of the following occurs during the light-dependent reactions of photosynthesis in the thylakoid membranes?',
        options: [
          'Photolysis of water releases oxygen gas while generating ATP and NADPH',
          'RuBisCO fixes carbon dioxide into 3-phosphoglycerate',
          'Glucose is phosphorylated into fructose-1,6-bisphosphate',
          'Pyruvate is converted into lactic acid',
        ],
        correctIndex: 0,
        difficulty: 'medium',
        topic: 'OpenStax Biology: Photophosphorylation',
        explainMore: {
          summaryOfQuestion: 'Determine the outputs of the light-dependent reactions.',
          fullSectionHeading: 'OpenStax Biology 8.2: Light-Dependent Reactions',
          exactTextSnippet: 'Water photolysis in Photosystem II splits H2O into protons, electrons, and O2 gas, driving photophosphorylation to produce ATP and NADPH.',
          deepContextualBreakdown: 'Solar photons excite electrons in chlorophyll P680. Water molecules are split (photolysis) to replace lost electrons, releasing oxygen as a byproduct while establishing a proton gradient across the thylakoid.',
          simplifiedExplanation: 'Light splits water, releases oxygen, and produces ATP and NADPH.',
          hint: 'Water is split and oxygen is released.',
          mnemonic: {
            hook: 'Light Splits Water: Oxygen Flies, ATP Multiplies!',
            rhymeOrAcronymExplanation: 'Water photolysis generates oxygen and cellular energy carriers.',
            whyItWorks: 'Direct link between solar energy and water splitting.',
          },
        },
        exploreAnswer: {
          exactParagraph: 'Photosystem II utilizes absorbed photons to split water, liberating oxygen while transferring electrons down the thylakoid transport chain.',
          paragraphSummary: 'Light reactions generate ATP and NADPH while releasing O2.',
          whyCorrect: 'Water photolysis in thylakoid membranes generates oxygen gas, ATP, and NADPH.',
          whyWrong: [
            'CORRECT CHOICE.',
            'RuBisCO carbon fixation occurs during the light-independent Calvin cycle in the stroma.',
            'Glucose phosphorylation occurs during glycolysis in the cytoplasm.',
            'Pyruvate fermentation to lactic acid occurs under anaerobic conditions in animal muscle.',
          ],
        },
      },
      {
        question: 'According to OpenStax genetics curriculum, what is the expected phenotypic ratio in the F2 generation of a classic Mendelian monohybrid cross between two heterozygous parents (Bb × Bb)?',
        options: ['3 dominant : 1 recessive', '1 dominant : 2 intermediate : 1 recessive', '9 : 3 : 3 : 1', '1 dominant : 1 recessive'],
        correctIndex: 0,
        difficulty: 'easy',
        topic: 'OpenStax Biology: Mendelian Ratios',
        explainMore: {
          summaryOfQuestion: 'Determine the monohybrid F2 phenotypic ratio.',
          fullSectionHeading: 'OpenStax Biology 12.1: Mendel\'s Experiments',
          exactTextSnippet: 'A cross between two heterozygous individuals (Bb × Bb) yields a genotypic ratio of 1 BB : 2 Bb : 1 bb and a phenotypic ratio of 3 dominant : 1 recessive.',
          deepContextualBreakdown: 'BB, Bb, and bB individuals (3/4) all display the dominant phenotype, while bb (1/4) displays the recessive phenotype.',
          simplifiedExplanation: '3 dominant to 1 recessive in a monohybrid cross.',
          hint: 'Remember Mendel\'s famous 3:1 ratio for purple and white pea flowers.',
          mnemonic: {
            hook: 'Three to One: The Dominant Trait Won!',
            rhymeOrAcronymExplanation: 'Rhymes One with Won: 75% display dominant trait.',
            whyItWorks: 'Immediate recall of the 3:1 classic ratio.',
          },
        },
        exploreAnswer: {
          exactParagraph: 'Mendel observed that crossing heterozygous F1 plants yielded a consistent 3:1 phenotypic ratio in the F2 offspring.',
          paragraphSummary: 'Monohybrid cross produces 75% dominant and 25% recessive phenotypes.',
          whyCorrect: 'Three out of four offspring exhibit the dominant phenotype (1 BB + 2 Bb = 3).',
          whyWrong: [
            'CORRECT CHOICE.',
            '1:2:1 is the genotypic ratio (1 BB : 2 Bb : 1 bb) or incomplete dominance ratio.',
            '9:3:3:1 is the phenotypic ratio for a dihybrid cross (AaBb × AaBb).',
            '1:1 is the expected phenotypic ratio of a testcross (Bb × bb).',
          ],
        },
      },
      {
        question: 'Which enzyme is responsible for unwinding the double-stranded DNA helix at the replication fork during DNA synthesis?',
        options: ['DNA Helicase', 'DNA Ligase', 'RNA Primase', 'Topoisomerase II'],
        correctIndex: 0,
        difficulty: 'easy',
        topic: 'OpenStax Biology: DNA Replication Fork',
        explainMore: {
          summaryOfQuestion: 'Identify the enzyme that unzips the DNA double helix.',
          fullSectionHeading: 'OpenStax Biology 14.4: DNA Replication in Eukaryotes',
          exactTextSnippet: 'DNA Helicase unwinds the double helix by breaking hydrogen bonds between complementary base pairs at the replication fork.',
          deepContextualBreakdown: 'Helicase uses ATP hydrolysis to travel along the phosphodiester backbone and separate the two strands, creating two single-stranded DNA templates.',
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
        topic: 'OpenStax U.S. History: Transcontinental Railroad',
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
      {
        question: 'In his landmark 1893 address at the World’s Columbian Exposition, what was Frederick Jackson Turner’s core thesis regarding the American frontier?',
        options: [
          'The availability of free western land had served as a safety valve fostering democratic egalitarianism and American individualism',
          'The frontier caused economic stagnation that could only be cured by imperialist conquest in Latin America',
          'Industrial manufacturing in northeastern cities was the sole driver of American democratic institutions',
          'Communal tribal reservations should be expanded into independent sovereign republics',
        ],
        correctIndex: 0,
        difficulty: 'hard',
        topic: 'OpenStax U.S. History: Turner\'s Frontier Thesis',
        explainMore: {
          summaryOfQuestion: 'Recall Frederick Jackson Turner’s argument on the significance of the frontier.',
          fullSectionHeading: 'OpenStax U.S. History 17.4: The Loss of the Frontier',
          exactTextSnippet: 'Turner argued that the continuous westward frontier forged the distinctive American character, promoting individualism and democracy.',
          deepContextualBreakdown: 'Turner asserted that adapting to the wilderness broke down European aristocratic traditions, acting as a social safety valve against class strife.',
          simplifiedExplanation: 'The frontier created American democracy and individualism.',
          hint: 'Frontier as the cradle of American democracy.',
          mnemonic: {
            hook: 'Turner Tells: The Frontier Casts the Freedom Spells!',
            rhymeOrAcronymExplanation: 'Turner linked democracy with the western frontier.',
            whyItWorks: 'Pairs the historian\'s name with frontier individualism.',
          },
        },
        exploreAnswer: {
          exactParagraph: 'Frederick Jackson Turner presented his Frontier Thesis in 1893, arguing that westward expansion was the central force shaping American democracy.',
          paragraphSummary: 'The frontier fostered egalitarianism and self-reliance.',
          whyCorrect: 'Turner argued the frontier served as a safety valve and the cradle of American democratic individualism.',
          whyWrong: [
            'CORRECT CHOICE.',
            'Turner focused on domestic continental expansion, not Latin American imperialism.',
            'Turner argued against urban origins, claiming the wilderness forged democratic instincts.',
            'Turner supported western development rather than sovereign tribal reservation expansion.',
          ],
        },
      },
    ],
    ethics: [
      {
        question: 'In Aristotle\'s Nicomachean Ethics (preserved in Project Gutenberg philosophy archives), what constitutes the supreme human end (telos) known as Eudaimonia?',
        options: [
          'Human flourishing achieved through rational activity of the soul in accordance with virtue',
          'The maximization of sensory physical pleasure and avoidance of physical pain',
          'Blind obedience to divine commandments without rational questioning',
          'Accumulation of commercial capital and civic political honors',
        ],
        correctIndex: 0,
        difficulty: 'medium',
        topic: 'Aristotle: Eudaimonia & Telos',
        explainMore: {
          summaryOfQuestion: 'Define Eudaimonia according to Aristotle.',
          fullSectionHeading: 'Aristotle\'s Nicomachean Ethics: Book I',
          exactTextSnippet: 'Aristotle defines Eudaimonia not as a fleeting emotional state, but as living well and doing well through virtuous rational action over a complete lifetime.',
          deepContextualBreakdown: 'For Aristotle, everything has a purpose (telos). The distinctive function of humans is reason. Therefore, the highest good is flourishing through reasoned virtue.',
          simplifiedExplanation: 'Eudaimonia is human flourishing through reasoned virtue.',
          hint: 'Human flourishing and virtuous action.',
          mnemonic: {
            hook: 'Eu-daimonia = Good Spirit: Flourish with virtue, never fear it!',
            rhymeOrAcronymExplanation: 'Eu means good; daimon means spirit. Translates to flourishing.',
            whyItWorks: 'Links the Greek etymology with true flourishing.',
          },
        },
        exploreAnswer: {
          exactParagraph: 'Eudaimonia is the ultimate good in Aristotle\'s ethics, achieved through rational virtue rather than passive enjoyment.',
          paragraphSummary: 'Flourishing is an activity of the soul expressing complete excellence.',
          whyCorrect: 'Aristotle defines Eudaimonia as flourishing through rational activity in accordance with virtue.',
          whyWrong: [
            'CORRECT CHOICE.',
            'Sensory pleasure maximization is the defining principle of Epicurean and Cyrenaic hedonism.',
            'Blind obedience describes divine command theory, which Aristotle did not propose.',
            'Aristotle argued that wealth and honors are mere instrumental means, not the ultimate end.',
          ],
        },
      },
    ],
  };

  /**
   * 100% synchronous question generator.
   * Guarantees 0ms latency when starting quizzes so buttons respond immediately with no async delay.
   */
  public static generateDynamicQuestionSync(
    subject: string,
    courseId: string,
    existingQuestionIds: Set<string>,
    missedQuestions: Question[] = []
  ): Question {
    if (missedQuestions.length > 0 && Math.random() < 0.35) {
      const missed = missedQuestions[Math.floor(Math.random() * missedQuestions.length)];
      return this.generateReinforcementQuestion(missed);
    }

    const key = Object.keys(this.OPENSTAX_CURRICULUM).find(
      (k) => subject.toLowerCase().includes(k) || courseId.toLowerCase().includes(k)
    ) || 'biology';

    const pool = this.OPENSTAX_CURRICULUM[key] || this.OPENSTAX_CURRICULUM.biology;
    const available = pool.filter((q) => !existingQuestionIds.has(q.question || ''));
    const source = available.length > 0 ? available : pool;
    const template = source[Math.floor(Math.random() * source.length)];

    const templateOptions: [string, string, string, string] = [
      template.options?.[0] || 'Option A',
      template.options?.[1] || 'Option B',
      template.options?.[2] || 'Option C',
      template.options?.[3] || 'Option D',
    ];

    const templateWhyWrong: [string, string, string, string] = [
      template.exploreAnswer?.whyWrong?.[0] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[1] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[2] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[3] || 'Incorrect distractor.',
    ];

    return shuffleQuestionOptions({
      id: `openstax-sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      chapterId: 'openstax-stream',
      courseId,
      type: 'concept',
      question: template.question || `What is a primary principle in ${subject}?`,
      options: templateOptions,
      correctIndex: template.correctIndex ?? 0,
      difficulty: template.difficulty || 'medium',
      explainMore: template.explainMore || {
        summaryOfQuestion: `Evaluates fundamental principles in ${subject}.`,
        fullSectionHeading: `${subject.toUpperCase()} Core Concepts (OpenStax)`,
        exactTextSnippet: 'Key curriculum principle.',
        deepContextualBreakdown: 'Understanding this concept provides the foundation for CLEP mastery.',
        simplifiedExplanation: 'Core definition and principle.',
        hint: 'Review the foundational concept.',
        mnemonic: {
          hook: `Master ${subject}: One concept at a time!`,
          rhymeOrAcronymExplanation: 'Memory reinforcement hook.',
          whyItWorks: 'Direct cognitive association.',
        },
      },
      exploreAnswer: template.exploreAnswer ? {
        ...template.exploreAnswer,
        whyWrong: templateWhyWrong,
      } : {
        exactParagraph: 'Established academic textbook content.',
        paragraphSummary: 'Comprehensive rationale.',
        whyCorrect: 'This answer aligns with OpenStax educational standards.',
        whyWrong: templateWhyWrong,
      },
    });
  }

  /**
   * Generates dynamic questions by combining:
   * 1. OpenStax curriculum banks
   * 2. Live API definitions from Wiktionary/Dictionary
   * 3. Wikibooks open chapters
   * 4. Project Gutenberg primary sources
   */
  public static async generateDynamicQuestion(
    subject: string,
    courseId: string,
    existingQuestionIds: Set<string>,
    missedQuestions: Question[] = []
  ): Promise<Question> {
    // 1. Spaced Repetition Reinforcement: 30% chance to re-test a missed concept with new framing
    if (missedQuestions.length > 0 && Math.random() < 0.35) {
      const missed = missedQuestions[Math.floor(Math.random() * missedQuestions.length)];
      return this.generateReinforcementQuestion(missed);
    }

    // 2. Fetch live definition from Wiktionary / Free Dictionary API for academic terms
    const academicTerms = this.getSubjectTerms(subject, courseId);
    const randomTerm = academicTerms[Math.floor(Math.random() * academicTerms.length)];

    const def = await this.fetchDefinition(randomTerm);
    if (def && def.definition.length > 20) {
      const distractorTerms = academicTerms.filter((t) => t !== randomTerm).sort(() => 0.5 - Math.random()).slice(0, 3);
      const rawOptions = [
        randomTerm.charAt(0).toUpperCase() + randomTerm.slice(1),
        ...distractorTerms.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
      ];
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
      const correctIndex = shuffledOptions.indexOf(randomTerm.charAt(0).toUpperCase() + randomTerm.slice(1));

      const fourOptions: [string, string, string, string] = [
        shuffledOptions[0] || 'Option A',
        shuffledOptions[1] || 'Option B',
        shuffledOptions[2] || 'Option C',
        shuffledOptions[3] || 'Option D',
      ];

      const fourWhyWrong: [string, string, string, string] = [
        correctIndex === 0 ? 'CORRECT CHOICE.' : `${fourOptions[0]} is a distinct concept with an alternate definition in ${subject}.`,
        correctIndex === 1 ? 'CORRECT CHOICE.' : `${fourOptions[1]} is a distinct concept with an alternate definition in ${subject}.`,
        correctIndex === 2 ? 'CORRECT CHOICE.' : `${fourOptions[2]} is a distinct concept with an alternate definition in ${subject}.`,
        correctIndex === 3 ? 'CORRECT CHOICE.' : `${fourOptions[3]} is a distinct concept with an alternate definition in ${subject}.`,
      ];

      return {
        id: `api-dict-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        chapterId: 'api-stream',
        courseId,
        type: 'concept',
        question: `According to educational lexicons for ${subject}, which academic term is defined as: "${def.definition.replace(/\.$/, '')}"?`,
        options: fourOptions,
        correctIndex: Math.max(0, correctIndex),
        difficulty: 'medium',
        explainMore: {
          summaryOfQuestion: `Identify the academic term matching the verified dictionary definition.`,
          fullSectionHeading: `${subject.toUpperCase()} Core Glossary (Wiktionary / OpenStax)`,
          exactTextSnippet: `${def.word}: ${def.definition}`,
          deepContextualBreakdown: `The term "${def.word}" (${def.partOfSpeech}) represents an essential concept in ${subject}. Accurate mastery of this terminology is required for college-level synthesis questions.`,
          simplifiedExplanation: `The definition describes ${def.word}.`,
          hint: `Think about the ${def.partOfSpeech} used in ${subject}.`,
          mnemonic: {
            hook: `Anchor ${def.word.toUpperCase()} for Academic Mastery!`,
            rhymeOrAcronymExplanation: `Directly links the word to its educational meaning.`,
            whyItWorks: `Reinforces formal definition recall.`,
          },
        },
        exploreAnswer: {
          exactParagraph: `Verified definition: ${def.word} is "${def.definition}".`,
          paragraphSummary: `Mastery of academic definitions is fundamental to ${subject}.`,
          whyCorrect: `The definition precisely describes ${def.word}.`,
          whyWrong: fourWhyWrong,
        },
      };
    }

    // 3. Select from OpenStax curriculum bank
    const key = Object.keys(this.OPENSTAX_CURRICULUM).find(
      (k) => subject.toLowerCase().includes(k) || courseId.toLowerCase().includes(k)
    ) || 'biology';

    const pool = this.OPENSTAX_CURRICULUM[key] || this.OPENSTAX_CURRICULUM.biology;
    const available = pool.filter((q) => !existingQuestionIds.has(q.question || ''));
    const source = available.length > 0 ? available : pool;
    const template = source[Math.floor(Math.random() * source.length)];

    const templateOptions: [string, string, string, string] = [
      template.options?.[0] || 'Option A',
      template.options?.[1] || 'Option B',
      template.options?.[2] || 'Option C',
      template.options?.[3] || 'Option D',
    ];

    const templateWhyWrong: [string, string, string, string] = [
      template.exploreAnswer?.whyWrong?.[0] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[1] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[2] || 'Incorrect distractor.',
      template.exploreAnswer?.whyWrong?.[3] || 'Incorrect distractor.',
    ];

    return shuffleQuestionOptions({
      id: `openstax-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      chapterId: 'openstax-stream',
      courseId,
      type: 'concept',
      question: template.question || `What is a primary principle in ${subject}?`,
      options: templateOptions,
      correctIndex: template.correctIndex ?? 0,
      difficulty: template.difficulty || 'medium',
      explainMore: template.explainMore || {
        summaryOfQuestion: `Evaluates fundamental principles in ${subject}.`,
        fullSectionHeading: `${subject.toUpperCase()} Core Concepts (OpenStax)`,
        exactTextSnippet: 'Key curriculum principle.',
        deepContextualBreakdown: 'Understanding this concept provides the foundation for CLEP mastery.',
        simplifiedExplanation: 'Core definition and principle.',
        hint: 'Review the foundational concept.',
        mnemonic: {
          hook: `Master ${subject}: One concept at a time!`,
          rhymeOrAcronymExplanation: 'Memory reinforcement hook.',
          whyItWorks: 'Direct cognitive association.',
        },
      },
      exploreAnswer: template.exploreAnswer ? {
        ...template.exploreAnswer,
        whyWrong: templateWhyWrong,
      } : {
        exactParagraph: 'Established academic textbook content.',
        paragraphSummary: 'Comprehensive rationale.',
        whyCorrect: 'This answer aligns with OpenStax educational standards.',
        whyWrong: templateWhyWrong,
      },
    });
  }

  /**
   * Spaced repetition: create a newly rephrased version of a missed concept
   */
  public static generateReinforcementQuestion(missed: Question): Question {
    const correctValue = missed.options[missed.correctIndex];
    const otherOptions = missed.options.filter((_, idx) => idx !== missed.correctIndex);
    const newOptionsList = [correctValue, ...otherOptions].sort(() => 0.5 - Math.random());
    const newCorrectIndex = newOptionsList.indexOf(correctValue);

    const rephrasings = [
      `Review Reinforcement: Based on your previous question, which concept accurately corresponds to: "${correctValue}"?`,
      `Adaptive Check: Why is "${correctValue}" the correct academic answer regarding this topic?`,
      `Mastery Verification: Which option correctly identifies the principle behind "${correctValue}"?`,
    ];

    const questionText = rephrasings[Math.floor(Math.random() * rephrasings.length)];

    const reinforcementOptions: [string, string, string, string] = [
      newOptionsList[0] || 'Option A',
      newOptionsList[1] || 'Option B',
      newOptionsList[2] || 'Option C',
      newOptionsList[3] || 'Option D',
    ];

    const reinforcementWhyWrong: [string, string, string, string] = [
      newCorrectIndex === 0 ? 'CORRECT CHOICE.' : `${reinforcementOptions[0]} is not the primary factor in this concept.`,
      newCorrectIndex === 1 ? 'CORRECT CHOICE.' : `${reinforcementOptions[1]} is not the primary factor in this concept.`,
      newCorrectIndex === 2 ? 'CORRECT CHOICE.' : `${reinforcementOptions[2]} is not the primary factor in this concept.`,
      newCorrectIndex === 3 ? 'CORRECT CHOICE.' : `${reinforcementOptions[3]} is not the primary factor in this concept.`,
    ];

    return {
      ...missed,
      id: `reinforce-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      question: questionText,
      options: reinforcementOptions,
      correctIndex: Math.max(0, newCorrectIndex),
      difficulty: 'medium',
      explainMore: {
        ...missed.explainMore,
        summaryOfQuestion: `Reinforcement question for previously missed concept: ${correctValue}.`,
        hint: `Recall that ${correctValue} was the verified answer.`,
      },
      exploreAnswer: {
        ...missed.exploreAnswer,
        whyCorrect: `This re-affirms the core principle: ${correctValue}.`,
        whyWrong: reinforcementWhyWrong,
      },
    };
  }

  private static getSubjectTerms(subject: string, courseId: string): string[] {
    const combined = `${subject} ${courseId}`.toLowerCase();
    if (combined.includes('bio')) {
      return ['mitochondria', 'chloroplast', 'ribosome', 'enzyme', 'osmosis', 'meiosis', 'glycolysis', 'allele', 'nucleotide', 'homeostasis', 'cytoplasm', 'vacuole', 'fermentation'];
    }
    if (combined.includes('hist') || combined.includes('civics')) {
      return ['constitution', 'amendment', 'federalist', 'monopoly', 'confederation', 'boycott', 'reconstruction', 'homestead', 'sovereignty', 'treaty', 'suffrage', 'nullification'];
    }
    if (combined.includes('ethic') || combined.includes('philosophy')) {
      return ['virtue', 'utilitarianism', 'deontology', 'eudaimonia', 'categorical', 'altruism', 'hedonism', 'morality', 'justice', 'consequentialism'];
    }
    if (combined.includes('span') || combined.includes('lang')) {
      return ['aeropuerto', 'pasaporte', 'billete', 'embarque', 'estación', 'equipaje', 'viaje', 'aduana', 'vuelo'];
    }
    return ['hypothesis', 'empirical', 'variable', 'synthesis', 'correlation', 'paradigm', 'analysis'];
  }
}
