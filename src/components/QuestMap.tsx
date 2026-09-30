import React, { useRef } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { Course } from '../types/quest.js';
import { SubjectIcon } from './SubjectIcon.js';
import { Plus, ChevronLeft, ChevronRight, MapPin, Flag, Castle, Landmark, Compass, Sparkles, CheckCircle2, X, BookOpen, Play } from 'lucide-react';
import mapBackdrop from '../assets/images/adventure_quest_map.jpg';

import { ChapterMasteryBar } from './ChapterMasteryBar.js';
import { ExpertBadgeMedallion } from './ExpertBadgeMedallion.js';

export const QuestMap: React.FC = () => {
  const {
    courses,
    openCourseModal,
    openCourseEditor,
    selectedRouteId,
    setSelectedRouteId,
    startTrivia,
    travelEvent,
    clearTravelEvent,
  } = useStudyQuest();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 70) return 'text-purple-900 bg-purple-100/90 border-purple-300';
    if (pct >= 50) return 'text-emerald-900 bg-emerald-100/90 border-emerald-300';
    if (pct > 0) return 'text-amber-900 bg-amber-100/90 border-amber-300';
    return 'text-slate-700 bg-slate-100/90 border-slate-300';
  };

  // Determine which courses to show: either a single dedicated course expedition with chapters, or the grand overland route
  const activeCourseRoute = courses.find((c) => c.id === selectedRouteId);

  return (
    <div className="relative w-full my-2 select-none">
      {/* Route Switcher Tab Bar above map (Addresses "Each subject should have its own destination") */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none px-2">
        <button
          onClick={() => setSelectedRouteId('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedRouteId === 'all'
              ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-500 font-black'
              : 'parchment-card text-slate-800 hover:border-amber-400'
          }`}
        >
          🌍 Grand Overland Map (All Subjects)
        </button>

        {courses.map((c) => {
          const isSelected = selectedRouteId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedRouteId(c.id);
                openCourseModal(c);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-500 font-black ring-2 ring-amber-300'
                  : 'parchment-card text-slate-800 hover:border-amber-400'
              }`}
            >
              <span>{c.title}</span>
              <span className="text-[10px] text-amber-950/70">→ {c.destination?.name || 'Citadel'}</span>
            </button>
          );
        })}
      </div>

      {/* Expedition Travel Progress Ribbon if a chapter or trivia was completed */}
      {travelEvent && (
        <div className="mb-3 parchment-card rounded-2xl p-3 sm:p-4 border-2 border-amber-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center shadow-md shrink-0 border border-white">
              <Compass className="w-6 h-6 animate-spin-slow text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-[10px] font-black uppercase text-amber-900 tracking-wider">
                  Expedition Journey Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  +{travelEvent.toPercentage - travelEvent.fromPercentage}% Route Mastered
                </span>
              </div>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                Marching from <span className="text-emerald-800">{travelEvent.fromChapterTitle}</span> → <span className="text-amber-800">{travelEvent.toChapterTitle || travelEvent.destinationName}</span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="w-36 sm:w-44">
              <div className="flex justify-between text-[10px] font-bold text-slate-800 mb-1">
                <span>{travelEvent.fromPercentage}%</span>
                <span className="text-emerald-800 font-black">{travelEvent.toPercentage}% Route Mastered</span>
              </div>
              <div className="h-2.5 rounded-full bg-amber-950/20 overflow-hidden border border-[#C5AF82]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-yellow-400 transition-all duration-1000 ease-out shadow-xs"
                  style={{ width: `${travelEvent.toPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={clearTravelEvent}
              className="w-7 h-7 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Dismiss travel alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Subject Expedition Header Banner when an individual course route is chosen */}
      {selectedRouteId !== 'all' && activeCourseRoute && (
        <div className="mb-3 parchment-card rounded-2xl p-3 sm:p-4 border-2 border-amber-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] border border-amber-300 text-amber-200 flex items-center justify-center shrink-0 shadow-md">
              <SubjectIcon icon={activeCourseRoute.icon} className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-[10px] font-black uppercase text-amber-900 tracking-wider">
                  Active Subject Trail
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                  {activeCourseRoute.completedPercentage}% Mastered
                </span>
              </div>
              <h3 className="font-cinzel text-sm sm:text-base font-black text-slate-900">
                {activeCourseRoute.title} — {activeCourseRoute.chapters.length} Chapters Available
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            <button
              onClick={() => openCourseModal(activeCourseRoute)}
              className="px-4 py-2 rounded-full text-xs font-cinzel font-bold bg-white hover:bg-amber-50 text-slate-900 border border-[#C5AF82] shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Choose Chapter / Syllabus</span>
            </button>
            <button
              onClick={() => startTrivia(activeCourseRoute)}
              className="px-5 py-2 rounded-full text-xs font-cinzel font-black bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-md border border-amber-300 cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Subject Expedition</span>
            </button>
          </div>
        </div>
      )}

      {/* Background Painting Container with subtle vignette & map contours */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-amber-800/40 shadow-2xl min-h-[480px] sm:min-h-[540px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.96] contrast-[1.05]"
          style={{ backgroundImage: `url(${mapBackdrop})` }}
        />

        {/* Vintage Map Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Left / Right Scroll Buttons for the winding path */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll Quest Path Left"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollRight}
          aria-label="Scroll Quest Path Right"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Horizontal Scrollable Quest Trail */}
        <div
          ref={scrollContainerRef}
          className="relative w-full overflow-x-auto scrollbar-none py-12 px-12 sm:px-20 z-10"
        >
          {/* Case 1: Grand Overland Map (Shows all courses on winding trail leading to the royal castle) */}
          {selectedRouteId === 'all' ? (
            <div className="relative min-w-[1400px] flex items-center justify-between gap-6 py-6">
              {/* Winding Trail SVG connecting pedestals */}
              <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-32 pointer-events-none -z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 50,60 C 200,90 350,30 500,65 C 650,95 800,40 950,70 C 1100,100 1200,50 1380,65"
                  fill="none"
                  stroke="#E2D0A5"
                  strokeWidth="6"
                  strokeDasharray="10 8"
                  className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </svg>

              {courses.map((course: Course, idx: number) => {
                const offsets = [15, -10, 20, -15, 10, -5, 15, -10];
                const verticalOffset = offsets[idx % offsets.length];

                return (
                  <div
                    key={course.id}
                    style={{ transform: `translateY(${verticalOffset}px)` }}
                    className="flex flex-col items-center group cursor-pointer transition-transform duration-300 shrink-0 w-36"
                    onClick={() => openCourseModal(course)}
                  >
                    {/* Realistic Metallic Heraldic Waypoint Pin */}
                    <div className="relative mb-3 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                      {/* Detailed Ornate Emerald Shield SVG */}
                      <div className="relative w-20 h-24 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]">
                        <svg viewBox="0 0 76 92" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Antique Brass Beveled Outer Frame */}
                          <path
                            d="M38 2C57 2 72 17 72 36C72 60 38 90 38 90C38 90 4 60 4 36C4 17 19 2 38 2Z"
                            fill="url(#brassRimGrad)"
                            stroke="#FFE599"
                            strokeWidth="2.5"
                          />
                          {/* Inner Beveled Emerald Jewel */}
                          <path
                            d="M38 7C53 7 65 19 65 35C65 54 38 81 38 81C38 81 11 54 11 35C11 19 23 7 38 7Z"
                            fill="url(#deepEmeraldGrad)"
                            stroke="#047857"
                            strokeWidth="1.5"
                          />
                          {/* Faceted Light Reflection */}
                          <path
                            d="M20 16C25 10 33 8 39 8C41 8 44 8.5 46 9C35 11 27 18 23 26C21 23 20 19 20 16Z"
                            fill="white"
                            fillOpacity="0.4"
                          />
                          <defs>
                            <linearGradient id="brassRimGrad" x1="0" y1="0" x2="76" y2="92" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#F59E0B" />
                              <stop offset="0.3" stopColor="#FDE68A" />
                              <stop offset="0.7" stopColor="#D97706" />
                              <stop offset="1" stopColor="#78350F" />
                            </linearGradient>
                            <linearGradient id="deepEmeraldGrad" x1="0" y1="0" x2="76" y2="92" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#10B981" />
                              <stop offset="0.5" stopColor="#047857" />
                              <stop offset="1" stopColor="#064E3B" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Subject Icon inside shield */}
                        <div className="absolute top-5 text-amber-200 group-hover:scale-110 transition-transform">
                          <SubjectIcon icon={course.icon} className="w-8 h-8 drop-shadow-md text-amber-100" />
                        </div>
                      </div>

                      {/* Pedestal Base */}
                      <div className="w-16 h-5 rounded-full bg-gradient-to-r from-[#8C7A5B] via-[#DFD1B5] to-[#736345] border border-amber-950/60 shadow-lg -mt-2 flex items-center justify-center">
                        <div className="w-12 h-2.5 rounded-full bg-[#52442D]/40" />
                      </div>
                    </div>

                    {/* Parchment Label Card */}
                    <div className="parchment-card rounded-xl p-2.5 text-center w-36 shadow-lg border border-[#C5AF82] transition-all group-hover:border-amber-500">
                      <h3 className="font-cinzel text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-[10px] text-amber-950/70 font-semibold mt-0.5">
                        {course.chaptersCount} Chapters
                      </p>
                      <div className="mt-1.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black border tracking-wider ${getProgressColor(
                            course.completedPercentage
                          )}`}
                        >
                          {course.completedPercentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Course Waypoint Pin */}
              <div
                onClick={() => openCourseEditor()}
                className="flex flex-col items-center group cursor-pointer shrink-0 w-36 transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900/80 hover:bg-slate-900 border-2 border-dashed border-amber-300 text-amber-300 flex items-center justify-center shadow-xl mb-3 backdrop-blur-xs">
                  <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <div className="parchment-card rounded-xl p-2.5 text-center w-36 shadow-md border border-dashed border-amber-400">
                  <h4 className="font-cinzel text-xs font-black text-amber-950">Add Course</h4>
                  <p className="text-[10px] text-slate-600 font-semibold mt-0.5">Custom Subject</p>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-200 text-amber-900 mt-1">
                    New Quest Pin
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Case 2: Subject Dedicated Route with Landmark Destination */
            activeCourseRoute && (
              <div className="relative min-w-[900px] flex items-center justify-between gap-8 py-6">
                {/* Dedicated Trail Line */}
                <svg
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-32 pointer-events-none -z-10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50,65 C 200,90 350,40 500,75 C 650,100 800,50 900,65"
                    fill="none"
                    stroke="#FDE68A"
                    strokeWidth="7"
                    strokeDasharray="12 8"
                    className="filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
                  />
                </svg>

                {/* Chapter Waypoint Pins along the dedicated subject path */}
                {(() => {
                  const uncompletedIdx = activeCourseRoute.chapters.findIndex((c) => !c.completed);
                  const currentPartyIdx = uncompletedIdx !== -1 ? uncompletedIdx : activeCourseRoute.chapters.length - 1;

                  return activeCourseRoute.chapters.map((ch, idx) => {
                    const isCurrentParty = idx === currentPartyIdx;

                    return (
                      <div
                        key={ch.id}
                        onClick={() => {
                          startTrivia(activeCourseRoute, ch);
                        }}
                        className="relative flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-1 shrink-0 w-44"
                      >
                        {/* Animated Traveling Scholar Avatar Token positioned above the party's current location */}
                        {isCurrentParty && (
                          <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce pointer-events-none">
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-2 border-white shadow-xl flex items-center justify-center text-slate-950">
                              <Compass className="w-5 h-5 text-amber-950 animate-spin-slow" />
                              <div className="absolute inset-0 rounded-xl bg-amber-400/40 animate-ping" />
                            </div>
                            <span className="text-[9px] font-cinzel font-black px-1.5 py-0.5 rounded-full bg-slate-950/90 text-amber-300 shadow-md whitespace-nowrap mt-0.5">
                              Expedition Party
                            </span>
                          </div>
                        )}

                        {/* Emerald Waypoint Pin with Completion Badge */}
                        <div
                          className={`relative w-14 h-14 rounded-full bg-gradient-to-b ${
                            ch.completed
                              ? 'from-emerald-500 to-emerald-700 ring-4 ring-emerald-400/40'
                              : 'from-[#059669] to-[#064E3B]'
                          } border-2 border-amber-300 shadow-xl flex items-center justify-center text-amber-200 mb-2 transition-all`}
                        >
                          <span className="font-cinzel font-black text-sm">{idx + 1}</span>
                          {ch.completed && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-white text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                              ✓
                            </div>
                          )}
                        </div>

                        <div className="parchment-card rounded-xl p-3 text-center w-44 shadow-lg border border-[#C5AF82]">
                          <span className="font-cinzel text-[10px] font-black uppercase text-amber-900 block">
                            Chapter {ch.chapterNumber}
                          </span>
                          <h4 className="font-cinzel text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                            {ch.title.split(':')[1] || ch.title}
                          </h4>
                          <div className="mt-2 flex items-center justify-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {ch.questions.length} MCQs
                            </span>
                            {ch.questions.some((q) => q.diagram) && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-100 text-indigo-800">
                                🔬 Diagram
                              </span>
                            )}
                          </div>

                          {/* Mini Chapter Mastery Bar */}
                          <div className="mt-2.5 pt-1.5 border-t border-amber-900/15">
                            <ChapterMasteryBar
                              mastery={ch.masteryPercentage ?? (ch.completed ? 85 : 0)}
                              compact={true}
                            />
                          </div>

                          {/* Direct Play Chapter Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startTrivia(activeCourseRoute, ch);
                            }}
                            className="mt-2.5 w-full bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-[10px] py-1.5 px-2 rounded-lg shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Play Chapter {ch.chapterNumber}</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Subject Landmark Destination! (Directly addressing: "Each subject should have its own destination") */}
                <div
                  onClick={() => openCourseModal(activeCourseRoute)}
                  className="flex flex-col items-center group cursor-pointer shrink-0 w-52 transition-transform hover:-translate-y-2"
                >
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-100 border-3 border-amber-600 shadow-2xl flex items-center justify-center text-amber-950 mb-2">
                    <Landmark className="w-10 h-10 text-amber-900" />
                    <Flag className="w-4 h-4 fill-emerald-600 text-emerald-700 absolute -top-2 -right-2" />
                  </div>

                  <div className="parchment-card rounded-2xl p-3 text-center w-52 shadow-xl border-2 border-amber-400 bg-amber-50">
                    <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block">
                      Expedition Destination
                    </span>
                    <h3 className="font-cinzel text-xs font-black text-slate-900 leading-tight mt-0.5">
                      {activeCourseRoute.destination?.name || 'The Academic Citadel'}
                    </h3>
                    <p className="text-[10px] text-amber-900 font-semibold mt-1">
                      {activeCourseRoute.completedPercentage}% Route Mastered
                    </p>

                    {/* Subject Expert Seal Badge */}
                    <div className="mt-2 pt-2 border-t border-amber-900/15 flex justify-center">
                      <ExpertBadgeMedallion
                        courseTitle={activeCourseRoute.title}
                        icon={activeCourseRoute.icon}
                        unlocked={activeCourseRoute.expertBadgeUnlocked}
                        unlockedDate={activeCourseRoute.expertBadgeDate}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
