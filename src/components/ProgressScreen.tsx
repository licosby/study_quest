import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { ArrowLeft, Target, Award, Flame, Star, BookOpen, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { SubjectIcon } from './SubjectIcon.js';

export const ProgressScreen: React.FC = () => {
  const { profile, courses, setActiveView, startTrivia } = useStudyQuest();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveView('map')}
          className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-amber-900 bg-white/80 hover:bg-white border border-[#C5AF82] px-4 py-2 rounded-full shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quest Map</span>
        </button>

        <span className="font-cinzel text-xs font-bold text-amber-100">
          Cartographer's Ledger & CLEP Mastery
        </span>
      </div>

      {/* Main Score Gauge Banner */}
      <div className="parchment-card rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#C5AF82] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <span className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-900 block mb-2">
              ACE Recommended Passing Standard: 50+
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {profile.clepReadiness >= 50
                ? 'College Credit Ready! 🎓'
                : 'Expedition In Progress'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Based on your chapter completions and 100% multiple-choice accuracy, your estimated CLEP scaled readiness is <strong>{profile.clepReadiness}</strong> on the standard 20-80 examination scale.
            </p>
          </div>

          {/* Big Score Gauge Medallion */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-100 to-amber-200/80 rounded-2xl border-2 border-amber-400 shadow-md text-center">
            <span className="font-cinzel text-[11px] font-black uppercase tracking-wider text-amber-950">
              Estimated Scaled Score
            </span>
            <span className="font-cinzel text-5xl font-black text-slate-950 my-1">
              {profile.clepReadiness}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-xs">
              Proficient (50+ Passing)
            </span>
          </div>
        </div>
      </div>

      {/* Course Breakdown Cards */}
      <div className="mb-8">
        <h2 className="font-cinzel text-lg font-black text-amber-100 mb-4">
          Course Progression ({courses.length} Active Subjects)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="parchment-card rounded-2xl p-4 sm:p-5 border border-[#C5AF82] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-200 flex items-center justify-center shrink-0 border border-amber-300">
                      <SubjectIcon icon={course.icon} className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-sm font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-amber-950/70 font-semibold">
                        {course.chaptersCount} Chapters in Syllabus
                      </p>
                    </div>
                  </div>
                  <span className="font-cinzel text-xs font-black text-slate-900">
                    {course.completedPercentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-amber-900/15 rounded-full overflow-hidden mt-3 mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full"
                    style={{ width: `${course.completedPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-900/10 mt-2">
                <span className="text-[10px] text-slate-500 font-bold">100% Multiple Choice</span>
                <button
                  onClick={() => startTrivia(course)}
                  className="text-xs font-cinzel font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-emerald-800" />
                  <span>Launch Trivia</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Areas Engine */}
      <div className="parchment-card rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C5AF82]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
            <h2 className="font-cinzel text-lg font-bold text-slate-900">Targeted Weak Areas</h2>
          </div>
          <span className="text-xs font-semibold text-amber-950">Adaptive Drill Engine</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed mb-4">
          Study Quest records concepts with trick distractors to focus your multiple-choice practice directly where it counts:
        </p>

        <div className="space-y-3 mb-6">
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-cinzel text-xs font-black text-slate-900">
                US History I • Articles of Confederation Direct Taxation
              </span>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                Review Advised
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Distinguishing requisition powers vs sovereign direct taxation.
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-cinzel text-xs font-black text-slate-900">
                Biology • Chemiosmotic Proton Gradient
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Moderate Recall
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Location of hydrogen ion concentration in the mitochondrial intermembrane space.
            </p>
          </div>
        </div>

        <button
          onClick={() => startTrivia(courses[0])}
          className="w-full bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-xs py-3 rounded-full shadow-md border border-amber-300 cursor-pointer active:scale-95 transition-all"
        >
          Launch Weak Areas Practice Quest
        </button>
      </div>
    </div>
  );
};
