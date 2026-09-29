import React, { useState } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { BookOpen, Scroll, Key, Brain, Play, ArrowLeft, Copy, Check, Volume2, Sparkles } from 'lucide-react';
import { playNativeSpeech } from '../utils/audioHelper.js';

export const SummariesScreen: React.FC = () => {
  const { courses, activeCourse, setActiveCourse, startTrivia, setActiveView } = useStudyQuest();

  const course = activeCourse || courses[0];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    course?.chapters[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeChapter =
    course?.chapters.find((ch) => ch.id === selectedChapterId) ||
    course?.chapters[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    playNativeSpeech(text, {
      language: course.title.toLowerCase().includes('spanish') ? 'Spanish' : 'English',
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setActiveView('map')}
          className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-amber-900 bg-white/80 hover:bg-white border border-[#C5AF82] px-4 py-2 rounded-full shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quest Map</span>
        </button>

        {/* Course Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold text-amber-100">Subject:</span>
          <select
            value={course.id}
            onChange={(e) => {
              const found = courses.find((c) => c.id === e.target.value);
              if (found) {
                setActiveCourse(found);
                setSelectedChapterId(found.chapters[0]?.id || '');
              }
            }}
            className="parchment-card text-xs font-bold text-slate-900 rounded-full px-3 py-1.5 border border-[#C5AF82] focus:outline-none cursor-pointer"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapter Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {course.chapters.map((ch) => {
          const isSelected = activeChapter?.id === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`px-4 py-2 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-500'
                  : 'parchment-card text-slate-800 hover:border-amber-500'
              }`}
            >
              {ch.title.split(':')[0]}
            </button>
          );
        })}
      </div>

      {/* Main Parchment Document */}
      {activeChapter && (
        <div className="parchment-card rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#C5AF82] mb-8 space-y-8">
          {/* Header */}
          <div className="border-b border-amber-900/20 pb-5">
            <span className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-900 block mb-1">
              {course.title} • Syllabus Archive
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
              {activeChapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {activeChapter.description}
            </p>
          </div>

          {/* Academic Summary Section */}
          <div className="bg-amber-100/60 border border-amber-300 rounded-2xl p-5">
            <h3 className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-950 mb-2">
              📜 Chapter Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeChapter.summary}
            </p>
          </div>

          {/* Key Concepts Grid */}
          <div>
            <h3 className="font-cinzel text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-800" />
              <span>Key Concepts & Grounded Definitions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChapter.keyConcepts.map((kc, i) => (
                <div key={i} className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-cinzel text-sm font-bold text-slate-900">{kc.term}</h4>
                    <button
                      onClick={() => handleSpeak(`${kc.term}: ${kc.definition}`)}
                      className="p-1 rounded-full hover:bg-amber-100 text-amber-800 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">{kc.definition}</p>
                  <blockquote className="text-[11px] font-serif italic text-amber-950 bg-amber-50 p-2.5 rounded-lg border-l-2 border-amber-500">
                    "{kc.exactParagraph}"
                  </blockquote>
                  {kc.mnemonic && (
                    <div className="mt-2 text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-purple-700" />
                      <span>Hook: {kc.mnemonic}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vocabulary Bank */}
          {activeChapter.vocabulary.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Vocabulary Bank</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeChapter.vocabulary.map((v, i) => (
                  <div key={i} className="bg-white/80 border border-[#C5AF82] p-3.5 rounded-xl shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-cinzel text-xs font-black text-slate-900">{v.word}</h5>
                      <button
                        onClick={() => handleSpeak(v.word)}
                        className="text-amber-800 hover:text-amber-950 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-1.5">{v.definition}</p>
                    <span className="text-[10px] text-amber-900 font-serif italic block">
                      "{v.contextSentence}"
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mnemonic Vault */}
          {activeChapter.mnemonics.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-700" />
                <span>Mnemonic Memory Vault</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChapter.mnemonics.map((m) => (
                  <div
                    key={m.id}
                    className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 border border-purple-200 p-4 rounded-2xl shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                          {m.target}
                        </span>
                        <button
                          onClick={() => handleCopy(m.phrase, m.id)}
                          className="p-1 rounded-full hover:bg-purple-100 text-purple-700 cursor-pointer"
                        >
                          {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="font-cinzel text-sm font-black text-purple-950 mb-1">
                        "{m.phrase}"
                      </p>
                      <p className="text-xs text-slate-700">{m.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Play Trivia for this Chapter */}
          <div className="pt-4 border-t border-amber-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-cinzel text-sm font-bold text-slate-900">Ready to conquer this chapter?</h4>
              <p className="text-xs text-slate-600">Test concepts with 100% multiple-choice trivia.</p>
            </div>
            <button
              onClick={() => startTrivia(course, activeChapter)}
              className="bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-xs px-7 py-3 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Chapter Trivia</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
