import React, { useState } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { api } from '../api/client.js';
import { X, UploadCloud, Sparkles, BookOpen, Loader2, CheckCircle2, ArrowRight, FileText, Plus } from 'lucide-react';
import { Chapter, SubjectIconType } from '../types/quest.js';
import { extractTextFromPdf } from '../utils/pdfExtractor.js';
import { SubjectIcon } from './SubjectIcon.js';

export const UploadChapterModal: React.FC = () => {
  const {
    isUploadModalOpen,
    closeUploadModal,
    courses,
    addCourse,
    addNewChapterToCourse,
    setActiveCourse,
    setActiveChapter,
    startTrivia,
  } = useStudyQuest();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'us-history-1');
  const [isAddingInlineCourse, setIsAddingInlineCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseIcon, setNewCourseIcon] = useState<SubjectIconType>('scroll');
  const [newCourseDestination, setNewCourseDestination] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isUploadModalOpen) return null;

  const presets = [
    {
      courseId: 'us-history-1',
      title: 'The Great Compromise & Constitutional Convention',
      text: `In May 1787, delegates convened at the Constitutional Convention in Philadelphia. A profound division arose between large and small states: The Virginia Plan proposed a bicameral legislature apportioned strictly by population, while the New Jersey Plan called for equal voting power per state. Roger Sherman proposed the Great Compromise (Connecticut Compromise), creating a bicameral Congress: the House apportioned by population, and the Senate granting equal representation (two senators per state). To resolve slavery disputes, delegates adopted the Three-Fifths Compromise.`,
    },
    {
      courseId: 'biology',
      title: 'Photosynthesis, Chloroplasts & The Calvin Cycle',
      text: `Photosynthesis is the bioenergetic process converting solar light energy into chemical sugars. In the thylakoid membranes of chloroplasts, the light-dependent reactions split water molecules (photolysis), releasing oxygen gas and generating ATP and NADPH. In the stroma, the Calvin Cycle (light-independent reactions) utilizes the enzyme RuBisCO to fix carbon dioxide into 3-carbon sugars (G3P), which subsequently synthesize glucose.
Mnemonic: "Light in the Thylakoid, Sugar in the Stroma!"`,
    },
    {
      courseId: 'ethics',
      title: 'Aristotle’s Nicomachean Ethics & The Golden Mean',
      text: `Aristotle’s virtue ethics posits that the ultimate human good is Eudaimonia (flourishing or living well). Virtue is cultivated through habituation and rational choice, occupying a Golden Mean between two extremes of excess and deficiency. For instance, courage is the mean between cowardice (deficiency) and rashness (excess). Truthfulness is the mean between false modesty and boastfulness.
Mnemonic: "Golden Mean: Right in between excess and lean!"`,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSelectedCourseId(p.courseId);
    setIsAddingInlineCourse(false);
    setChapterTitle(p.title);
    setText(p.text);
    setErrorMsg(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setChapterTitle(file.name.replace(/\.[^/.]+$/, ''));
    setErrorMsg(null);

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

    if (isPdf) {
      setIsExtractingFile(true);
      try {
        const extracted = await extractTextFromPdf(file);
        if (!extracted || extracted.length < 20) {
          setErrorMsg('PDF could not be parsed into text. Please ensure it is not a scanned image, or copy-paste text directly.');
        } else {
          setText(extracted);
        }
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        setErrorMsg('Failed to read PDF file. Please try pasting the text or using a text document.');
      } finally {
        setIsExtractingFile(false);
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCourseSelect = (val: string) => {
    if (val === '__new__') {
      setIsAddingInlineCourse(true);
      setSelectedCourseId('__new__');
    } else {
      setIsAddingInlineCourse(false);
      setSelectedCourseId(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length < 30) {
      setErrorMsg('Please paste or upload at least 30 characters of chapter text.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const steps = [
      'Parsing textbook chapter and academic concepts...',
      'Extracting key terms, definitions, and context...',
      'Synthesizing 100% multiple-choice questions...',
      'Synthesizing visual science diagrams if applicable...',
      'Formulating rhyming and acronym memory mnemonics...',
      'Grounding Explain More deep context breakdown...',
    ];

    let stepIdx = 0;
    setCurrentStep(steps[0]);
    const timer = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setCurrentStep(steps[stepIdx]);
    }, 1200);

    try {
      let targetCourse = courses.find((c) => c.id === selectedCourseId);

      // If user selected inline new course
      if (isAddingInlineCourse || !targetCourse) {
        targetCourse = addCourse({
          title: newCourseTitle.trim() || 'Custom Subject',
          icon: newCourseIcon,
          chaptersCount: 1,
          description: `Expedition quest route for ${newCourseTitle.trim() || 'Custom Subject'}.`,
          destinationName: newCourseDestination.trim() || `The Citadel of ${newCourseTitle.trim() || 'Custom Subject'}`,
        });
      }

      const res = await api.uploadChapter({
        text,
        title: chapterTitle || 'New Quest Chapter',
        subject: targetCourse.title as any,
      });

      clearInterval(timer);

      const newChapter: Chapter = {
        id: res.chapter.id,
        courseId: targetCourse.id,
        title: res.chapter.title,
        chapterNumber: (targetCourse.chapters.length || 0) + 1,
        completed: false,
        description: res.chapter.description,
        rawText: text,
        summary: res.chapter.summary,
        keyConcepts: (res.chapter.keyConcepts || []).map((kc: any) => ({
          ...kc,
          mnemonicExplanation: kc.mnemonicExplanation || 'Connects the core definition with memory recall.',
        })),
        vocabulary: res.chapter.vocabulary || [],
        mnemonics: (res.chapter.mnemonics || []).map((m: any) => ({
          id: m.id || `m-${Date.now()}`,
          target: m.target,
          phrase: m.phrase,
          rhymeOrAcronym: m.rhymeOrAcronym || m.phrase,
          explanation: m.explanation,
        })),
        questions: (res.chapter.questions || []).map((q: any) => ({
          ...q,
          courseId: targetCourse!.id,
        })),
        audioQuestions: (res.chapter.audioQuestions || []).map((aq: any) => ({
          ...aq,
          courseId: targetCourse!.id,
        })),
      };

      addNewChapterToCourse(targetCourse.id, newChapter);
      setActiveCourse(targetCourse);
      setActiveChapter(newChapter);
      closeUploadModal();

      // Launch newly extracted trivia session
      startTrivia(targetCourse, newChapter);
    } catch (err: any) {
      clearInterval(timer);
      console.error('Extraction error:', err);
      setErrorMsg(err.message || 'Failed to process chapter. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-800 text-amber-200 flex items-center justify-center border border-amber-300 shadow-md">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Study Quest Ingestion
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Upload Textbook Chapter
              </h2>
            </div>
          </div>

          <button
            onClick={closeUploadModal}
            className="w-9 h-9 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Presets */}
        <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span className="font-cinzel text-xs font-black text-amber-950 uppercase tracking-wider">
              Quick 1-Click Sample Chapters:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-xs font-bold bg-white/80 hover:bg-white text-slate-900 border border-amber-300 px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                {p.title.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Assign to Course Dropdown + Add Course Option */}
          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-1.5">
              Assign to Course Route
            </label>
            <select
              value={isAddingInlineCourse ? '__new__' : selectedCourseId}
              onChange={(e) => handleCourseSelect(e.target.value)}
              className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.chaptersCount} Chapters)
                </option>
              ))}
              <option value="__new__" className="font-black text-emerald-800">
                ➕ + Add New Course Route...
              </option>
            </select>
          </div>

          {/* Inline New Course Creator if "+ Add New Course..." selected */}
          {isAddingInlineCourse && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-400 space-y-3 animate-in fade-in">
              <span className="font-cinzel text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-700" />
                Configure New Subject Route:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry, French"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Landmark Destination Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Alchemical Citadel"
                    value={newCourseDestination}
                    onChange={(e) => setNewCourseDestination(e.target.value)}
                    className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Icon selector for the new course */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Select Waypoint Marker Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['scroll', 'dome', 'scales', 'star', 'flask', 'calculator', 'brain', 'books'] as SubjectIconType[]).map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewCourseIcon(ic)}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                        newCourseIcon === ic
                          ? 'border-amber-500 bg-amber-200 font-bold'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <SubjectIcon icon={ic} className="w-4 h-4 text-slate-800" />
                      <span className="text-[10px] capitalize">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chapter Title */}
          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-1.5">
              Chapter Title
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. Chapter 4: Cellular Respiration and Glycolysis"
              className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* File Upload Dropzone for .pdf and .txt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider">
                Chapter Text (PDF or Text Document)
              </label>
              <label className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer bg-white/80 px-3 py-1 rounded-lg border border-[#C5AF82]">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Upload .pdf or .txt File</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedFileName && (
              <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between">
                <span>Selected File: {uploadedFileName}</span>
                {isExtractingFile && <span className="text-amber-700 flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing PDF...</span>}
              </div>
            )}

            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste textbook chapter text, lecture transcription, or import a .pdf/.txt document above..."
              className="w-full bg-white border border-[#C5AF82] rounded-2xl p-4 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex items-center justify-between text-[11px] text-amber-900/60 mt-1">
              <span>{text.length} characters</span>
              <span>100% Multiple Choice + Rhyming Mnemonics</span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-amber-900/5 p-3 rounded-xl border border-amber-900/10 text-[11px] font-bold text-slate-800">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              PDF & TXT Parser
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              100% Multiple Choice
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Catchy Explained Mnemonics
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || isExtractingFile || text.trim().length < 30}
            className="w-full bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-sm py-3.5 rounded-full shadow-lg border-2 border-amber-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mt-4"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>{currentStep}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Convert into Study Quest</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
