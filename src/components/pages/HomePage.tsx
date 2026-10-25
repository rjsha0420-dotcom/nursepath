import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Calendar,
  Flame,
  Brain,
  Layers,
  HeartHandshake,
  Compass,
  GraduationCap,
  Globe,
  Stethoscope,
  Users,
  Gamepad2
} from 'lucide-react';
import { UserProfile, PageId } from '../../types';

interface HomePageProps {
  user: UserProfile;
  onNavigate: (page: PageId) => void;
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  onNavigate,
  onOpenSubscription,
  onOpenAuth
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Student Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.25),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🇵🇭 Philippine & Global Nursing Platform
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-2.5 py-0.5 rounded-full border border-white/10">
              CHED CMO 15 s.2017 & CMO 5 s.2024 Aligned
            </span>
          </div>

          <div className="flex items-center space-x-3.5 pt-1">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-24_at_10.05.09_PM_6ca69e7c.jpeg"
              alt="NursePath Official Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-lg border-2 border-teal-400/50 shrink-0"
            />
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Mabuhay, <span className="text-teal-300">{user.name}</span>! Welcome to NursePath.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            Your unified platform across every milestone: 4-Year BSN curriculum, PNLE board review, NextGen NCLEX, UK NMC, Australia AHPRA, hospital bedside clinical tools, and Graduate MSN/PhD leadership.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-teal-200 block font-medium">Target Exam</span>
              <span className="text-sm sm:text-base font-extrabold text-white">{user.targetExam || 'PNLE & NCLEX'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-teal-200 block font-medium">Readiness Score</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-300">{user.pnleReadinessScore}%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-teal-200 block font-medium">Clinical RLE Logged</span>
              <span className="text-sm sm:text-base font-extrabold text-white">{user.clinicalHoursCompleted} hrs</span>
            </div>
            <div 
              onClick={onOpenSubscription}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-xs p-3 rounded-2xl border border-amber-400/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-teal-200 font-medium">Active Plan</span>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded group-hover:scale-105 transition">
                  Upgrade
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-amber-300 capitalize block mt-0.5">{user.tier} Pass</span>
            </div>
          </div>

          {/* Action CTAs: Direct access to all key zones */}
          <div className="flex flex-wrap gap-2.5 pt-3">
            <button
              onClick={onOpenSubscription}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ring-2 ring-amber-300/50"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>⚡ Upgrade Plan</span>
            </button>

            <button
              onClick={() => onNavigate('study_lounge')}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-slate-950" />
              <span>🎮 Study Lounge &amp; Games</span>
            </button>

            <button
              onClick={() => onNavigate('quizzes')}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Practice &amp; Mock Exam</span>
            </button>

            <button
              onClick={() => onNavigate('graduate')}
              className="bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-xs border border-indigo-400/40 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-indigo-200" />
              <span>🎓 Graduate MSN / PhD</span>
            </button>

            <button
              onClick={() => onNavigate('study_materials')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-200" />
              <span>PNLE Materials & Uploads</span>
            </button>

            <button
              onClick={() => onNavigate('clinical_tools')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-200" />
              <span>Bedside Clinical Tools</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid: All Restored Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Study Materials */}
        <div 
          onClick={() => onNavigate('study_materials')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-teal-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">
              Full BSN Syllabus
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Study Materials & PNLE Reviewer
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Explore 5 PNLE board exam subject guides, CHED 4-year BSN curriculum, RLE clinical logbook, 11 National Core Competencies, and AI lecture notes synthesizer.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Explore Syllabi & Notes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Study Lounge & Nurse Game Hub */}
        <div 
          onClick={() => onNavigate('study_lounge')}
          className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-xs hover:shadow-md transition-all hover:border-amber-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
              🎮 Nurse Game Hub & Buddies
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Study Lounge & Nurse Game Hub
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              1v1 Clinical Duel Showdowns with study buddies or AI challengers, Nurse Game Hub memory speed card match, lightning buzzer trivia, and flame streaks.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Enter Study Lounge & Games</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: International Boards */}
        <div 
          onClick={() => onNavigate('international')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-cyan-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider bg-cyan-50 px-2 py-0.5 rounded-full">
              Global Licensure
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              International Board Mastery
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              NextGen NCLEX-RN adaptive clinical judgment drills, UK NMC CBT Part A & B plus OSCE stations, Australia AHPRA OBA, and visa sponsorship roadmaps.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
            <span>Prepare for NCLEX & NMC</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Clinical Tools & Specialties */}
        <div 
          onClick={() => onNavigate('clinical_tools')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-blue-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
              Bedside Practice & Certs
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Clinical Tools & 10 Specialties
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              High-alert drug database with IV push rates & antidotes, advanced ABG analyzer, IV drip calculators, critical lab alerts, and CCRN/CEN certification reviewers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
            <span>Open Clinical Tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Graduate Leadership */}
        <div 
          onClick={() => onNavigate('graduate')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-indigo-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
              PQF Levels 7 & 8
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Graduate MSN & PhD Leadership
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Master of Science in Nursing (CHED CMO 5 s.2024), doctoral competencies, thesis proposal interactive builder, and comprehensive qualifying exam prep.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Explore Graduate Tracks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 5: Practice Quizzes */}
        <div 
          onClick={() => onNavigate('quizzes')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-emerald-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
              15,000+ Question Bank
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Practice Quizzes & Tests
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Subject drills across Nursing Practice I to V, timed 30-min full mock board exams with PRC-standard countdowns, and SM-2 adaptive spaced repetition flashcards.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Take Practice Drill</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 6: Community & Network */}
        <div 
          onClick={() => onNavigate('community')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-violet-500 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider bg-violet-50 px-2 py-0.5 rounded-full">
              Mentorship & Jobs
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Global Network & RN Jobs
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Connect with 14,000+ Filipino nurses, book 1-on-1 sessions with verified preceptors, view direct US/UK/Australia hospital sponsorships, and discover grants.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-700">
            <span>Join Network & Jobs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Daily High-Yield Clinical Pearl & PNLE Table of Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Yield Pearl */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-50/30 rounded-3xl p-6 border border-amber-200/60 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-black">
              💡
            </span>
            <h4 className="font-extrabold text-sm text-slate-900">
              Today's High-Yield Clinical Pearl
            </h4>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
              Pharmacology • Cardiac
            </span>
            <h5 className="font-bold text-xs text-slate-900">
              Digoxin (Lanoxin) Toxicity & Hypokalemia Alert
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Always check the apical pulse for a full 60 seconds before administration. Withhold if HR &lt; 60 bpm in adults (&lt; 90 in infants). <strong>Hypokalemia (&lt; 3.5 mEq/L)</strong> dramatically increases toxicity risk!
            </p>
            <div className="text-[10px] font-semibold text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Early signs: Anorexia, nausea, vomiting, yellow-green visual halos. Antidote: Digibind (Digoxin Immune Fab).
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-teal-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded uppercase">
              Obstetrics Mnemonic
            </span>
            <h5 className="font-bold text-xs text-slate-900">
              VEAL CHOP: Fetal Heart Rate Decelerations
            </h5>
            <ul className="text-[11px] text-slate-700 space-y-1">
              <li><strong>V</strong>ariable = <strong>C</strong>ord compression</li>
              <li><strong>E</strong>arly = <strong>H</strong>ead compression (benign)</li>
              <li><strong>A</strong>cceleration = <strong>O</strong>kay / Oxygenated</li>
              <li><strong>L</strong>ate = <strong>P</strong>lacental insufficiency (Priority!)</li>
            </ul>
          </div>
        </div>

        {/* PNLE 5 Subjects Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900">
                Philippine Nurse Licensure Examination (PNLE) Blueprint
              </h3>
              <p className="text-xs text-slate-500">
                PRC Board of Nursing Table of Specifications (5 Parts × 100 Items = 500 Total Questions)
              </p>
            </div>
            <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-teal-200">
              Passing Mark: 75% GWA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                code: 'NP I',
                title: 'Community Health Nursing',
                desc: 'Primary health care, epidemiology, immunization (EPI), family health care plan, and public health nursing laws (RA 9173, RA 7160).',
                color: 'border-teal-200 bg-teal-50/40 text-teal-900'
              },
              {
                code: 'NP II',
                title: 'Maternal and Child Nursing',
                desc: 'Care of the mother during pregnancy, labor, delivery, postpartum; neonatal assessment (APGAR), growth and developmental milestones.',
                color: 'border-pink-200 bg-pink-50/40 text-pink-900'
              },
              {
                code: 'NP III',
                title: 'Medical-Surgical Nursing (Part 1)',
                desc: 'Cellular aberrations, perioperative care, cardiovascular, respiratory, fluids and electrolytes, acid-base imbalances.',
                color: 'border-blue-200 bg-blue-50/40 text-blue-900'
              },
              {
                code: 'NP IV',
                title: 'Medical-Surgical Nursing (Part 2)',
                desc: 'Gastrointestinal, endocrine, neurologic, musculoskeletal, burns (Parkland formula), and emergency triage.',
                color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900'
              },
              {
                code: 'NP V',
                title: 'Psychiatric & Mental Health Nursing',
                desc: 'Therapeutic nurse-client relationship, defense mechanisms, anxiety, mood disorders, schizophrenia, psychopharmacology.',
                color: 'border-purple-200 bg-purple-50/40 text-purple-900'
              },
              {
                code: 'RLE',
                title: 'Related Learning Experiences',
                desc: '2,142 required clinical hours across Operating Room, Delivery Room, ICU, Emergency Room, and Rural Health Units.',
                color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
              }
            ].map((subj) => (
              <div 
                key={subj.code}
                onClick={() => onNavigate('study_materials')}
                className={`p-3.5 rounded-2xl border transition-all hover:shadow-xs cursor-pointer ${subj.color}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-black text-xs px-2 py-0.5 rounded-md bg-white border border-current shadow-2xs">
                    {subj.code}
                  </span>
                  <span className="font-extrabold text-xs">{subj.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {subj.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
