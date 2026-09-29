import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { User, Star, ArrowRight, Sparkles, Flame } from 'lucide-react';

export const PlayerCard: React.FC = () => {
  const { profile, openStreakModal } = useStudyQuest();

  return (
    <div className="parchment-card rounded-2xl p-4 sm:p-5 w-full sm:w-60 shadow-xl border-2 border-[#C5AF82] relative">
      {/* Top Avatar & Name */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar circle with purple border */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-100 to-white border-3 border-[#6366F1] shadow-md flex items-center justify-center -mt-8 mb-2">
          <User className="w-8 h-8 text-[#4338CA]" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[10px]">
            🎓
          </div>
        </div>

        <h3 className="font-cinzel text-base font-black text-slate-900 leading-tight">
          {profile.name}
        </h3>
        <p className="text-xs font-semibold text-amber-900/70 mb-3">{profile.role}</p>
      </div>

      {/* Streak Section */}
      <div className="border-t border-amber-900/20 pt-2.5 text-center">
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800 mb-0.5">
          <span>Keep it up!</span>
          <Sparkles className="w-3 h-3 text-amber-600" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-sm font-black text-slate-900 mb-2">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
          <span>{profile.streak} Day Streak</span>
        </div>

        {/* Star Progress Badges (★ ★ ○ ○ matching the reference image) */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = idx < profile.starsFilled;
            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isFilled
                    ? 'bg-[#4338CA] border-indigo-700 text-white shadow-xs'
                    : 'bg-white/60 border-amber-900/30 text-amber-900/40'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFilled ? 'fill-white' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* Action Link: View Streak Calendar */}
        <button
          onClick={openStreakModal}
          className="w-full text-[11px] font-bold text-amber-950 hover:text-indigo-900 bg-white/60 hover:bg-white border border-amber-900/20 rounded-lg py-1 px-2 transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>View Streak Calendar</span>
          <ArrowRight className="w-3 h-3 text-amber-800" />
        </button>
      </div>
    </div>
  );
};
