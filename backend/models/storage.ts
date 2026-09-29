import { Chapter, UserProgress } from './types.js';

export const initialChapters: Chapter[] = [
  {
    id: 'clep-spanish-1',
    title: 'CLEP Spanish: En el Aeropuerto y El Subjuntivo',
    subject: 'Spanish',
    category: 'Foreign Language (CLEP Spanish Level 1 & 2)',
    description: 'Master travel dialogues, airport vocabulary, and the subjunctive mood with native-speed audio comprehension.',
    uploadDate: '2026-09-28',
    rawText: `Capítulo 4: Viajes Internacionales y Expresiones del Subjuntivo.
En los aeropuertos internacionales de habla hispana, los pasajeros deben seguir procedimientos estrictos. Al llegar al mostrador de facturación (check-in counter), el agente solicita el pasaporte, el boleto electrónico y pregunta si lleva equipaje de mano o maletas para facturar. Es fundamental recordar la diferencia entre "la puerta de embarque" (boarding gate) y "la recogida de equipajes" (baggage claim).

La gramática del modo subjuntivo se utiliza para expresar deseos, dudas, recomendaciones y emociones. Una regla esencial se recuerda con el acrónimo WEIRDOS: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá. Por ejemplo, cuando el asistente de vuelo dice: "Recomiendo que usted abroche su cinturón de seguridad", el verbo "abroche" está en subjuntivo porque sigue una recomendación dirigida a otra persona. Si no hay cambio de sujeto, se utiliza el infinitivo ("Deseo viajar").

El diálogo en el control de aduanas exige atención auditiva rápida:
Oficial: "Buenos días. ¿Cuál es el motivo de su estancia en Madrid?"
Pasajero: "Vengo a participar en un congreso académico durante siete días."
Oficial: "¿Lleva en su maleta artículos perecederos, alimentos frescos o más de diez mil euros en efectivo?"
Pasajero: "No, señor oficial. Solo llevo ropa, libros de estudio y mi ordenador portátil personal."
Oficial: "Muy bien. Que tenga una excelente estadía en España. Puede pasar."`,
    summary: 'This chapter reviews essential Spanish travel terminology, airport navigation dialogues, and the formation and triggers of the present subjunctive (WEIRDOS rule). It emphasizes listening comprehension at natural native cadence.',
    keyConcepts: [
      {
        term: 'Modo Subjuntivo (WEIRDOS Trigger)',
        definition: 'Grammatical mood used to express wishes, emotions, uncertainty, or impersonal recommendations when there is a change of subject.',
        exactParagraph: 'La gramática del modo subjuntivo se utiliza para expresar deseos, dudas, recomendaciones y emociones. Una regla esencial se recuerda con el acrónimo WEIRDOS: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá.',
        mnemonic: 'WEIRDOS = Wishes, Emotions, Impersonal expressions, Recommendations, Doubt/Denial, Ojalá, Speculation.'
      },
      {
        term: 'Puerta de Embarque vs. Recogida de Equipajes',
        definition: 'Critical distinction in airport logistics: boarding gate (where flights depart) versus baggage claim (where luggage arrives).',
        exactParagraph: 'Es fundamental recordar la diferencia entre "la puerta de embarque" (boarding gate) y "la recogida de equipajes" (baggage claim).',
        mnemonic: 'EMBARQUE = You EMBARK onto the plane; EQUIPAJES = Your EQUIPMENT luggage is picked up.'
      }
    ],
    vocabulary: [
      {
        word: 'El mostrador de facturación',
        definition: 'Check-in counter at an airport or terminal',
        contextSentence: 'Al llegar al mostrador de facturación, el agente solicita el pasaporte.',
        mnemonic: 'MOSTRAR = To show; you SHOW your passport at the mostrador.'
      },
      {
        word: 'Equipaje de mano',
        definition: 'Carry-on luggage allowed inside the passenger cabin',
        contextSentence: 'El agente pregunta si lleva equipaje de mano o maletas para facturar.',
        mnemonic: 'MANO = Hand. Hand luggage you hold yourself!'
      },
      {
        word: 'Perecedero',
        definition: 'Perishable (goods, fresh produce, meat that spoils)',
        contextSentence: '¿Lleva en su maleta artículos perecederos o alimentos frescos?',
        mnemonic: 'PERECER = To perish; perecedero will perish if not refrigerated.'
      }
    ],
    grammarRules: [
      {
        rule: 'Subject Change Subjunctive Trigger',
        explanation: 'When the main clause verb expresses influence (recomendar, querer, exigir) and introduces a different subject via "que", the subordinate verb must take the subjunctive form.',
        example: 'Recomiendo que usted abroche su cinturón. (Not "abrocha")',
        mnemonic: 'Two Different Subjects + "Que" = Subjunctive is True!'
      }
    ],
    dialogues: [
      {
        id: 'dial-sp-1',
        title: 'Control de Aduanas e Inmigración',
        speakers: ['Oficial', 'Pasajero'],
        lines: [
          { speaker: 'Oficial', text: 'Buenos días. ¿Cuál es el motivo de su estancia en Madrid?', translation: 'Good morning. What is the reason for your stay in Madrid?' },
          { speaker: 'Pasajero', text: 'Vengo a participar en un congreso académico durante siete días.', translation: 'I have come to participate in an academic conference for seven days.' },
          { speaker: 'Oficial', text: '¿Lleva en su maleta artículos perecederos, alimentos frescos o más de diez mil euros en efectivo?', translation: 'Do you carry in your suitcase perishable items, fresh food, or more than 10,000 euros in cash?' },
          { speaker: 'Pasajero', text: 'No, señor oficial. Solo llevo ropa, libros de estudio y mi ordenador portátil personal.', translation: 'No, officer. I only have clothes, study textbooks, and my personal laptop.' },
          { speaker: 'Oficial', text: 'Muy bien. Que tenga una excelente estadía en España. Puede pasar.', translation: 'Very well. May you have an excellent stay in Spain. You may proceed.' }
        ]
      }
    ],
    mnemonics: [
      {
        id: 'mnem-sp-1',
        target: 'Subjunctive Triggers',
        phrase: 'WEIRDOS guide the Subjunctive stream!',
        explanation: 'Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá, Speculation.',
        subject: 'Spanish'
      },
      {
        id: 'mnem-sp-2',
        target: 'Ojalá',
        phrase: 'Ojalá = Oh Allah, let it happen!',
        explanation: 'Etymologically derived from Arabic, always accompanied by the subjunctive mood.',
        subject: 'Spanish'
      }
    ],
    questions: [
      {
        id: 'q-sp-1',
        chapterId: 'clep-spanish-1',
        type: 'grammar',
        question: 'En la oración: "El comandante exige que todos los pasajeros ____ sus asientos", ¿cuál es la forma verbal correcta?',
        options: ['ocupan', 'ocupen', 'ocuparán', 'ocupar'],
        correctIndex: 1,
        difficulty: 'medium',
        explainMore: {
          summaryOfQuestion: 'The question tests subjunctive mood conjugation after a verb of command ("exigir que") with a subject change.',
          exactTextSnippet: 'La gramática del modo subjuntivo se utiliza para expresar deseos, dudas, recomendaciones y emociones... cuando el verbo expresa mandato/recomendación hacia otra persona.',
          simplifiedExplanation: 'Because the captain commands ("exige que") someone else ("los pasajeros"), the verb must be present subjunctive ("ocupen").',
          hint: 'Remember WEIRDOS: "Exigir" is a Recommendation/Demand triggering the opposite vowel (-ar verbs end in -e/-en in subjunctive).',
          mnemonic: 'Flip the vowels for subjunctive: AR becomes E, ER/IR becomes A!'
        },
        exploreAnswer: {
          exactParagraph: 'La gramática del modo subjuntivo se utiliza para expresar deseos, dudas, recomendaciones y emociones... "Recomiendo que usted abroche su cinturón de seguridad", el verbo está en subjuntivo porque sigue una recomendación dirigida a otra persona.',
          paragraphSummary: 'Subjunctive mood is mandatory following clauses expressing orders or influence over another subject.',
          whyCorrect: '"Ocupen" is the 3rd person plural present subjunctive form of the -ar verb "ocupar", which changes to -en.',
          whyWrong: [
            '"Ocupan" is present indicative, which is incorrect following verbs of demand with subject change.',
            'CORRECT CHOICE.',
            '"Ocuparán" is future indicative, not used after the subordinate subjunctive trigger "exige que".',
            '"Ocupar" is an infinitive, which is only used when there is NO subject change.'
          ],
          mnemonic: 'Flip the vowel: AR becomes E, ER/IR becomes A.'
        }
      },
      {
        id: 'q-sp-2',
        chapterId: 'clep-spanish-1',
        type: 'vocabulary',
        question: 'Si un viajero necesita reclamar sus maletas después del aterrizaje, ¿a qué zona del aeropuerto debe dirigirse?',
        options: ['A la puerta de embarque', 'Al mostrador de facturación', 'A la recogida de equipajes', 'A la casa de cambio'],
        correctIndex: 2,
        difficulty: 'easy',
        explainMore: {
          summaryOfQuestion: 'The question asks which terminal area corresponds to baggage claim where luggage arrives after a flight.',
          exactTextSnippet: 'Es fundamental recordar la diferencia entre "la puerta de embarque" (boarding gate) y "la recogida de equipajes" (baggage claim).',
          simplifiedExplanation: '"Recogida de equipajes" literally means collection of baggage/luggage.',
          hint: 'Look for the word meaning "pick-up" or "claim" connected with luggage.',
          mnemonic: 'EQUIPAJES = Equipment & Luggage to RECOGER (pick up).'
        },
        exploreAnswer: {
          exactParagraph: 'Es fundamental recordar la diferencia entre "la puerta de embarque" (boarding gate) y "la recogida de equipajes" (baggage claim).',
          paragraphSummary: 'Airport navigation requires identifying baggage claim distinct from departure gates.',
          whyCorrect: '"Recogida de equipajes" is the official Spanish term for baggage claim / luggage pickup carousel.',
          whyWrong: [
            '"Puerta de embarque" is the gate where passengers board departures.',
            '"Mostrador de facturación" is the initial check-in desk before security.',
            'CORRECT CHOICE.',
            '"Casa de cambio" is a currency exchange booth.'
          ],
          mnemonic: 'Recoger = to pick up; Equipaje = luggage.'
        }
      }
    ],
    audioQuestions: [
      {
        id: 'aq-sp-1',
        chapterId: 'clep-spanish-1',
        language: 'Spanish',
        audioPrompt: 'Oficial: "¿Cuál es el motivo de su estancia en Madrid?" Pasajero: "Vengo a participar en un congreso académico durante siete días."',
        audioTranscript: 'Oficial: "¿Cuál es el motivo de su estancia en Madrid?" Pasajero: "Vengo a participar en un congreso académico durante siete días."',
        question: 'Según el diálogo escuchado a velocidad nativa, ¿cuál es el propósito del viaje del pasajero?',
        options: [
          'Visitar a familiares durante las vacaciones de verano',
          'Asistir a una conferencia académica por una semana',
          'Comprar artículos perecederos para su empresa',
          'Instalar ordenadores portátiles en un colegio'
        ],
        correctIndex: 1,
        difficulty: 'medium',
        speaker: 'Oficial y Pasajero de Aduanas',
        dialogueContext: 'Control de inmigración en el aeropuerto Adolfo Suárez Madrid-Barajas',
        explainMore: {
          summaryOfQuestion: 'Identify the exact stated motive for the passenger entering Spain from the spoken audio.',
          exactTextSnippet: 'Pasajero: "Vengo a participar en un congreso académico durante siete días."',
          simplifiedExplanation: '"Congreso académico durante siete días" translates directly to an academic conference for seven days (one week).',
          hint: 'Listen closely for "congreso académico" and "siete días".',
          mnemonic: 'Siete días = Una semana; Congreso = Conference.'
        },
        exploreAnswer: {
          exactParagraph: 'Oficial: "Buenos días. ¿Cuál es el motivo de su estancia en Madrid?" Pasajero: "Vengo a participar en un congreso académico durante siete días."',
          paragraphSummary: 'The dialogue demonstrates a standard border control inquiry regarding length and reason for stay.',
          whyCorrect: 'The passenger explicitly declares "un congreso académico durante siete días" (an academic conference for 7 days / one week).',
          whyWrong: [
            'Family vacation was never mentioned in the audio clip.',
            'CORRECT CHOICE.',
            'Perishable items were part of the customs declaration warning, not his trip objective.',
            'The laptop was personal property ("mi ordenador portátil personal"), not for commercial installation.'
          ],
          mnemonic: 'Congreso = Academic Convention / Conference.'
        }
      },
      {
        id: 'aq-sp-2',
        chapterId: 'clep-spanish-1',
        language: 'Spanish',
        audioPrompt: 'Atención pasajeros con destino a Bogotá. El vuelo cuatro-cero-dos ha cambiado su salida a la puerta número dieciocho. Por favor acérquense inmediatamente.',
        audioTranscript: 'Atención pasajeros con destino a Bogotá. El vuelo cuatro-cero-dos ha cambiado su salida a la puerta número dieciocho. Por favor acérquense inmediatamente.',
        question: '¿Qué información crucial anuncia la megafonía del aeropuerto?',
        options: [
          'El vuelo a Bogotá fue cancelado por mal tiempo',
          'El vuelo 402 ahora embarcará por la puerta 18',
          'Los pasajeros deben pagar un cargo extra de equipaje',
          'El avión aterrizará con cuarenta minutos de retraso'
        ],
        correctIndex: 1,
        difficulty: 'hard',
        speaker: 'Megafonía del Aeropuerto',
        dialogueContext: 'Anuncio urgente por los altavoces del aeropuerto internacional',
        explainMore: {
          summaryOfQuestion: 'Determine what change occurred regarding flight 402 departing for Bogotá.',
          exactTextSnippet: 'El vuelo cuatro-cero-dos ha cambiado su salida a la puerta número dieciocho.',
          simplifiedExplanation: 'The flight changed its departure gate to gate number 18 ("dieciocho").',
          hint: 'Listen for numbers: "cuatro-cero-dos" (402) and "dieciocho" (18).',
          mnemonic: 'Puerta = Gate; Dieciocho = 18.'
        },
        exploreAnswer: {
          exactParagraph: 'El vuelo cuatro-cero-dos ha cambiado su salida a la puerta número dieciocho. Por favor acérquense inmediatamente.',
          paragraphSummary: 'Audio announcements test rapid comprehension of flight numbers and gate changes under standard airport acoustics.',
          whyCorrect: '"Ha cambiado su salida a la puerta número dieciocho" confirms the gate reassignment to 18 for flight 402.',
          whyWrong: [
            'No cancellation was announced; only a gate change.',
            'CORRECT CHOICE.',
            'Luggage fees were never addressed in the broadcast.',
            'A arrival delay is not mentioned; the announcement concerns immediate boarding gate departure.'
          ],
          mnemonic: 'Gate 18: Dieci-ocho at the gate!'
        }
      }
    ]
  },
  {
    id: 'clep-biology-1',
    title: 'CLEP Biology: Cellular Respiration & Bioenergetics',
    subject: 'Biology',
    category: 'Natural Sciences (CLEP Biology)',
    description: 'Master Glycolysis, the Krebs Cycle, Oxidative Phosphorylation, ATP synthase, and high-yield bioenergetic mnemonics.',
    uploadDate: '2026-09-28',
    rawText: `Chapter 7: Cellular Respiration and Energy Harvesting.
Cellular respiration is the metabolic pathway through which aerobic organisms catabolize glucose into usable chemical energy in the form of adenosine triphosphate (ATP). The overall chemical equation is: C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + approximately 30 to 32 ATP.

This complex pathway proceeds through three continuous stages:
1. Glycolysis: Occurring exclusively in the cytoplasm, one 6-carbon glucose molecule is cleaved into two 3-carbon pyruvate molecules, yielding a net gain of 2 ATP and 2 NADH. Glycolysis does not require oxygen (anaerobic).
2. The Citric Acid Cycle (Krebs Cycle): In the mitochondrial matrix, pyruvate is decarboxylated into Acetyl-CoA. Acetyl-CoA joins oxaloacetate (4 carbons) to generate citrate (6 carbons). Through cyclical redox reactions, it reduces electron carriers, producing 6 NADH, 2 FADH2, and 2 ATP per glucose molecule.
3. Oxidative Phosphorylation: Localized along the inner mitochondrial membrane (cristae), the Electron Transport Chain (ETC) utilizes electron transfer from NADH and FADH2 to pump protons (H+) from the matrix into the intermembrane space, creating a steep electrochemical proton gradient. ATP synthase then allows protons to flow back down their gradient, driving the mechanical synthesis of ~26-28 ATP via chemiosmosis. Oxygen acts as the ultimate terminal electron acceptor, bonding with low-energy protons to form water (H2O).

A foundational mnemonic used across college biology to remember cellular organelle function is: "Mito = Might = Powerhouse of the cell." Furthermore, the order of electron carriers is remembered by "OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain of electrons."`,
    summary: 'Comprehensive review of aerobic respiration: glycolysis in cytoplasm, citric acid cycle in mitochondrial matrix, and oxidative phosphorylation along the cristae generating the bulk of cellular ATP via chemiosmosis.',
    keyConcepts: [
      {
        term: 'Terminal Electron Acceptor (Oxygen)',
        definition: 'In aerobic cellular respiration, molecular oxygen (O2) serves as the final recipient of electrons at Complex IV of the ETC, reducing to water.',
        exactParagraph: 'Oxygen acts as the ultimate terminal electron acceptor, bonding with low-energy protons to form water (H2O).',
        mnemonic: 'Oxygen = "O" for "Outermost End of the chain".'
      },
      {
        term: 'Chemiosmosis and Proton-Motive Force',
        definition: 'The generation of ATP driven by the flow of hydrogen ions across the inner mitochondrial membrane through ATP synthase.',
        exactParagraph: 'ATP synthase then allows protons to flow back down their gradient, driving the mechanical synthesis of ~26-28 ATP via chemiosmosis.',
        mnemonic: 'CHEMIOSMOSIS: Chemicals (H+) rushing through a waterwheel (ATP Synthase).'
      }
    ],
    vocabulary: [
      {
        word: 'Glycolysis',
        definition: 'The anaerobic breakdown of glucose into two pyruvate molecules in the cytoplasm.',
        contextSentence: 'Occurring exclusively in the cytoplasm, one 6-carbon glucose molecule is cleaved into two 3-carbon pyruvate molecules.',
        mnemonic: 'GLYCO = sugar, LYSIS = splitting. Sugar splitting!'
      },
      {
        word: 'Cristae',
        definition: 'The folds of the inner mitochondrial membrane providing immense surface area for the Electron Transport Chain.',
        contextSentence: 'Localized along the inner mitochondrial membrane (cristae), the Electron Transport Chain pumps protons.',
        mnemonic: 'Cristae = Crests (folds like waves of the sea).'
      }
    ],
    mnemonics: [
      {
        id: 'mnem-bio-1',
        target: 'Mitochondria Function',
        phrase: 'Mito = Might = Powerhouse of the Cell',
        explanation: 'Mitochondria generate the overwhelming majority of cellular ATP via oxidative phosphorylation.',
        subject: 'Biology'
      },
      {
        id: 'mnem-bio-2',
        target: 'Redox Reactions',
        phrase: 'OIL RIG: Oxidation Is Loss, Reduction Is Gain',
        explanation: 'Oxidation is loss of electrons/hydrogen; Reduction is gain of electrons/hydrogen.',
        subject: 'Biology'
      }
    ],
    questions: [
      {
        id: 'q-bio-1',
        chapterId: 'clep-biology-1',
        type: 'concept',
        question: 'During oxidative phosphorylation in aerobic eukaryotes, what molecule acts as the terminal electron acceptor?',
        options: ['NAD+ (Nicotinamide adenine dinucleotide)', 'Pyruvate', 'Molecular Oxygen (O2)', 'Citrate'],
        correctIndex: 2,
        difficulty: 'medium',
        explainMore: {
          summaryOfQuestion: 'Identify the final chemical recipient of electrons at the culmination of the Electron Transport Chain.',
          exactTextSnippet: 'Oxygen acts as the ultimate terminal electron acceptor, bonding with low-energy protons to form water (H2O).',
          simplifiedExplanation: 'Electrons cascade through complexes I-IV and are finally picked up by Oxygen, which combines with H+ to produce metabolic water.',
          hint: 'Think about why animals must breathe in oxygen to survive.',
          mnemonic: 'OIL RIG: Oxygen receives and is Reduced at the end of the line.'
        },
        exploreAnswer: {
          exactParagraph: 'Oxygen acts as the ultimate terminal electron acceptor, bonding with low-energy protons to form water (H2O).',
          paragraphSummary: 'The ETC transfers electrons along four multi-protein complexes, terminating with O2 forming H2O.',
          whyCorrect: 'Oxygen has high electronegativity and pulls electrons from Complex IV, preventing traffic jams in the ETC.',
          whyWrong: [
            'NAD+ is an intermediate electron carrier, not the terminal acceptor.',
            'Pyruvate is the end product of glycolysis and can act as electron acceptor only in lactic acid fermentation.',
            'CORRECT CHOICE.',
            'Citrate is a 6-carbon intermediate in the Krebs Cycle.'
          ],
          mnemonic: 'O2 = The Ultimate End: Takes the electrons to make H2O.'
        }
      },
      {
        id: 'q-bio-2',
        chapterId: 'clep-biology-1',
        type: 'concept',
        question: 'In which exact subcellular compartment does the Citric Acid (Krebs) Cycle take place in human eukaryotic cells?',
        options: ['Cytoplasm / Cytosol', 'Mitochondrial Matrix', 'Intermembrane Space', 'Nucleolus'],
        correctIndex: 1,
        difficulty: 'easy',
        explainMore: {
          summaryOfQuestion: 'The question asks for the specific physical location inside the cell where the Krebs Cycle enzymes operate.',
          exactTextSnippet: 'The Citric Acid Cycle (Krebs Cycle): In the mitochondrial matrix, pyruvate is decarboxylated into Acetyl-CoA.',
          simplifiedExplanation: 'Glycolysis happens outside in cytoplasm, but the Krebs cycle takes place inside the innermost fluid compartment of the mitochondria (the matrix).',
          hint: 'It is inside the inner membrane of the mitochondria, in the fluid matrix.',
          mnemonic: 'Matrix = Middle of Mitochondria.'
        },
        exploreAnswer: {
          exactParagraph: 'The Citric Acid Cycle (Krebs Cycle): In the mitochondrial matrix, pyruvate is decarboxylated into Acetyl-CoA. Acetyl-CoA joins oxaloacetate...',
          paragraphSummary: 'Enzymes catalyzing the citric acid cycle reside in the mitochondrial matrix.',
          whyCorrect: 'The mitochondrial matrix holds the dehydrogenase enzymes and cofactors required for the cyclical steps of the Krebs Cycle.',
          whyWrong: [
            'Cytoplasm is the location of Glycolysis, not the Krebs Cycle.',
            'CORRECT CHOICE.',
            'Intermembrane space is where H+ ions are concentrated to establish the proton gradient.',
            'Nucleolus is inside the nucleus and manufactures ribosomal RNA.'
          ],
          mnemonic: 'Krebs in the Matrix, Glycolysis in the Cytosol.'
        }
      }
    ],
    audioQuestions: [
      {
        id: 'aq-bio-1',
        chapterId: 'clep-biology-1',
        language: 'Spanish',
        audioPrompt: 'Profesor: "Recuerden para el examen CLEP: la mitocondria genera más del noventa por ciento del ATP celular mediante la fosforilación oxidativa gracias al gradiente de protones."',
        audioTranscript: 'Profesor: "Recuerden para el examen CLEP: la mitocondria genera más del noventa por ciento del ATP celular mediante la fosforilación oxidativa gracias al gradiente de protones."',
        question: 'According to the instructor’s spoken lecture, what biological mechanism produces over 90% of cellular ATP?',
        options: [
          'Anaerobic fermentation in the Golgi apparatus',
          'Oxidative phosphorylation via a proton gradient in the mitochondria',
          'Direct photolysis of water in the chloroplast stroma',
          'Substrate-level phosphorylation during cytoplasmic glycolysis'
        ],
        correctIndex: 1,
        difficulty: 'medium',
        speaker: 'Biology Professor',
        dialogueContext: 'Pre-exam review session in university lecture hall',
        explainMore: {
          summaryOfQuestion: 'Listen to the professor’s emphasis on the organelle and process responsible for 90%+ ATP production.',
          exactTextSnippet: 'la mitocondria genera más del noventa por ciento del ATP celular mediante la fosforilación oxidativa gracias al gradiente de protones.',
          simplifiedExplanation: 'The professor identifies the mitochondria and oxidative phosphorylation fueled by proton gradients.',
          hint: 'Listen for "mitocondria", "noventa por ciento", and "fosforilación oxidativa".',
          mnemonic: 'Mito = Might = 90% of ATP.'
        },
        exploreAnswer: {
          exactParagraph: 'ATP synthase then allows protons to flow back down their gradient, driving the mechanical synthesis of ~26-28 ATP via chemiosmosis.',
          paragraphSummary: 'The proton gradient generated by the ETC drives high-efficiency ATP synthesis in the mitochondria.',
          whyCorrect: 'The professor explicitly specified "la mitocondria genera más del noventa por ciento del ATP celular mediante la fosforilación oxidativa gracias al gradiente de protones".',
          whyWrong: [
            'Golgi does not carry out anaerobic fermentation.',
            'CORRECT CHOICE.',
            'Photolysis occurs in plants during photosynthesis, not human cellular respiration.',
            'Glycolysis yields only a minor net of 2 ATP molecules.'
          ],
          mnemonic: 'Mito = Might = Powerhouse.'
        }
      }
    ]
  },
  {
    id: 'clep-history-1',
    title: 'CLEP US History I: Early Republic & The Constitution',
    subject: 'US History',
    category: 'History & Social Sciences (CLEP US History I)',
    description: 'Master the Articles of Confederation, Constitutional Convention of 1787, Great Compromise, and Federalist Papers.',
    uploadDate: '2026-09-28',
    rawText: `Chapter 9: The Creation of the American Republic (1781-1789).
Following independence, the United States was initially governed under the Articles of Confederation (ratified 1781). The Articles established a weak unicameral legislature without an executive branch, federal judiciary, or the power to levy taxes or regulate interstate commerce. Shay's Rebellion (1786-1787) in Massachusetts exposed the critical military and economic vulnerabilities of this confederation.

In May 1787, delegates convened at the Constitutional Convention in Philadelphia. A profound division arose between large and small states:
- The Virginia Plan (drafted by James Madison) proposed a bicameral legislature with representation apportioned strictly by population.
- The New Jersey Plan (introduced by William Paterson) called for a unicameral legislature where each state received equal voting power.
Roger Sherman proposed the Connecticut Compromise (Great Compromise), creating a bicameral Congress: the House of Representatives apportioned by state population, and the Senate granting equal representation (two senators per state).

To resolve disputes over enslaved populations, delegates adopted the Three-Fifths Compromise, counting three out of every five enslaved persons for congressional apportionment and federal taxation. Ratification required nine of the thirteen states and was fiercely debated between Federalists (led by Alexander Hamilton, James Madison, and John Jay, authors of The Federalist Papers) and Anti-Federalists (who demanded a Bill of Rights to protect individual liberties).

A classic historical mnemonic for taxonomy and constitutional order is: "King Philip Came Over For Good Soup" (Kingdom, Phylum, Class, Order, Family, Genus, Species), mirrored in history studies by: "We The People Order Good Freedom."`,
    summary: 'Analysis of America’s transition from the weak Articles of Confederation to the 1787 U.S. Constitution, detailing the Great Compromise, Three-Fifths Compromise, and Federalist-Antifederalist ratification debates.',
    keyConcepts: [
      {
        term: 'The Great Compromise (Connecticut Compromise)',
        definition: 'Agreement balancing small and large state interests by establishing a bicameral legislature: proportional House and equal Senate.',
        exactParagraph: 'Roger Sherman proposed the Connecticut Compromise (Great Compromise), creating a bicameral Congress: the House of Representatives apportioned by state population, and the Senate granting equal representation.',
        mnemonic: 'Sherman’s Scale: Balances big states (House) and small states (Senate).'
      },
      {
        term: 'Shay\'s Rebellion (1786-1787)',
        definition: 'Armed uprising of Massachusetts farmers led by Daniel Shays protesting debt collection, exposing the federal inability to maintain order under the Articles.',
        exactParagraph: 'Shay\'s Rebellion (1786-1787) in Massachusetts exposed the critical military and economic vulnerabilities of this confederation.',
        mnemonic: 'Shay shook the nation to fix the Articles!'
      }
    ],
    vocabulary: [
      {
        word: 'Unicameral',
        definition: 'Having a single legislative chamber.',
        contextSentence: 'The Articles established a weak unicameral legislature without an executive branch.',
        mnemonic: 'Uni = One (like unicycle: one wheel, one legislative room).'
      },
      {
        word: 'Ratification',
        definition: 'The formal approval or validation of a constitution or constitutional amendment.',
        contextSentence: 'Ratification required nine of the thirteen states and was fiercely debated.',
        mnemonic: 'Ratify = Rat = stamp of formal approval.'
      }
    ],
    mnemonics: [
      {
        id: 'mnem-hist-1',
        target: 'Constitutional Ratification',
        phrase: 'Federalists Built Strong Walls, Anti-Federalists Demanded Rights on the Halls',
        explanation: 'Federalists supported strong central government; Anti-Federalists insisted upon the Bill of Rights.',
        subject: 'US History'
      },
      {
        id: 'mnem-hist-2',
        target: 'Shay\'s Rebellion',
        phrase: 'Shay Shook the Confederation',
        explanation: 'Daniel Shays showed the national government was powerless without taxation and army.',
        subject: 'US History'
      }
    ],
    questions: [
      {
        id: 'q-hist-1',
        chapterId: 'clep-history-1',
        type: 'history',
        question: 'Under the Great Compromise (Connecticut Compromise) of 1787, how was representation allocated in the United States Senate?',
        options: [
          'Proportionally according to state free white population',
          'Equally, with exactly two senators representing each state regardless of size',
          'Based on the total amount of federal taxes paid by the state',
          'Apportioned based on total land area in square miles'
        ],
        correctIndex: 1,
        difficulty: 'easy',
        explainMore: {
          summaryOfQuestion: 'The question asks how senatorial representation was determined in Roger Sherman’s compromise.',
          exactTextSnippet: 'the Senate granting equal representation (two senators per state).',
          simplifiedExplanation: 'The Senate treats every state equally with 2 seats each, while the House is based on population.',
          hint: 'Small states like New Jersey refused to be outvoted by large states like Virginia.',
          mnemonic: 'Senate = Same for every state (2 each).'
        },
        exploreAnswer: {
          exactParagraph: 'Roger Sherman proposed the Connecticut Compromise (Great Compromise), creating a bicameral Congress: the House of Representatives apportioned by state population, and the Senate granting equal representation (two senators per state).',
          paragraphSummary: 'The compromise united Madison’s Virginia Plan and Paterson’s New Jersey Plan.',
          whyCorrect: 'The Senate was designed with equal representation (two senators per state) to protect smaller states.',
          whyWrong: [
            'Proportional population representation defines the House of Representatives.',
            'CORRECT CHOICE.',
            'Taxation-based representation was rejected as it favored wealthy maritime states.',
            'Land area was never adopted as an apportionment metric.'
          ],
          mnemonic: 'House = Population; Senate = State equality.'
        }
      }
    ],
    audioQuestions: [
      {
        id: 'aq-hist-1',
        chapterId: 'clep-history-1',
        language: 'Spanish',
        audioPrompt: 'Historiador: "La rebelión de Daniel Shays en mil setecientos ochenta y seis demostró a George Washington y a los líderes fundadores que los Artículos de la Confederación eran incapaces de mantener la estabilidad económica y la seguridad nacional."',
        audioTranscript: 'Historiador: "La rebelión de Daniel Shays en mil setecientos ochenta y seis demostró a George Washington y a los líderes fundadores que los Artículos de la Confederación eran incapaces de mantener la estabilidad económica y la seguridad nacional."',
        question: 'According to the historian’s audio commentary, why was Shays’ Rebellion historically significant?',
        options: [
          'It led directly to the purchase of Louisiana from Napoleon',
          'It proved the Articles of Confederation were too weak to govern the nation',
          'It caused Massachusetts to declare full independence from the union',
          'It established the first national bank under Thomas Jefferson'
        ],
        correctIndex: 1,
        difficulty: 'medium',
        speaker: 'History Scholar',
        dialogueContext: 'CLEP US History Audio Podcast on the Founding Era',
        explainMore: {
          summaryOfQuestion: 'Identify the main effect of Shays’ Rebellion cited by the historian.',
          exactTextSnippet: 'demostró a George Washington y a los líderes fundadores que los Artículos de la Confederación eran incapaces de mantener la estabilidad',
          simplifiedExplanation: 'The rebellion proved the Articles of Confederation were unable to maintain order and security.',
          hint: 'Listen for "incapaces de mantener la estabilidad" (unable to maintain stability).',
          mnemonic: 'Shays Shook the Articles.'
        },
        exploreAnswer: {
          exactParagraph: 'Shay\'s Rebellion (1786-1787) in Massachusetts exposed the critical military and economic vulnerabilities of this confederation.',
          paragraphSummary: 'Shays’ Rebellion was the catalyst uniting nationalists to convene in Philadelphia.',
          whyCorrect: 'The speaker directly confirms that the rebellion demonstrated that the Articles were incapable of maintaining stability and security.',
          whyWrong: [
            'Louisiana Purchase occurred in 1803 under Jefferson, long after Shays.',
            'CORRECT CHOICE.',
            'Massachusetts never seceded; the uprising was suppressed by state militia.',
            'The first national bank was chartered under Alexander Hamilton in 1791.'
          ],
          mnemonic: 'Shays Shook the Confederation into creating the Constitution.'
        }
      }
    ]
  },
  {
    id: 'clep-psychology-1',
    title: 'CLEP Introductory Psychology: Memory & Learning',
    subject: 'Psychology',
    category: 'Social Sciences (CLEP Psychology)',
    description: 'Master Classical Conditioning, Operant Conditioning, Atkinson-Shiffrin 3-stage memory model, and mnemonic chunking.',
    uploadDate: '2026-09-28',
    rawText: `Chapter 6: Learning and Memory Encoding.
Psychological learning models divide predominantly into associative learning and cognitive processing.
Ivan Pavlov discovered Classical Conditioning, demonstrating that an Unconditioned Stimulus (UCS, e.g., food) that reflexively elicits an Unconditioned Response (UCR, salivation) can be paired with a Neutral Stimulus (NS, bell). Through repeated contiguous pairings (acquisition), the neutral stimulus transforms into a Conditioned Stimulus (CS) that triggers a Conditioned Response (CR) in the absence of the UCS.
In contrast, B.F. Skinner developed Operant Conditioning, where voluntary behaviors are shaped through reinforcement (which increases behavior frequency) or punishment (which decreases behavior). Negative reinforcement involves the removal of an aversive stimulus to increase behavior (e.g., buckling a seatbelt to silence an annoying chime).

The Atkinson-Shiffrin Model conceptualizes human memory in three sequential stores:
1. Sensory Memory: High capacity, fleeting storage (<1 sec for iconic visual memory; ~3-4 sec for echoic auditory memory).
2. Short-Term / Working Memory: Limited capacity traditionally measured as 7 +/- 2 items (Miller's Law), lasting ~20-30 seconds unless maintained via rehearsal. Chunking organizes information into meaningful chunks to dramatically expand capacity.
3. Long-Term Memory: Virtually limitless capacity, subdivided into explicit (declarative: episodic and semantic) and implicit (procedural: muscle memory and habits).

A universal psychology mnemonic for statistics and hypothesis testing is: "If the p is low, the null must go" (significance p < 0.05 rejects the null hypothesis). For classical conditioning: "U comes before C in the natural unconditioned state."`,
    summary: 'Core breakdown of classical vs operant conditioning, positive vs negative reinforcement, and the Atkinson-Shiffrin sensory-working-longterm memory architecture.',
    keyConcepts: [
      {
        term: 'Negative Reinforcement',
        definition: 'Increasing the likelihood of a behavior by removing or terminating an unpleasant/aversive stimulus.',
        exactParagraph: 'Negative reinforcement involves the removal of an aversive stimulus to increase behavior (e.g., buckling a seatbelt to silence an annoying chime).',
        mnemonic: 'REINFORCEMENT always INCREASES behavior; NEGATIVE means SUBTRACTING an annoyance.'
      },
      {
        term: 'Miller\'s Law (7 +/- 2)',
        definition: 'The typical capacity limit of human working memory items, expandable via chunking.',
        exactParagraph: 'Short-Term / Working Memory: Limited capacity traditionally measured as 7 +/- 2 items (Miller\'s Law), lasting ~20-30 seconds unless maintained via rehearsal.',
        mnemonic: 'Lucky 7 is the memory limit.'
      }
    ],
    vocabulary: [
      {
        word: 'Chunking',
        definition: 'Cognitive strategy of grouping individual bits of information into meaningful, manageable units.',
        contextSentence: 'Chunking organizes information into meaningful chunks to dramatically expand working memory capacity.',
        mnemonic: 'Chunk it up into bites you can chew!'
      },
      {
        word: 'Echoic Memory',
        definition: 'Sensory memory sub-system dedicated to retaining brief auditory sound echoes (3-4 seconds).',
        contextSentence: '~3-4 sec for echoic auditory memory.',
        mnemonic: 'Echo = Sound repeating in your ears.'
      }
    ],
    mnemonics: [
      {
        id: 'mnem-psych-1',
        target: 'Hypothesis Testing',
        phrase: 'If the p is low, the null must go!',
        explanation: 'When the p-value is less than the significance alpha (0.05), reject the null hypothesis.',
        subject: 'Psychology'
      },
      {
        id: 'mnem-psych-2',
        target: 'Negative Reinforcement vs Punishment',
        phrase: 'Reinforcement makes it RISE, Punishment makes it DIE',
        explanation: 'All reinforcement increases behavior; all punishment decreases behavior.',
        subject: 'Psychology'
      }
    ],
    questions: [
      {
        id: 'q-psych-1',
        chapterId: 'clep-psychology-1',
        type: 'concept',
        question: 'A driver buckles their seatbelt promptly to stop the car’s loud, irritating beeping noise. In Skinnerian operant conditioning, this behavior is maintained by:',
        options: [
          'Positive Reinforcement',
          'Negative Reinforcement',
          'Positive Punishment',
          'Negative Punishment'
        ],
        correctIndex: 1,
        difficulty: 'medium',
        explainMore: {
          summaryOfQuestion: 'The question tests identification of reinforcement vs punishment when an unpleasant stimulus is eliminated.',
          exactTextSnippet: 'Negative reinforcement involves the removal of an aversive stimulus to increase behavior (e.g., buckling a seatbelt to silence an annoying chime).',
          simplifiedExplanation: 'The behavior (buckling) increases because an annoying sound was removed (subtracted).',
          hint: 'The unpleasant sound is TAKEN AWAY (negative) to INCREASE future buckling (reinforcement).',
          mnemonic: 'Negative = Subtract annoyance; Reinforcement = Do it again.'
        },
        exploreAnswer: {
          exactParagraph: 'Negative reinforcement involves the removal of an aversive stimulus to increase behavior (e.g., buckling a seatbelt to silence an annoying chime).',
          paragraphSummary: 'Operant conditioning defines negative reinforcement as strengthening behavior through escape or avoidance of an aversive condition.',
          whyCorrect: 'Buckling the belt removes the unpleasant alarm; because removing an annoyance increases the behavior, it is Negative Reinforcement.',
          whyWrong: [
            'Positive reinforcement adds a pleasant reward (like candy or money).',
            'CORRECT CHOICE.',
            'Positive punishment adds an unpleasant penalty (like a speeding ticket) to decrease behavior.',
            'Negative punishment removes a pleasant privilege (like revoking a driver’s license) to decrease behavior.'
          ],
          mnemonic: 'Reinforce = Increase; Negative = Subtract pain.'
        }
      }
    ],
    audioQuestions: [
      {
        id: 'aq-psych-1',
        chapterId: 'clep-psychology-1',
        language: 'Spanish',
        audioPrompt: 'Psicóloga: "Atención estudiantes: la memoria a corto plazo retiene información únicamente entre veinte y treinta segundos, a menos que utilicemos técnicas activas como el agrupamiento o chunking."',
        audioTranscript: 'Psicóloga: "Atención estudiantes: la memoria a corto plazo retiene información únicamente entre veinte y treinta segundos, a menos que utilicemos técnicas activas como el agrupamiento o chunking."',
        question: 'According to the psychologist’s audio lecture, how long does working memory store items without active rehearsal?',
        options: [
          'Less than one full second',
          'Between twenty and thirty seconds',
          'Approximately fifteen to twenty minutes',
          'Up to two complete days'
        ],
        correctIndex: 1,
        difficulty: 'easy',
        speaker: 'Cognitive Psychologist',
        dialogueContext: 'University audio lecture on cognitive memory architectures',
        explainMore: {
          summaryOfQuestion: 'Extract the spoken duration of unrehearsed short-term memory from the audio.',
          exactTextSnippet: 'la memoria a corto plazo retiene información únicamente entre veinte y treinta segundos',
          simplifiedExplanation: 'The psychologist specifies "entre veinte y treinta segundos" (20 to 30 seconds).',
          hint: 'Listen for the numbers "veinte" (20) and "treinta" (30).',
          mnemonic: '20-30 seconds is the short-term window.'
        },
        exploreAnswer: {
          exactParagraph: 'Short-Term / Working Memory: Limited capacity traditionally measured as 7 +/- 2 items (Miller\'s Law), lasting ~20-30 seconds unless maintained via rehearsal.',
          paragraphSummary: 'Working memory exhibits strict temporal limits without active rehearsal loops.',
          whyCorrect: 'The audio explicitly asserts "únicamente entre veinte y treinta segundos" (between 20 and 30 seconds).',
          whyWrong: [
            'Under one second describes iconic sensory memory.',
            'CORRECT CHOICE.',
            '15-20 minutes is typical for intermediate consolidation.',
            'Two days implies long-term memory storage.'
          ],
          mnemonic: '20 to 30: Working memory is clean and sturdy!'
        }
      }
    ]
  }
];

