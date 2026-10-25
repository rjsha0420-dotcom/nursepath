import { SubjectScopeModule } from '../types';

export interface CourseCurriculum {
  id: string;
  year: number; // 1, 2, 3, 4
  semester: 1 | 2 | 'Summer';
  code: string;
  title: string;
  lectureUnits: number;
  labUnits: number;
  rleHours: number;
  description: string;
  competencyFocus: string[];
  syllabusScope?: SubjectScopeModule[];
  learningOutcomes?: string[];
  prescribedReferences?: string[];
}

export const CHED_BSN_CURRICULUM: CourseCurriculum[] = [
  // Year 1
  {
    id: 'n101',
    year: 1,
    semester: 1,
    code: 'NURS 101',
    title: 'Theoretical Foundations in Nursing (TFN)',
    lectureUnits: 3,
    labUnits: 0,
    rleHours: 0,
    description: 'Philosophical, historical, and theoretical perspectives in nursing with emphasis on Florence Nightingale, Virginia Henderson, Dorothea Orem, Sister Callista Roy, and Jean Watson.',
    competencyFocus: ['Ethico-Moral Responsibility', 'Personal & Professional Development', 'Communication'],
    learningOutcomes: [
      'Analyze the evolution of nursing paradigm concepts: Person, Health, Environment, and Nursing.',
      'Critically contrast grand theories (Orem, Rogers, Roy) with middle-range theories (Kolcaba, Mishel).',
      'Apply nursing conceptual frameworks to holistic Filipino client assessment and nursing care plans.'
    ],
    prescribedReferences: [
      'Alligood, M. R. (2022). Nursing Theorists and Their Work (10th ed.). Elsevier.',
      'Octaviano, E. F. & Balita, C. E. (2020). Theoretical Foundations of Nursing: The Philippine Setting. Ultimate Learning Series.'
    ],
    syllabusScope: [
      {
        unitNumber: 1,
        unitTitle: 'Introduction to Nursing Theory & Epistemology',
        topics: ['Philosophy of Science in Nursing', 'Metaparadigm Concepts', 'Historical Milestones from Florence Nightingale to Modern Era'],
        learningOutcomes: ['Distinguish concepts, models, propositions, and scientific theories.'],
        prcTosWeightPercent: 15
      },
      {
        unitNumber: 2,
        unitTitle: 'Needs and Interactive Theories',
        topics: ['Virginia Henderson (14 Components)', 'Faye Abdellah (21 Problems)', 'Dorothea Orem (Self-Care Deficit)'],
        learningOutcomes: ['Evaluate self-care requisites across developmental life stages.'],
        prcTosWeightPercent: 25
      },
      {
        unitNumber: 3,
        unitTitle: 'Systems and Behavioral Adaptation Models',
        topics: ['Sister Callista Roy (Adaptation Model: 4 Modes)', 'Betty Neuman (Systems Model: Lines of Defense)', 'Imogene King (Goal Attainment)'],
        learningOutcomes: ['Formulate adaptive stimuli interventions for stressors.'],
        prcTosWeightPercent: 30
      },
      {
        unitNumber: 4,
        unitTitle: 'Humanistic, Caring, and Philippine Contextual Theories',
        topics: ['Jean Watson (Theory of Human Caring - 10 Caritas)', 'Sister Carolina Agravante (CASAGRA Transformative Leadership)', 'Carmencita Abaquin (PREPARE ME Theory)'],
        learningOutcomes: ['Contextualize transpersonal caring inside Philippine healthcare settings.'],
        prcTosWeightPercent: 30
      }
    ]
  },
  {
    id: 'n102',
    year: 1,
    semester: 1,
    code: 'ANAT 101',
    title: 'Anatomy and Physiology',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Detailed study of human body structures, physiological mechanisms, cellular homeostasis, and organ systems.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Communication']
  },
  {
    id: 'n103',
    year: 1,
    semester: 2,
    code: 'NURS 102',
    title: 'Fundamentals of Nursing Practice (FNP)',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Basic nursing concepts, nursing process (ADPIE), infection control, vital signs, bed making, hygienic care, aseptic technique, and medication administration.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Management of Environment & Resources']
  },
  {
    id: 'n104',
    year: 1,
    semester: 2,
    code: 'MICR 101',
    title: 'Microbiology and Parasitology',
    lectureUnits: 3,
    labUnits: 1,
    rleHours: 51,
    description: 'Host-parasite relationships, infectious disease pathogenesis, sterilization, disinfection, and hospital infection control.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Quality Improvement']
  },

  // Year 2
  {
    id: 'n201',
    year: 2,
    semester: 1,
    code: 'NURS 201',
    title: 'Community Health Nursing I (Individual and Family)',
    lectureUnits: 2,
    labUnits: 2,
    rleHours: 102,
    description: 'Primary health care, family health assessment, home visits, DOH national health programs (EPI, IMCI), and Bag Technique.',
    competencyFocus: ['Health Education', 'Collaboration and Teamwork']
  },
  {
    id: 'n202',
    year: 2,
    semester: 1,
    code: 'PHAR 201',
    title: 'Pharmacology for Nursing',
    lectureUnits: 3,
    labUnits: 0,
    rleHours: 0,
    description: 'Pharmacokinetics, pharmacodynamics, high-alert drug safety, calculation of dosage and IV rates, adverse drug reactions.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Legal Responsibility']
  },
  {
    id: 'n203',
    year: 2,
    semester: 2,
    code: 'NURS 202',
    title: 'Care of Mother, Child, and Adolescent (MCN I)',
    lectureUnits: 4,
    labUnits: 5,
    rleHours: 255,
    description: 'Normal antepartum, intrapartum, postpartum, newborn care (Essential Intrapartum and Newborn Care - EINC), and pediatric growth and development.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Ethico-Moral Responsibility']
  },
  {
    id: 'n204',
    year: 2,
    semester: 2,
    code: 'NURS 203',
    title: 'Nutrition and Diet Therapy',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Dietary management for pathological conditions: renal diets, diabetic exchanges, low-sodium DASH, total parenteral nutrition (TPN).',
    competencyFocus: ['Health Education', 'Quality Improvement']
  },

  // Year 3
  {
    id: 'n301',
    year: 3,
    semester: 1,
    code: 'NURS 301',
    title: 'Care of Clients with Problems in Cellular Aberrations, Acute Biologic Crisis (Med-Surg I)',
    lectureUnits: 4,
    labUnits: 5,
    rleHours: 255,
    description: 'Pathophysiology and holistic nursing management for cardiovascular, pulmonary, oncological, and hematologic critical conditions.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Management of Environment & Resources']
  },
  {
    id: 'n302',
    year: 3,
    semester: 1,
    code: 'NURS 302',
    title: 'Nursing Research I (Quantitative & Qualitative)',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Scientific inquiry, formulation of nursing research problem, theoretical framework, sampling, ethics (PHREB & Declaration of Helsinki).',
    competencyFocus: ['Research', 'Quality Improvement']
  },
  {
    id: 'n303',
    year: 3,
    semester: 2,
    code: 'NURS 303',
    title: 'Care of Clients with Maladaptive Patterns of Behavior (Psychiatric Nursing)',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Therapeutic communication, schizophrenia spectrum, mood disorders, substance dependence, crisis intervention, psychopharmacology.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Ethico-Moral Responsibility', 'Communication']
  },
  {
    id: 'n304',
    year: 3,
    semester: 2,
    code: 'NURS 304',
    title: 'Nursing Research II (Data Analysis & Defense)',
    lectureUnits: 1,
    labUnits: 2,
    rleHours: 102,
    description: 'Data gathering, biostatistical analysis (SPSS/Jamovi), interpretation of results, oral defense, and research dissemination.',
    competencyFocus: ['Research', 'Personal and Professional Development']
  },

  // Year 4
  {
    id: 'n401',
    year: 4,
    semester: 1,
    code: 'NURS 401',
    title: 'Nursing Leadership, Management, and Professional Adjustment',
    lectureUnits: 4,
    labUnits: 3,
    rleHours: 153,
    description: 'Philippine Nursing Act of 2002 (RA 9173), Code of Ethics, negligence, malpractice, transformational leadership, staffing, budgeting, and conflict resolution.',
    competencyFocus: ['Management of Environment & Resources', 'Legal Responsibility', 'Collaboration and Teamwork']
  },
  {
    id: 'n402',
    year: 4,
    semester: 1,
    code: 'NURS 402',
    title: 'Disaster Nursing and Emergency Management',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Mass casualty triage (START / SALT), disaster cycle preparedness, BLS/ACLS protocols, ICS (Incident Command System), and psychological first aid.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Collaboration and Teamwork']
  },
  {
    id: 'n403',
    year: 4,
    semester: 2,
    code: 'NURS 403',
    title: 'Intensive Clinical Practicum / Immersion (RLE Capstone)',
    lectureUnits: 0,
    labUnits: 8,
    rleHours: 408,
    description: 'Comprehensive clinical internship rotations in tertiary hospitals (ICU, CCU, ER, OR/DR, NICU) and rural community health teams.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Personal and Professional Development', 'Record Management']
  }
];

