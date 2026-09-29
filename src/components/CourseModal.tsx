import React, { useState } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { SubjectIcon } from './SubjectIcon.js';
import { X, Play, BookOpen, Trash2, Edit3, CheckCircle2, Circle, Sparkles, Volume2, AlertTriangle, MapPin } from 'lucide-react';

export const CourseModal: React.FC = () => {
  const {
    isCourseModalOpen,
    closeCourseModal,
    activeCourse,
    startTrivia,
    setActiveChapter,
    setActiveView,
    deleteCourse,
    openCourseEditor,
  } = useStudyQuest();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isCourseModalOpen || !activeCourse) return null;

  const handleStartChapter = (ch: any) => {
    setActiveChapter(ch);
    startTrivia(activeCourse, ch);
  };

  const handleViewSummaries = (ch: any) => {
    setActiveChapter(ch);
    closeCourseModal();
    setActiveView('summaries');
  };

  const handleExecuteDelete = () => {
    deleteCourse(activeCourse.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Emerald Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] border-2 border-amber-300 text-amber-200 flex items-center justify-center shadow-md">
              <SubjectIcon icon={activeCourse.icon} className="w-7 h-7 text-amber-200" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900">
                  {activeCourse.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950">
                  Subject Expedition
                </span>
              </div>
              <p className="text-xs text-amber-950/70 font-semibold mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>Destination: <strong>{activeCourse.destination?.name || 'Academic Citadel'}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit Course Button */}
            <button
              onClick={() => {
                closeCourseModal();
                openCourseEditor(activeCourse);
              }}
              title="Edit Subject Details"
              className="p-2 rounded-full hover:bg-amber-900/10 text-amber-900 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Course Button - toggles in-modal confirmation */}
            <button
              onClick={() => setConfirmDelete(!confirmDelete)}
              title="Remove Subject"
              className="p-2 rounded-full hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={closeCourseModal}
              className="p-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert (Replaces window.confirm which fails in iframes) */}
        {confirmDelete && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 animate-in fade-in">
            <div className="flex items-start gap-2.5 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-cinzel text-sm font-bold text-rose-900">
                  Remove "{activeCourse.title}" from Quest Path?
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  This will remove the course marker, chapters, and progress from your active quest ledger.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 rounded-full text-xs font-cinzel font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
              >
                Confirm Remove Subject
              </button>
            </div>
          </div>
        )}

        {/* Course Destination & Progress Overview */}
        <div className="bg-white/80 border border-[#C5AF82] rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center text-xs font-cinzel font-bold text-slate-900 mb-2">
            <span>Course Expedition Route</span>
            <span>{activeCourse.completedPercentage}% Conquered</span>
          </div>
          <div className="w-full h-3 bg-amber-900/15 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${activeCourse.completedPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {activeCourse.description}
          </p>
        </div>

        {/* Chapter List */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-950">
              Syllabus Chapters ({activeCourse.chapters.length})
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">
              100% Multiple Choice
            </span>
          </div>

          {activeCourse.chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-white border border-[#C5AF82] hover:border-amber-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {ch.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-amber-700/40" />
                  )}
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-slate-900">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {ch.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-amber-900 font-bold">
                    <span>{ch.questions.length} Questions</span>
                    {ch.questions.some((q) => q.diagram) && (
                      <span className="text-indigo-700 font-black">🔬 Diagram Question Included</span>
                    )}
                    {ch.audioQuestions?.length > 0 && (
                      <span className="text-teal-700 flex items-center gap-0.5">
                        <Volume2 className="w-3 h-3" /> Audio Drills
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Chapter */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleViewSummaries(ch)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-100/70 border border-[#C5AF82] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                  Summary
                </button>
                <button
                  onClick={() => handleStartChapter(ch)}
                  className="bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10B981] hover:to-[#047857] text-white px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Play Trivia
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Action Button */}
        <div className="pt-2">
          <button
            onClick={() => startTrivia(activeCourse)}
            className="w-full bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-black text-sm py-3.5 rounded-full shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Complete Course Expedition</span>
          </button>
        </div>
      </div>
    </div>
  );
};