export const initialUserProgress: UserProgress = {
  energy: 250,
  coins: 25000,
  campaignProgress: 57,
  taskCompleted: 57,
  streak: 8,
  totalQuizzesTaken: 24,
  totalCorrect: 88,
  totalQuestions: 104,
  subjectMastery: {
    Spanish: { attempted: 45, correct: 39, percentage: 86.6, clepScore: 68 },
    Biology: { attempted: 32, correct: 28, percentage: 87.5, clepScore: 65 },
    'US History': { attempted: 27, correct: 21, percentage: 77.7, clepScore: 58 },
    Psychology: { attempted: 20, correct: 18, percentage: 90.0, clepScore: 71 }
  },
  weakAreas: [
    {
      id: 'wa-1',
      chapterId: 'clep-spanish-1',
      subject: 'Spanish',
      concept: 'Subjunctive Mood Triggers (Impersonal expressions)',
      questionText: 'Selecting subjunctive verb endings for irregular verbs with stem changes',
      missedCount: 3,
      lastMissedAt: '2026-09-27'
    },
    {
      id: 'wa-2',
      chapterId: 'clep-history-1',
      subject: 'US History',
      concept: 'Articles of Confederation Limitations',
      questionText: 'Distinguishing unicameral congressional powers vs state commercial taxes',
      missedCount: 2,
      lastMissedAt: '2026-09-26'
    }
  ],
  recentActivity: [
    {
      id: 'act-1',
      timestamp: 'Today, 2:15 PM',
      chapterTitle: 'CLEP Spanish: En el Aeropuerto y El Subjuntivo',
      subject: 'Spanish',
      score: 5,
      total: 5,
      xpEarned: 5000
    },
    {
      id: 'act-2',
      timestamp: 'Yesterday, 8:40 PM',
      chapterTitle: 'CLEP Biology: Cellular Respiration',
      subject: 'Biology',
      score: 4,
      total: 5,
      xpEarned: 4000
    }
  ]
};

