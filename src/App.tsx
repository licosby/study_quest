import React from 'react';
import { StudyQuestProvider, useStudyQuest } from './context/StudyQuestContext.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { TriviaScreen } from './components/TriviaScreen.js';
import { SummariesScreen } from './components/SummariesScreen.js';
import { ProgressScreen } from './components/ProgressScreen.js';
import { UploadChapterModal } from './components/UploadChapterModal.js';
import { CourseModal } from './components/CourseModal.js';
import { CourseEditorModal } from './components/CourseEditorModal.js';
import { StreakCalendarModal } from './components/StreakCalendarModal.js';
import { AchievementsModal } from './components/AchievementsModal.js';
import { NewQuestModal } from './components/NewQuestModal.js';

const MainView: React.FC = () => {
  const { activeView } = useStudyQuest();

  switch (activeView) {
    case 'trivia':
      return <TriviaScreen />;
    case 'summaries':
      return <SummariesScreen />;
    case 'progress':
      return <ProgressScreen />;
    case 'map':
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <StudyQuestProvider>
      <div className="min-h-screen bg-[#111A29] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
        {/* Subtle Map / Atmospheric Background Glow */}
        <div className="fixed inset-0 bg-radial from-slate-800/40 via-transparent to-black/80 pointer-events-none -z-10" />

        {/* Active Screen View */}
        <MainView />

        {/* Global Adventure Modals */}
        <UploadChapterModal />
        <CourseModal />
        <CourseEditorModal />
        <StreakCalendarModal />
        <AchievementsModal />
        <NewQuestModal />
      </div>
    </StudyQuestProvider>
  );
}
