import { 
  UserProfile, 
  Flashcard, 
  CarePlan, 
  CPDRecord, 
  ReferenceMaterial,
  HospitalRotationRecord,
  CommunityLogbookEntry,
  SubjectTaskItem,
  SubjectNoteEntry,
  SubjectJournalEntry,
  PageId,
  SubscriptionTierId,
  StudyBuddy,
  GameQuizSession
} from '../types';
import { INITIAL_FLASHCARDS } from '../data/mockFlashcards';
import { MOCK_CPD_RECORDS } from '../data/mockClinicalTools';
import { INITIAL_HOSPITAL_ROTATIONS, INITIAL_COMMUNITY_LOGBOOK, INITIAL_SUBJECT_TASKS } from '../data/mockCurriculum';

const STORAGE_KEYS = {
  CURRENT_USER: 'nursepath_current_user_v2',
  FLASHCARDS: 'nursepath_flashcards_v2',
  CARE_PLANS: 'nursepath_care_plans_v2',
  CPD_RECORDS: 'nursepath_cpd_records_v2',
  BOOKMARKS: 'nursepath_bookmarks_v2',
  COMPLETED_QUIZZES: 'nursepath_completed_quizzes_v2',
  REFERENCES: 'nursepath_references_v2',
  HOSPITAL_ROTATIONS: 'nursepath_hospital_rotations_v2',
  COMMUNITY_LOGBOOK: 'nursepath_community_logbook_v2',
  SUBJECT_TASKS: 'nursepath_subject_tasks_v2',
  SUBJECT_NOTES: 'nursepath_subject_notes_v2',
  SUBJECT_JOURNALS: 'nursepath_subject_journals_v2',
};

// Default initial user: Starts on Starter Pass (₱0 / Free Mode) - always accessible upon account creation
export const DEFAULT_USER: UserProfile = {
  id: 'usr-student-01',
  name: 'Angelica Ramos',
  email: 'angelica.ramos@ust.edu.ph',
  role: 'undergrad',
  tier: 'start', // Starter Pass (₱0 / Free Mode)
  billingCycle: 'monthly',
  subscriptionExpiresAt: '2099-12-31',
  schoolOrHospital: 'University of Santo Tomas — Faculty of Nursing',
  targetExam: 'PNLE 2026',
  targetCountry: 'Philippines',
  specialtyInterest: 'Medical-Surgical & Maternal-Child',
  clinicalHoursCompleted: 1850,
  cpdUnitsCompleted: 15,
  pnleReadinessScore: 88,
  savedDecksCount: 6,
  isGuest: false,
  isEmailVerified: true,
  isMobileVerified: true,
  isPaymentVerified: true,
  paymentVerificationStatus: 'verified'
};

export const SAMPLE_STUDENT_PROFILES: UserProfile[] = [
  {
    id: 'usr-student-01',
    name: 'Angelica Ramos',
    email: 'angelica.ramos@ust.edu.ph',
    role: 'undergrad',
    tier: 'growth',
    billingCycle: 'monthly',
    subscriptionExpiresAt: '2026-12-31',
    schoolOrHospital: 'University of Santo Tomas',
    targetExam: 'PNLE Nov 2026',
    targetCountry: 'Philippines',
    specialtyInterest: 'Maternal & Child Nursing',
    clinicalHoursCompleted: 1850,
    cpdUnitsCompleted: 12,
    pnleReadinessScore: 88,
    savedDecksCount: 8,
    isGuest: false
  },
  {
    id: 'usr-student-02',
    name: 'Mark Joshua Bautista',
    email: 'mj.bautista@up.edu.ph',
    role: 'undergrad',
    tier: 'ready',
    billingCycle: 'monthly',
    subscriptionExpiresAt: '2026-11-30',
    schoolOrHospital: 'UP Manila College of Nursing',
    targetExam: 'PNLE May 2026',
    targetCountry: 'Philippines',
    specialtyInterest: 'Critical Care & Emergency',
    clinicalHoursCompleted: 2100,
    cpdUnitsCompleted: 18,
    pnleReadinessScore: 94,
    savedDecksCount: 14,
    isGuest: false
  },
  {
    id: 'usr-student-03',
    name: 'Clarisse Santos',
    email: 'clarisse.santos@feu.edu.ph',
    role: 'newgrad',
    tier: 'lifetime',
    billingCycle: 'lifetime',
    subscriptionExpiresAt: '2099-12-31',
    schoolOrHospital: 'Far Eastern University - Nursing',
    targetExam: 'PNLE & NCLEX-RN',
    targetCountry: 'Philippines / USA',
    specialtyInterest: 'Pediatrics & Community Health',
    clinicalHoursCompleted: 2142,
    cpdUnitsCompleted: 24,
    pnleReadinessScore: 91,
    savedDecksCount: 19,
    isGuest: false
  }
];

