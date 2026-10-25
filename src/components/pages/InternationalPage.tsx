import React, { useState } from 'react';
import { 
  Globe, 
  Award, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  FileText, 
  Layers, 
  Sparkles,
  Zap,
  MapPin,
  Compass,
  Building,
  Plane
} from 'lucide-react';
import { COMPREHENSIVE_QUESTION_BANK } from '../../data/mockQuestions';
import { UserProfile } from '../../types';

interface InternationalPageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const InternationalPage: React.FC<InternationalPageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeExam, setActiveExam] = useState<'nclex' | 'uk_nmc' | 'ahpra' | 'relocation'>('nclex');

  // NCLEX questions from mock bank
  const nclexQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.examType.includes('NCLEX') || q.zone === 'international');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = nclexQuestions[currentIdx] || nclexQuestions[0];

  const handleSelectOpt = (idx: number) => {
    if (showRationale) return;
    setSelectedOpt(idx);
    setShowRationale(true);
    if (idx === currentQ?.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQ = () => {
    setSelectedOpt(null);
    setShowRationale(false);
    setCurrentIdx((prev) => (prev + 1) % nclexQuestions.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🌐 International Board Mastery
            </span>
            <span className="text-cyan-300 text-xs font-semibold">USA • UK • Australia • Canada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pass Global Licensure Examinations
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
            From Philippine BSN to Global Registered Nurse. NextGen NCLEX-RN clinical judgment case drills, UK NMC Computer-Based Test (CBT) & OSCE stations, Australian AHPRA Outcomes-Based Assessment (OBA), and international nurse relocation pathways.
          </p>
        </div>
      </div>

      {/* Exam Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'nclex', label: '🇺🇸 US NCLEX-RN NextGen (NGN)', badge: 'Adaptive CJMM' },
          { id: 'uk_nmc', label: '🇬🇧 UK NMC CBT & OSCE', badge: 'Adult Nursing' },
          { id: 'ahpra', label: '🇦🇺 Australia AHPRA (OBA)', badge: 'NCLEX & OSCE' },
          { id: 'relocation', label: '✈️ Global Relocation & Visa Roadmap', badge: 'EB-3 & Visas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveExam(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeExam === tab.id
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeExam === tab.id ? 'bg-cyan-800 text-cyan-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: NCLEX-RN NextGen */}
      {activeExam === 'nclex' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                  {currentQ?.subject || 'NextGen NCLEX-RN Case Study'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Item {currentIdx + 1} of {nclexQuestions.length}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ?.question}
              </h3>

              <div className="space-y-3 pt-2">
                {currentQ?.options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  const isCorrect = i === currentQ.correctAnswerIndex;
                  let style = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';
                  if (showRationale) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    else if (isSelected) style = 'border-rose-400 bg-rose-50 text-rose-950';
                    else style = 'border-slate-200 opacity-60 text-slate-500';
                  }

                  return (
                    <button
                      key={i}
                      disabled={showRationale}
                      onClick={() => handleSelectOpt(i)}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer ${style}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showRationale && (
                <div className="bg-cyan-50 border-2 border-cyan-400/40 rounded-2xl p-5 space-y-2 animate-fadeIn text-xs sm:text-sm text-cyan-950">
                  <strong className="block font-black text-cyan-900">NCSBN Clinical Judgment Model Rationale:</strong>
                  <p className="leading-relaxed">{currentQ.rationale}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Passing Score Threshold: Adaptive (85 to 150 items)
                </span>
                <button
                  onClick={handleNextQ}
                  className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Next NCLEX Item
                </button>
              </div>
            </div>
          </div>

          {/* NCSBN Blueprint Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                NCSBN Test Plan Breakdown
              </h4>
              <ul className="text-xs text-slate-700 space-y-2.5">
                <li className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <span>Management of Care</span>
                  <span className="font-bold text-cyan-700">17 - 23%</span>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <span>Safety & Infection Control</span>
                  <span className="font-bold text-cyan-700">9 - 15%</span>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <span>Pharmacological & Parenteral</span>
                  <span className="font-bold text-cyan-700">12 - 18%</span>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <span>Physiological Adaptation</span>
                  <span className="font-bold text-cyan-700">11 - 17%</span>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <span>Reduction of Risk Potential</span>
                  <span className="font-bold text-cyan-700">9 - 15%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UK NMC */}
      {activeExam === 'uk_nmc' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              United Kingdom Nursing and Midwifery Council (NMC)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Part 1: Computer-Based Test (CBT - Pearson VUE) & Part 2: Objective Structured Clinical Examination (OSCE).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Part 1 • CBT Review
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                115 Questions (Part A Numeracy & Part B Clinical)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Part A includes 15 critical medication calculations (must score 100% on safety math). Part B covers 100 clinical knowledge and professional ethics items under the UK NMC Code.
              </p>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>✓ The NMC Code: Prioritise people, practice effectively</li>
                <li>✓ British National Formulary (BNF) drug administration</li>
                <li>✓ Safeguarding vulnerable adults & children</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Part 2 • 10-Station OSCE
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                APIE (Assessment, Planning, Implementation, Evaluation)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrate face-to-face hands-on nursing stations at designated UK university test centres (Oxford Brookes, Ulster, Northampton, Leeds).
              </p>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>✓ Aseptic Non-Touch Technique (ANTT) wound dressing</li>
                <li>✓ Basic Life Support (BLS) & De-escalation</li>
                <li>✓ Subcutaneous injection & IV flush protocol</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AHPRA */}
      {activeExam === 'ahpra' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              Australian Health Practitioner Regulation Agency (AHPRA)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Outcomes-Based Assessment (OBA) pathway for Internationally Qualified Registered Nurses (IQRNs).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="block text-slate-900 font-bold">Step 1: Self-Check & Portfolio</strong>
              <p className="text-slate-600 leading-relaxed">Submit BSN credentials, PRC license verification, and English language proficiency (IELTS 7.0 / OET Grade B).</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="block text-slate-900 font-bold">Step 2: NCLEX-RN Cognitive Exam</strong>
              <p className="text-slate-600 leading-relaxed">AHPRA accepts the NCSBN NCLEX-RN as the stage 1 cognitive assessment for registered nurse qualification.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="block text-slate-900 font-bold">Step 3: Adelaide OSCE</strong>
              <p className="text-slate-600 leading-relaxed">Clinical behavioral simulation examination conducted at the Adelaide Health Simulation centre in Australia.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Relocation */}
      {activeExam === 'relocation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              Global Nurse Relocation & Visa Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct employer sponsorships, green cards, and work permits for Filipino nurses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-blue-900">
                <Plane className="w-4 h-4 text-blue-600" />
                <span>USA EB-3 Immigrant Visa</span>
              </div>
              <p className="text-slate-600 leading-relaxed">Permanent residency green card for nurse and immediate family. Direct hire by US hospital networks with full relocation assistance.</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-indigo-900">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>UK NHS Health & Care Visa</span>
              </div>
              <p className="text-slate-600 leading-relaxed">3-5 year renewable work visa sponsored by NHS Trusts. Fast-track pathway to UK Indefinite Leave to Remain (ILR).</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Australia Subclass 186 / 482</span>
              </div>
              <p className="text-slate-600 leading-relaxed">Employer Nomination Scheme (ENS) direct entry permanent residency for registered nurses in regional and metro hospitals.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Middle East (SCFHS / DHA / HAAD)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">Tax-free salary packages with free housing, flight allowances, and end-of-service gratuity benefits in UAE and Saudi Arabia.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
