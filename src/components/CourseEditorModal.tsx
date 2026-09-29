import React, { useState, useEffect } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { SubjectIconType } from '../types/quest.js';
import { SubjectIcon } from './SubjectIcon.js';
import { X, Check, Plus } from 'lucide-react';

export const CourseEditorModal: React.FC = () => {
  const { isCourseEditorModalOpen, closeCourseEditor, editingCourse, addCourse, updateCourse } = useStudyQuest();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chaptersCount, setChaptersCount] = useState(10);
  const [selectedIcon, setSelectedIcon] = useState<SubjectIconType>('scroll');

  useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title);
      setDescription(editingCourse.description);
      setChaptersCount(editingCourse.chaptersCount);
      setSelectedIcon(editingCourse.icon);
    } else {
      setTitle('');
      setDescription('');
      setChaptersCount(10);
      setSelectedIcon('scroll');
    }
  }, [editingCourse, isCourseEditorModalOpen]);

  if (!isCourseEditorModalOpen) return null;

  const iconsList: Array<{ id: SubjectIconType; label: string }> = [
    { id: 'scroll', label: 'History / Scroll' },
    { id: 'dome', label: 'Government / Dome' },
    { id: 'scales', label: 'Ethics / Scales' },
    { id: 'star', label: 'TX Gov / Star' },
    { id: 'flask', label: 'Biology / Flask' },
    { id: 'calculator', label: 'Algebra / Calculator' },
    { id: 'brain', label: 'Psychology / Brain' },
    { id: 'books', label: 'Info Science / Books' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        title,
        description,
        chaptersCount,
        icon: selectedIcon,
      });
    } else {
      addCourse({
        title,
        description,
        chaptersCount,
        icon: selectedIcon,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div>
            <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
              Dynamic Course Management
            </span>
            <h2 className="font-cinzel text-xl font-bold text-slate-900">
              {editingCourse ? 'Edit Subject Marker' : 'Add New Subject Quest'}
            </h2>
          </div>
          <button
            onClick={closeCourseEditor}
            className="p-1.5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. World Literature, Organic Chemistry, Microeconomics"
              className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Literary devices, rhetorical analysis, and CLEP prep."
              className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-1.5">
              Total Chapters in Syllabus
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={chaptersCount}
              onChange={(e) => setChaptersCount(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-white border border-[#C5AF82] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-black font-cinzel text-slate-900 uppercase tracking-wider mb-2">
              Select Quest Marker Icon
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {iconsList.map((ic) => {
                const isSelected = selectedIcon === ic.id;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setSelectedIcon(ic.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-200/80 shadow-xs'
                        : 'border-[#C5AF82] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-amber-200 flex items-center justify-center">
                      <SubjectIcon icon={ic.id} className="w-5 h-5 text-amber-200" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 text-center line-clamp-1">
                      {ic.label.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-900/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeCourseEditor}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-amber-900/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10B981] hover:to-[#047857] text-white font-cinzel font-bold text-xs px-6 py-2.5 rounded-full shadow-md border border-amber-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{editingCourse ? 'Save Changes' : 'Place Marker on Quest Path'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
