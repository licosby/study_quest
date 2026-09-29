import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const { isAchievementsModalOpen, closeAchievementsModal, achievements } = useStudyQuest();

  if (!isAchievementsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center border border-amber-500 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Study Quest Trophies
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Quest Achievements
              </h2>
            </div>
          </div>

          <button
            onClick={closeAchievementsModal}
            className="p-1.5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-white/90 border-[#C5AF82] shadow-xs'
                  : 'bg-amber-950/5 border-amber-900/15 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  ach.unlocked ? 'bg-amber-100 border border-amber-300' : 'bg-slate-200 border border-slate-300'
                }`}
              >
                {ach.icon}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-cinzel text-xs font-bold text-slate-900">{ach.title}</h4>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{ach.description}</p>
                {ach.unlocked && ach.unlockedDate && (
                  <span className="text-[9px] font-bold text-amber-900 mt-1 block">
                    Unlocked on {ach.unlockedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-amber-900/20">
          <button
            onClick={closeAchievementsModal}
            className="bg-slate-900 hover:bg-slate-800 text-amber-200 font-cinzel font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer shadow-md"
          >
            Return to Quest
          </button>
        </div>
      </div>
    </div>
  );
};
