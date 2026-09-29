import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { UploadCloud, Star, Sparkles, BookOpen } from 'lucide-react';

export const ParchmentRibbon: React.FC = () => {
  const { profile, openUploadModal, openNewQuestModal } = useStudyQuest();

  return (
    <div className="relative w-full pt-4 pb-2 z-20 flex flex-col items-center">
      {/* Top Header Bar Container */}
      <div className="w-full max-w-7xl px-4 sm:px-6 flex items-center justify-between mb-2">
        {/* Top-Left: Sapphire Crest Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-11 h-11 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-xl flex items-center justify-center border-2 border-amber-400/80 shadow-xl shadow-black/60">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-300 absolute -top-1 -right-1" />
          </div>
          <div>
            <span className="font-cinzel font-black tracking-widest text-amber-200 text-sm sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] block">
              STUDY QUEST
            </span>
            <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase drop-shadow-xs">
              Adventure Learning
            </span>
          </div>
        </div>

        {/* Top-Right: Interactive "new quest. ☆" button */}
        <button
          onClick={openNewQuestModal}
          className="parchment-card px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold text-amber-950 flex items-center gap-1.5 shadow-md border border-amber-400 hover:border-amber-600 hover:bg-white active:scale-95 transition-all cursor-pointer"
          title="Open New Quest Expeditions"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-300" />
          <span>new quest. ☆</span>
        </button>
      </div>

      {/* Slim Curved Parchment Ribbon Banner */}
      <div className="relative mx-auto my-1 flex flex-col items-center max-w-lg w-full px-4">
        {/* Ribbon banner */}
        <div className="relative w-full max-w-md text-center py-2.5 px-8 parchment-ribbon rounded-lg shadow-xl border border-[#C5AF82]">
          {/* Folded ribbon left tail */}
          <div className="absolute -left-3 top-1.5 w-4 h-full bg-[#DCC8A0] border-l border-b border-[#A68A56] transform -skew-y-12 -z-10 rounded-l-sm" />
          {/* Folded ribbon right tail */}
          <div className="absolute -right-3 top-1.5 w-4 h-full bg-[#DCC8A0] border-r border-b border-[#A68A56] transform skew-y-12 -z-10 rounded-r-sm" />

          <h1 className="font-cinzel text-lg sm:text-2xl font-bold text-slate-900 tracking-wide">
            Welcome back, <span className="text-[#1E3A8A] font-black">{profile.name}!</span>
          </h1>
        </div>

        {/* High-Contrast Subtitle Plate (Fixes "barely visible on dark background" issue) */}
        <div className="parchment-card px-5 py-1.5 rounded-full mt-2.5 mb-3 shadow-md border border-[#C5AF82] text-center">
          <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">
            Turn your textbooks into trivia. <span className="font-extrabold text-[#047857]">Learn, play, conquer!</span>
          </p>
        </div>

        {/* Centered Emerald "Upload Chapter" Button with golden border & glow */}
        <div className="relative">
          <button
            onClick={openUploadModal}
            className="group relative flex items-center gap-2.5 bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white px-7 py-2.5 rounded-full font-cinzel font-bold text-sm tracking-wider shadow-xl shadow-black/50 border-2 border-amber-300 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span className="drop-shadow-xs">Upload Chapter</span>
          </button>

          {/* Playful green curved arrow annotation */}
          <svg
            className="absolute -right-7 -top-1 w-6 h-6 text-emerald-400 pointer-events-none transform rotate-12 drop-shadow-md"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
      </div>
    </div>
  );
};
