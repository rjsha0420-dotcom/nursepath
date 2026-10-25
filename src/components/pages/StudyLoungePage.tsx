import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Users, 
  Swords, 
  Zap, 
  Trophy, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  RotateCcw, 
  Share2, 
  ShieldCheck, 
  Award, 
  Crown, 
  ChevronRight, 
  Search, 
  Star, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  Smartphone,
  QrCode,
  Layers,
  Heart,
  BookOpen
} from 'lucide-react';
import { UserProfile, StudyBuddy, GameQuizSession, SubscriptionTierId } from '../../types';
import { PersonalStudyWorkspace } from '../zones/study/PersonalStudyWorkspace';
import { 
  getStudyBuddies, 
  saveStudyBuddy, 
  deleteStudyBuddy, 
  getDailyGameCount, 
  incrementDailyGameCount, 
  canPlayGame, 
  recordGameSession, 
  FREE_DAILY_GAMES_LIMIT 
} from '../../services/storageService';

interface StudyLoungePageProps {
  user: UserProfile;
  onOpenSubscription: (tier?: SubscriptionTierId) => void;
}

// Clinical Duel Questions Set for Nurse Game Hub Battles
interface DuelQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

const DUEL_QUESTIONS: Record<string, DuelQuestion[]> = {
  pharmacology: [
    {
      id: 'pharm-1',
      topic: 'Pharmacology Antidotes',
      question: 'A client receiving an intravenous infusion of Heparin Sodium develops hematuria and bleeding gums. What is the immediate specific antidote prescribed?',
      options: ['Vitamin K1 (Phytonadione)', 'Protamine Sulfate', 'Calcium Gluconate', 'Deferoxamine'],
      correctIndex: 1,
      rationale: 'Protamine Sulfate is the specific antidote that binds and neutralizes unfractionated and LMW heparin. Vitamin K1 reverses Warfarin.'
    },
    {
      id: 'pharm-2',
      topic: 'Pharmacology Antidotes',
      question: 'A client diagnosed with Preeclampsia is receiving Magnesium Sulfate IV. Which bedside medication must the nurse ensure is immediately available in case of toxicity?',
      options: ['Sodium Bicarbonate', 'Calcium Gluconate 10%', 'Flumazenil', 'Naloxone'],
      correctIndex: 1,
      rationale: 'Calcium Gluconate (1 g IV over 3 minutes) is the specific antagonist for hypermagnesemia / magnesium sulfate toxicity.'
    },
    {
      id: 'pharm-3',
      topic: 'Pharmacology Antidotes',
      question: 'Which antidote is administered for an acute toxicity of Acetaminophen (Paracetamol) to replenish hepatic glutathione stores?',
      options: ['Acetylcysteine (Mucomyst)', 'Naloxone (Narcan)', 'Atropine Sulfate', 'Pralidoxime (2-PAM)'],
      correctIndex: 0,
      rationale: 'Acetylcysteine prevents toxic NAPQI metabolites from destroying hepatocytes when given within 8-10 hours of acetaminophen overdose.'
    },
    {
      id: 'pharm-4',
      topic: 'Pharmacology Antidotes',
      question: 'An emergency room client presents with severe opioid overdose (pinpoint pupils, apnea, cyanosis). Which immediate IV push agent reverses respiratory depression?',
      options: ['Flumazenil', 'Naloxone Hydrochloride', 'Neostigmine', 'Digoxin Immune Fab'],
      correctIndex: 1,
      rationale: 'Naloxone is a pure competitive opioid antagonist that rapidly reverses respiratory arrest caused by opioids (morphine, fentanyl, heroin).'
    },
    {
      id: 'pharm-5',
      topic: 'Pharmacology Antidotes',
      question: 'A cardiac patient exhibits visual halos (yellow-green vision), bradycardia (pulse 44 bpm), and nausea while on Digoxin. Which agent reverses this life-threatening toxicity?',
      options: ['Digoxin Immune Fab (DigiFab)', 'Protamine Sulfate', 'Atropine only', 'Kayexalate'],
      correctIndex: 0,
      rationale: 'Digoxin Immune Fab (DigiFab) binds free digoxin molecules in the circulation, forming inert antibody complexes excreted in urine.'
    }
  ],
  med_surg: [
    {
      id: 'ms-1',
      topic: 'Med-Surg Emergencies',
      question: 'In a patient with suspected Increased Intracranial Pressure (ICP), which classic triad of vital sign changes indicates imminent herniation (Cushing\'s Triad)?',
      options: [
        'Hypotension, tachycardia, and tachypnea',
        'Systolic hypertension with widening pulse pressure, bradycardia, and irregular respirations',
        'Hypertension, tachycardia, and hyperthermia',
        'Hypotension, bradycardia, and Cheyne-Stokes respirations'
      ],
      correctIndex: 1,
      rationale: 'Cushing\'s Triad consists of widening pulse pressure (severe systolic hypertension), profound bradycardia, and irregular respirations (Cheyne-Stokes or ataxic breathing).'
    },
    {
      id: 'ms-2',
      topic: 'Med-Surg Emergencies',
      question: 'Using the Parkland Formula, calculate the total fluid requirement in the first 24 hours for a 70 kg adult who sustained 40% Total Body Surface Area (TBSA) thermal burns.',
      options: ['5,600 mL', '8,400 mL', '11,200 mL', '14,000 mL'],
      correctIndex: 2,
      rationale: 'Parkland Formula = 4 mL × kg × %TBSA burned. 4 × 70 kg × 40 = 11,200 mL of Lactated Ringer\'s solution (50% given in first 8 hours).'
    },
    {
      id: 'ms-3',
      topic: 'Med-Surg Emergencies',
      question: 'A post-thyroidectomy client reports perioral numbness and hand tingling. Tapping the facial nerve in front of the ear produces facial muscle twitching. What is this sign?',
      options: ['Trousseau\'s sign indicating Hyperkalemia', 'Chvostek\'s sign indicating Hypocalcemia', 'Kernig\'s sign indicating Meningitis', 'Brudzinski\'s sign indicating Hypomagnesemia'],
      correctIndex: 1,
      rationale: 'Chvostek\'s sign (facial spasm upon tapping anterior to tragus) indicates hypocalcemia resulting from accidental parathyroid removal/trauma during thyroidectomy.'
    },
    {
      id: 'ms-4',
      topic: 'Med-Surg Emergencies',
      question: 'Which arterial blood gas (ABG) value represents Uncompensated Metabolic Acidosis according to the ROME mnemonic?',
      options: [
        'pH 7.30, PaCO2 38 mmHg, HCO3 18 mEq/L',
        'pH 7.50, PaCO2 30 mmHg, HCO3 24 mEq/L',
        'pH 7.32, PaCO2 52 mmHg, HCO3 25 mEq/L',
        'pH 7.48, PaCO2 42 mmHg, HCO3 32 mEq/L'
      ],
      correctIndex: 0,
      rationale: 'pH is acidotic (< 7.35), PaCO2 is normal (35-45), and HCO3 is low (< 22), indicating uncompensated metabolic acidosis.'
    }
  ],
  maternal_child: [
    {
      id: 'mc-1',
      topic: 'Maternal & Child Nursing',
      question: 'A pregnant client\'s last menstrual period (LMP) began on April 10, 2025. Using Naegele\'s Rule, calculate the expected date of delivery (EDD).',
      options: ['January 17, 2026', 'January 10, 2026', 'January 24, 2026', 'December 17, 2025'],
      correctIndex: 0,
      rationale: 'Naegele\'s Rule: LMP + 7 days (10 + 7 = 17), minus 3 months (April - 3 months = January), plus 1 year (2025 + 1 = 2026) -> January 17, 2026.'
    },
    {
      id: 'mc-2',
      topic: 'Maternal & Child Nursing',
      question: 'A newborn at 1 minute has a heart rate of 115 bpm, vigorous crying, active motion with flexed extremities, prompt sneeze to nasal suction, and pink body with blue extremities. What is the APGAR score?',
      options: ['7', '8', '9', '10'],
      correctIndex: 2,
      rationale: 'Heart rate > 100 (2) + Respiratory vigorous cry (2) + Muscle tone active (2) + Reflex sneeze (2) + Color acrocyanosis (1) = 9 points.'
    },
    {
      id: 'mc-3',
      topic: 'Maternal & Child Nursing',
      question: 'A client at 34 weeks gestation arrives with painless, bright red vaginal bleeding and a soft, non-tender uterus. Which nursing action is strictly CONTRAINDICATED?',
      options: ['Digital vaginal examination', 'External fetal heart monitoring', 'Initiating an 18-gauge IV line', 'Ultrasound evaluation'],
      correctIndex: 0,
      rationale: 'In painless bright red vaginal bleeding (suggestive of Placenta Previa), digital vaginal examination is strictly contraindicated as it can puncture the placenta and cause catastrophic maternal-fetal hemorrhage.'
    }
  ]
};

