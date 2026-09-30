import React, { useEffect, useState } from 'react';
import { Compass, Flag, Sparkles, CheckCircle2, ChevronRight, Landmark, MapPin } from 'lucide-react';

interface TravelAnimationProps {
  fromChapterTitle: string;
  toChapterTitle?: string;
  destinationName: string;
  fromPercentage: number;
  toPercentage: number;
  onContinue?: () => void;
}

export const TravelAnimation: React.FC<TravelAnimationProps> = ({
  fromChapterTitle,
  toChapterTitle,
  destinationName,
  fromPercentage,
  toPercentage,
  onContinue,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(fromPercentage);
  const [travelerPosition, setTravelerPosition] = useState(15); // Percentage across track
  const [hasArrived, setHasArrived] = useState(false);

  useEffect(() => {
    // Start travel animation after short initial pause
    const timer = setTimeout(() => {
      setAnimatedProgress(toPercentage);
      setTravelerPosition(85);
    }, 400);

    const arrivalTimer = setTimeout(() => {
      setHasArrived(true);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(arrivalTimer);
    };
  }, [fromPercentage, toPercentage]);

  return (
    <div className="w-full parchment-card rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-[#C5AF82] my-6 relative overflow-hidden text-left animate-in fade-in">
      {/* Background Cartography Compass Rose Watermark */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 pointer-events-none">
        <Compass className="w-full h-full text-amber-950 animate-spin-slow" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-900/20 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md border border-amber-200">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
              Expedition Progress
            </span>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900">
              Traveling to Next Quest Waypoint...
            </h3>
          </div>
        </div>

        <div className="bg-amber-400/30 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-cinzel font-black text-amber-950 flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>+{Math.max(10, toPercentage - fromPercentage)}% Route Distance</span>
        </div>
      </div>

      {/* Visual Travel Trail Map */}
      <div className="relative py-6 px-4 sm:px-8 bg-amber-900/5 rounded-2xl border border-amber-900/10 mb-5 overflow-hidden">
        {/* Terrain Contour Dashed Path Line */}
        <div className="absolute top-1/2 left-8 right-8 h-2 -translate-y-1/2 bg-amber-900/20 rounded-full overflow-hidden">
          {/* Animated Gold Fill Path */}
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-amber-500 transition-all duration-1500 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

        {/* Trail Stations Grid */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Origin Station (Completed Chapter) */}
          <div className="flex flex-col items-center text-center max-w-[130px]">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-800 text-amber-200 flex items-center justify-center shadow-lg border-2 border-emerald-400 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center border border-amber-100 shadow-xs">
                ✓
              </span>
            </div>
            <span className="font-cinzel text-[10px] font-black uppercase text-emerald-900">
              Checkpoint Mastered
            </span>
            <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
              {fromChapterTitle}
            </span>
          </div>

          {/* Animated Traveling Icon (Scholar / Adventurer with Compass aura) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1500 ease-out flex flex-col items-center pointer-events-none"
            style={{ left: `calc(${travelerPosition}% - 24px)` }}
          >
            {/* Pulsating Golden Travel Token */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
              <Compass className="w-6 h-6 text-amber-950 animate-spin-slow" />
              <div className="absolute inset-0 rounded-2xl bg-amber-400/40 animate-ping" />
            </div>

            {/* Travel Tag */}
            <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 text-amber-300 font-cinzel text-[9px] font-bold shadow-md whitespace-nowrap">
              {hasArrived ? 'Arrived!' : 'Marching Forward...'}
            </span>
          </div>

          {/* Destination Station (Next Chapter or Landmark Citadel) */}
          <div className="flex flex-col items-center text-center max-w-[140px]">
            <div
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all duration-500 mb-2 ${
                hasArrived
                  ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 text-amber-950 border-amber-500 scale-110'
                  : 'bg-white/80 border-[#C5AF82] text-amber-900'
              }`}
            >
              {toChapterTitle && toChapterTitle !== destinationName ? (
                <MapPin className="w-6 h-6 text-amber-900" />
              ) : (
                <Landmark className="w-6 h-6 text-amber-900" />
              )}
              <Flag className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600 absolute -top-1 -right-1" />
            </div>
            <span className="font-cinzel text-[10px] font-black uppercase text-amber-950">
              Next Waypoint
            </span>
            <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
              {toChapterTitle || destinationName}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Adventure Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-cinzel font-bold text-slate-900">
          <span className="flex items-center gap-1.5 text-amber-950 font-black">
            <Flag className="w-3.5 h-3.5 text-amber-700" />
            Route to {destinationName}
          </span>
          <span className="text-emerald-900 font-black text-sm">
            {animatedProgress}% Route Complete
          </span>
        </div>

        {/* Outer Parchment Bar Frame */}
        <div className="relative w-full h-5 rounded-full bg-amber-950/15 p-0.5 border border-[#C5AF82] shadow-inner overflow-hidden">
          {/* Inner Animated Gold Ingot Bar */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-amber-500 to-yellow-400 transition-all duration-1500 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Continue Action Button */}
      {onContinue && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg border border-amber-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>Proceed Down Quest Route</span>
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      )}
    </div>
  );
};