export interface PhilippineCoreCompetency {
  code: string;
  title: string;
  chedRef: string;
  description: string;
  indicators: string[];
}

import { HospitalRotationRecord, CommunityLogbookEntry, CompetencyQAItem, SubjectTaskItem } from '../types';

export const PHILIPPINE_NURSING_COMPETENCIES: PhilippineCoreCompetency[] = [
  {
    code: 'COMP-01',
    title: 'Safe and Quality Nursing Care',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 1',
    description: 'Demonstrates knowledge of physical, social, natural and health sciences and systematically applies the Nursing Process (ADPIE) to ensure patient safety and clinical excellence.',
    indicators: [
      'Executes comprehensive head-to-toe client assessment and recognizes subtle clinical deterioration',
      'Formulates prioritized NANDA-I nursing diagnoses aligned with Maslow’s hierarchy of needs',
      'Implements physician orders and nurse-initiated protocols using strict aseptic technique and 10 Rights of Drug Administration',
      'Evaluates patient therapeutic responses and adjusts nursing care plan collaboratively'
    ]
  },
  {
    code: 'COMP-02',
    title: 'Management of Resources and Environment',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 2',
    description: 'Organizes workload, ensures therapeutic and hazard-free physical surroundings, and stewards hospital/health center resources with cost consciousness.',
    indicators: [
      'Enforces infection prevention protocols (Standard, Contact, Droplet, Airborne precautions)',
      'Ensures availability, readiness, and electrical safety of critical unit equipment (defibrillator, suction, infusion pumps)',
      'Manages ward inventory, prevents medication wastage, and participates in lean healthcare resource planning'
    ]
  },
  {
    code: 'COMP-03',
    title: 'Health Education',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 3',
    description: 'Assesses learning needs of individuals, families, and communities, formulating, executing, and evaluating culturally competent health teaching plans.',
    indicators: [
      'Evaluates literacy, cultural beliefs, language, and readiness to learn prior to instruction',
      'Conducts structured discharge teaching covering warning signs, dietary modifications, and medication adherence',
      'Facilitates community-based health promotion sessions on maternal health, non-communicable diseases, and sanitation'
    ]
  },
  {
    code: 'COMP-04',
    title: 'Legal Responsibility',
    chedRef: 'PRC BON Res. 22 s.2012 / RA 9173 (Philippine Nursing Act of 2002)',
    description: 'Practices nursing in strict compliance with the Philippine Nursing Act of 2002 (RA 9173), healthcare jurisprudence, statutory mandates, and legal standards.',
    indicators: [
      'Validates signed, informed, voluntary consent from patient or legally authorized surrogate prior to invasive procedures',
      'Practices strictly within the legal scope of nursing defined in Article VI Section 28 of RA 9173',
      'Protects client rights and privacy under Republic Act 10173 (Data Privacy Act of 2012)',
      'Fulfills legal duty to report suspected child abuse, domestic violence, or sentinel healthcare events'
    ]
  },
  {
    code: 'COMP-05',
    title: 'Ethico-Moral-Spiritual Responsibility',
    chedRef: 'PRC BON Res. 22 s.2012 / Code of Ethics for Philippine Nurses',
    description: 'Upholds bioethical principles (Autonomy, Beneficence, Non-maleficence, Justice, Veracity, Fidelity) and respects diverse spiritual and cultural values.',
    indicators: [
      'Serves as client advocate when ethical dilemmas or conflicts between patient autonomy and family wishes arise',
      'Navigates end-of-life care, Do-Not-Resuscitate (DNR) directives, and palliative comfort ethically',
      'Delivers compassionate, non-judgmental nursing care regardless of socioeconomic status, gender, religion, or nationality'
    ]
  },
  {
    code: 'COMP-06',
    title: 'Personal and Professional Development',
    chedRef: 'PRC BON Res. 22 s.2012 / RA 10912 (CPD Act of 2016)',
    description: 'Pursues lifelong learning, self-appraisal, and continuous competency enhancement through continuing professional development and post-graduate studies.',
    indicators: [
      'Maintains active PRC Professional Identification Card and earns required CPD credit units under RA 10912',
      'Engages in specialty certification (e.g., BLS/ACLS, IV Therapy Certification by ANSAP, CCRN)',
      'Participates in professional nursing organizations (PNA, ANSAP, ADPCN) and mentors junior nurses'
    ]
  },
  {
    code: 'COMP-07',
    title: 'Quality Improvement',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 7',
    description: 'Participates proactively in clinical audits, root cause analysis of adverse events, and hospital-wide patient safety initiatives.',
    indicators: [
      'Identifies clinical variations, near-misses, and medication errors and submits timely non-punitive incident reports',
      'Participates in clinical audit cycles to benchmark bedside nursing care against international standards',
      'Applies PDCA (Plan-Do-Check-Act) quality improvement cycles to reduce hospital-acquired pressure injuries and CAUTI'
    ]
  },
  {
    code: 'COMP-08',
    title: 'Research and Evidence-Based Practice',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 8',
    description: 'Critiques scientific nursing literature and incorporates validated, peer-reviewed evidence into clinical decision-making and patient care.',
    indicators: [
      'Formulates clinical PICO(T) questions to address clinical dilemmas at bedside',
      'Critiques Level I to Level III evidence from reputable nursing databases (CINAHL, Cochrane, PubMed)',
      'Adheres to research ethics standards (PHREB, Declaration of Helsinki) when conducting nursing studies'
    ]
  },
  {
    code: 'COMP-09',
    title: 'Record Management',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 9',
    description: 'Maintains accurate, comprehensive, objective, and timely clinical documentation in paper and Electronic Health Record (EHR) systems.',
    indicators: [
      'Documents nursing care using FDAR (Focus, Data, Action, Response) or SOAPIE formats concurrently with care delivery',
      'Adheres to legal documentation rules: no white-outs, objective observations only, accurate timestamps, and clear signatures',
      'Safeguards patient charts and digital credentials from unauthorized physical or electronic access'
    ]
  },
  {
    code: 'COMP-10',
    title: 'Communication',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 10',
    description: 'Utilizes effective therapeutic communication techniques with clients and establishes clear, standardized interprofessional dialogue.',
    indicators: [
      'Applies therapeutic communication techniques (active listening, open-ended questioning, clarification, reflection)',
      'Uses standardized SBAR (Situation, Background, Assessment, Recommendation) framework during physician escalations and handoffs',
      'Overcomes communication barriers (intubated patients, aphasia, language barriers) using assistive communication tools'
    ]
  },
  {
    code: 'COMP-11',
    title: 'Collaboration and Teamwork',
    chedRef: 'PRC BON Res. 22 s.2012 / CMO 15 s.2017 Core Area 11',
    description: 'Fosters collaborative relationships with multidisciplinary team members, physicians, allied health professionals, and community leaders.',
    indicators: [
      'Coordinates multidisciplinary patient discharge planning with physicians, physical therapists, dietitians, and social workers',
      'Participates actively in physician bedside rounds and family conferences',
      'Partners with local government officials, Barangay Health Workers (BHWs), and Rural Health Midwives in community health initiatives'
    ]
  }
];

