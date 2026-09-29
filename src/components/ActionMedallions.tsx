import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { Star, Scroll, BarChart2, Trophy } from 'lucide-react';

export const ActionMedallions: React.FC = () => {
  const { startTrivia, setActiveView, openAchievementsModal, activeCourse } = useStudyQuest();

  const actions = [
    {
      id: 'trivia',
      label: 'Start Trivia',
      icon: Star,
      onClick: () => startTrivia(activeCourse || undefined),
    },
    {
      id: 'summaries',
      label: 'Summaries',
      icon: Scroll,
      onClick: () => setActiveView('summaries'),
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart2,
      onClick: () => setActiveView('progress'),
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      onClick: () => openAchievementsModal(),
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 my-2">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={act.onClick}
            className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer active:scale-95 transition-transform"
          >
            {/* Glowing Emerald Circle with Golden Rim */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] border-2 border-amber-300 shadow-xl shadow-black/50 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-200 transition-all">
              {/* Inner highlight ring */}
              <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 drop-shadow-md group-hover:text-white transition-colors" />
            </div>

            {/* Clean gold/ivory label */}
            <span className="font-cinzel text-xs font-bold text-amber-100 group-hover:text-amber-300 transition-colors drop-shadow-sm">
              {act.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