// Card Match Clinical Pairs (Nurse Game Hub Memory Speed Game)
interface MatchCard {
  id: string;
  pairId: string;
  text: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MATCH_PAIRS = [
  { pairId: 'pair-1', cardA: 'Heparin Sodium', cardB: 'Protamine Sulfate', cat: 'Antidotes' },
  { pairId: 'pair-2', cardA: 'Warfarin (Coumadin)', cardB: 'Vitamin K1 (Phytonadione)', cat: 'Antidotes' },
  { pairId: 'pair-3', cardA: 'Magnesium Sulfate', cardB: 'Calcium Gluconate 10%', cat: 'Antidotes' },
  { pairId: 'pair-4', cardA: 'Chvostek\'s Facial Twitch', cardB: 'Hypocalcemia (< 8.5 mg/dL)', cat: 'Clinical Signs' },
  { pairId: 'pair-5', cardA: 'Cushing\'s Triad', cardB: 'Increased Intracranial Pressure (ICP)', cat: 'Clinical Signs' },
  { pairId: 'pair-6', cardA: 'Parkland Fluid Formula', cardB: '4 mL × kg × %TBSA Burn', cat: 'Emergency Formulas' },
];

export const StudyLoungePage: React.FC<StudyLoungePageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'study_workspace' | 'duel' | 'card_match' | 'buzzer' | 'buddies'>('study_workspace');
  const [buddies, setBuddies] = useState<StudyBuddy[]>(getStudyBuddies());
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState<number>(getDailyGameCount());
  