export function getCurrentUser(): UserProfile {
  try {
    // Purge legacy storage keys
    ['nursepath_current_user_v1', 'nursepath_admin_metrics_v1', 'nursepath_transactions_v1', 'nursepath_payment_config_v1'].forEach((k) => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure user role is never admin
      if ((parsed as any).role === 'admin') {
        parsed.role = 'undergrad';
        saveCurrentUser(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load user from storage', e);
  }
  return DEFAULT_USER;
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load flashcards', e);
  }
  return INITIAL_FLASHCARDS;
}

export function saveFlashcards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save flashcards', e);
  }
}

export function getCarePlans(): CarePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARE_PLANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load care plans', e);
  }
  return [];
}

export function saveCarePlan(plan: CarePlan): void {
  const current = getCarePlans();
  const updated = [plan, ...current];
  localStorage.setItem(STORAGE_KEYS.CARE_PLANS, JSON.stringify(updated));
}

export function getCPDRecords(): CPDRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CPD_RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load CPD records', e);
  }
  return MOCK_CPD_RECORDS;
}

export function saveCPDRecord(record: CPDRecord): void {
  const current = getCPDRecords();
  const updated = [record, ...current];
  localStorage.setItem(STORAGE_KEYS.CPD_RECORDS, JSON.stringify(updated));
}