export interface ClinicalCasesTracker {
  category: string;
  requiredCount: number;
  completedCount: number;
  minimumLevel: string;
}

export const CHED_CLINICAL_REQUIREMENTS: ClinicalCasesTracker[] = [
  { category: 'Major Operating Room Scrub/Circulating Cases', requiredCount: 5, completedCount: 5, minimumLevel: 'Tertiary Hospital' },
  { category: 'Minor Operating Room Scrub Cases', requiredCount: 5, completedCount: 5, minimumLevel: 'Secondary/Tertiary Hospital' },
  { category: 'Actual Spontaneous Vaginal Deliveries Handled', requiredCount: 5, completedCount: 5, minimumLevel: 'Maternity/Lying-in Unit' },
  { category: 'Immediate Newborn Cord Care Assisted', requiredCount: 5, completedCount: 5, minimumLevel: 'Delivery Room' },
  { category: 'Community Organizing & Family Case Study', requiredCount: 2, completedCount: 2, minimumLevel: 'Rural Health Unit (RHU)' },
  { category: 'Intensive Care Unit (ICU/CCU) Rotation Hours', requiredCount: 160, completedCount: 160, minimumLevel: 'Critical Care Center' },
  { category: 'Emergency Room (ER) Rotation Hours', requiredCount: 160, completedCount: 160, minimumLevel: 'Trauma/Emergency Center' }
];

