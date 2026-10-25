import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Compass, 
  Layers, 
  Sparkles, 
  Search,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Heart,
  Brain
} from 'lucide-react';
import { CHED_BSN_CURRICULUM, CourseCurriculum } from '../../data/mockCurriculum';
import { UserProfile } from '../../types';
import { SubjectScopeModal } from '../zones/undergrad/SubjectScopeModal';
import { SubjectNotesAndTasks } from '../zones/undergrad/SubjectNotesAndTasks';
import { ClinicalLogbook } from '../zones/undergrad/ClinicalLogbook';
import { CoreCompetenciesInteractive } from '../zones/undergrad/CoreCompetenciesInteractive';
import { ReferenceSynthesizer } from '../zones/study/ReferenceSynthesizer';

interface StudyMaterialsPageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const StudyMaterialsPage: React.FC<StudyMaterialsPageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'pnle_subjects' | 'curriculum' | 'rle_logbook' | 'competencies' | 'reference_synthesizer'>('pnle_subjects');
  const [selectedYear, setSelectedYear] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals for Course Scope and Personal Subject Notes
  const [scopeModalCourse, setScopeModalCourse] = useState<CourseCurriculum | null>(null);
  const [notesDrawerCourse, setNotesDrawerCourse] = useState<CourseCurriculum | null>(null);

  // Active PNLE subject selection for detailed guides
  const [activePnleSubject, setActivePnleSubject] = useState<'np1' | 'np2' | 'np3' | 'np4' | 'np5'>('np1');

  const pnleSubjectGuides = {
    np1: {
      code: 'Nursing Practice I',
      title: 'Community Health Nursing & Primary Health Care',
      focus: 'Promotion of health, disease prevention, and public health nursing administration.',
      weight: '20% of PNLE GWA (100 Questions)',
      keyTopics: [
        'Expanded Program on Immunization (EPI) - Storage temperature +2°C to +8°C, BCG, Pentavalent, OPV/IPV schedule',
        'Public Health Bag Technique - Principles of asepsis, clean to contaminated order, alcohol handrub before opening bag',
        'Family Health Nursing Care Plan (FHNCP) - Typology of nursing problems (First-level health deficit/threat, Second-level inability to provide care)',
        'Legal Standards: RA 9173 (Philippine Nursing Act of 2002), RA 7160 (Local Government Code & Devolution), RA 10173 (Data Privacy Act)',
        'Vital Health Statistics: Infant Mortality Rate (sensitive indicator of community health), Maternal Mortality Ratio, Crude Birth/Death Rate'
      ],
      examAlert: 'PRC Board Tip: In home visit prioritization, always attend to active infectious communicable diseases or vulnerable antenatal clients with danger signs first.'
    },
    np2: {
      code: 'Nursing Practice II',
      title: 'Maternal and Child Nursing',
      focus: 'Comprehensive care of women throughout life cycle and pediatric development.',
      weight: '20% of PNLE GWA (100 Questions)',
      keyTopics: [
        'Obstetric Calculation: Naegele’s Rule (LMP + 7 days - 3 months + 1 year), McDonald’s Rule, GTPAL system',
        'Labor & Delivery Stages: 1st Stage (Latent, Active, Transition), 2nd Stage (Full dilation to expulsion of fetus), 3rd Stage (Placental expulsion), 4th Stage (Immediate postpartum recovery)',
        'High-Risk Pregnancy: Preeclampsia vs Eclampsia (Magnesium Sulfate infusion, monitor DTRs & Calcium Gluconate at bedside), Placenta Previa (painless bright red bleeding) vs Abruptio Placentae (painful dark red bleeding with board-like abdomen)',
        'Newborn Care: APGAR Scoring at 1 and 5 minutes, Vitamin K1 administration (vastus lateralis), Erythromycin eye prophylaxis, Cord care (keep dry and exposed)',
        'Pediatric Growth & Developmental Milestones: Erikson (Trust vs Mistrust, Autonomy vs Shame), Piaget cognitive stages, Developmental red flags'
      ],
      examAlert: 'Priority Alert: Never perform vaginal examination on a client with active third-trimester vaginal bleeding until Placenta Previa has been ruled out by ultrasound!'
    },
    np3: {
      code: 'Nursing Practice III',
      title: 'Care of Clients with Cellular Aberrations & Acute Med-Surg Conditions',
      focus: 'Physiologic adaptation in acute illness, oncology, and perioperative nursing.',
      weight: '20% of PNLE GWA (100 Questions)',
      keyTopics: [
        'Fluids & Electrolytes: Hypokalemia (flattened T waves, U waves) vs Hyperkalemia (peaked T waves, Kayexalate / Calcium gluconate)',
        'Acid-Base Disorders: ROME method (Respiratory Opposite, Metabolic Equal), ABG interpretation, Compensation mechanisms',
        'Perioperative Safety: WHO Surgical Safety Checklist, Informed Consent (Nurse is witness to signature, Physician explains risks/benefits), Malignant Hyperthermia (Dantrolene)',
        'Cardiovascular Nursing: Myocardial Infarction MONA protocol (Morphine, Oxygen, Nitroglycerin, Aspirin), ECG lead placements, Heart failure inotropes',
        'Oncology: 7 Warning Signs of Cancer (CAUTION mnemonic), Chemotherapy extravasation prevention, Radiation safety (Time, Distance, Shielding)'
      ],
      examAlert: 'Emergency Note: In acute pulmonary edema, seat patient high-Fowler with dependent legs to reduce venous return (preload) to overloaded ventricles.'
    },
    np4: {
      code: 'Nursing Practice IV',
      title: 'Care of Clients with Systemic Chronic Illness & Complex Multi-Organ Issues',
      focus: 'Continuing care across endocrinology, neurology, renal, and emergency burns.',
      weight: '20% of PNLE GWA (100 Questions)',
      keyTopics: [
        'Neurological Emergencies: Glasgow Coma Scale (Eye 4, Verbal 5, Motor 6 = Max 15), Increased ICP Triad of Cushing (Bradycardia, Systolic Hypertension with widening pulse pressure, Irregular respirations)',
        'Burn Management: Rule of Nines for BSA calculation, Parkland Formula (4 mL × kg × %TBSA burned; 50% given in first 8 hours, 50% over next 16 hours)',
        'Endocrine Disorders: DKA (type 1, fruity breath, Kussmaul, IV Regular Insulin) vs HHS (type 2, severe dehydration, glucose > 600 mg/dL)',
        'Renal & Urologic: Chronic Kidney Disease stages, hemodialysis fistula care (feel the thrill, hear the bruit, NO BP on fistula arm!), Renal diet (low protein, low potassium, low sodium)',
        'Emergency Triage: START Triage algorithm (Red = Immediate, Yellow = Delayed, Green = Minor/Walking wounded, Black = Expectant/Morgue)'
      ],
      examAlert: 'Triage Priority: A patient with airway stridor or tension pneumothorax is tagged RED and managed immediately over stable fractures or expectant patients.'
    },
    np5: {
      code: 'Nursing Practice V',
      title: 'Care of Clients with Maladaptive Behavior & Psychiatric Disorders',
      focus: 'Mental health, therapeutic communication, defense mechanisms, and psychopharmacology.',
      weight: '20% of PNLE GWA (100 Questions)',
      keyTopics: [
        'Therapeutic Communication: Clarification, reflecting feelings, silence, restating; NON-THERAPEUTIC: false reassurance, giving advice, asking "why"',
        'Defense Mechanisms: Denial, Projection, Sublimation (healthy channeling), Reaction Formation, Intellectualization, Displacement',
        'Schizophrenia & Psychosis: Positive vs Negative symptoms; Hallucinations (acknowledge feelings, do NOT validate false perception: "I don\'t see the spiders, but I see you are scared")',
        'Mood Disorders & Suicide Precautions: Major Depression, Bipolar Mania (high-calorie finger foods, low stimulus room), 1-on-1 suicide watch for active ideation',
        'Psychotropic Medications: Lithium (therapeutic range 0.6-1.2 mEq/L, toxicity: coarse hand tremors, ataxia, vomiting; maintain normal sodium intake!), Extrapyramidal symptoms (EPS) and Neuroleptic Malignant Syndrome (NMS)'
      ],
      examAlert: 'Communication Rule: Never ask a psychiatric client "Why did you do that?" as it forces defensiveness and breaks therapeutic rapport.'
    }
  };

  const currentGuide = pnleSubjectGuides[activePnleSubject];

  const yearCourses = CHED_BSN_CURRICULUM.filter((c) => c.year === selectedYear);
  const filteredCourses = yearCourses.filter((c) => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              📖 Study Materials & PNLE Reviewer
            </span>
            <span className="text-teal-300 text-xs font-semibold">CHED CMO 15 s.2017</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Complete Philippine Nursing Curriculum & Board Materials
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            All 5 PNLE board examination subject guides, complete 4-year BSN course syllabi, clinical RLE logbook tracker, 11 National Core Competencies, and AI-powered study note synthesizers.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'pnle_subjects', label: '🇵🇭 5 PNLE Board Review Guides', badge: 'PRC Blueprint' },
          { id: 'curriculum', label: 'CHED 4-Year BSN Curriculum', badge: 'CMO 15 s.2017' },
          { id: 'rle_logbook', label: 'Clinical Hours (RLE) Tracker', badge: '2,142 Hrs Log' },
          { id: 'competencies', label: '11 National Core Competencies', badge: 'PRC Standards' },
          { id: 'reference_synthesizer', label: 'Reference & Notes Synthesizer', badge: 'AI Summaries' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: 5 PNLE Board Review Guides */}
      {activeTab === 'pnle_subjects' && (
        <div className="space-y-6">
          {/* 5 Subject Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'np1', code: 'NP I', label: 'Community Health' },
              { id: 'np2', code: 'NP II', label: 'Maternal & Child' },
              { id: 'np3', code: 'NP III', label: 'Med-Surg Acute' },
              { id: 'np4', code: 'NP IV', label: 'Med-Surg Chronic' },
              { id: 'np5', code: 'NP V', label: 'Psychiatric Nursing' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActivePnleSubject(s.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  activePnleSubject === s.id
                    ? 'border-teal-600 bg-teal-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-black ${activePnleSubject === s.id ? 'text-teal-800' : 'text-slate-700'}`}>
                  {s.code}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {s.label}
                </div>
              </button>
            ))}
          </div>

          {/* Active Subject Guide Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-teal-100 text-teal-800 text-xs font-black px-2.5 py-0.5 rounded-md">
                    {currentGuide.code}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{currentGuide.weight}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {currentGuide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {currentGuide.focus}
                </p>
              </div>
            </div>

            {/* PRC Board Alert Banner */}
            <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <strong className="block font-black text-amber-900 mb-0.5">High-Yield Board Examination Alert</strong>
                <p className="text-[11px] leading-relaxed">{currentGuide.examAlert}</p>
              </div>
            </div>

            {/* Core Concepts & Topics */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Essential High-Yield Subject Topics (Table of Specifications)</span>
              </h3>

              <div className="space-y-3">
                {currentGuide.keyTopics.map((topic, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-800 leading-relaxed flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>{topic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHED 4-Year BSN Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Year Level Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex space-x-1.5 overflow-x-auto">
              {[1, 2, 3, 4].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedYear === year
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Year {year} BSN
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject code, title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {course.lectureUnits} Lec + {course.labUnits} Lab ({course.rleHours} RLE hrs)
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.competencyFocus.slice(0, 3).map((comp: string, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {comp}
                      </span>
                    ))}
                    {course.competencyFocus.length > 3 && (
                      <span className="text-[10px] text-teal-700 font-semibold self-center">
                        +{course.competencyFocus.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setScopeModalCourse(course)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Syllabus & Scope</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setNotesDrawerCourse(course)}
                    className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    My Notes & Tasks
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Clinical Hours (RLE) Tracker */}
      {activeTab === 'rle_logbook' && (
        <ClinicalLogbook />
      )}

      {/* TAB 4: 11 National Core Competencies */}
      {activeTab === 'competencies' && (
        <CoreCompetenciesInteractive />
      )}

      {/* TAB 5: Reference Synthesizer */}
      {activeTab === 'reference_synthesizer' && (
        <ReferenceSynthesizer 
          userTier={user.tier}
          onOpenSubscription={onOpenSubscription}
        />
      )}

      {/* Modals for Course Scope and Notes */}
      {scopeModalCourse && (
        <SubjectScopeModal
          course={scopeModalCourse}
          isOpen={Boolean(scopeModalCourse)}
          onClose={() => setScopeModalCourse(null)}
          onOpenNotesAndTasks={(c) => {
            setScopeModalCourse(null);
            setNotesDrawerCourse(c);
          }}
        />
      )}

      {notesDrawerCourse && (
        <SubjectNotesAndTasks
          course={notesDrawerCourse}
          isOpen={Boolean(notesDrawerCourse)}
          onClose={() => setNotesDrawerCourse(null)}
        />
      )}
    </div>
  );
};