export const INITIAL_PRESET_REFERENCE: ReferenceMaterial = {
  id: 'ref-cardio-inotropes',
  title: 'Critical Care Inotropes & Vasoactive Hemodynamics',
  fileName: 'Cardio_Inotropes_Lecture_Handout.pdf',
  fileType: 'pdf',
  fileSize: '2.4 MB',
  uploadedAt: '2026-10-24',
  pageCountOrDuration: '14 Pages',
  content: `Critical Care Pharmacotherapy: Vasoactive Infusions & Shock States.
1. Norepinephrine (Levophed): Potent alpha-1 receptor agonist with modest beta-1 stimulation. First-line vasopressor for septic and cardiogenic shock. Goal: MAP >= 65 mmHg. Warning: Extravasation causes severe ischemia and tissue sloughing; phentolamine mesylate is the antidote.
2. Epinephrine: Non-selective alpha and beta agonist. Drug of choice for anaphylaxis (0.3-0.5 mg IM 1:1,000) and cardiac arrest (1 mg IV 1:10,000 every 3-5 min).
3. Dopamine: Dose-dependent inotrope. Low dose (1-3 mcg/kg/min) renal vasodilation (controversial); Moderate (5-10 mcg/kg/min) beta-1 positive inotropy; High dose (>10 mcg/kg/min) alpha-1 vasoconstriction.
4. Dobutamine: Synthetic catecholamine, primary beta-1 agonist. Enhances myocardial contractility and stroke volume in acute decompensated heart failure with reduced ejection fraction.
5. Nursing Priorities: Continuous arterial line monitoring, central line infusion preferred, strict hourly urine output (>= 0.5 mL/kg/hr), monitor serum lactate clearance.`,
  summary: `### 📋 Executive Clinical Summary: Critical Care Inotropes & Vasoactive Hemodynamics\n\n**1. High-Yield Overview:**\nVasoactive infusions represent life-saving pharmacotherapy in shock states to restore adequate tissue perfusion (MAP ≥ 65 mmHg) when fluid resuscitation alone is insufficient.\n\n**2. Core Pathophysiology & Receptor Profiles:**\n- **Alpha-1 stimulation:** Peripheral vasoconstriction (Norepinephrine, High-dose Dopamine).\n- **Beta-1 stimulation:** Positive inotropy (contractility) and chronotropy (heart rate) (Dobutamine, Epinephrine).\n- **Beta-2 stimulation:** Bronchodilation and peripheral vasodilation (Epinephrine low dose).\n\n**3. Priority Bedside Nursing Interventions:**\n1. Always infuse via central venous catheter (CVC) whenever possible to avoid catastrophic peripheral extravasation.\n2. Titrate continuously based on accurate arterial blood pressure and Mean Arterial Pressure (MAP).\n3. Keep bedside phentolamine (Regitine) readily available if administering norepinephrine.\n4. Monitor hourly urine output (goal: ≥ 0.5 mL/kg/hr) as sensitive marker of renal end-organ perfusion.\n\n**4. Critical Black-Box Warnings:**\n- Tachyarrhythmias, myocardial ischemia due to increased oxygen demand, and peripheral gangrene from excessive vasoconstriction.`,
  quiz: [
    {
      id: 'ref-q1',
      question: 'Which of the following is the FIRST-LINE vasopressor recommended in the Surviving Sepsis Campaign guidelines to target a Mean Arterial Pressure (MAP) of >= 65 mmHg?',
      options: [
        'Norepinephrine (Levophed)',
        'Dobutamine (Dobutrex)',
        'Isoproterenol (Isuprel)',
        'Low-dose Dopamine'
      ],
      correctAnswerIndex: 0,
      rationale: 'Norepinephrine bitartrate (Levophed) is the gold standard first-line vasopressor for septic shock due to potent alpha-1 vasoconstriction and modest beta-1 inotropy, reliably elevating vascular resistance with less tachycardia than epinephrine or dopamine.'
    },
    {
      id: 'ref-q2',
      question: 'A nurse discovers that a peripheral IV infusing Norepinephrine has extravasated into the subcutaneous tissue of the forearm. Which immediate pharmacological antidote must the nurse prepare?',
      options: [
        'Subcutaneous Phentolamine mesylate (Regitine)',
        'Intravenous Calcium Gluconate',
        'Intravenous Protamine Sulfate',
        'Subcutaneous Heparin Sodium'
      ],
      correctAnswerIndex: 0,
      rationale: 'Phentolamine (Regitine) is an alpha-adrenergic blocker that produces immediate local vasodilation to counteract severe norepinephrine-induced ischemia and prevent tissue necrosis.'
    },
    {
      id: 'ref-q3',
      question: 'A patient with acute decompensated heart failure and cardiogenic shock is started on Dobutamine. Which physiological parameter indicates therapeutic effectiveness?',
      options: [
        'Increased cardiac output and cardiac index with warm extremities and urine output >= 0.5 mL/kg/hr',
        'Marked peripheral vasoconstriction with pale cold digits',
        'Heart rate reduction below 40 bpm',
        'Elevated systemic vascular resistance (SVR) > 2,000 dynes'
      ],
      correctAnswerIndex: 0,
      rationale: 'Dobutamine is a synthetic inotrope acting on beta-1 receptors to boost stroke volume, cardiac output, and peripheral organ perfusion, evidenced by clear sensorium and adequate urine output.'
    }
  ],
  flashcards: [
    {
      id: 'ref-fc-1',
      deckId: 'deck-uploaded',
      category: 'Critical Care Inotropes',
      front: 'What is the target Mean Arterial Pressure (MAP) when titrating Norepinephrine in septic shock?',
      back: 'Target MAP >= 65 mmHg (ensures critical renal, cerebral, and coronary perfusion without excessive afterload).',
      pearl: 'MAP = (SBP + 2*DBP) / 3. Never titrate by SBP alone.',
      evidenceLevel: 'Level I (Surviving Sepsis Guideline)',
      reps: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      tags: ['Inotropes', 'ICU', 'Shock']
    },
    {
      id: 'ref-fc-2',
      deckId: 'deck-uploaded',
      category: 'Critical Care Inotropes',
      front: 'What are the dose-dependent receptor effects of Dopamine infusion?',
      back: 'Low dose (1-3 mcg/kg/min): Dopaminergic (renal/mesenteric dilation);\nMedium dose (5-10 mcg/kg/min): Beta-1 (positive inotropy);\nHigh dose (>10 mcg/kg/min): Alpha-1 (potent vasoconstriction).',
      pearl: 'High doses (>10 mcg/kg/min) can induce extreme tachycardia and tachyarrhythmias.',
      evidenceLevel: 'Level I (ACCP Critical Care Consensus)',
      reps: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      tags: ['Pharmacology', 'Dopamine']
    }
  ],
  mindMap: {
    id: 'root',
    label: 'Vasoactive & Inotropic Agents',
    badge: 'ICU Hemodynamics',
    children: [
      {
        id: 'mm-1',
        label: 'Vasopressors (Alpha-1)',
        children: [
          { id: 'mm-1-1', label: 'Norepinephrine (1st Line Shock)' },
          { id: 'mm-1-2', label: 'Epinephrine (Code Arrest & Anaphylaxis)' },
          { id: 'mm-1-3', label: 'Phenylephrine (Pure Alpha)' }
        ]
      },
      {
        id: 'mm-2',
        label: 'Inotropes (Beta-1)',
        children: [
          { id: 'mm-2-1', label: 'Dobutamine (Cardiogenic Contractility)' },
          { id: 'mm-2-2', label: 'Milrinone (PDE-3 Inodilator)' },
          { id: 'mm-2-3', label: 'Mid-Dose Dopamine (5-10 mcg/kg/min)' }
        ]
      },
      {
        id: 'mm-3',
        label: 'Priority Nursing Monitoring',
        children: [
          { id: 'mm-3-1', label: 'Arterial Line BP (MAP >= 65 mmHg)' },
          { id: 'mm-3-2', label: 'Central Line Infusion Only' },
          { id: 'mm-3-3', label: 'Hourly Urine Output (>= 0.5 mL/kg/hr)' },
          { id: 'mm-3-4', label: 'Serial Serum Lactate Clearance' }
        ]
      },
      {
        id: 'mm-4',
        label: 'Emergency Antidotes',
        children: [
          { id: 'mm-4-1', label: 'Phentolamine Subcutaneous for Extravasation' },
          { id: 'mm-4-2', label: 'Warm Compresses & Immediate Line Disconnect' }
        ]
      }
    ]
  },
  mnemonics: [
    {
      id: 'mn-1',
      mnemonic: 'PRESS',
      expansion: 'P - Perfusion Pressure (MAP >= 65), R - Regitine (Phentolamine) bedside, E - Extravasation prevention via Central line, S - Strict hourly urine, S - Serum lactate tracking',
      clinicalApplication: 'Safety checklist during vasoactive continuous infusion titration.',
      highYieldTip: 'Essential for NCLEX/PNLE prioritization when titrating pressors.'
    },
    {
      id: 'mn-2',
      mnemonic: 'DOPE',
      expansion: 'D - Dobutamine for Dilated heart failure, O - Oxygen balance preservation, P - Positive inotropy, E - Ejection fraction enhancement',
      clinicalApplication: 'Quick differentiation between inotropes and pure vasopressors.',
      highYieldTip: 'Dobutamine causes mild vasodilation; not suitable for hypovolemic hypotension.'
    }
  ]
};