  // Add Buddy Modal State
  const [isAddBuddyOpen, setIsAddBuddyOpen] = useState(false);
  const [newBuddyName, setNewBuddyName] = useState('');
  const [newBuddySchool, setNewBuddySchool] = useState('');
  const [newBuddyExam, setNewBuddyExam] = useState('PNLE 2026');

  // Limit reached modal state
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // GAME MODE 1: CLINICAL DUEL SHOWDOWN STATE
  // --------------------------------------------------------------------------
  const [duelTopic, setDuelTopic] = useState<'pharmacology' | 'med_surg' | 'maternal_child'>('pharmacology');
  const [duelOpponent, setDuelOpponent] = useState<StudyBuddy | { name: string; school: string; isOnline: boolean }>(
    buddies[0] || { name: 'Nurse Sarah (Top AI Ranker)', school: 'PGH Pediatric ICU', isOnline: true }
  );
  const [duelState, setDuelState] = useState<'lobby' | 'playing' | 'completed'>('lobby');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [duelTimer, setDuelTimer] = useState(15);
  const [streakCount, setStreakCount] = useState(0);

  // --------------------------------------------------------------------------
  // GAME MODE 2: CARD MATCH MEMORY GAME STATE
  // --------------------------------------------------------------------------
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [firstSelectedCard, setFirstSelectedCard] = useState<MatchCard | null>(null);
  const [secondSelectedCard, setSecondSelectedCard] = useState<MatchCard | null>(null);
  const [matchMoves, setMatchMoves] = useState(0);
  const [matchMatches, setMatchMatches] = useState(0);
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [isMatchWon, setIsMatchWon] = useState(false);

  // --------------------------------------------------------------------------
  // GAME MODE 3: RAPID FIRE BUZZER TRIVIA STATE
  // --------------------------------------------------------------------------
  const [buzzerScore, setBuzzerScore] = useState(0);
  const [buzzerTimer, setBuzzerTimer] = useState(10);
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [buzzerIndex, setBuzzerIndex] = useState(0);
  const [buzzerGameOver, setBuzzerGameOver] = useState(false);

  const activeDuelQuestions = DUEL_QUESTIONS[duelTopic] || DUEL_QUESTIONS.pharmacology;
  const currentQuestion = activeDuelQuestions[currentQuestionIdx];

