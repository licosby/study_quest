import React from 'react';
import { Award, Crown, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChapterMasteryBarProps {
  mastery?: number; // 0 to 100
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

export interface MasteryTierInfo {
  tier: 'Unexplored' | 'Novice' | 'Adept' | 'Scholar' | 'Grandmaster';
  label: string;
  badgeColor: string;
  barGradient: string;
  icon: React.ReactNode;
}

export function getMasteryTier(percentage: number = 0): MasteryTierInfo {
  const p = Math.max(0, Math.min(100, Math.round(percentage)));

  if (p === 100) {
    return {
      tier: 'Grandmaster',
      label: 'Grandmaster (100%)',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-400 font-black',
      barGradient: 'from-amber-500 via-yellow-400 to-amber-300',
      icon: <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />,
    };
  }
  if (p >= 80) {
    return {
      tier: 'Scholar',
      label: `Scholar (${p}%)`,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
      barGradient: 'from-purple-600 via-indigo-500 to-purple-400',
      icon: <Sparkles className="w-3 h-3 text-purple-600 fill-purple-500" />,
    };
  }
  if (p >= 50) {
    return {
      tier: 'Adept',
      label: `Adept (${p}%)`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      barGradient: 'from-emerald-600 via-teal-500 to-emerald-400',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    };
  }
  if (p > 0) {
    return {
      tier: 'Novice',
      label: `Novice (${p}%)`,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200 font-medium',
      barGradient: 'from-amber-600 via-amber-500 to-yellow-400',
      icon: <Award className="w-3 h-3 text-amber-600" />,
    };
  }
  return {
    tier: 'Unexplored',
    label: 'Unexplored (0%)',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
    barGradient: 'from-slate-400 to-slate-300',
    icon: <Award className="w-3 h-3 text-slate-400" />,
  };
}

export const ChapterMasteryBar: React.FC<ChapterMasteryBarProps> = ({
  mastery = 0,
  compact = false,
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round(mastery)));
  const tierInfo = getMasteryTier(percentage);

  if (compact) {
    return (
      <div className={`w-full ${className}`}>
        {showLabel && (
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
            <span className="flex items-center gap-1 font-cinzel text-amber-950 font-black">
              {tierInfo.icon}
              Mastery
            </span>
            <span className={percentage >= 80 ? 'text-purple-900 font-black' : 'text-slate-800'}>
              {percentage}%
            </span>
          </div>
        )}
        <div className="h-2 w-full rounded-full bg-amber-950/15 p-0.5 border border-[#C5AF82] overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tierInfo.barGradient} transition-all duration-700 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-950">
              Chapter Mastery
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 shadow-xs ${tierInfo.badgeColor}`}
            >
              {tierInfo.icon}
              <span>{tierInfo.tier}</span>
            </span>
          </div>

          <span
            className={`text-xs font-black font-cinzel ${
              percentage >= 80 ? 'text-purple-950 font-black' : 'text-slate-800'
            }`}
          >
            {percentage}% Accuracy
          </span>
        </div>
      )}

      {/* Outer Parchment Bar Frame */}
      <div className="relative w-full h-3 rounded-full bg-amber-950/15 p-0.5 border border-[#C5AF82] shadow-inner overflow-hidden">
        {/* Fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tierInfo.barGradient} transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {percentage >= 80 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};