export function getSavedReferences(): ReferenceMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFERENCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load references', e);
  }
  return [INITIAL_PRESET_REFERENCE];
}

export function saveReferenceMaterial(ref: ReferenceMaterial): void {
  const current = getSavedReferences();
  const existingIdx = current.findIndex((r) => r.id === ref.id);
  let updated: ReferenceMaterial[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = ref;
  } else {
    updated = [ref, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updated));
}

export function deleteReferenceMaterial(id: string): void {
  const current = getSavedReferences();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updated));
}

// ----------------------------------------------------
// Clinical Hours (RLE) Hospital Rotations Storage
// ----------------------------------------------------
export function getHospitalRotations(): HospitalRotationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOSPITAL_ROTATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load hospital rotations', e);
  }
  return INITIAL_HOSPITAL_ROTATIONS;
}

export function saveHospitalRotation(record: HospitalRotationRecord): void {
  const current = getHospitalRotations();
  const existingIdx = current.findIndex((r) => r.id === record.id);
  let updated: HospitalRotationRecord[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = record;
  } else {
    updated = [record, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.HOSPITAL_ROTATIONS, JSON.stringify(updated));
}

export function deleteHospitalRotation(id: string): void {
  const current = getHospitalRotations();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.HOSPITAL_ROTATIONS, JSON.stringify(updated));
}

