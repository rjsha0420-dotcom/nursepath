import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Clock, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle, 
  Sparkles,
  Zap,
  Layers,
  Flag,
  Flame,
  Brain,
  Timer
} from 'lucide-react';
import { COMPREHENSIVE_QUESTION_BANK } from '../../data/mockQuestions';
import { INITIAL_FLASHCARDS } from '../../data/mockFlashcards';
import { QuizQuestion, Flashcard, UserProfile } from '../../types';
import { calculateSM2 } from '../../services/sm2Algorithm';

interface PracticeQuizzesPageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const PracticeQuizzesPage: React.FC<PracticeQuizzesPageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeMode, setActiveMode] = useState<'practice' | 'mock_exam' | 'flashcards'>('practice');

  // Filtered practice questions
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const allPnleQuestions = COMPREHENSIVE_QUESTION_BANK;
  
  const filteredQuestions = subjectFilter === 'all' 
    ? allPnleQuestions 
    : allPnleQuestions.filter((q) => q.subject.toLowerCase().includes(subjectFilter.toLowerCase()));

  // Practice state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (showRationale) return;
    setSelectedOption(idx);
    setShowRationale(true);
    setAnsweredCount((prev) => prev + 1);
    if (idx === currentQ?.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentIdx((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrev = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentIdx((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentIdx(0);
    setScore(0);
    setAnsweredCount(0);
  };

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // Mock Exam Simulation State
  const [mockStarted, setMockStarted] = useState(false);
  const [mockTimeLeft, setMockTimeLeft] = useState<number>(1800); // 30 minutes in seconds
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockFlagged, setMockFlagged] = useState<number[]>([]);
  const [mockCurrentIndex, setMockCurrentIndex] = useState(0);
  const [mockFinished, setMockFinished] = useState(false);

  useEffect(() => {
    let timer: any;
    if (mockStarted && !mockFinished && mockTimeLeft > 0) {
      timer = setInterval(() => {
        setMockTimeLeft((prev) => {
          if (prev <= 1) {
            setMockFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mockStarted, mockFinished, mockTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startMockExam = () => {
    setMockStarted(true);
    setMockFinished(false);
    setMockTimeLeft(1800);
    setMockAnswers({});
    setMockFlagged([]);
    setMockCurrentIndex(0);
  };

  const handleMockSelect = (optIdx: number) => {
    setMockAnswers({ ...mockAnswers, [mockCurrentIndex]: optIdx });
  };

  const toggleMockFlag = (qIdx: number) => {
    if (mockFlagged.includes(qIdx)) {
      setMockFlagged(mockFlagged.filter((i) => i !== qIdx));
    } else {
      setMockFlagged([...mockFlagged, qIdx]);
    }
  };

  const calculateMockScore = () => {
    let correct = 0;
    allPnleQuestions.forEach((q, idx) => {
      if (mockAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: allPnleQuestions.length,
      percentage: Math.round((correct / allPnleQuestions.length) * 100)
    };
  };

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentFcIdx, setCurrentFcIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentFcIdx] || flashcards[0];

  const handleRateCard = (quality: 0 | 1 | 2 | 3) => {
    const { interval, easeFactor, reps, dueDate } = calculateSM2(
      currentCard,
      quality + 2
    );

    const updated = [...flashcards];
    updated[currentFcIdx] = {
      ...currentCard,
      reps,
      interval,
      easeFactor,
      dueDate
    };

    setFlashcards(updated);
    setIsFlipped(false);
    setCurrentFcIdx((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ⏱️ Practice Quizzes & Mock Tests
            </span>
            <span className="text-teal-300 text-xs font-semibold">15,000+ Verified Questions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            PNLE Board Examination Drills & Adaptive Testing
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Test your clinical judgment across all 5 Philippine Nurse Licensure Exam subjects. Choose instant practice drills with step-by-step rationales, simulated PRC mock exams, or high-yield spaced repetition flashcards.
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'practice', label: '🎯 Subject Practice Drills', badge: 'Instant Feedback' },
          { id: 'mock_exam', label: '⏱️ Full Timed Mock Board Exam', badge: 'PRC Simulation' },
          { id: 'flashcards', label: '🧠 Spaced Repetition (SM-2) Flashcards', badge: 'High-Yield Pearls' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeMode === tab.id
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeMode === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* MODE 1: Practice Drills */}
      {activeMode === 'practice' && (
        <div className="space-y-6">
          {/* Subject Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All 5 PNLE Subjects' },
              { id: 'NP 1', label: 'NP 1: Community Health' },
              { id: 'NP 2', label: 'NP 2: Maternal & Child' },
              { id: 'NP 3', label: 'NP 3: Med-Surg (Part A)' },
              { id: 'NP 4', label: 'NP 4: Med-Surg (Part B)' },
              { id: 'NP 5', label: 'NP 5: Psychiatric Nursing' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSubjectFilter(s.id);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  subjectFilter === s.id
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Question Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {currentQ?.subject}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 font-medium">
                      Item {currentIdx + 1} of {filteredQuestions.length}
                    </span>
                  </div>

                  <button
                    onClick={() => currentQ && toggleBookmark(currentQ.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    title="Bookmark this question"
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarkedIds.includes(currentQ?.id || '') ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Question Stem */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {currentQ?.question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ?.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswerIndex;
                    let btnClass = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800';

                    if (showRationale) {
                      if (isCorrect) {
                        btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected) {
                        btnClass = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                      } else {
                        btnClass = 'border-slate-200 opacity-60 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={showRationale}
                        className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer disabled:cursor-default ${btnClass}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Clinical Rationale Box */}
                {showRationale && (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-500/40 rounded-2xl p-5 space-y-3 animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-700" />
                      <strong className="text-xs font-black text-teal-900 uppercase tracking-wide">
                        Clinical Rationale & Evidence Standard
                      </strong>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {currentQ.rationale}
                    </p>

                    <div className="pt-2 border-t border-teal-200/60 text-[11px] text-teal-950 font-medium flex items-center justify-between">
                      <span>Standard: {currentQ.referenceStandard}</span>
                      <span className="text-teal-700 font-bold">PRC Board Aligned</span>
                    </div>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Drill</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Score & Progress Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Session Performance
                </h4>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Correct</span>
                    <span className="text-2xl font-black text-emerald-600">{score}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Answered</span>
                    <span className="text-2xl font-black text-slate-800">{answeredCount}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                  <span className="text-xs text-slate-500 block">Current Accuracy</span>
                  <div className="text-3xl font-black text-teal-700">
                    {answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0}%
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    PRC Passing Threshold: 75%
                  </span>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Board Exam Study Tip</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Read the question stem carefully for negative qualifiers: <em>&quot;Except&quot;</em>, <em>&quot;Least appropriate&quot;</em>, or <em>&quot;Needs further instruction&quot;</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Timed Mock Board Exam Simulation */}
      {activeMode === 'mock_exam' && (
        <div className="space-y-6">
          {!mockStarted && !mockFinished && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-2xl mx-auto space-y-5 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
                <Timer className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Full PNLE Mock Board Exam Simulation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Experience realistic PRC Board conditions. You will answer 100 items with a timed countdown, question flagging, and an end-of-exam comprehensive score report.
              </p>

              <div className="grid grid-cols-3 gap-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Time Limit:</span>
                  <strong className="text-slate-900">30 Minutes</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Items:</span>
                  <strong className="text-slate-900">{allPnleQuestions.length} Items</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Passing Mark:</span>
                  <strong className="text-emerald-600">75% General Weighted Avg</strong>
                </div>
              </div>

              <button
                onClick={startMockExam}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Begin Timed Mock Simulation
              </button>
            </div>
          )}

          {mockStarted && !mockFinished && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Area */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      Item {mockCurrentIndex + 1} of {allPnleQuestions.length}
                    </span>

                    <button
                      onClick={() => toggleMockFlag(mockCurrentIndex)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 cursor-pointer ${
                        mockFlagged.includes(mockCurrentIndex)
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{mockFlagged.includes(mockCurrentIndex) ? 'Flagged for Review' : 'Flag Question'}</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {allPnleQuestions[mockCurrentIndex]?.question}
                  </h3>

                  <div className="space-y-3 pt-2">
                    {allPnleQuestions[mockCurrentIndex]?.options.map((option, idx) => {
                      const isSelected = mockAnswers[mockCurrentIndex] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleMockSelect(idx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      disabled={mockCurrentIndex === 0}
                      onClick={() => setMockCurrentIndex((p) => p - 1)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>

                    <button
                      onClick={() => {
                        if (mockCurrentIndex < allPnleQuestions.length - 1) {
                          setMockCurrentIndex((p) => p + 1);
                        } else {
                          setMockFinished(true);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      {mockCurrentIndex < allPnleQuestions.length - 1 ? 'Save & Next' : 'Submit Exam'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar with Timer & Question Navigator */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Time Remaining
                    </span>
                    <span className="text-3xl font-black font-mono text-teal-400">
                      {formatTime(mockTimeLeft)}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      Question Palette ({Object.keys(mockAnswers).length}/{allPnleQuestions.length} answered)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto p-1">
                      {allPnleQuestions.map((_, idx) => {
                        const isAns = mockAnswers[idx] !== undefined;
                        const isFlg = mockFlagged.includes(idx);
                        const isCur = mockCurrentIndex === idx;

                        let bg = 'bg-slate-100 text-slate-700';
                        if (isFlg) bg = 'bg-amber-400 text-white font-bold';
                        else if (isAns) bg = 'bg-teal-600 text-white';
                        if (isCur) bg += ' ring-2 ring-blue-500';

                        return (
                          <button
                            key={idx}
                            onClick={() => setMockCurrentIndex(idx)}
                            className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${bg}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setMockFinished(true)}
                    className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Finish & Submit Exam Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {mockFinished && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-2xl mx-auto text-center space-y-5 shadow-xs animate-fadeIn">
              {(() => {
                const res = calculateMockScore();
                const isPassed = res.percentage >= 75;
                return (
                  <>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm ${
                      isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Award className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">
                      {isPassed ? 'Congratulations! You Passed!' : 'Good Effort! Keep Reviewing'}
                    </h3>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="text-4xl font-black text-slate-900 mb-1">
                        {res.percentage}%
                      </div>
                      <p className="text-xs text-slate-600">
                        Score: <strong>{res.correct}</strong> out of <strong>{res.total}</strong> questions
                      </p>
                      <div className="mt-2 text-xs font-bold">
                        Status: <span className={isPassed ? 'text-emerald-600' : 'text-amber-600'}>{isPassed ? 'PASSED (75% GWA Required)' : 'CONDITIONAL / DID NOT REACH 75%'}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={startMockExam}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Retake Simulation
                      </button>
                      <button
                        onClick={() => setActiveMode('practice')}
                        className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Review Rationales in Practice Mode
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* MODE 3: High-Yield Flashcards (SM-2) */}
      {activeMode === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Card {currentFcIdx + 1} of {flashcards.length}</span>
            <span className="bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
              {currentCard?.category}
            </span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md hover:border-teal-500 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                {isFlipped ? 'Answer & Explanation (Click to flip back)' : 'Question (Click card to flip answer)'}
              </span>

              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {isFlipped ? currentCard?.back : currentCard?.front}
              </p>

              {isFlipped && currentCard?.pearl && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <strong className="block font-bold mb-0.5">💡 Clinical Pearl:</strong>
                  {currentCard.pearl}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{currentCard?.evidenceLevel}</span>
              <span className="font-semibold text-teal-700">SM-2 Spaced Repetition</span>
            </div>
          </div>

          {/* SM-2 Response Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-2 pt-2 animate-fadeIn">
              <button
                onClick={() => handleRateCard(0)}
                className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                Again (&lt; 1d)
              </button>
              <button
                onClick={() => handleRateCard(1)}
                className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
              >
                Hard (1d)
              </button>
              <button
                onClick={() => handleRateCard(2)}
                className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
              >
                Good (3d)
              </button>
              <button
                onClick={() => handleRateCard(3)}
                className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                Easy (6d)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