// In-memory data store with mutation helpers
class DataStore {
  private chapters: Chapter[] = [...initialChapters];
  private progress: UserProgress = { ...initialUserProgress };

  getChapters(): Chapter[] {
    return this.chapters;
  }

  getChapterById(id: string): Chapter | undefined {
    return this.chapters.find((c) => c.id === id);
  }

  addChapter(chapter: Chapter): Chapter {
    this.chapters.unshift(chapter);
    return chapter;
  }

  getProgress(): UserProgress {
    return this.progress;
  }

  updateProgress(update: Partial<UserProgress>): UserProgress {
    this.progress = { ...this.progress, ...update };
    return this.progress;
  }

  recordQuizResult(result: {
    chapterId: string;
    subject: string;
    score: number;
    total: number;
    missedQuestions?: Array<{ concept: string; questionText: string }>;
  }): UserProgress {
    const xpGained = result.score * 1000;
    const coinsGained = result.score * 250;

    this.progress.energy = Math.max(0, this.progress.energy - 15);
    this.progress.coins += coinsGained;
    this.progress.totalQuizzesTaken += 1;
    this.progress.totalCorrect += result.score;
    this.progress.totalQuestions += result.total;

    // Update subject mastery
    const currentSubject = this.progress.subjectMastery[result.subject] || {
      attempted: 0,
      correct: 0,
      percentage: 0,
      clepScore: 50
    };

    const newAttempted = currentSubject.attempted + result.total;
    const newCorrect = currentSubject.correct + result.score;
    const newPercentage = Math.round((newCorrect / newAttempted) * 100);
    // CLEP scores scale between 20 and 80; 50 is passing.
    // Base 50 + (accuracy - 50) * 0.6
    const calculatedClep = Math.min(80, Math.max(20, Math.round(50 + (newPercentage - 50) * 0.6)));

    this.progress.subjectMastery[result.subject] = {
      attempted: newAttempted,
      correct: newCorrect,
      percentage: newPercentage,
      clepScore: calculatedClep
    };

    // Update campaign / task progress
    this.progress.campaignProgress = Math.min(100, Math.round((this.progress.totalCorrect / Math.max(1, this.progress.totalQuestions)) * 100));
    this.progress.taskCompleted = Math.min(100, this.progress.taskCompleted + 3);

    // Record weak areas if any missed
    if (result.missedQuestions && result.missedQuestions.length > 0) {
      result.missedQuestions.forEach((mq) => {
        const existing = this.progress.weakAreas.find(
          (w) => w.concept.toLowerCase() === mq.concept.toLowerCase()
        );
        if (existing) {
          existing.missedCount += 1;
          existing.lastMissedAt = new Date().toISOString().split('T')[0];
        } else {
          this.progress.weakAreas.push({
            id: `wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            chapterId: result.chapterId,
            subject: result.subject,
            concept: mq.concept,
            questionText: mq.questionText,
            missedCount: 1,
            lastMissedAt: new Date().toISOString().split('T')[0]
          });
        }
      });
    }

    // Add to recent activity
    const chapter = this.getChapterById(result.chapterId);
    this.progress.recentActivity.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      chapterTitle: chapter?.title || result.chapterId,
      subject: result.subject,
      score: result.score,
      total: result.total,
      xpEarned: xpGained
    });

    if (this.progress.recentActivity.length > 15) {
      this.progress.recentActivity.pop();
    }

    return this.progress;
  }
}

export const dataStore = new DataStore();