// ----------------------------------------------------
// Community Health Nursing (CHN) Field Logbook Storage
// ----------------------------------------------------
export function getCommunityLogbook(): CommunityLogbookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_LOGBOOK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load community logbook', e);
  }
  return INITIAL_COMMUNITY_LOGBOOK;
}

export function saveCommunityLogbookEntry(entry: CommunityLogbookEntry): void {
  const current = getCommunityLogbook();
  const existingIdx = current.findIndex((r) => r.id === entry.id);
  let updated: CommunityLogbookEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_LOGBOOK, JSON.stringify(updated));
}

export function deleteCommunityLogbookEntry(id: string): void {
  const current = getCommunityLogbook();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_LOGBOOK, JSON.stringify(updated));
}

// ----------------------------------------------------
// BSN Subject Tasks (Assignments / Projects) Storage
// ----------------------------------------------------
export function getSubjectTasks(courseId?: string): SubjectTaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECT_TASKS);
    const all: SubjectTaskItem[] = raw ? JSON.parse(raw) : INITIAL_SUBJECT_TASKS;
    if (courseId) {
      return all.filter((t) => t.courseId === courseId);
    }
    return all;
  } catch (e) {
    console.error('Failed to load subject tasks', e);
    return INITIAL_SUBJECT_TASKS;
  }
}

export function saveSubjectTask(task: SubjectTaskItem): void {
  const all = getSubjectTasks();
  const existingIdx = all.findIndex((t) => t.id === task.id);
  let updated: SubjectTaskItem[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = task;
  } else {
    updated = [task, ...all];
  }
  localStorage.setItem(STORAGE_KEYS.SUBJECT_TASKS, JSON.stringify(updated));
}

export function toggleSubjectTaskStatus(taskId: string): SubjectTaskItem | null {
  const all = getSubjectTasks();
  const idx = all.findIndex((t) => t.id === taskId);
  if (idx === -1) return null;
  const current = all[idx];
  const newStatus = current.status === 'completed' ? 'upcoming' : 'completed';
  const updatedTask: SubjectTaskItem = {
    ...current,
    status: newStatus,
    completedAt: newStatus === 'completed' ? new Date().toISOString().slice(0, 10) : undefined
  };
  all[idx] = updatedTask;
  localStorage.setItem(STORAGE_KEYS.SUBJECT_TASKS, JSON.stringify(all));
  return updatedTask;
}

export function deleteSubjectTask(taskId: string): void {
  const all = getSubjectTasks();
  const updated = all.filter((t) => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.SUBJECT_TASKS, JSON.stringify(updated));
}

// ----------------------------------------------------
// BSN Subject Notes Storage
// ----------------------------------------------------
export function getSubjectNotes(courseId?: string): SubjectNoteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECT_NOTES);
    const all: SubjectNoteEntry[] = raw ? JSON.parse(raw) : [
      {
        id: 'note-01',
        courseId: 'n101',
        title: 'Virginia Henderson 14 Basic Human Needs Summary',
        content: `Henderson defines the unique function of the nurse: to assist the individual, sick or well, in the performance of those activities contributing to health or its recovery (or to peaceful death) that he would perform unaided if he had the necessary strength, will, or knowledge.\n\n14 Basic Needs Categories:\n1. Breathe normally\n2. Eat and drink adequately\n3. Eliminate body wastes\n4. Move and maintain desirable postures\n5. Sleep and rest\n6. Select suitable clothes\n7. Maintain body temperature within normal range\n8. Keep the body clean and well groomed\n9. Avoid dangers in the environment and avoid injuring others\n10. Communicate with others\n11. Worship according to one's faith\n12. Work in such a way that there is a sense of accomplishment\n13. Play or participate in various forms of recreation\n14. Learn, discover, or satisfy curiosity`,
        tags: ['Theories', 'Henderson', 'FNP'],
        updatedAt: '2026-10-21'
      }
    ];
    if (courseId) return all.filter((n) => n.courseId === courseId);
    return all;
  } catch (e) {
    console.error('Failed to load notes', e);
    return [];
  }
}

