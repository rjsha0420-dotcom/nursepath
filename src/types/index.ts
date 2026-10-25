export type UserRole =
  | 'undergrad'
  | 'newgrad'
  | 'rn'
  | 'masteral'
  | 'phd'
  | 'faculty';

export type SubscriptionTierId =
  | 'start'      // Free Starter Tier: ₱0
  | 'growth'     // Student / Undergrad Plan: ₱69/mo
  | 'ready'      // Nurse Board Ready: ₱149/mo
  | 'lifetime';  // Lifetime VIP Access: ₱999 One-Time

export type BillingCycle = 'monthly' | 'annual' | 'lifetime';

export type PaymentMethodType =
  | 'gcash'
  | 'maya'
  | 'card'
  | 'bank_dragonpay'
  | 'otc_dragonpay'
  | 'paypal';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: SubscriptionTierId;
  billingCycle: BillingCycle;
  subscriptionExpiresAt: string;
  avatarUrl?: string;
  schoolOrHospital: string;
  targetExam: string; // 'PNLE' | 'NCLEX-RN' | etc.
  targetCountry: string; // 'Philippines' | 'USA' | etc.
  specialtyInterest: string;
  clinicalHoursCompleted: number;
  cpdUnitsCompleted: number;
  pnleReadinessScore: number;
  savedDecksCount: number;
  isGuest?: boolean;
  mobileNumber?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isPaymentVerified?: boolean;
  paymentVerificationStatus?: 'unverified' | 'pending' | 'verified';
  paymentReferenceNumber?: string;
  paymentMethod?: PaymentMethodType;
  verifiedAt?: string;
  verificationToken?: string;
  registeredDevices?: string[];
  maxDevicesAllowed?: number;
}

export type PageId =
  | 'home'
  | 'study_materials'
  | 'study_lounge'
  | 'international'
  | 'clinical_tools'
  | 'graduate'
  | 'quizzes'
  | 'community'
  | 'pricing';

// Legacy alias for compatibility
export type ZoneId = PageId;

export type GraduateTab = 'masteral' | 'doctoral';

// Nurse Game Hub Study Buddy & Gaming Types
export interface StudyBuddy {
  id: string;
  name: string;
  school: string;
  targetExam: string;
  avatarBg: string;
  isOnline: boolean;
  status: string;
  streakDays: number;
  duelsWon: number;
  duelsPlayed: number;
  addedAt: string;
}

export interface GameQuizSession {
  id: string;
  mode: 'duel' | 'card_match' | 'buzzer';
  topic: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  opponentName?: string;
  won?: boolean;
}

// SM-2 Flashcard
export interface Flashcard {
  id: string;
  deckId: string;
  category: string;
  front: string;
  back: string;
  pearl: string;
  evidenceLevel: string; // 'Level I (RCT/Systematic)' | 'Level II' | 'Level III' | 'Expert Opinion'
  reps: number;
  interval: number; // in days
  easeFactor: number; // default 2.5
  dueDate: string;
  tags: string[];
}

// Question / Quiz item
export interface QuizQuestion {
  id: string;
  zone: 'undergrad' | 'international' | 'specialist' | 'graduate';
  examType: string; // 'PNLE' | 'NCLEX-RN' | 'UK-NMC' | 'AHPRA' | 'MSN-ENTRANCE' | 'DOCTORAL-QUAL'
  subject: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  rationale: string;
  clientNeedCategory?: string; // NCSBN category
  cognitiveLevel?: string; // Bloom's: Analysis, Application, Evaluation
  referenceStandard: string; // e.g., 'CHED CMO 15 s.2017' | 'NCSBN Test Plan 2024' | 'ICN Practice'
}

// Drug Reference
export interface DrugItem {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  indications: string;
  mechanism: string;
  standardDose: string;
  pediatricDose?: string;
  ivAdministration: {
    pushRate: string;
    dilution: string;
    compatibility: string[];
  };
  highAlert: boolean;
  blackBoxWarning?: string;
  antidote?: string;
  nursingConsiderations: string[];
  monitoringParameters: string[];
  patientTeaching: string[];
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X';
}

// Lab Reference
export interface LabItem {
  id: string;
  name: string;
  category: 'Electrolytes' | 'CBC' | 'Coagulation' | 'Cardiac' | 'Renal' | 'Liver' | 'ABG';
  conventionalRange: string;
  siUnits: string;
  criticalLow: string;
  criticalHigh: string;
  causesHigh: string[];
  causesLow: string[];
  nursingImplications: string[];
  priorityAlert: string;
}

