import { QuizQuestion } from '../types';

export const COMPREHENSIVE_QUESTION_BANK: QuizQuestion[] = [
  // PNLE - NP1: Community Health Nursing
  {
    id: 'pnle-01',
    zone: 'undergrad',
    examType: 'PNLE',
    subject: 'NP 1: Community Health & Communicable Disease Nursing',
    subtopic: 'Expanded Program on Immunization (EPI)',
    question: 'Under the Philippine Department of Health (DOH) Expanded Program on Immunization (EPI), at what age should the Pentavalent vaccine (DPT-HepB-HiB) 1st dose be administered to an infant, and via which anatomical site and route?',
    options: [
      'At birth, right vastus lateralis, intramuscular',
      'At 6 weeks, left anterolateral thigh (vastus lateralis), intramuscular',
      'At 10 weeks, deltoid muscle, subcutaneous',
      'At 9 months, right upper arm, intradermal'
    ],
    correctAnswerIndex: 1,
    rationale: 'Under DOH EPI guidelines, Pentavalent 1 is given at 6 weeks of age via Intramuscular (IM) injection at a 90-degree angle into the anterolateral aspect of the upper thigh (vastus lateralis). Pentavalent 2 is given at 10 weeks, and Pentavalent 3 at 14 weeks. BCG is given at birth (intradermal), Hep B at birth (vastus lateralis), and Measles/MMR at 9 & 12 months (subcutaneous).',
    referenceStandard: 'DOH Administrative Order on National Immunization Program (NIP) / CHED CMO 15 s.2017'
  },
  {
    id: 'pnle-02',
    zone: 'undergrad',
    examType: 'PNLE',
    subject: 'NP 2: Maternal and Child Health Nursing',
    subtopic: 'Essential Intrapartum and Newborn Care (EINC)',
    question: 'Nurse Angela is implementing the 4 core steps of the DOH "Unang Yakap" (Essential Intrapartum and Newborn Care - EINC) protocol. What is the correct chronological sequence of these life-saving interventions?',
    options: [
      'Suction airway → Immediate drying → Non-separation of mother and child → Delayed cord clamping',
      'Immediate and thorough drying (30 seconds) → Early skin-to-skin contact → Properly timed cord clamping (1-3 minutes) → Non-separation for breastfeeding initiation',
      'Properly timed cord clamping → Footprinting → Immediate bathing → Vitamin K administration',
      'Immediate drying → Cutting the cord immediately within 10 seconds → Suctioning secretions → Radiant warmer placement'
    ],
    correctAnswerIndex: 1,
    rationale: 'EINC Unang Yakap evidence-based steps are: 1. Immediate and thorough drying for 30 seconds (stimulates breathing, prevents hypothermia). 2. Early skin-to-skin contact between mother and newborn. 3. Properly timed cord clamping after pulsations stop (1 to 3 minutes; prevents anemia and intraventricular hemorrhage). 4. Non-separation of mother and infant for early breastfeeding initiation within the first 90 minutes. Routine suctioning and immediate bathing are avoided.',
    referenceStandard: 'DOH Administrative Order 2009-0025 (EINC Protocol)'
  },
  {
    id: 'pnle-03',
    zone: 'undergrad',
    examType: 'PNLE',
    subject: 'NP 3: Care of Clients with Physiological Alterations (Part A)',
    subtopic: 'Cardiovascular & Hemodynamic Instability',
    question: 'A 58-year-old male post-percutaneous coronary intervention (PCI) suddenly develops restlessness, tachycardia (HR 126 bpm), blood pressure drop from 138/84 to 86/52 mmHg, and muffled distant heart sounds with distended neck veins. Which condition must the nurse suspect immediately?',
    options: [
      'Pulmonary embolism',
      'Cardiac tamponade (Beck\'s Triad)',
      'Tension pneumothorax',
      'Vasovagal syncope'
    ],
    correctAnswerIndex: 1,
    rationale: 'The combination of hypotension, jugular venous distention (JVD), and muffled/distant heart tones constitutes Beck\'s Triad, the classic hallmark of cardiac tamponade. Blood or pericardial fluid accumulates rapidly, restricting ventricular diastolic filling and dropping cardiac output. Immediate emergency intervention is pericardiocentesis.',
    referenceStandard: 'CHED CMO 15 s.2017 Medical-Surgical Nursing Standards'
  },
  {
    id: 'pnle-04',
    zone: 'undergrad',
    examType: 'PNLE',
    subject: 'NP 4: Care of Clients with Physiological Alterations (Part B)',
    subtopic: 'Neurology - Increased Intracranial Pressure (ICP)',
    question: 'In a patient with severe traumatic brain injury (TBI), which group of vital sign changes indicates late-stage decompensated increased intracranial pressure (Cushing\'s Triad)?',
    options: [
      'Hypotension, tachycardia, and tachypnea',
      'Widening pulse pressure (severe systolic hypertension), bradycardia, and irregular/Cheyne-Stokes respirations',
      'Narrowing pulse pressure, tachycardia, and hypothermia',
      'Severe hypotension, bounding pulse, and hyperventilation'
    ],
    correctAnswerIndex: 1,
    rationale: 'Cushing\'s Triad is a medical emergency signaling impending brain herniation due to elevated ICP. It is characterized by: 1. Systolic hypertension with widening pulse pressure; 2. Bradycardia (vagal response to elevated mean arterial pressure); and 3. Irregular, slowed respirations (Cheyne-Stokes or ataxic breathing due to brainstem compression).',
    referenceStandard: 'CHED Medical-Surgical Nursing Core Competencies'
  },
  {
    id: 'pnle-05',
    zone: 'undergrad',
    examType: 'PNLE',
    subject: 'NP 5: Psychiatric Nursing & Professional Adjustment',
    subtopic: 'Philippine Nursing Act of 2002 (RA 9173)',
    question: 'Under Republic Act 9173 (Philippine Nursing Act of 2002), which of the following actions constitutes an illegal practice of nursing and holds criminal liability?',
    options: [
      'A staff nurse administering an intravenous antibiotic after verifying the written physician order',
      'A nursing graduate who failed the PNLE practicing as an independent clinical staff nurse without a valid Professional Identification Card',
      'A registered nurse delegating non-invasive bed-bath procedures to a certified nursing assistant',
      'A charge nurse conducting a root-cause quality improvement audit following a medication error'
    ],
    correctAnswerIndex: 1,
    rationale: 'Section 26 & Section 31 of RA 9173 strictly prohibit any person from practicing or offering to practice nursing in the Philippines without a valid certificate of registration/professional license issued by the Board of Nursing (BON) and the Professional Regulation Commission (PRC). Violators are punishable by fines and/or imprisonment.',
    referenceStandard: 'Republic Act 9173 (Philippine Nursing Act of 2002)'
  },

  // NCLEX-RN (Next Generation NCSBN 2024 Test Plan)
  {
    id: 'nclex-01',
    zone: 'international',
    examType: 'NCLEX-RN',
    subject: 'Safe and Effective Care Environment / Pharmacological Therapies',
    subtopic: 'NextGen NGN Prioritization Case',
    question: 'The nurse is caring for 4 assigned patients on a medical telemetry floor. Which patient should the registered nurse assess FIRST upon receiving morning handoff report?',
    options: [
      'A 62-year-old patient with congestive heart failure who has 2+ pitting bilateral ankle edema and dry cough',
      'A 45-year-old patient with deep vein thrombosis (DVT) receiving continuous IV heparin who reports sudden acute onset dyspnea, pleuritic chest pain, and SpO2 of 88% on room air',
      'A 70-year-old patient with type 2 diabetes mellitus whose morning fingerstick blood glucose reads 240 mg/dL',
      'A 34-year-old patient 1 day post-laparoscopic cholecystectomy reporting 6/10 right shoulder surgical gas pain'
    ],
    correctAnswerIndex: 1,
    rationale: 'Using airway, breathing, circulation (ABC) and acute vs chronic prioritization, the patient with DVT who suddenly develops acute dyspnea, pleuritic chest pain, and hypoxemia (SpO2 88%) is displaying classic signs of a life-threatening Pulmonary Embolism (PE). Immediate assessment, oxygen administration, vital signs, and rapid physician notification are paramount.',
    cognitiveLevel: 'Analysis / Evaluation',
    clientNeedCategory: 'Physiological Adaptation',
    referenceStandard: 'NCSBN Next Generation NCLEX (NGN) Test Plan 2024'
  },
  {
    id: 'nclex-02',
    zone: 'international',
    examType: 'NCLEX-RN',
    subject: 'Pharmacological and Parenteral Therapies',
    subtopic: 'High-Alert Medications: Potassium Chloride IV',
    question: 'A physician orders Potassium Chloride (KCl) 20 mEq IV infusion for a patient with a serum potassium of 2.9 mEq/L. Which nursing action is ESSENTIAL to prevent fatal cardiac arrest?',
    options: [
      'Administer the 20 mEq KCl via direct rapid IV push over 30 seconds',
      'Dilute the KCl in IV fluids and infuse via an electronic infusion pump at a rate NOT exceeding 10 to 20 mEq/hour with continuous cardiac monitoring',
      'Administer the dose intramuscularly into the ventrogluteal muscle',
      'Bolus the KCl through a central venous catheter over 2 minutes'
    ],
    correctAnswerIndex: 1,
    rationale: 'NEVER administer IV Potassium Chloride by IV push, bolus, or intramuscular injection—doing so causes immediate cardiac arrest and death! IV KCl must always be diluted in compatible IV fluids (e.g., Normal Saline), infused using an electronic infusion pump, and administered at a controlled maximum rate (typically 10 mEq/hr on peripheral lines, up to 20 mEq/hr via central venous access with continuous cardiac telemetry monitoring).',
    clientNeedCategory: 'Pharmacological and Parenteral Therapies',
    referenceStandard: 'ISMP High-Alert Medication Guidelines & NCSBN Test Plan'
  },

  // UK NMC CBT (Part 1 Adult Nursing)
  {
    id: 'uk-nmc-01',
    zone: 'international',
    examType: 'UK-NMC',
    subject: 'NMC Code of Conduct & Clinical Governance',
    subtopic: 'The Code: Professional standards of practice and behaviour',
    question: 'Under the UK Nursing and Midwifery Council (NMC) Code, a registered nurse makes a medication administration error. What is the nurse\'s primary professional duty under the "Duty of Candour"?',
    options: [
      'Document the error in the nurse\'s personal private notebook without telling anyone to avoid unnecessary anxiety',
      'Be open and honest with the patient immediately, explain what happened, apologize sincerely, report to the nurse-in-charge, and complete a formal Datix clinical incident report',
      'Notify the family only if the patient suffers permanent physiological harm',
      'Withhold disclosure until a formal disciplinary committee issues an inquest'
    ],
    correctAnswerIndex: 1,
    rationale: 'The NMC Code section "Be open and candid" and the statutory Duty of Candour mandate that healthcare professionals must be open and honest with service users when things go wrong. The nurse must promptly inform the patient, apologize, offer appropriate remedy or support, notify the clinical team, and submit a formal incident log (such as Datix).',
    referenceStandard: 'NMC Code (2018 revision) / Health and Social Care Act 2008 Regulation 20'
  },

  // AHPRA NMBA (Australia)
  {
    id: 'ahpra-01',
    zone: 'international',
    examType: 'AHPRA',
    subject: 'Registered Nurse Standards for Practice (Australia)',
    subtopic: 'Culturally Safe Practice & Aboriginal and Torres Strait Islander Peoples',
    question: 'In accordance with NMBA Standard 1 & Standard 2 for Registered Nurses in Australia, what does "Culturally Safe Practice" mandate when providing care to Aboriginal and Torres Strait Islander patients?',
    options: [
      'Treating every patient exactly identical regardless of their cultural heritage, personal history, or generational trauma',
      'Reflecting on personal power dynamics, bias, and institutional racism, while ensuring care is perceived by the Aboriginal patient as safe, respectful, and empowering',
      'Requiring a family member to provide 100% of all nursing care',
      'Translating English clinical forms into traditional dialects only when requested by hospital legal teams'
    ],
    correctAnswerIndex: 1,
    rationale: 'The Nursing and Midwifery Board of Australia (NMBA) Standard 1 requires critical thinking and culturally safe practice. Cultural safety is defined not just by cultural awareness, but by healthcare workers examining their own systemic biases and delivering care that Aboriginal and Torres Strait Islander people feel is safe, free from discrimination, and honors their cultural identity.',
    referenceStandard: 'NMBA Registered Nurse Standards for Practice (Standard 1.4)'
  },

  // Graduate Zone: Masteral (MSN) Entrance & Advanced Coursework
  {
    id: 'msn-01',
    zone: 'graduate',
    examType: 'MSN-ENTRANCE',
    subject: 'Advanced Nursing Theory & Theoretical Frameworks',
    subtopic: 'CHED CMO 5 s.2024 Core MSN Foundations',
    question: 'A Masteral nursing scholar is designing an advanced nursing intervention for diabetic glycemic control using Dorothea Orem\'s Self-Care Deficit Nursing Theory. In which nursing system does the clinical specialist act when the adult client can bathe and ambulate independently but lacks the specialized psychomotor skill to calculate insulin carb ratios and administer subcutaneous injections?',
    options: [
      'Wholly compensatory nursing system',
      'Partially compensatory nursing system',
      'Supportive-educative (developmental) nursing system',
      'Interpersonal interactional system'
    ],
    correctAnswerIndex: 1,
    rationale: 'In Orem\'s theory: 1. Wholly Compensatory is when the patient is completely dependent (e.g., comatose). 2. Partially Compensatory occurs when both the nurse and the patient perform care measures (the patient performs basic self-care like hygiene, but the nurse provides clinical disease management and skilled medication assistance). 3. Supportive-Educative is when the patient can perform and learn to execute all measures with guidance.',
    referenceStandard: 'CHED CMO 5 s.2024 (MSN Advanced Theoretical Foundations in Nursing)'
  },

  // Graduate Zone: Doctoral (PhD / DScN / DNP) Qualifying Exam Item
  {
    id: 'phd-01',
    zone: 'graduate',
    examType: 'DOCTORAL-QUAL',
    subject: 'Advanced Epistemology & Translational Research Methodology',
    subtopic: 'Doctoral Comprehensive Qualifying Examination',
    question: 'In doctoral nursing scholarship (PQF Level 8), which epistemological paradigm best underpins a mixed-methods convergent parallel design investigating both the biochemical biomarker changes (cortisol/IL-6) of chronic clinical nurse burnout and the lived phenomenological existential distress of bedside nurses?',
    options: [
      'Positivism / Post-positivism solely',
      'Constructivism / Interpretivism exclusively',
      'Pragmatism (combining empirical measurement with humanistic interpretive meaning)',
      'Critical Feminist Theory exclusively'
    ],
    correctAnswerIndex: 2,
    rationale: 'Pragmatism is the philosophical foundation most widely embraced for Mixed Methods Research (MMR) at the PhD/DScN level. Pragmatism rejects the strict incompatibility thesis between post-positivism (quantitative objective measurement of biological variables) and constructivism (qualitative exploration of subjective lived experience), asserting that both methodologies can be integrated to address complex healthcare and human phenomena.',
    referenceStandard: 'CHED PQF Level 8 Doctoral Framework & AACN Doctoral Essentials'
  }
];