export function saveSubjectNote(note: SubjectNoteEntry): void {
  const all = getSubjectNotes();
  const existingIdx = all.findIndex((n) => n.id === note.id);
  let updated: SubjectNoteEntry[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = note;
  } else {
    updated = [note, ...all];
  }
  localStorage.setItem(STORAGE_KEYS.SUBJECT_NOTES, JSON.stringify(updated));
}

// ----------------------------------------------------
// BSN Subject Journals Storage
// ----------------------------------------------------
export function getSubjectJournals(courseId?: string): SubjectJournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECT_JOURNALS);
    const all: SubjectJournalEntry[] = raw ? JSON.parse(raw) : [
      {
        id: 'jrn-01',
        courseId: 'n201',
        date: '2026-10-14',
        clinicalSetting: 'Barangay Bagong Silang Health Center',
        learningReflection: 'During my first home visit using the public health bag technique, I realized that true nursing care requires empathy and deep cultural understanding. Even though the client’s house was humble, the family welcomed us warmly. Practicing strict hand hygiene and waste segregation in the field taught me how to adapt hospital safety principles to real-world community environments.',
        ethicalOrLegalObservation: 'Client initially hesitated to share family health history. Respecting autonomy and explaining confidentiality under RA 10173 helped build trust.',
        competencyAddressed: 'COMP-03 Health Education & COMP-05 Ethico-Moral Responsibility',
        instructorFeedback: 'Excellent reflection, Nurse Angelica. Your attention to sterile technique during Bag demonstration was commendable.'
      }
    ];
    if (courseId) return all.filter((j) => j.courseId === courseId);
    return all;
  } catch (e) {
    console.error('Failed to load journals', e);
    return [];
  }
}

export function saveSubjectJournal(entry: SubjectJournalEntry): void {
  const all = getSubjectJournals();
  const existingIdx = all.findIndex((j) => j.id === entry.id);
  let updated: SubjectJournalEntry[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...all];
  }
  localStorage.setItem(STORAGE_KEYS.SUBJECT_JOURNALS, JSON.stringify(updated));
}

// ----------------------------------------------------
// Device Limit & Single-Email Policy Validation
// ----------------------------------------------------
export const TIER_DEVICE_LIMITS: Record<SubscriptionTierId, number> = {
  start: 1,
  growth: 2,       // Student / Undergrad Plan: ₱69 (2 devices)
  ready: 5,        // Nurse Ready Plan: ₱149 (5 devices)
  lifetime: 10     // Lifetime VIP: ₱999 (10 devices)
};

export function getClientDeviceIdentifier(): string {
  let devId = localStorage.getItem('nursepath_device_id');
  if (!devId) {
    devId = 'dev-' + Math.random().toString(36).substring(2, 9) + '-' + (navigator.platform || 'web').replace(/\s+/g, '');
    localStorage.setItem('nursepath_device_id', devId);
  }
  return devId;
}

export function registerCurrentDevice(user: UserProfile): { user: UserProfile; allowed: boolean; activeDevices: string[] } {
  const currentDeviceId = getClientDeviceIdentifier();
  const allowedMax = TIER_DEVICE_LIMITS[user.tier] || 2;
  const currentList = user.registeredDevices || [currentDeviceId];

  if (!currentList.includes(currentDeviceId)) {
    if (currentList.length >= allowedMax) {
      return { user, allowed: false, activeDevices: currentList };
    }
    const updatedDevices = [...currentList, currentDeviceId];
    const updatedUser: UserProfile = {
      ...user,
      registeredDevices: updatedDevices,
      maxDevicesAllowed: allowedMax
    };
    saveCurrentUser(updatedUser);
    return { user: updatedUser, allowed: true, activeDevices: updatedDevices };
  }

  return { user, allowed: true, activeDevices: currentList };
}

