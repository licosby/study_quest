import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { BookOpen, Star, Flame } from 'lucide-react';

export const GlobalStatsRibbon: React.FC = () => {
  const { profile } = useStudyQuest();

  return (
    <div className="relative mx-auto my-3 flex justify-center w-full max-w-lg px-4">
      {/* Parchment ribbon container */}
      <div className="relative w-full max-w-md py-2.5 px-6 parchment-ribbon rounded-lg shadow-lg border border-[#C5AF82] flex items-center justify-around text-slate-900">
        {/* Left ribbon tail */}
        <div className="absolute -left-3 top-1.5 w-4 h-full bg-[#DCC8A0] border-l border-b border-[#A68A56] transform -skew-y-12 -z-10 rounded-l-sm" />
        {/* Right ribbon tail */}
        <div className="absolute -right-3 top-1.5 w-4 h-full bg-[#DCC8A0] border-r border-b border-[#A68A56] transform skew-y-12 -z-10 rounded-r-sm" />

        {/* 1. Courses */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-800" />
          <div className="text-left">
            <span className="font-cinzel text-base font-black text-slate-900 block leading-tight">
              {profile.coursesCount}
            </span>
            <span className="text-[10px] font-bold text-amber-950/70 uppercase tracking-wider">
              Courses
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-amber-900/20" />

        {/* 2. Chapters Completed */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
          <div className="text-left">
            <span className="font-cinzel text-base font-black text-slate-900 block leading-tight">
              {profile.chaptersCompleted}
            </span>
            <span className="text-[10px] font-bold text-amber-950/70 uppercase tracking-wider">
              Chapters Done
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-amber-900/20" />

        {/* 3. Day Streak */}
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
          <div className="text-left">
            <span className="font-cinzel text-base font-black text-slate-900 block leading-tight">
              {profile.streak}
            </span>
            <span className="text-[10px] font-bold text-amber-950/70 uppercase tracking-wider">
              Day Streak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
