import React, { useState } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { ArrowLeft, ArrowRight, Lightbulb, BookOpen, Volume2, CheckCircle2, XCircle, Trophy, RotateCcw, Home, Sparkles, Brain, FileText, HelpCircle } from 'lucide-react';
import { playNativeSpeech } from '../utils/audioHelper.js';
import { DiagramViewer } from './DiagramViewer.js';
import { TravelAnimation } from './TravelAnimation.js';
import { ChapterMasteryBar } from './ChapterMasteryBar.js';
import { ExpertBadgeMedallion } from './ExpertBadgeMedallion.js';

export const TriviaScreen: React.FC = () => {
  const {
    currentQuestions,
    currentQuestionIndex,
    currentQuestion,
    selectedOptionIndex,
    selectOption,
    answeredState,
    submitCurrentAnswer,
    nextQuestion,
    prevQuestion,
    openExplainMore,
    closeExplainMore,
    isExplainMoreOpen,
    activeExplainData,
    openExploreAnswer,
    closeExploreAnswer,
    isExploreAnswerOpen,
    activeExploreData,
    quizScore,
    quizCompleted,
    missedQuestions,
    targetPassingRate,
    minRequiredQuestions,
    isLoadingNextQuestion,
    timerMode,
    setTimerMode,
    timeRemaining,
    isTimerPaused,
    togglePauseTimer,
    travelEvent,
    recentlyUnlockedExpertBadge,
    exitQuiz,
    startTrivia,
    activeCourse,
    activeChapter,
  } = useStudyQuest();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (currentQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="parchment-card rounded-3xl p-8 shadow-xl">
          <h2 className="font-cinzel text-xl font-bold text-slate-900 mb-2">
            No Active Trivia Quest
          </h2>
          <p className="text-xs text-amber-950/70 mb-6">
            Select a subject marker along the winding quest path to launch a 100% multiple-choice quiz session.
          </p>
          <button
            onClick={exitQuiz}
            className="bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-cinzel font-bold text-xs px-6 py-3 rounded-full shadow-md border border-amber-300 cursor-pointer"
          >
            Return to Quest Map
          </button>
        </div>
      </div>
    );
  }

  // Quiz Completion View
  if (quizCompleted) {
    const accuracy = Math.round((quizScore / currentQuestions.length) * 100);
    const scaledClep = Math.min(80, Math.max(20, Math.round(20 + (accuracy / 100) * 60)));

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in">
        <div className="parchment-card rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-[#C5AF82] text-center relative overflow-hidden">
          {/* Trophy Header */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-500 text-amber-950 mx-auto flex items-center justify-center shadow-lg shadow-black/30 mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="font-cinzel text-xs font-black uppercase tracking-widest text-amber-900 block mb-1">
            Quest Triumphant!
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            {scaledClep >= 50 ? 'College Credit Standard Mastered! 🎓' : 'Chapter Knowledge Consolidated!'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-950/80 max-w-md mx-auto mb-6 font-medium">
            Your results have been etched into the cartographer's ledger.
          </p>

          {/* Newly Unlocked Subject Expert Badge Celebration Banner */}
          {recentlyUnlockedExpertBadge && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-100 border-2 border-amber-500 shadow-xl text-amber-950 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in-95">
              <ExpertBadgeMedallion
                courseTitle={recentlyUnlockedExpertBadge.courseTitle}
                icon={recentlyUnlockedExpertBadge.icon}
                unlocked={true}
                unlockedDate={recentlyUnlockedExpertBadge.date}
                size="lg"
                showLabel={false}
              />
              <div className="text-center sm:text-left flex-1">
                <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                  👑 Grand Milestone Achieved!
                </span>
                <h3 className="font-cinzel text-base sm:text-lg font-black text-slate-950">
                  {recentlyUnlockedExpertBadge.courseTitle} Expert Badge Unlocked!
                </h3>
                <p className="text-xs text-amber-950/80 font-medium mt-0.5 leading-snug">
                  You conquered chapters with 80%+ accuracy! The royal seal has been permanently etched into your achievements ledger.
                </p>
              </div>
            </div>
          )}

          {/* Chapter Mastery Bar showing updated accuracy */}
          <div className="mb-6 p-4 rounded-2xl bg-white/90 border border-[#C5AF82] shadow-xs text-left">
            <ChapterMasteryBar
              mastery={Math.max(activeChapter?.masteryPercentage || 0, accuracy)}
              showLabel={true}
            />
          </div>

          {/* Visual Travel Animation: Scholar / Compass travels towards next waypoint with progress bar fill */}
          <TravelAnimation
            fromChapterTitle={travelEvent?.fromChapterTitle || activeChapter?.title || 'Current Chapter'}
            toChapterTitle={travelEvent?.toChapterTitle || 'Next Waypoint'}
            destinationName={travelEvent?.destinationName || activeCourse?.destination?.name || 'Academic Citadel'}
            fromPercentage={travelEvent?.fromPercentage ?? (activeCourse?.completedPercentage || 25)}
            toPercentage={travelEvent?.toPercentage ?? Math.min(100, (activeCourse?.completedPercentage || 25) + 20)}
            onContinue={exitQuiz}
          />

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl">
              <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block">Accuracy</span>
              <span className="font-cinzel text-2xl font-black text-slate-900 mt-1 block">
                {quizScore} / {currentQuestions.length}
              </span>
              <span className="text-[10px] font-bold text-emerald-800">{accuracy}% Correct</span>
            </div>

            <div className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl">
              <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block">CLEP Score</span>
              <span className="font-cinzel text-2xl font-black text-emerald-900 mt-1 block">
                {scaledClep}
              </span>
              <span className="text-[10px] font-bold text-amber-800">Scaled 20-80</span>
            </div>

            <div className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl col-span-2 sm:col-span-1">
              <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block">Status</span>
              <span className="font-cinzel text-lg font-black text-slate-900 mt-1 block">
                {scaledClep >= 50 ? 'Passed (50+)' : 'In Progress'}
              </span>
              <span className="text-[10px] font-bold text-purple-800">ACE Standard</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => startTrivia(activeCourse || undefined)}
              className="bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-cinzel font-bold text-xs px-6 py-3 rounded-full shadow-md border border-amber-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quest</span>
            </button>

            <button
              onClick={exitQuiz}
              className="bg-slate-900 hover:bg-slate-800 text-amber-200 font-cinzel font-bold text-xs px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Quest Map</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question State
  const isAnswered = !!answeredState?.answered;
  const isCorrect = answeredState?.isCorrect;
  const correctIndex = answeredState?.correctIndex ?? currentQuestion.correctIndex;
  
  // Note: Per user instruction: "We don't need audio clips for any subject that is not a language."
  const isAudio = 'audioPrompt' in currentQuestion && currentQuestion.language !== undefined;

  const handleAudioPlay = async () => {
    if (!isAudio) return;
    setIsPlayingAudio(true);
    await playNativeSpeech((currentQuestion as any).audioPrompt, {
      language: (currentQuestion as any).language || 'Spanish',
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const alphabet = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Header / Exit & Timer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          onClick={exitQuiz}
          className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-amber-900 bg-white/80 hover:bg-white border border-[#C5AF82] px-4 py-2 rounded-full shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Quest Map</span>
        </button>

        {/* Timer Mode Controls (No Time Limit vs. Timed Speed Run) */}
        <div className="flex items-center gap-2">
          {timerMode === 'timed' ? (
            <div className="flex items-center gap-2 bg-white/90 border border-amber-300 rounded-full px-3 py-1 shadow-xs">
              <span className={`font-mono text-xs font-black ${timeRemaining <= 15 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                ⏳ {timeRemaining}s
              </span>
              <button
                onClick={togglePauseTimer}
                title={isTimerPaused ? 'Resume countdown' : 'Pause countdown'}
                className="text-[10px] font-bold text-amber-950 px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 cursor-pointer"
              >
                {isTimerPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                onClick={() => setTimerMode('untimed')}
                className="text-[10px] text-slate-500 hover:text-slate-800 underline ml-1 cursor-pointer"
              >
                Switch to No Time Limit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/80 border border-emerald-300 rounded-full px-3 py-1 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                🌿 No Time Limit (Untimed)
              </span>
              <button
                onClick={() => setTimerMode('timed')}
                className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 cursor-pointer"
              >
                ⏱️ Enable 60s Timer
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-cinzel text-xs font-bold text-slate-900 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-2xs">
            Score: {quizScore} / {currentQuestions.length}
          </span>
          <span className="font-cinzel text-xs font-black text-amber-950">
            Waypoint {currentQuestionIndex + 1} of {currentQuestions.length}
          </span>
        </div>
      </div>

      {/* Dynamic Educational Engine & Adaptive Mastery HUD */}
      <div className="bg-amber-950/5 border border-amber-900/20 rounded-2xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-cinzel font-black uppercase text-[11px] text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            85% Passing Target
          </span>
          <span className="font-semibold text-slate-700 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            Min 12 Questions: <strong className="text-slate-900">{Math.min(currentQuestionIndex + 1, minRequiredQuestions || 12)}/{minRequiredQuestions || 12}</strong>
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>📡</span> OpenStax & Gutenberg Live APIs Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-950 font-bold">
            Live Accuracy:{' '}
            <span
              className={`font-black font-cinzel ${
                Math.round((quizScore / Math.max(isAnswered ? currentQuestionIndex + 1 : currentQuestionIndex, 1)) * 100) >= (targetPassingRate || 85)
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}
            >
              {Math.round((quizScore / Math.max(isAnswered ? currentQuestionIndex + 1 : currentQuestionIndex, 1)) * 100)}%
            </span>
          </span>
          <span className="text-slate-500">({quizScore} correct)</span>
        </div>
      </div>

      {/* Adaptive Reinforcement Banner if user has answered >= 12 questions but accuracy is < 85% */}
      {currentQuestionIndex + 1 >= (minRequiredQuestions || 12) &&
        Math.round((quizScore / (currentQuestionIndex + 1)) * 100) < (targetPassingRate || 85) && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border-2 border-amber-500/60 text-amber-950 flex items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              ⚔️
            </div>
            <div className="text-xs leading-relaxed">
              <strong className="font-cinzel uppercase text-amber-950 block">Adaptive Reinforcement Active</strong>
              You've completed {currentQuestionIndex + 1} questions with{' '}
              {Math.round((quizScore / (currentQuestionIndex + 1)) * 100)}% accuracy. The quest requires{' '}
              <strong className="text-emerald-800">85% passing rate</strong> to claim chapter victory. Fresh questions are dynamically streaming from OpenStax, Project Gutenberg, and open educational APIs!
            </div>
          </div>
        )}

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-amber-900/20 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-amber-500 rounded-full transition-all duration-300 shadow-xs"
          style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
        />
      </div>

      {/* Audio Player Card (Strictly only for Foreign Language courses!) */}
      {isAudio && (
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-6 text-white shadow-xl mb-6 border border-amber-400/40">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-[10px] font-cinzel font-black uppercase tracking-wider text-amber-300 bg-amber-900/50 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Native Speed Language Listening Drill
            </span>
            <span className="text-xs font-bold text-slate-400">1.0x Speed Locked</span>
          </div>

          <p className="text-xs text-slate-300 mb-4 font-medium">
            Listen closely to the native spoken passage or dialogue, then answer the multiple-choice question below.
          </p>

          <button
            onClick={handleAudioPlay}
            disabled={isPlayingAudio}
            className="flex items-center gap-2 bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10B981] hover:to-[#047857] text-white px-6 py-2.5 rounded-full font-cinzel font-bold text-xs shadow-md border border-amber-300 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>{isPlayingAudio ? 'Speaking at Native Speed...' : 'Play Spoken Dialogue'}</span>
          </button>
        </div>
      )}

      {/* Main Question Parchment Card */}
      <div className="parchment-card rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#C5AF82]">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-900">
              100% Multiple Choice Quest
            </span>
            {'diagram' in currentQuestion && currentQuestion.diagram && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-300">
                🔬 Visual Diagram Question
              </span>
            )}
          </div>

          {/* Explain More (Before Answering) */}
          <button
            onClick={openExplainMore}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>🧩 Explain More</span>
          </button>
        </div>

        {/* Science Visual Diagram (If question has a visual diagram) */}
        {'diagram' in currentQuestion && currentQuestion.diagram && (
          <DiagramViewer diagram={currentQuestion.diagram} />
        )}

        {/* Question Statement */}
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-8">
          {currentQuestion.question}
        </h2>

        {/* 4 Large Multiple-Choice Buttons (Strictly 100% MCQ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((optionText, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrectOption = correctIndex === idx;

            let buttonStyles =
              'p-4 sm:p-5 rounded-2xl text-left font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-between cursor-pointer shadow-xs ';

            if (!isAnswered) {
              if (isSelected) {
                buttonStyles +=
                  'bg-gradient-to-r from-amber-200 to-yellow-100 border-amber-600 text-slate-950 shadow-md transform scale-[1.01]';
              } else {
                buttonStyles +=
                  'bg-white/80 hover:bg-white border-[#C5AF82] text-slate-900 hover:border-amber-500';
              }
            } else {
              if (isCorrectOption) {
                buttonStyles += 'bg-emerald-100/90 border-emerald-600 text-emerald-950 shadow-md';
              } else if (isSelected && !isCorrect) {
                buttonStyles += 'bg-rose-100/90 border-rose-500 text-rose-950 line-through';
              } else {
                buttonStyles += 'bg-slate-100 border-slate-300 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => selectOption(idx)}
                className={buttonStyles}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected && !isAnswered
                        ? 'bg-slate-900 text-amber-300'
                        : isAnswered && isCorrectOption
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-[#C5AF82] text-slate-800'
                    }`}
                  >
                    {alphabet[idx]}
                  </span>
                  <span className="leading-snug">{optionText}</span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 ml-2" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner & Explore Answer Button */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              {isCorrect ? (
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-cinzel font-bold text-sm sm:text-base">
                  {isCorrect ? 'Correct! Waypoint Conquered!' : 'Incorrect Waypoint Selection'}
                </p>
                <p className="text-xs opacity-90 line-clamp-1 mt-0.5">
                  {currentQuestion.exploreAnswer.whyCorrect}
                </p>
              </div>
            </div>

            <button
              onClick={openExploreAnswer}
              className="flex items-center gap-1.5 bg-white hover:bg-amber-50 text-slate-900 border border-[#C5AF82] px-4 py-2 rounded-full font-cinzel font-bold text-xs shadow-xs cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>🔍 Explore Answer</span>
            </button>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between border-t border-amber-900/20 pt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-10 h-10 rounded-full border border-[#C5AF82] bg-white hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextQuestion}
              disabled={!isAnswered && selectedOptionIndex === null}
              className="w-10 h-10 rounded-full border border-[#C5AF82] bg-white hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 shadow-2xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            {!isAnswered ? (
              <button
                disabled={selectedOptionIndex === null}
                onClick={submitCurrentAnswer}
                className="bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] hover:from-[#10B981] hover:to-[#047857] disabled:opacity-40 text-white font-cinzel font-bold text-sm px-8 py-3 rounded-full shadow-lg border border-amber-300 cursor-pointer active:scale-95 transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={isLoadingNextQuestion}
                className="bg-slate-900 hover:bg-slate-800 text-amber-200 font-cinzel font-bold text-sm px-8 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoadingNextQuestion ? (
                  <>
                    <span className="animate-pulse">Streaming Next API Question...</span>
                  </>
                ) : currentQuestionIndex + 1 >= (minRequiredQuestions || 12) &&
                  Math.round((quizScore / (currentQuestionIndex + 1)) * 100) >= (targetPassingRate || 85) ? (
                  <>
                    <span>Claim Quest Victory (85%+ Mastered) 🏆</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>
                      {currentQuestionIndex + 1 < (minRequiredQuestions || 12)
                        ? `Next Challenge (${currentQuestionIndex + 1}/${minRequiredQuestions || 12} min)`
                        : `Next Challenge (85% Target)`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deep Explain More Modal (Directly addressing: "Explain more section needs to open up the text and go over that section more in detail") */}
      {isExplainMoreOpen && activeExplainData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <Lightbulb className="w-5 h-5 fill-indigo-200" />
                </div>
                <div>
                  <span className="font-cinzel text-[10px] font-black uppercase tracking-wider text-indigo-800 block">
                    Detailed Pedagogical Text Review
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">
                    🧩 Explain More: {activeExplainData.fullSectionHeading || 'Textbook Deep Dive'}
                  </h3>
                </div>
              </div>
              <button
                onClick={closeExplainMore}
                className="w-8 h-8 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 1. What the question is asking */}
              <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl">
                <span className="font-cinzel text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  What This Question Is Testing
                </span>
                <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                  {activeExplainData.summaryOfQuestion}
                </p>
              </div>

              {/* 2. Open up the exact textbook section in detail */}
              <div className="bg-amber-100/70 border border-amber-300 p-4 sm:p-5 rounded-2xl">
                <span className="font-cinzel text-xs font-black uppercase text-amber-950 flex items-center gap-1.5 mb-2">
                  <FileText className="w-4 h-4 text-amber-800" />
                  Source Textbook Section (Full Excerpt)
                </span>
                <blockquote className="text-xs sm:text-sm font-serif italic text-amber-950 bg-white/70 p-3.5 rounded-xl border-l-4 border-amber-600 leading-relaxed mb-3">
                  "{activeExplainData.exactTextSnippet}"
                </blockquote>

                {/* Deep Contextual Breakdown */}
                {activeExplainData.deepContextualBreakdown && (
                  <div className="mt-2 text-xs text-amber-950/90 leading-relaxed font-sans border-t border-amber-300/60 pt-2.5">
                    <strong className="block text-slate-900 font-cinzel mb-1">Contextual Section Breakdown:</strong>
                    {activeExplainData.deepContextualBreakdown}
                  </div>
                )}
              </div>

              {/* 3. Simplified Takeaway */}
              <div className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl">
                <span className="font-cinzel text-xs font-black uppercase text-slate-800 block mb-1">
                  Simplified Takeaway
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {activeExplainData.simplifiedExplanation}
                </p>
              </div>

              {/* 4. Quest Hint */}
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl">
                <span className="font-cinzel text-xs font-black uppercase text-emerald-950 flex items-center gap-1 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Waypoint Hint
                </span>
                <p className="text-xs sm:text-sm text-emerald-900 font-semibold leading-relaxed">
                  {activeExplainData.hint}
                </p>
              </div>

              {/* 5. Catchy Rhyming / Acronym Mnemonic with Full Explanation */}
              {activeExplainData.mnemonic && (
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 border-2 border-purple-300 p-4 sm:p-5 rounded-2xl">
                  <span className="font-cinzel text-xs font-black uppercase text-purple-950 flex items-center gap-1.5 mb-2">
                    <Brain className="w-5 h-5 text-purple-700" />
                    Catchy Rhyming / Acronym Memory Hook
                  </span>

                  <p className="font-cinzel text-sm sm:text-base font-black text-purple-950 mb-2">
                    "{activeExplainData.mnemonic.hook}"
                  </p>

                  <div className="space-y-1.5 text-xs text-purple-900/90 bg-white/70 p-3 rounded-xl border border-purple-200">
                    <p>
                      <strong>How It Works:</strong> {activeExplainData.mnemonic.rhymeOrAcronymExplanation}
                    </p>
                    <p>
                      <strong>Why It Helps:</strong> {activeExplainData.mnemonic.whyItWorks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeExplainMore}
                className="bg-gradient-to-b from-[#059669] to-[#047857] text-white font-cinzel font-bold text-xs px-6 py-2.5 rounded-full border border-amber-300 cursor-pointer shadow-md active:scale-95"
              >
                Back to Waypoint Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Explore Answer Modal */}
      {isExploreAnswerOpen && activeExploreData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5AF82] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-800" />
                <h3 className="font-cinzel text-lg font-bold text-slate-900">🔍 Explore Answer Analysis</h3>
              </div>
              <button
                onClick={closeExploreAnswer}
                className="w-8 h-8 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Exact Paragraph from Textbook */}
              <div className="bg-amber-100/70 border border-amber-300 p-4 rounded-2xl">
                <span className="font-cinzel text-[10px] font-black uppercase text-amber-950 block mb-1">
                  Exact Paragraph From Textbook
                </span>
                <blockquote className="text-xs sm:text-sm font-serif italic text-amber-950 mb-2 leading-relaxed">
                  "{activeExploreData.exactParagraph}"
                </blockquote>
                <p className="text-xs text-amber-900/80 font-medium">
                  <strong>Paragraph Summary:</strong> {activeExploreData.paragraphSummary}
                </p>
              </div>

              {/* Why Correct is Correct */}
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl">
                <span className="font-cinzel text-[10px] font-black uppercase text-emerald-950 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Why The Correct Answer Is Right
                </span>
                <p className="text-xs sm:text-sm text-emerald-900 font-semibold leading-relaxed">
                  {activeExploreData.whyCorrect}
                </p>
              </div>

              {/* Distractor Breakdown */}
              <div className="bg-white/80 border border-[#C5AF82] p-4 rounded-2xl">
                <span className="font-cinzel text-[10px] font-black uppercase text-slate-800 block mb-2">
                  Distractor Breakdown: Why The Other Choices Are Wrong
                </span>
                <div className="space-y-2">
                  {activeExploreData.whyWrong.map((reason, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-amber-900 shrink-0">{alphabet[i]}:</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mnemonic with Explanation */}
              {activeExploreData.mnemonic && (
                <div className="bg-purple-50 border border-purple-300 p-4 rounded-2xl">
                  <span className="font-cinzel text-[10px] font-black uppercase text-purple-950 flex items-center gap-1.5 mb-1.5">
                    <Brain className="w-4 h-4 text-purple-700" />
                    Permanent Memory Hook (Mnemonic)
                  </span>
                  <p className="font-cinzel text-sm font-black text-purple-950 mb-1">
                    "{activeExploreData.mnemonic.hook}"
                  </p>
                  <p className="text-xs text-purple-900">
                    {activeExploreData.mnemonic.rhymeOrAcronymExplanation}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeExploreAnswer}
                className="bg-slate-900 text-amber-200 font-cinzel font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer shadow-md"
              >
                Close Deep Dive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