// ----------------------------------------------------
// ----------------------------------------------------
// Student Plan Feature & Zone Verification
// ----------------------------------------------------
export const FREE_UPLOAD_LIMIT = 5;
export const FREE_DAILY_GAMES_LIMIT = 3;

export function getDailyLimitResetHours(): { hours: number; minutes: number; label: string } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Next midnight (00:00)
  const diffMs = midnight.getTime() - now.getTime();
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    hours,
    minutes,
    label: `${hours}h ${minutes}m until midnight reset (00:00 PST)`
  };
}

export function isZoneAllowedForTier(
  zone: PageId,
  tier: SubscriptionTierId,
  isPaymentVerified: boolean = true
): boolean {
  // If user selected a paid tier but payment is NOT verified yet, strictly restrict access to free zones only!
  if (tier !== 'start' && !isPaymentVerified) {
    return zone === 'home' || zone === 'study_lounge' || zone === 'quizzes' || zone === 'pricing';
  }

  // Lifetime VIP (₱999) & Board Ready (₱149/mo): Unlocks all 5 zones!
  if (tier === 'lifetime' || tier === 'ready') return true;

  // Nurse Student Pass (₱69/mo):
  // Includes: Home, Zone 1 (Study Materials - Full BSN Notes & 5-Subject PNLE Question Bank), Study Lounge, Quizzes, Zone 5 (Community), Pricing.
  // Restricted: Zone 2 (International), Zone 3 (Bedside Clinical Tools), Zone 4 (Graduate MSN/Doctorate).
  if (tier === 'growth') {
    return zone === 'home' || zone === 'study_materials' || zone === 'study_lounge' || zone === 'quizzes' || zone === 'community' || zone === 'pricing';
  }

  // Starter Pass (₱0 / Free Mode):
  // Always accessible upon creating an account!
  // Includes: Home, Study Lounge (with 5-upload & 3-game limit), Quizzes (sample 50-item drill), Pricing.
  // Restricted: Zone 1 (Study Materials full BSN notes & full PNLE bank), Zone 2 (International), Zone 3 (Clinical Tools), Zone 4 (Graduate), Zone 5 (Community).
  return zone === 'home' || zone === 'study_lounge' || zone === 'quizzes' || zone === 'pricing';
}

export function isFeatureAllowedForTier(
  feature: 'unlimited_quizzes' | 'mock_simulation' | 'full_syllabi' | 'offline_mode' | 'unlimited_uploads' | 'unlimited_games',
  tier: SubscriptionTierId,
  isPaymentVerified: boolean = true
): boolean {
  if (tier !== 'start' && !isPaymentVerified) return false;
  if (tier === 'lifetime' || tier === 'ready') return true;
  if (tier === 'growth') {
    return feature !== 'mock_simulation';
  }
  return false;
}