  // Check Game Limit Helper
  const checkCanPlay = (): boolean => {
    const quota = canPlayGame(user.tier);
    if (!quota.allowed) {
      setIsLimitModalOpen(true);
      return false;
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // DUEL TIMER & OPPONENT AI BEHAVIOR
  // --------------------------------------------------------------------------
  useEffect(() => {
    let interval: any = null;
    if (duelState === 'playing' && !isAnswerRevealed && duelTimer > 0) {
      interval = setInterval(() => {
        setDuelTimer((prev) => prev - 1);
      }, 1000);
    } else if (duelTimer === 0 && !isAnswerRevealed) {
      // Time ran out
      handleAnswerSelect(-1);
    }
    return () => clearInterval(interval);
  }, [duelState, duelTimer, isAnswerRevealed]);

  // --------------------------------------------------------------------------
  // CARD MATCH TIMER
  // --------------------------------------------------------------------------
  useEffect(() => {
    let interval: any = null;
    if (isMatchActive && !isMatchWon) {
      interval = setInterval(() => {
        setMatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMatchActive, isMatchWon]);

  // Start Card Match Game
  const initCardMatch = () => {
    if (!checkCanPlay()) return;

    // Pick 6 pairs
    const cards: MatchCard[] = [];
    MATCH_PAIRS.forEach((p, idx) => {
      cards.push({
        id: `card-${idx}-A`,
        pairId: p.pairId,
        text: p.cardA,
        category: p.cat,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `card-${idx}-B`,
        pairId: p.pairId,
        text: p.cardB,
        category: p.cat,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setMatchCards(shuffled);
    setFirstSelectedCard(null);
    setSecondSelectedCard(null);
    setMatchMoves(0);
    setMatchMatches(0);
    setMatchSeconds(0);
    setIsMatchActive(true);
    setIsMatchWon(false);

    // Increment game quota
    const newCount = incrementDailyGameCount();
    setDailyGamesPlayed(newCount);
  };

  const handleCardClick = (card: MatchCard) => {
    if (!isMatchActive || card.isFlipped || card.isMatched || secondSelectedCard) return;

    // Flip card
    const updated = matchCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setMatchCards(updated);

    if (!firstSelectedCard) {
      setFirstSelectedCard(card);
    } else {
      setSecondSelectedCard(card);
      setMatchMoves((prev) => prev + 1);

      // Check match
      if (firstSelectedCard.pairId === card.pairId) {
        // MATCH!
        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c) => (c.pairId === card.pairId ? { ...c, isMatched: true } : c))
          );
          setFirstSelectedCard(null);
          setSecondSelectedCard(null);
          const nextMatches = matchMatches + 1;
          setMatchMatches(nextMatches);

          if (nextMatches === MATCH_PAIRS.length) {
            setIsMatchWon(true);
            setIsMatchActive(false);
            recordGameSession({
              id: 'game-' + Date.now(),
              mode: 'card_match',
              topic: 'Clinical Pairs & Antidotes',
              score: 100,
              totalQuestions: MATCH_PAIRS.length,
              completedAt: new Date().toISOString(),
              won: true
            });
          }
        }, 500);
      } else {
        // NO MATCH - flip back
        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c) =>
              c.id === firstSelectedCard.id || c.id === card.id ? { ...c, isFlipped: false } : c
            )
          );
          setFirstSelectedCard(null);
          setSecondSelectedCard(null);
        }, 1000);
      }
    }
  };

  // Start Clinical Duel
  const startDuel = () => {
    if (!checkCanPlay()) return;

    setCurrentQuestionIdx(0);
    setUserScore(0);
    setOpponentScore(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setDuelTimer(15);
    setStreakCount(0);
    setDuelState('playing');

    const newCount = incrementDailyGameCount();
    setDailyGamesPlayed(newCount);
  };

  // Handle Answer in Duel
  const handleAnswerSelect = (optionIdx: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(optionIdx);
    setIsAnswerRevealed(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    
    // Opponent score logic (70% accuracy simulation for opponent)
    const opponentCorrect = Math.random() < 0.75;
    const opponentPoints = opponentCorrect ? Math.floor(Math.random() * 200) + 700 : 0;
    
    let userPoints = 0;
    if (isCorrect) {
      // Faster answer gives more points (up to 1000)
      const speedBonus = duelTimer * 30;
      userPoints = 600 + speedBonus;
      setUserScore((prev) => prev + userPoints);
      setStreakCount((prev) => prev + 1);
    } else {
      setStreakCount(0);
    }

    if (opponentCorrect) {
      setOpponentScore((prev) => prev + opponentPoints);
    }
  };

  const handleNextDuelQuestion = () => {
    if (currentQuestionIdx + 1 < activeDuelQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setDuelTimer(15);
    } else {
      // Completed duel
      setDuelState('completed');
      const won = userScore >= opponentScore;
      recordGameSession({
        id: 'duel-' + Date.now(),
        mode: 'duel',
        topic: duelTopic,
        score: userScore,
        totalQuestions: activeDuelQuestions.length,
        completedAt: new Date().toISOString(),
        opponentName: duelOpponent.name,
        won
      });
    }
  };

  // Add Buddy Handler
  const handleAddBuddy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuddyName.trim()) return;

    const colors = ['bg-teal-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: StudyBuddy = {
      id: 'buddy-' + Date.now(),
      name: newBuddyName.trim(),
      school: newBuddySchool.trim() || 'Philippine Nursing College',
      targetExam: newBuddyExam,
      avatarBg: randomColor,
      isOnline: true,
      status: 'Ready in Study Lounge',
      streakDays: 1,
      duelsWon: 0,
      duelsPlayed: 0,
      addedAt: new Date().toISOString().slice(0, 10)
    };

    const updated = saveStudyBuddy(created);
    setBuddies(updated);
    setNewBuddyName('');
    setNewBuddySchool('');
    setIsAddBuddyOpen(false);
  };

  const handleNudgeBuddy = (buddy: StudyBuddy) => {
    setNudgeMessage(`Sent a study nudge to ${buddy.name}! "Time to review together!" 💬`);
    setTimeout(() => setNudgeMessage(null), 3500);
  };

  const handleChallengeBuddy = (buddy: StudyBuddy) => {
    setDuelOpponent(buddy);
    setActiveTab('duel');
    setDuelState('lobby');
  };

  const isFreePlan = user.tier === 'start';
  const gamesRemaining = Math.max(0, FREE_DAILY_GAMES_LIMIT - dailyGamesPlayed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Toast Nudge Notification */}
      {nudgeMessage && (
        <div className="fixed top-20 right-4 z-50 bg-teal-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-teal-500 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold">{nudgeMessage}</span>
        </div>
      )}

      {/* Hero Lounge Header */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Study Lounge & Nurse Game Hub</span>
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-2.5 py-0.5 rounded-full border border-white/10">
              Interactive Peer Gaming & Buddy Quizzes
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Level up your nursing instincts through <span className="text-amber-300">gamified battles</span>.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Challenge your study buddies to 1v1 clinical showdowns, race the clock in Nurse Game Hub card matching, and boost retention on pharmacology antidotes, lab values, and board triage.
          </p>

          {/* Daily Quota Indicator & Upgrade Plan Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isFreePlan ? (
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 flex items-center space-x-3 text-xs">
                <div>
                  <span className="text-slate-300 block text-[10px] font-semibold">Free Starter Daily Limit:</span>
                  <span className="font-extrabold text-amber-300">
                    {dailyGamesPlayed} / {FREE_DAILY_GAMES_LIMIT} Free Games Played Today ({gamesRemaining} left)
                  </span>
                </div>
                <button
                  onClick={() => onOpenSubscription('growth')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Upgrade Plan (₱69/mo)</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-2 rounded-2xl flex items-center space-x-3 text-xs font-bold">
                <div className="flex items-center space-x-1.5">
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Active Plan: {user.tier.toUpperCase()} PASS</span>
                </div>
                <button
                  onClick={() => onOpenSubscription(user.tier === 'growth' ? 'ready' : 'lifetime')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1 rounded-xl text-[11px] transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3 fill-slate-950" />
                  <span>Upgrade Plan</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsAddBuddyOpen(true)}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-3.5 py-2 rounded-2xl text-xs border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-300" />
              <span>Add Study Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Game & Study Tabs: Clean, Prominent & Touch-Friendly */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('study_workspace')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'study_workspace'
              ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>📚 Personal Study Space (Uploads, Quiz, Flashcards, Mnemonics &amp; Reviewer)</span>
        </button>

        <button
          onClick={() => setActiveTab('duel')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'duel'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>⚔️ 1v1 Clinical Duel Showdown</span>
        </button>

        <button
          onClick={() => { setActiveTab('card_match'); if (!isMatchActive) initCardMatch(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'card_match'
              ? 'bg-indigo-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-300" />
          <span>🧩 Nurse Game Hub Speed Card Match</span>
        </button>

        <button
          onClick={() => setActiveTab('buddies')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'buddies'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-purple-300" />
          <span>👥 Study Buddies Network ({buddies.length})</span>
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 0: PERSONAL STUDY WORKSPACE (5 CORE STUDY LOUNGE TOOLS) */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'study_workspace' && (
        <PersonalStudyWorkspace
          user={user}
          onOpenSubscription={onOpenSubscription}
        />
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: CLINICAL DUEL SHOWDOWN */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'duel' && (
        <div className="space-y-6">
          {duelState === 'lobby' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Select Duel Configuration */}
              <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <Swords className="w-5 h-5 text-teal-600" />
                    <span>Choose Your Battle Arena & Subject</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a high-yield clinical domain. You and your opponent will answer timed 15-second questions.
                  </p>
                </div>

                {/* Topic Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setDuelTopic('pharmacology')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      duelTopic === 'pharmacology'
                        ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">💊</div>
                    <div className="font-black text-xs text-slate-900">Pharmacology Antidotes</div>
                    <div className="text-[10px] text-slate-500 mt-1">Heparin, Digoxin, Magnesium, Opioids</div>
                  </button>

                  <button
                    onClick={() => setDuelTopic('med_surg')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      duelTopic === 'med_surg'
                        ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏥</div>
                    <div className="font-black text-xs text-slate-900">Med-Surg Emergencies</div>
                    <div className="text-[10px] text-slate-500 mt-1">Parkland burns, Cushing triad, ABG</div>
                  </button>

                  <button
                    onClick={() => setDuelTopic('maternal_child')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      duelTopic === 'maternal_child'
                        ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">👶</div>
                    <div className="font-black text-xs text-slate-900">Maternal & Child OB</div>
                    <div className="text-[10px] text-slate-500 mt-1">Naegele rule, APGAR score, labor stages</div>
                  </button>
                </div>

                {/* Opponent Selection Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Selected Challenger:</span>
                    <span className="text-teal-700 font-bold text-[11px] cursor-pointer" onClick={() => setActiveTab('buddies')}>
                      Change Buddy ➔
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center">
                      {duelOpponent.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900">{duelOpponent.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-[10px] text-slate-500">{duelOpponent.school}</div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      🔥 Challenger Ready
                    </span>
                  </div>
                </div>

                {/* Start Battle CTA */}
                <button
                  onClick={startDuel}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                >
                  <Swords className="w-5 h-5 text-amber-300" />
                  <span>Enter Battle Showdown (5 Rounds)</span>
                </button>
              </div>

              {/* Study Buddy Quick Side Panel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Online Study Buddies
                  </h4>
                  <button 
                    onClick={() => setIsAddBuddyOpen(true)}
                    className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-2.5">
                  {buddies.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl ${b.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                            <span className="truncate max-w-[110px]">{b.name}</span>
                            {b.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span>{b.streakDays}d streak</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleChallengeBuddy(b)}
                        className="bg-white border border-slate-300 hover:border-teal-600 hover:text-teal-700 text-slate-700 text-[10px] font-black px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Challenge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE BATTLE SCREEN */}
          {duelState === 'playing' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              {/* Battle Header with Health / Score Bars */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-black">
                      {user.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-teal-300 font-extrabold">{user.name.split(' ')[0]} (You)</div>
                      <div className="font-mono text-amber-300 text-sm font-black">{userScore} pts</div>
                    </div>
                  </div>

                  {/* Timer Badge */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Time Left</span>
                    <div className={`text-xl font-black font-mono ${duelTimer <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                      00:{duelTimer < 10 ? `0${duelTimer}` : duelTimer}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-right">
                    <div>
                      <div className="text-indigo-300 font-extrabold">{duelOpponent.name.split(' ')[0]}</div>
                      <div className="font-mono text-amber-300 text-sm font-black">{opponentScore} pts</div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                      {duelOpponent.name.slice(0, 1)}
                    </div>
                  </div>
                </div>

                {/* Score Ratio Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 flex overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.max(10, (userScore / (userScore + opponentScore || 1)) * 100)}%` }} 
                  />
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.max(10, (opponentScore / (userScore + opponentScore || 1)) * 100)}%` }} 
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Round {currentQuestionIdx + 1} of {activeDuelQuestions.length}</span>
                  {streakCount > 1 && (
                    <span className="text-amber-400 font-bold flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{streakCount}x Combo Streak!</span>
                    </span>
                  )}
                  <span>Category: {currentQuestion.topic}</span>
                </div>
              </div>

              {/* Question Statement */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Clinical Challenge #{currentQuestionIdx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((option, idx) => {
                  let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                  if (isAnswerRevealed) {
                    if (idx === currentQuestion.correctIndex) {
                      buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (idx === selectedAnswer) {
                      buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950 line-through';
                    } else {
                      buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start space-x-3 cursor-pointer ${buttonStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 mt-0.5">{option}</span>
                      {isAnswerRevealed && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerRevealed && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Rationale & Next Round */}
              {isAnswerRevealed && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="text-xs font-black text-teal-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Clinical Board Rationale:</span>
                  </div>
                  <p className="text-xs text-teal-950 leading-relaxed">
                    {currentQuestion.rationale}
                  </p>
                  <button
                    onClick={handleNextDuelQuestion}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>{currentQuestionIdx + 1 < activeDuelQuestions.length ? 'Next Battle Round ➔' : 'View Duel Results 🏆'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DUEL RESULTS / VICTORY SCREEN */}
          {duelState === 'completed' && (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-scaleIn">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-3xl shadow-sm">
                {userScore >= opponentScore ? '🏆' : '🤝'}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {userScore >= opponentScore ? 'Victory Showdown Winner!' : 'Good Effort Battle!'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {userScore >= opponentScore ? `You defeated ${duelOpponent.name.split(' ')[0]}!` : `${duelOpponent.name.split(' ')[0]} took this match!`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Topic: {duelTopic === 'pharmacology' ? 'Pharmacology Antidotes' : duelTopic === 'med_surg' ? 'Med-Surg Emergencies' : 'Maternal-Child OB'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Your Score</span>
                  <span className="text-lg font-black text-teal-700">{userScore} pts</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Challenger Score</span>
                  <span className="text-lg font-black text-indigo-700">{opponentScore} pts</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={startDuel}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rematch Challenger</span>
                </button>
                <button
                  onClick={() => setDuelState('lobby')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Back to Lounge Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: NURSE GAME HUB SPEED CARD MATCH */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'card_match' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Nurse Game Hub Speed Card Match (Memory Tiles)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Match clinical drugs to their antidotes, or signs to their medical conditions in minimum time!
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{matchSeconds}s</span>
                </div>
                <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">
                  Moves: <span className="font-black text-slate-900">{matchMoves}</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-xl">
                  Matched: <span className="font-black text-indigo-700">{matchMatches} / {MATCH_PAIRS.length}</span>
                </div>
                <button
                  onClick={initCardMatch}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-bold text-xs flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </div>
            </div>

            {/* Win Alert Banner */}
            {isMatchWon && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2 animate-scaleIn">
                <div className="text-2xl">🎉</div>
                <h4 className="text-sm font-black text-emerald-900">
                  Memory Mastery Completed in {matchSeconds} Seconds!
                </h4>
                <p className="text-xs text-emerald-800">
                  You completed all {MATCH_PAIRS.length} clinical antidote & emergency sign pairs in {matchMoves} moves.
                </p>
                <button
                  onClick={initCardMatch}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Play Another Match Game
                </button>
              </div>
            )}

            {/* Match Grid 3x4 or 4x3 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {matchCards.map((card) => {
                const isSelected = card.id === firstSelectedCard?.id || card.id === secondSelectedCard?.id;
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched || isSelected}
                    onClick={() => handleCardClick(card)}
                    className={`h-28 rounded-2xl p-3 border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-60'
                        : card.isFlipped || isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-400/30 text-indigo-950 font-bold scale-102'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {card.isFlipped || card.isMatched ? card.category : 'Tap to Flip'}
                      </span>
                      {card.isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>

                    <div className="text-xs sm:text-sm font-extrabold leading-snug line-clamp-3">
                      {card.isFlipped || card.isMatched ? (
                        card.text
                      ) : (
                        <div className="text-slate-300 font-mono text-xl text-center py-2">
                          ❓
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono">
                      {card.isMatched ? 'MATCHED' : 'CARD'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 3: STUDY BUDDIES NETWORK */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'buddies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Nursing Study Buddies Network</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect, review together, send study nudges, and challenge classmates across Philippine nursing colleges.
              </p>
            </div>

            <button
              onClick={() => setIsAddBuddyOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Study Buddy</span>
            </button>
          </div>

          {/* Buddies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buddies.map((buddy) => (
              <div 
                key={buddy.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl ${buddy.avatarBg} text-white font-black text-base flex items-center justify-center shadow-xs`}>
                      {buddy.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                        <span>{buddy.name}</span>
                        {buddy.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="Online now" />
                        )}
                      </h4>
                      <div className="text-[11px] text-slate-500">{buddy.school}</div>
                      <div className="text-[10px] font-bold text-teal-700">{buddy.targetExam}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    buddy.isOnline ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {buddy.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Status Bar */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center space-x-2">
                  <span className="text-sm">📖</span>
                  <span className="truncate">{buddy.status}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Streak</span>
                    <span className="font-black text-orange-600 flex items-center justify-center space-x-0.5">
                      <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                      <span>{buddy.streakDays}d</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duels Won</span>
                    <span className="font-black text-slate-800">{buddy.duelsWon}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Win Rate</span>
                    <span className="font-black text-emerald-700">
                      {buddy.duelsPlayed > 0 ? Math.round((buddy.duelsWon / buddy.duelsPlayed) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleChallengeBuddy(buddy)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Swords className="w-3.5 h-3.5 text-amber-300" />
                    <span>Duel Now</span>
                  </button>

                  <button
                    onClick={() => handleNudgeBuddy(buddy)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                  >
                    👋 Nudge to Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ADD BUDDY MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {isAddBuddyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <span>Add Study Buddy to Lounge</span>
              </h3>
              <button 
                onClick={() => setIsAddBuddyOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBuddy} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Buddy Full Name or Nickname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={newBuddyName}
                  onChange={(e) => setNewBuddyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nursing College / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. UST, UP Manila, SLU Baguio, Cebu Doctors"
                  value={newBuddySchool}
                  onChange={(e) => setNewBuddySchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Nursing Exam
                </label>
                <select
                  value={newBuddyExam}
                  onChange={(e) => setNewBuddyExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="PNLE May 2026">PNLE May 2026</option>
                  <option value="PNLE November 2026">PNLE November 2026</option>
                  <option value="NextGen NCLEX-RN">NextGen NCLEX-RN</option>
                  <option value="UK NMC CBT">UK NMC CBT</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddBuddyOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Connect Buddy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* DAILY GAME QUOTA LIMIT MODAL (FOR STARTER FREE TIER) */}
      {/* ---------------------------------------------------------------------- */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-5 animate-scaleIn">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
              🎮
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Daily Free Limit Reached
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                You've completed your 3 free game quizzes for today!
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Free Starter accounts include <strong>3 game generations per day</strong>. Upgrade to <strong>Nurse Student Pass (₱69/mo)</strong> or <strong>Nurse Board Ready (₱149/mo)</strong> for unlimited battles, unlimited buddy challenges, and full syllabus access!
              </p>
            </div>

            {/* Quick Philippine E-Wallet Pay Bar */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Direct Philippine E-Wallet Payment:</span>
                <span className="text-teal-700 font-mono text-[10px]">Zero Transfer Fees</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-xl text-left">
                  <div className="font-black text-blue-900 text-[10px]">GCash Direct</div>
                  <div className="font-mono text-[11px] font-bold text-blue-800">09912725905</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-left">
                  <div className="font-black text-emerald-900 text-[10px]">Maya Direct</div>
                  <div className="font-mono text-[11px] font-bold text-emerald-800">09218432624</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => { setIsLimitModalOpen(false); onOpenSubscription('growth'); }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Upgrade to Student Pass (₱69/month)</span>
              </button>

              <button
                onClick={() => setIsLimitModalOpen(false)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
