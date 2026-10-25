import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Sparkles,
  Send,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CHED_MSN_PROGRAM, DOCTORAL_TRACKS } from '../../data/mockGraduatePrograms';
import { UserProfile } from '../../types';

interface GraduatePageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const GraduatePage: React.FC<GraduatePageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'msn' | 'doctoral' | 'thesis_builder'>('msn');

  // Thesis Proposal Interactive Builder State
  const [researchTitle, setResearchTitle] = useState('Predictors of Compassion Fatigue and Moral Resilience Among Critical Care Nurses in Metro Manila Tertiary Hospitals: A Mixed-Methods Study');
  const [theoreticalFramework, setTheoreticalFramework] = useState('Sister Callista Roy Adaptation Model & Kristen Swanson Theory of Caring');
  const [methodology, setMethodology] = useState('Convergent Parallel Mixed-Methods Design (Quantitative Survey + Qualitative Phenomenological Interviews)');
  const [samplePopulation, setSamplePopulation] = useState('N = 250 Staff Nurses with >= 1 year ICU/ER experience across 4 Level-3 DOH-accredited hospitals');
  const [proposalSaved, setProposalSaved] = useState(false);

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSaved(true);
    setTimeout(() => setProposalSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🎓 Graduate & Doctoral Leadership
            </span>
            <span className="text-purple-300 text-xs font-semibold">PQF Levels 7 & 8 • CHED CMO 5 s.2024</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Advanced Masteral (MSN) & Doctoral (PhD / DScN) Scholarship
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Navigate post-graduate nursing scholarship: Advanced pathophysiology, theoretical epistemology, biostatistics, thesis proposal creation, and doctoral comprehensive qualifying exam preparation.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'msn', label: 'Master of Science in Nursing (MSN)', badge: 'CHED CMO 5 s.2024' },
          { id: 'doctoral', label: 'Doctoral Studies (PhD / DScN / DNP)', badge: 'PQF Level 8' },
          { id: 'thesis_builder', label: 'Interactive Thesis Proposal Builder', badge: 'Research Suite' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: MSN Curriculum */}
      {activeTab === 'msn' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="bg-indigo-50 text-indigo-800 text-xs font-black px-2.5 py-0.5 rounded-md">
                {CHED_MSN_PROGRAM.degreeName}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {CHED_MSN_PROGRAM.title}
              </h2>
              <p className="text-xs text-slate-500">
                {CHED_MSN_PROGRAM.chedBasis} • {CHED_MSN_PROGRAM.totalUnits} Units • {CHED_MSN_PROGRAM.duration}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl">
                Thesis Track
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl">
                Non-Thesis Track
              </span>
            </div>
          </div>

          <h3 className="font-extrabold text-sm text-slate-900">
            Core Masteral Courses (Curriculum Structure):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHED_MSN_PROGRAM.coreCourses.map((c) => (
              <div key={c.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{c.units} Academic Units</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Doctoral Studies */}
      {activeTab === 'doctoral' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOCTORAL_TRACKS.map((doc, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    {doc.degreeType} • PQF Level {doc.pqfLevel}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-2">{doc.fullName}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{doc.focus}</p>
                  
                  <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Qualifying Exam Topics:</span>
                    {doc.qualifyingExamTopics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="text-[11px] text-slate-700 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Basis: {doc.chedBasis}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Thesis Proposal Builder */}
      {activeTab === 'thesis_builder' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              Interactive MSN/Doctoral Thesis Proposal Builder
            </h2>
            <p className="text-xs text-slate-500">
              Formulate your Chapter 1 to 3 framework aligned with CHED and university research ethics standards.
            </p>
          </div>

          <form onSubmit={handleSaveProposal} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Proposed Research Title:
              </label>
              <textarea
                rows={2}
                value={researchTitle}
                onChange={(e) => setResearchTitle(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Theoretical / Conceptual Framework:
              </label>
              <input
                type="text"
                value={theoreticalFramework}
                onChange={(e) => setTheoreticalFramework(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Methodology & Research Design:
              </label>
              <input
                type="text"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Sample Population & Setting:
              </label>
              <input
                type="text"
                value={samplePopulation}
                onChange={(e) => setSamplePopulation(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Proposal Draft</span>
              </button>

              {proposalSaved && (
                <span className="text-emerald-600 font-bold text-xs flex items-center space-x-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Draft Saved Successfully!</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