// Clinical Calculator
export interface ClinicalCalcResult {
  title: string;
  result: string | number;
  unit: string;
  interpretation: string;
  warning?: string;
}

// Care Plan
export interface CarePlan {
  id: string;
  patientProfile: string;
  nandaDiagnosis: string;
  relatedTo: string;
  asEvidencedBy: string;
  nocOutcomes: string[];
  nicInterventions: {
    action: string;
    rationale: string;
  }[];
  evaluationCriteria: string;
  createdAt: string;
}

// CPD Log
export interface CPDRecord {
  id: string;
  title: string;
  provider: string;
  dateCompleted: string;
  category: 'PRC Credit Units' | 'UK NMC Revalidation' | 'AHPRA CPD' | 'CNA Contact Hours';
  units: number;
  certificateRef?: string;
  evidenceType: string;
}

// Masteral / MSN Program
export interface MSNTrack {
  id: string;
  title: string;
  degreeName: string; // e.g., 'Master of Science in Nursing (MSN)'
  chedBasis: string; // 'CHED CMO No. 5 Series of 2024'
  pqfLevel: 7;
  totalUnits: number; // 36-48 units
  duration: string; // '2 - 3 Years'
  tracks: ('Academic / Thesis Track' | 'Professional / Non-Thesis Track')[];
  coreCourses: {
    code: string;
    title: string;
    units: number;
    description: string;
  }[];
  specializations: string[];
  careerOutcomes: string[];
}

// Doctoral Program
export interface DoctoralTrack {
  id?: string;
  degreeType: 'PhD' | 'DScN' | 'DNP';
  fullName: string;
  pqfLevel: 8;
  focus: string; // 'Research / Theory Generation' | 'Clinical Science' | 'Systems Leadership'
  chedBasis: string;
  competencies: string[];
  qualifyingExamTopics: string[];
  dissertationRequirements: string[];
  internationalEquivalents: string;
}


// User-Uploaded Reference Material & Multi-Format Synthesis
export interface MindMapNode {
  id: string;
  label: string;
  badge?: string;
  color?: string;
  children?: MindMapNode[];
}

export interface MnemonicItem {
  id: string;
  mnemonic: string; // e.g. "MONA"
  expansion: string; // e.g. "Morphine, Oxygen, Nitroglycerin, Aspirin"
  clinicalApplication: string;
  highYieldTip: string;
}

export interface GeneratedQuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  rationale: string;
  subtopic?: string;
}

export interface ReferenceMaterial {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'word' | 'image' | 'video' | 'text';
  fileSize: string;
  uploadedAt: string;
  content: string; // Raw text or extracted transcript
  previewUrl?: string; // Data URL for image / video
  pageCountOrDuration?: string;
  summary?: string;
  quiz?: GeneratedQuizItem[];
  flashcards?: Flashcard[];
  mindMap?: MindMapNode;
  mnemonics?: MnemonicItem[];
}

// BSN Subject Scope, Syllabus, Notes, Journal & Task Tracking
export interface SubjectScopeModule {
  unitNumber: number;
  unitTitle: string;
  topics: string[];
  learningOutcomes: string[];
  prcTosWeightPercent?: number; // Board Exam Weight
}

export interface SubjectTaskItem {
  id: string;
  courseId: string; // e.g. 'n101'
  title: string;
  type: 'Assignment' | 'Project' | 'Return Demonstration' | 'Case Presentation' | 'Term Paper' | 'Major Exam';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'upcoming' | 'in_progress' | 'completed';
  notes?: string;
  completedAt?: string;
  gradeOrScore?: string;
}

export interface SubjectNoteEntry {
  id: string;
  courseId: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  referencesAttached?: string[];
}

export interface SubjectJournalEntry {
  id: string;
  courseId: string;
  date: string;
  clinicalSetting: string;
  learningReflection: string;
  ethicalOrLegalObservation?: string;
  competencyAddressed: string;
  instructorFeedback?: string;
}