export const INITIAL_HOSPITAL_ROTATIONS: HospitalRotationRecord[] = [
  {
    id: 'rot-01',
    affiliatedHospital: 'Philippine General Hospital (PGH)',
    departmentWard: 'Operating Room (OR)',
    rotationType: 'Major Scrub',
    dateStarted: '2026-08-04',
    dateEnded: '2026-08-28',
    hoursCompleted: 160,
    caseCount: 5,
    clinicalInstructor: 'Prof. Maria Elena Santos, RN, MAN',
    status: 'verified',
    notes: 'Completed 5 major scrub cases (Exploratory Laparotomy, Cholecystectomy, Appendectomy, Total Abdominal Hysterectomy, ORIF Femur).'
  },
  {
    id: 'rot-02',
    affiliatedHospital: 'University of Santo Tomas Hospital',
    departmentWard: 'Delivery Room (DR)',
    rotationType: 'Spontaneous Delivery',
    dateStarted: '2026-09-01',
    dateEnded: '2026-09-22',
    hoursCompleted: 160,
    caseCount: 5,
    clinicalInstructor: 'Prof. Ronald De Castro, RN, PhD',
    status: 'verified',
    notes: 'Completed 5 actual spontaneous vaginal deliveries (NSVD) and 5 immediate newborn cord care procedures under strict EINC protocol.'
  },
  {
    id: 'rot-03',
    affiliatedHospital: 'Philippine Heart Center (PHC)',
    departmentWard: 'Intensive Care Unit (ICU)',
    rotationType: 'Critical Care',
    dateStarted: '2026-10-01',
    dateEnded: '2026-10-24',
    hoursCompleted: 160,
    caseCount: 12,
    clinicalInstructor: 'Prof. Clarissa Alcantara, RN, MSN, CCRN',
    status: 'verified',
    notes: 'Coronary Care Unit & Post-CABG recovery. Monitored hemodynamic lines (Arterial line, CVP), vasoactive infusions, and mechanical ventilators.'
  },
  {
    id: 'rot-04',
    affiliatedHospital: 'Quirino Memorial Medical Center (QMMC)',
    departmentWard: 'Emergency Room (ER)',
    rotationType: 'Emergency Triage',
    dateStarted: '2026-05-10',
    dateEnded: '2026-05-31',
    hoursCompleted: 160,
    caseCount: 28,
    clinicalInstructor: 'Prof. Gabriel Mendoza, RN, MAN',
    status: 'verified',
    notes: 'Emergency department triage, START mass casualty protocol, acute trauma resuscitation, and advanced airway management assistance.'
  }
];

