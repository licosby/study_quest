import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { X, Flame, Star, CheckCircle2 } from 'lucide-react';

export const StreakCalendarModal: React.FC = () => {
  const { isStreakModalOpen, closeStreakModal, profile } = useStudyQuest();

  if (!isStreakModalOpen) return null;

  // Days of current week
  const days = [
    { day: 'Mon', date: 'Sep 22', active: true },
    { day: 'Tue', date: 'Sep 23', active: false },
    { day: 'Wed', date: 'Sep 24', active: false },
    { day: 'Thu', date: 'Sep 25', active: false },
    { day: 'Fri', date: 'Sep 26', active: true },
    { day: 'Sat', date: 'Sep 27', active: true },
    { day: 'Sun', date: 'Sep 28', active: true, today: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-300">
              <Flame className="w-6 h-6 fill-orange-400" />
            </div>
            <div>
              <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Study Cadence
              </span>
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {profile.streak} Day Streak
              </h3>
            </div>
          </div>

          <button
            onClick={closeStreakModal}
            className="p-1.5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 mb-6 leading-relaxed">
          Daily questing locks academic concepts into long-term memory. Maintain your streak to earn bonus multiplier stars!
        </p>

        {/* Days Row */}
        <div className="grid grid-cols-7 gap-1.5 mb-6 text-center">
          {days.map((d, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center ${
                d.active
                  ? 'bg-gradient-to-b from-orange-400 to-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                  : 'bg-white/60 text-slate-400 border-[#C5AF82]'
              } ${d.today ? 'ring-2 ring-indigo-600 ring-offset-1' : ''}`}
            >
              <span className="text-[10px] uppercase font-cinzel">{d.day}</span>
              <span className="text-xs font-black my-0.5">{d.date.split(' ')[1]}</span>
              {d.active ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-amber-100/70 border border-amber-300 p-4 rounded-2xl text-xs text-amber-950 flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-amber-600 fill-amber-500 shrink-0" />
          <div>
            <span className="font-cinzel font-bold block">Next Reward: 4-Day Star Badge</span>
            <span className="text-[11px] text-amber-900/80">Complete any chapter quiz today to claim.</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={closeStreakModal}
            className="bg-slate-900 hover:bg-slate-800 text-amber-200 font-cinzel font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer shadow-md"
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