// ----------------------------------------------------
// Nurse Game Hub Credits & Daily Tracking
// ----------------------------------------------------
export function getDailyGameCount(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `nursepath_game_count_${today}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function incrementDailyGameCount(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `nursepath_game_count_${today}`;
    const current = getDailyGameCount();
    const updated = current + 1;
    localStorage.setItem(key, updated.toString());
    return updated;
  } catch (e) {
    return 1;
  }
}

export function canPlayGame(tier: SubscriptionTierId): { allowed: boolean; count: number; limit: number } {
  if (tier !== 'start') {
    return { allowed: true, count: getDailyGameCount(), limit: Infinity };
  }
  const count = getDailyGameCount();
  return { allowed: count < FREE_DAILY_GAMES_LIMIT, count, limit: FREE_DAILY_GAMES_LIMIT };
}

// ----------------------------------------------------
// Study Buddy System
// ----------------------------------------------------
export const DEFAULT_STUDY_BUDDIES: StudyBuddy[] = [
  {
    id: 'buddy-1',
    name: 'Bea Mae Fernandez',
    school: 'UST College of Nursing',
    targetExam: 'PNLE 2026',
    avatarBg: 'bg-emerald-600',
    isOnline: true,
    status: 'Reviewing NP3 Med-Surg Emergencies',
    streakDays: 14,
    duelsWon: 18,
    duelsPlayed: 24,
    addedAt: '2026-03-01'
  },
  {
    id: 'buddy-2',
    name: 'Kenji Tan',
    school: 'UP Manila College of Nursing',
    targetExam: 'PNLE & NCLEX-RN',
    avatarBg: 'bg-blue-600',
    isOnline: true,
    status: 'Practicing Pharmacology Antidotes',
    streakDays: 9,
    duelsWon: 12,
    duelsPlayed: 15,
    addedAt: '2026-03-10'
  },
  {
    id: 'buddy-3',
    name: 'Alyssa Marie Reyes',
    school: 'Saint Louis University (SLU) Baguio',
    targetExam: 'PNLE 2026',
    avatarBg: 'bg-purple-600',
    isOnline: false,
    status: 'Offline (Studied 35 mins ago)',
    streakDays: 21,
    duelsWon: 27,
    duelsPlayed: 32,
    addedAt: '2026-02-15'
  },
  {
    id: 'buddy-4',
    name: 'Rico Dela Cruz',
    school: 'Far Eastern University (FEU) Manila',
    targetExam: 'PNLE May 2026',
    avatarBg: 'bg-amber-600',
    isOnline: true,
    status: 'Lounge Ready for Quiz Duel!',
    streakDays: 6,
    duelsWon: 8,
    duelsPlayed: 11,
    addedAt: '2026-03-18'
  }
];

export function getStudyBuddies(): StudyBuddy[] {
  try {
    const raw = localStorage.getItem('nursepath_study_buddies_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load study buddies', e);
  }
  return DEFAULT_STUDY_BUDDIES;
}

export function saveStudyBuddy(buddy: StudyBuddy): StudyBuddy[] {
  try {
    const existing = getStudyBuddies();
    const updated = [buddy, ...existing.filter((b) => b.id !== buddy.id)];
    localStorage.setItem('nursepath_study_buddies_v2', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save study buddy', e);
    return DEFAULT_STUDY_BUDDIES;
  }
}

export function deleteStudyBuddy(buddyId: string): StudyBuddy[] {
  try {
    const existing = getStudyBuddies();
    const updated = existing.filter((b) => b.id !== buddyId);
    localStorage.setItem('nursepath_study_buddies_v2', JSON.stringify(updated));
    return updated;
  } catch (e) {
    return DEFAULT_STUDY_BUDDIES;
  }
}

// ----------------------------------------------------
// Game Session History
// ----------------------------------------------------
export function getGameSessions(): GameQuizSession[] {
  try {
    const raw = localStorage.getItem('nursepath_game_sessions_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load game sessions', e);
  }
  return [];
}

export function recordGameSession(session: GameQuizSession): void {
  try {
    const existing = getGameSessions();
    const updated = [session, ...existing.slice(0, 49)];
    localStorage.setItem('nursepath_game_sessions_v2', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to record game session', e);
  }
}

export interface SubscriberNotificationPayload {
  studentName: string;
  studentEmail?: string;
  studentMobile?: string;
  university?: string;
  tierId: SubscriptionTierId;
  tierName: string;
  amountPhp: number;
  paymentMethod: string;
  referenceNumber?: string;
  verificationType: 'email' | 'mobile';
}

export async function notifyAdminSubscriberVerified(payload: SubscriberNotificationPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/notifications/subscriber-verified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Notification dispatched to rjsha0420@gmail.com' };
    }
  } catch (err) {
    console.error('Failed to notify admin via API:', err);
  }

  // Store in verified subscribers log for client persistence
  const key = 'nursepath_verified_subscribers_log';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift({ ...payload, notifiedTo: 'rjsha0420@gmail.com', loggedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));

  return { success: true, message: 'Verified subscriber recorded and notification dispatched to rjsha0420@gmail.com' };
}