export const INITIAL_COMMUNITY_LOGBOOK: CommunityLogbookEntry[] = [
  {
    id: 'chn-01',
    date: '2026-10-14',
    assignedLocation: 'Barangay Bagong Silang, Caloocan City',
    rhuOrBhsName: 'Phase 7 Barangay Health Station (BHS)',
    activitiesConducted: [
      'Public Health Home Visit (Initial Family Assessment)',
      'Public Health Nurse Bag Technique with strict asepsis',
      'Vital signs screening & Random Blood Sugar testing',
      'Health teaching on Hypertension and low-sodium diet'
    ],
    peopleInteracted: [
      'Barangay Health Worker (BHW) Ate Susan Morales',
      'Rural Health Midwife (RHM) Maria Clara Dizon',
      'Family Head Mang Eduardo Gomez (58yo hypertensive client)'
    ],
    clientOrFamilyName: 'Gomez Family (Household #14)',
    healthAssessmentFindings: 'Mang Eduardo: BP 160/95 mmHg, non-compliant with Amlodipine 10mg due to cost. High intake of salted fish (tuyo) and coffee.',
    interventionsProvided: 'Demonstrated Bag Technique. Provided health education on stroke warning signs (F.A.S.T.) and referred client to RHU for free DOH hypertension maintenance medications.',
    hoursSpent: 8,
    verifiedByPreceptor: true
  },
  {
    id: 'chn-02',
    date: '2026-10-18',
    assignedLocation: 'Barangay Commonwealth, Quezon City',
    rhuOrBhsName: 'Commonwealth Rural Health Center',
    activitiesConducted: [
      'Expanded Program on Immunization (EPI) Clinic',
      'Cold Chain Vaccine Temperature Monitoring',
      'Pediatric Growth Monitoring (Operation Timbang Plus)',
      'Post-vaccination parent counseling on fever management'
    ],
    peopleInteracted: [
      'Municipal Health Officer Dr. Aris Bautista, MD',
      'Public Health Nurse Supervisor Nurse Fatima Cruz, RN',
      'Barangay Health Workers (BHWs)',
      '18 Mothers and infants attending vaccination clinic'
    ],
    clientOrFamilyName: 'Community Pediatric Catchment (18 Infants)',
    healthAssessmentFindings: 'Administered Pentavalent (DPT-HepB-Hib) and Oral Polio Vaccine (OPV) to 18 infants aged 6-14 weeks. Monitored vaccine cold chain at +2°C to +8°C.',
    interventionsProvided: 'Instructed mothers on paracetamol dosage for post-vaccine fever, warned never to apply cold compresses with alcohol, and scheduled next vaccine dates.',
    hoursSpent: 8,
    verifiedByPreceptor: true
  },
  {
    id: 'chn-03',
    date: '2026-10-22',
    assignedLocation: 'Barangay Batasan Hills, Quezon City',
    rhuOrBhsName: 'Batasan Hills Community Health Unit',
    activitiesConducted: [
      'Tuberculosis Directly Observed Preventive Therapy (TB-DOTS) Follow-up',
      'Sputum Collection instruction and biohazard transport',
      'Contact tracing for household pediatric contacts'
    ],
    peopleInteracted: [
      'TB-DOTS Coordinator Nurse Dennis Ramos, RN',
      'Barangay Captain Hon. Roberto Reyes',
      'Community TB treatment partners and patients'
    ],
    clientOrFamilyName: 'Community TB Cohort',
    healthAssessmentFindings: 'Monitored 12 enrolled Category 1 pulmonary TB patients in continuation phase (Rifampicin + Isoniazid). Assessed for hepatotoxicity signs (jaundice, nausea).',
    interventionsProvided: 'Conducted DOTS pill count, reinforced full completion of 6-month regimen to prevent MDR-TB, and scheduled Mantoux testing for 6 pediatric family contacts.',
    hoursSpent: 8,
    verifiedByPreceptor: true
  }
];

