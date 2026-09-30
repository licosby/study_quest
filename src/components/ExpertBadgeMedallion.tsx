import React from 'react';
import { Crown, Sparkles, Award } from 'lucide-react';
import { SubjectIconType } from '../types/quest.js';
import { SubjectIcon } from './SubjectIcon.js';

interface ExpertBadgeMedallionProps {
  courseTitle: string;
  icon?: SubjectIconType;
  unlocked?: boolean;
  unlockedDate?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ExpertBadgeMedallion: React.FC<ExpertBadgeMedallionProps> = ({
  courseTitle,
  icon = 'scroll',
  unlocked = false,
  unlockedDate,
  size = 'md',
  showLabel = true,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      wrapper: 'w-8 h-8',
      icon: 'w-4 h-4',
      badgeText: 'text-[9px]',
      crown: 'w-3 h-3 -top-1.5 -right-1.5',
    },
    md: {
      wrapper: 'w-12 h-12',
      icon: 'w-6 h-6',
      badgeText: 'text-[11px]',
      crown: 'w-4 h-4 -top-2 -right-2',
    },
    lg: {
      wrapper: 'w-16 h-16',
      icon: 'w-8 h-8',
      badgeText: 'text-xs',
      crown: 'w-5 h-5 -top-2 -right-2',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer hover:scale-105' : ''} transition-all ${className}`}
      title={unlocked ? `${courseTitle} Expert Badge (Unlocked)` : `${courseTitle} Expert Badge (Locked - Master chapters to 80%+ to unlock)`}
    >
      {/* Medallion Seal */}
      <div className="relative shrink-0">
        <div
          className={`relative ${sizeClasses.wrapper} rounded-2xl flex items-center justify-center border-2 transition-all ${
            unlocked
              ? 'bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 border-amber-500 text-amber-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-800/60 border-slate-600 text-slate-500 opacity-60'
          }`}
        >
          <SubjectIcon icon={icon} className={`${sizeClasses.icon} drop-shadow-xs`} />

          {/* Golden Crown on top right if unlocked */}
          {unlocked ? (
            <div className={`absolute ${sizeClasses.crown} rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 p-0.5 border border-white shadow-xs text-amber-950 flex items-center justify-center animate-bounce`}>
              <Crown className="w-full h-full fill-amber-500 text-amber-900" />
            </div>
          ) : (
            <div className={`absolute ${sizeClasses.crown} rounded-full bg-slate-700 p-0.5 border border-slate-500 text-slate-400 flex items-center justify-center`}>
              <Award className="w-full h-full" />
            </div>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span
              className={`font-cinzel font-black uppercase tracking-wider ${sizeClasses.badgeText} ${
                unlocked ? 'text-amber-950' : 'text-slate-500'
              }`}
            >
              {unlocked ? '👑 Expert' : 'Locked'}
            </span>
            {unlocked && <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />}
          </div>
          <span className="text-[10px] font-bold text-slate-700 block line-clamp-1">
            {courseTitle}
          </span>
          {unlocked && unlockedDate && (
            <span className="text-[9px] text-amber-900/70 font-semibold block">
              {unlockedDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