// Clinical Hours (RLE) Tracker & Community Logbook
export interface HospitalRotationRecord {
  id: string;
  affiliatedHospital: string; // e.g. "Philippine General Hospital", "UST Hospital"
  departmentWard: 'Operating Room (OR)' | 'Delivery Room (DR)' | 'Intensive Care Unit (ICU)' | 'Emergency Room (ER)' | 'Pediatrics' | 'Medical Ward' | 'Surgical Ward' | 'Psychiatric Facility';
  rotationType: 'Major Scrub' | 'Minor Scrub' | 'Spontaneous Delivery' | 'Cord Care' | 'Critical Care' | 'Emergency Triage' | 'General Ward';
  dateStarted: string;
  dateEnded: string;
  hoursCompleted: number;
  caseCount: number;
  clinicalInstructor: string;
  status: 'verified' | 'pending' | 'in_progress';
  notes?: string;
}

export interface CommunityLogbookEntry {
  id: string;
  date: string;
  assignedLocation: string; // Barangay, Municipality, City, RHU
  rhuOrBhsName: string; // e.g. "Barangay Holy Spirit Health Station"
  activitiesConducted: string[]; // e.g. ["Home Visits", "Bag Technique", "Family Nursing Care Plan", "EPI Immunization"]
  peopleInteracted: string[]; // e.g. ["Barangay Health Workers (BHWs)", "Rural Health Midwife (RHM)", "Barangay Captain", "Family Head"]
  clientOrFamilyName?: string;
  healthAssessmentFindings: string;
  interventionsProvided: string;
  hoursSpent: number;
  verifiedByPreceptor: boolean;
}

// Interactive 11 Core Competencies Q&A
export interface CompetencyQAItem {
  id: string;
  competencyCode: string; // e.g. "COMP-01" to "COMP-11"
  question: string;
  answer: string;
  prcLegalStandardRef: string; // e.g. "PRC BON Res 22 s.2012 / RA 9173 Sec 28"
  highYieldBoardTip: string;
}

// ============================================================================
// STUDY LOUNGE PERSONAL STUDY SPACE TYPES
// ============================================================================
export type ResourceFolder = 'Midterms' | 'Finals' | 'Board Exams' | 'Personal Notes';
export type ResourceType = 'document' | 'image' | 'video' | 'link' | 'drive';

export interface StudyResource {
  id: string;
  name: string;
  folder: ResourceFolder;
  type: ResourceType;
  fileFormat: string; // 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'jpg' | 'png' | 'mp4' | 'youtube' | 'vimeo' | 'url' | 'gdrive'
  url: string; // Data URL, blob URL, external URL, or Google Drive URL
  sizeBytes?: number;
  sizeLabel?: string;
  uploadedAt: string;
  notes?: string;
  textContent?: string;
  driveFileId?: string;
  driveMimeType?: string;
  isFromDrive?: boolean;
}


export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'identification';
export type QuizDifficulty = 'easy' | 'moderate' | 'board_mastery';

export interface GeneratedQuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[]; // 4 choices for multiple choice, 2 choices for true/false
  correctAnswer: string;
  rationale: string;
  sourceResourceId?: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  createdAt: string;
  sourceResourceIds: string[];
  sourceResourceNames: string[];
  questionCount: number;
  difficulty: QuizDifficulty;
  questions: GeneratedQuizQuestion[];
  completedCount: number;
  lastAttemptScore?: number;
  bestScore?: number;
  lastAttemptAt?: string;
}

export interface StudyFlashcard {
  id: string;
  deckId: string;
  term: string;
  definition: string;
  folder?: ResourceFolder;
  status: 'new' | 'learning' | 'learned' | 'review_later';
  createdAt: string;
  sourceTitle?: string;
}

export interface StudyFlashcardDeck {
  id: string;
  title: string;
  folder: ResourceFolder;
  sourceResourceId?: string;
  cards: StudyFlashcard[];
  createdAt: string;
}

export interface NursingMnemonic {
  id: string;
  keywords: string;
  title: string;
  acronym: string;
  expansion: { letter: string; meaning: string; clinicalTip?: string }[];
  explanation: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
}

export type ExamCategory = 'Midterms' | 'Finals' | 'Board Exams';

export interface ExamTopicModule {
  id: string;
  title: string;
  subjectCode: string;
  completed: boolean;
  notesSummary: string;
  keyPoints: string[];
  highYieldChecklist: { id: string; text: string; done: boolean }[];
}

export interface ExamReviewerSchedule {
  id: string;
  category: ExamCategory;
  examDate: string; // YYYY-MM-DD
  targetName: string;
  linkedResourceIds: string[];
  topics: ExamTopicModule[];
  studyNotes: string;
  progressPercent: number;
}