export const PRC_CORE_COMPETENCY_QA: CompetencyQAItem[] = [
  {
    id: 'qa-1',
    competencyCode: 'COMP-04',
    question: 'What is the nurse’s legal responsibility when a conscious, competent adult patient refuses a life-saving blood transfusion?',
    answer: 'Under the Philippine Nursing Act of 2002 (RA 9173) and the principle of Patient Autonomy, a competent adult has the fundamental legal and ethical right to refuse any medical treatment, even if refusal leads to death. The nurse must: (1) Verify that the patient is fully informed regarding the consequences, prognosis, and alternatives; (2) Notify the attending physician immediately; (3) Facilitate the signing of an Against Medical Advice (AMA) or Treatment Refusal waiver; and (4) Document objectively in the patient chart all explanations given and the patient’s verbatim responses. The nurse must NOT force or guilt the patient.',
    prcLegalStandardRef: 'Philippine Nursing Act of 2002 (RA 9173 Section 28) & Code of Ethics Article III',
    highYieldBoardTip: 'PNLE High-Yield: Respect for autonomy overrides paternalism when the client is mentally competent and fully informed.'
  },
  {
    id: 'qa-2',
    competencyCode: 'COMP-04',
    question: 'Can a Philippine registered nurse legally accept and carry out telephone or verbal orders from a physician?',
    answer: 'Under PRC Board of Nursing regulations and Philippine hospital accreditation standards, telephone or verbal orders are permitted ONLY during emergency situations or when the physician is actively scrubbed in an operative procedure. The nurse must: (1) Write down the complete order immediately; (2) Read back the order verbatim to the physician (Repeat-Back verification); (3) Receive verbal confirmation; and (4) Require the physician to sign the verbal order within 24 hours. Verbal orders for high-alert medications (chemotherapy, insulin, narcotics) are strictly prohibited except in extreme cardiac arrest emergencies.',
    prcLegalStandardRef: 'DOH Administrative Order on Hospital Medication Safety & PRC BON Resolution No. 22 s.2012',
    highYieldBoardTip: 'PNLE Rule: "Write down, Read back, Receive confirmation, Countersign within 24 hours".'
  },
  {
    id: 'qa-3',
    competencyCode: 'COMP-01',
    question: 'What constitutes the legal "10 Rights of Medication Administration" under PRC Safe Quality Care standards?',
    answer: 'The 10 Rights required for PRC Board of Nursing compliance are: (1) Right Client (verify 2 patient identifiers: full name and birthday/ID band); (2) Right Medication (verify label 3 times); (3) Right Dose (perform double-check calculation); (4) Right Route; (5) Right Time/Frequency; (6) Right Client Education (inform drug purpose and adverse effects); (7) Right Documentation (chart immediately after, never before); (8) Right to Refuse; (9) Right Assessment (check vitals/labs before administration, e.g. apical pulse for Digoxin); and (10) Right Evaluation (monitor therapeutic and adverse response).',
    prcLegalStandardRef: 'CMO 15 s.2017 Core Competency 1.3 & WHO Patient Safety Curriculum',
    highYieldBoardTip: 'Always check apical pulse for 1 full minute prior to Digoxin; withhold if HR < 60 bpm in adults.'
  },
  {
    id: 'qa-4',
    competencyCode: 'COMP-09',
    question: 'If a nurse commits a documentation error on a paper patient chart, what is the legally acceptable method of correction?',
    answer: 'According to Philippine Medical Jurisprudence and PRC Record Management standards, never use correction fluid (liquid paper), eraser, or black-out markers, as this legally implies tampering or fraudulent intent. The correct legal procedure is: (1) Draw a single horizontal line across the incorrect entry so it remains legible; (2) Write "Mistaken Entry" or "Error" above or beside the line; (3) Sign your initials; and (4) Record the date and time of correction followed by the correct entry.',
    prcLegalStandardRef: 'RA 9173 Medical Records Jurisprudence & PRC BON Resolution 22 s.2012 Core Area 9',
    highYieldBoardTip: 'Tampered records with correction tape are inadmissible in court as evidence during malpractice litigation.'
  },
  {
    id: 'qa-5',
    competencyCode: 'COMP-05',
    question: 'How should a nurse handle a family member who requests that a cancer diagnosis be withheld from the patient?',
    answer: 'Under the ethical principle of Veracity (truth-telling) and the Code of Ethics for Philippine Nurses, the client has the primary moral and legal right to know their diagnosis and prognosis. The nurse should: (1) Explore the family’s cultural beliefs and fears underlying the request; (2) Assess the client’s desire for information (ask the client how much they want to know); (3) Collaborate with the attending physician and family in a multidisciplinary conference to deliver the diagnosis gently with adequate psychological support. The nurse should NOT collude in lying or deceiving the patient.',
    prcLegalStandardRef: 'Code of Ethics for Philippine Nurses (PRC BON Res. No. 220 s.2004)',
    highYieldBoardTip: 'Veracity requires honesty. The patient remains the primary stakeholder in their health decisions unless legally declared incompetent.'
  },
  {
    id: 'qa-6',
    competencyCode: 'COMP-11',
    question: 'What is the SBAR communication framework and how does it prevent sentinel events according to PRC guidelines?',
    answer: 'SBAR (Situation, Background, Assessment, Recommendation) is the international and PRC-endorsed standardized communication protocol to convey critical clinical data rapidly: S (Situation: Your name, unit, patient name, and immediate urgent problem); B (Background: Admission diagnosis, date of surgery, pertinent history, baseline vitals); A (Assessment: Current vital signs, Glasgow Coma Scale, physical findings, telemetry, oxygen saturation); R (Recommendation: What you need from the doctor now, e.g. "I recommend an immediate stat bedside review, stat chest x-ray, and arterial blood gas"). SBAR prevents handoff omissions, which cause over 70% of medical sentinel errors.',
    prcLegalStandardRef: 'The Joint Commission International & PRC BON Quality Standards 2012',
    highYieldBoardTip: 'Always conclude an urgent physician call with a clear Recommendation, not just reporting data.'
  }
];

