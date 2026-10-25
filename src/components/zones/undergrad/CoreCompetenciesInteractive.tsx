import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  MessageSquare,
  Award,
  AlertCircle
} from 'lucide-react';
import { PHILIPPINE_NURSING_COMPETENCIES, PRC_CORE_COMPETENCY_QA } from '../../../data/mockCurriculum';
import { CompetencyQAItem } from '../../../types';

export const CoreCompetenciesInteractive: React.FC = () => {
  const [selectedCompCode, setSelectedCompCode] = useState<string>('COMP-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQA, setActiveQA] = useState<CompetencyQAItem | null>(PRC_CORE_COMPETENCY_QA[0]);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<{
    question: string;
    answer: string;
    reference: string;
  } | null>(null);

  const selectedComp = PHILIPPINE_NURSING_COMPETENCIES.find((c) => c.code === selectedCompCode) || PHILIPPINE_NURSING_COMPETENCIES[0];

  // Filter Q&A
  const filteredQA = PRC_CORE_COMPETENCY_QA.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.highYieldBoardTip.toLowerCase().includes(q)
    );
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const query = userQuestion.toLowerCase();
    // Match against known PRC nursing jurisprudence principles
    let matchedStandard = {
      question: userQuestion,
      answer: '',
      reference: 'Philippine Nursing Act of 2002 (RA 9173) & PRC BON Resolution No. 22 s.2012'
    };

    if (query.includes('consent') || query.includes('minor') || query.includes('unconscious')) {
      matchedStandard.answer = `Under RA 9173 and Philippine Medical Jurisprudence: 
1. Informed consent must be voluntary, given by a legally competent adult after full explanation of risks, benefits, and alternatives by the physician.
2. The nurse's legal role is to WITNESS the client's signature and confirm voluntary signing and mental competence; the attending physician remains legally responsible for informing the patient.
3. For minors (<18yo), parents or legal guardians sign. In life-threatening emergencies without immediate surrogate contact, the doctrine of Implied Consent applies.`;
      matchedStandard.reference = 'RA 9173 Section 28 & DOH Patient Rights Charter';
    } else if (query.includes('order') || query.includes('verbal') || query.includes('telephone') || query.includes('doctor')) {
      matchedStandard.answer = `Under PRC Board of Nursing Medication Safety standards:
1. Verbal and telephone orders are strictly limited to life-threatening emergencies or when the doctor is scrubbed in surgery.
2. The nurse must write down the order, read it back verbatim (repeat-back protocol), obtain verbal confirmation, and verify the physician countersigns within 24 hours.
3. Never accept verbal orders for high-alert medications (e.g. chemotherapy, concentrated electrolytes, insulin) under non-emergency situations.`;
      matchedStandard.reference = 'PRC BON Resolution 22 s.2012 Core Competency 1.3 & AO 2012-0012';
    } else if (query.includes('error') || query.includes('mistake') || query.includes('chart') || query.includes('incident')) {
      matchedStandard.answer = `Under PRC Record Management & Quality Improvement guidelines:
1. Patient health priority: Immediately assess the client, check vitals, and notify the attending physician immediately.
2. Documentation in Chart: Record objective facts (patient assessment, vital signs, physician notified, and treatment implemented). NEVER write "Incident report submitted" inside the chart, as incident reports are confidential quality improvement documents.
3. Submit an Incident / Variance Report within 24 hours to the nursing supervisor to facilitate system-level root cause analysis (RCA).`;
      matchedStandard.reference = 'PRC BON Quality Improvement Core Area 7 & Record Management Core Area 9';
    } else if (query.includes('dnr') || query.includes('resuscitat') || query.includes('refus')) {
      matchedStandard.answer = `Under Philippine Bioethics and Code of Ethics for Nurses:
1. A Do-Not-Resuscitate (DNR) order requires written informed consent from the client or authorized surrogate and must be explicitly signed by the attending physician.
2. Nurses must clarify that DNR means "Do Not Resuscitate" in the event of cardiac/respiratory arrest; it DOES NOT mean withholding hygiene, nutrition, hydration, pain analgesia, or compassionate nursing care.`;
      matchedStandard.reference = 'Code of Ethics for Philippine Nurses Article III & PNA Ethical Guidelines';
    } else if (query.includes('delegat') || query.includes('aide') || query.includes('nursing aide') || query.includes('bhw')) {
      matchedStandard.answer = `Under RA 9173 Article VI Section 28:
1. The professional nurse cannot delegate the core nursing process (Assessment, Nursing Diagnosis, Planning, and Evaluation).
2. Delegation to unlicensed assistive personnel (nursing aides, BHWs) must follow the 5 Rights of Delegation: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision/Evaluation.
3. Invasive procedures (catheterization, IV insertion, NG tube placement) cannot be delegated to non-nurses.`;
      matchedStandard.reference = 'Philippine Nursing Act of 2002 (RA 9173) Section 28 Scope of Nursing';
    } else {
      matchedStandard.answer = `According to the 11 National Core Competency Standards (PRC BON Resolution No. 22 s.2012):
1. Safe and Quality Care: The nurse must prioritize patient safety, aseptic technique, and evidence-based interventions.
2. Legal & Ethical Responsibility: Uphold the Philippine Nursing Act (RA 9173), Data Privacy Act (RA 10173), and the 4 bioethical pillars (Autonomy, Beneficence, Non-maleficence, Justice).
3. Documentation: Document facts in real-time using FDAR or SOAPIE format. Timely communication via SBAR prevents clinical adverse outcomes.`;
      matchedStandard.reference = 'PRC Board of Nursing Resolution No. 22 Series of 2012 & CHED CMO 15 s.2017';
    }

    setCustomAnswer(matchedStandard);
    setUserQuestion('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PRC Board of Nursing Resolution No. 22 s.2012
          </span>
          <span className="text-teal-400 text-xs font-semibold">11 Core Standards</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Interactive 11 National Core Competencies
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          The official benchmark for Philippine nursing practice, board examinations (PNLE), and clinical hospital performance appraisals. Select any competency or ask clinical scenario questions grounded strictly in PRC regulations.
        </p>
      </div>

      {/* Competencies Horizontal Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Select National Core Competency:
          </span>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded">
            All 11 Standards Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {PHILIPPINE_NURSING_COMPETENCIES.map((comp) => {
            const isSelected = selectedCompCode === comp.code;
            return (
              <button
                key={comp.code}
                onClick={() => setSelectedCompCode(comp.code)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <span className={`text-[10px] font-bold block ${isSelected ? 'text-teal-800' : 'text-slate-500'}`}>
                  {comp.code}
                </span>
                <span className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {comp.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Competency Detail View */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                {selectedComp.code}
              </span>
              <h3 className="font-black text-lg text-slate-900">{selectedComp.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{selectedComp.chedRef}</p>
          </div>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
            Mandatory Board Exam Benchmark
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {selectedComp.description}
        </p>

        {/* Clinical Performance Indicators */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>PRC Clinical Performance Indicators:</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {selectedComp.indicators.map((ind, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/70">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive PRC Q&A Knowledge Engine */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                PRC Standards Clinical Q&A Engine
              </h3>
              <p className="text-xs text-slate-500">
                Ask any legal, ethical, or bedside dilemma and get authoritative answers based on PRC BON resolutions.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Grounded in RA 9173
          </span>
        </div>

        {/* Ask Question Form */}
        <form onSubmit={handleAskQuestion} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask a question (e.g. 'Can a nurse refuse telephone orders?', 'Who signs consent for confused patient?')..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-teal-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask PRC Engine</span>
            </button>
          </div>
        </form>

        {/* Custom Answer Render */}
        {customAnswer && (
          <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-2 border-teal-300 rounded-xl p-4 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Question: &quot;{customAnswer.question}&quot;</span>
              </span>
              <button
                onClick={() => setCustomAnswer(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
              {customAnswer.answer}
            </div>
            <div className="text-[10px] text-teal-800 pt-1 font-mono font-semibold">
              Legal Standard Citation: {customAnswer.reference}
            </div>
          </div>
        )}

        {/* Preset High-Yield PRC Questions */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              High-Yield PRC Board Exam Case Scenarios:
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios or legal terms..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredQA.map((qa) => (
              <button
                key={qa.id}
                onClick={() => setActiveQA(qa)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeQA?.id === qa.id
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded">
                      {qa.competencyCode}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                      High-Yield PNLE
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 leading-snug">
                    {qa.question}
                  </h5>
                </div>
                <span className="text-[10px] text-teal-700 font-semibold mt-2 flex items-center space-x-1">
                  <span>View PRC Standard Rationale</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected QA Detail Card */}
        {activeQA && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded">
                Official PRC Standard Ruling
              </span>
              <span className="text-[11px] font-mono text-slate-500">{activeQA.prcLegalStandardRef}</span>
            </div>

            <h4 className="font-extrabold text-sm text-slate-900">
              {activeQA.question}
            </h4>

            <p className="text-xs text-slate-700 leading-relaxed">
              {activeQA.answer}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 flex items-start space-x-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Board Exam Tip:</strong> {activeQA.highYieldBoardTip}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
