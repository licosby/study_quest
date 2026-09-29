import React from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { X, Sparkles, Zap, UploadCloud, Plus, BookOpen } from 'lucide-react';

export const NewQuestModal: React.FC = () => {
  const {
    isNewQuestModalOpen,
    closeNewQuestModal,
    startQuickSprint,
    openUploadModal,
    openCourseEditor,
    courses,
    openCourseModal,
  } = useStudyQuest();

  if (!isNewQuestModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center border border-amber-300 shadow-md">
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Daily Expeditions
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Choose a New Quest
              </h2>
            </div>
          </div>

          <button
            onClick={closeNewQuestModal}
            className="p-1.5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quest Action Tiles */}
        <div className="space-y-3 mb-6">
          {/* Quick Sprint */}
          <button
            onClick={startQuickSprint}
            className="w-full p-4 rounded-2xl bg-white/90 hover:bg-white border border-[#C5AF82] hover:border-amber-500 shadow-xs flex items-center justify-between transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center border border-orange-300">
                <Zap className="w-5 h-5 fill-orange-400" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  5-Question Speed Sprint
                </h4>
                <p className="text-xs text-slate-600">
                  Quick mixed-concept 100% multiple-choice challenge across all courses.
                </p>
              </div>
            </div>
            <span className="font-cinzel text-xs font-bold text-emerald-800">Launch →</span>
          </button>

          {/* Upload Chapter */}
          <button
            onClick={() => {
              closeNewQuestModal();
              openUploadModal();
            }}
            className="w-full p-4 rounded-2xl bg-white/90 hover:bg-white border border-[#C5AF82] hover:border-amber-500 shadow-xs flex items-center justify-between transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Upload Textbook Chapter (.pdf / .txt)
                </h4>
                <p className="text-xs text-slate-600">
                  Instantly ingest a college chapter, PDF, or text into a full quest.
                </p>
              </div>
            </div>
            <span className="font-cinzel text-xs font-bold text-emerald-800">Upload →</span>
          </button>

          {/* Add New Course Waypoint */}
          <button
            onClick={() => {
              closeNewQuestModal();
              openCourseEditor();
            }}
            className="w-full p-4 rounded-2xl bg-white/90 hover:bg-white border border-[#C5AF82] hover:border-amber-500 shadow-xs flex items-center justify-between transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center border border-indigo-300">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition-colors">
                  Add New Subject Route
                </h4>
                <p className="text-xs text-slate-600">
                  Place an emerald waypoint and destination for a custom course.
                </p>
              </div>
            </div>
            <span className="font-cinzel text-xs font-bold text-emerald-800">Create →</span>
          </button>
        </div>

        <div className="border-t border-amber-900/20 pt-3">
          <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block mb-2">
            Or Pick an Existing Subject Route:
          </span>
          <div className="flex flex-wrap gap-2">
            {courses.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  closeNewQuestModal();
                  openCourseModal(c);
                }}
                className="text-xs font-cinzel font-bold bg-white/80 hover:bg-amber-100 border border-[#C5AF82] px-3 py-1.5 rounded-xl text-slate-800 cursor-pointer"
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