export const INITIAL_SUBJECT_TASKS: SubjectTaskItem[] = [
  {
    id: 'tsk-01',
    courseId: 'n101',
    title: 'Theoretical Concept Map: Orem’s Self-Care Deficit Applied to Post-CVA Patient',
    type: 'Assignment',
    dueDate: '2026-10-28',
    priority: 'High',
    status: 'upcoming',
    notes: 'Focus on supportive-educative vs. wholly compensatory nursing systems for 64yo stroke client.'
  },
  {
    id: 'tsk-02',
    courseId: 'n101',
    title: 'Comparative Analysis: Nightingale’s Environmental Theory vs. Watson’s 10 Caritas',
    type: 'Term Paper',
    dueDate: '2026-10-15',
    priority: 'Medium',
    status: 'completed',
    completedAt: '2026-10-14',
    gradeOrScore: '96 / 100 (Prof. Rating: Outstanding Synthesis)'
  },
  {
    id: 'tsk-03',
    courseId: 'n102',
    title: 'Return Demonstration: Comprehensive Head-to-Toe Neurological & Cranial Nerve Exam',
    type: 'Return Demonstration',
    dueDate: '2026-11-04',
    priority: 'High',
    status: 'upcoming',
    notes: 'Must demonstrate CN I through XII assessment with ophthalmoscope and reflex hammer.'
  },
  {
    id: 'tsk-04',
    courseId: 'n201',
    title: 'Community Family Nursing Care Plan (FNCP) - First & Second Level Assessment',
    type: 'Project',
    dueDate: '2026-11-10',
    priority: 'High',
    status: 'in_progress',
    notes: 'Prioritize malnutrition and lack of potable water using the 4-criterion prioritization matrix.'
  }
];

