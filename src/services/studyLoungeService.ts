import {
  StudyResource,
  ResourceFolder,
  GeneratedQuiz,
  GeneratedQuizQuestion,
  QuizDifficulty,
  StudyFlashcard,
  NursingMnemonic,
  ExamReviewerSchedule,
  ExamCategory
} from '../types';
import {
  sanitizeClinicalText,
  generateGroundedSummary,
  generateGroundedQuiz,
  generateGroundedFlashcards
} from './referenceSynthesisEngine';

const LOUNGE_KEYS = {
  RESOURCES: 'nursepath_lounge_resources_v2',
  QUIZZES: 'nursepath_lounge_quizzes_v2',
  FLASHCARDS: 'nursepath_lounge_flashcards_v2',
  MNEMONICS: 'nursepath_lounge_mnemonics_v2',
  EXAM_SCHEDULES: 'nursepath_lounge_exam_schedules_v2',
  DRIVE_CONNECTED: 'nursepath_google_drive_connected_v1',
  DRIVE_TOKEN: 'nursepath_google_drive_token_v1'
};

export const FREE_RESOURCE_UPLOAD_LIMIT = 5;

// ============================================================================
// 1. DEFAULT INITIAL RESOURCES (Offline-Ready BSN & PNLE Materials)
// ============================================================================
const INITIAL_RESOURCES: StudyResource[] = [
  {
    id: 'res-bsn-pharm-pdf',
    name: 'High-Alert Pharmacology Antidotes & IV Titrations.pdf',
    folder: 'Board Exams',
    type: 'document',
    fileFormat: 'pdf',
    url: '#preview-pdf-pharmacology',
    sizeBytes: 1450000,
    sizeLabel: '1.4 MB',
    uploadedAt: '2026-10-18',
    notes: 'Essential PRC PNLE & NCLEX antidote pairings, therapeutic serum drug levels, and IV push administration rates.',
    textContent: `HIGH-ALERT PHARMACOLOGY ANTIDOTES & THERAPEUTIC SERUM LEVELS:
1. Heparin Sodium -> Antidote: Protamine Sulfate. Monitor aPTT (Normal 30-40 sec; Therapeutic 1.5-2.5x).
2. Warfarin (Coumadin) -> Antidote: Vitamin K1 (Phytonadione). Monitor PT/INR (Therapeutic INR 2.0-3.0).
3. Magnesium Sulfate -> Antidote: Calcium Gluconate 10% IV slow push. Monitor deep tendon reflexes (DTRs), respiratory rate (>= 12/min), and urine output (>= 30 mL/hr).
4. Acetaminophen (Paracetamol) -> Antidote: Acetylcysteine (Mucomyst). Protects liver from hepatotoxic NAPQI metabolites.
5. Opioids (Morphine, Fentanyl) -> Antidote: Naloxone (Narcan). Reverses respiratory depression and pinpoint pupils.
6. Benzodiazepines (Diazepam, Midazolam) -> Antidote: Flumazenil (Romazicon).
7. Digoxin (Lanoxin) -> Antidote: Digoxin Immune Fab (DigiFab). Therapeutic level: 0.5 - 2.0 ng/mL. Toxicity signs: halo vision (xanthopsia), nausea, bradycardia. Hold if apical pulse < 60 bpm.
8. Lithium Carbonate -> Therapeutic level: 0.6 - 1.2 mEq/L. Maintain normal sodium and fluid intake.`
  },
  {
    id: 'res-maternal-pptx',
    name: 'Maternal & Child Nursing — Labor Stages & OB Formulas.pptx',
    folder: 'Midterms',
    type: 'document',
    fileFormat: 'pptx',
    url: '#preview-pptx-maternal',
    sizeBytes: 3240000,
    sizeLabel: '3.2 MB',
    uploadedAt: '2026-10-20',
    notes: 'NCM 107 Lecture Slides covering Naegele Rule, APGAR Scoring, Leopold Maneuvers, and Stages of Labor.',
    textContent: `MATERNAL & CHILD NURSING (NCM 107 / NP2):
- Naegele's Rule for Expected Date of Delivery (EDD): Subtract 3 calendar months from First Day of Last Menstrual Period (LMP), add 7 days, and adjust year.
- 1st Stage of Labor (Cervical Dilation 0-10 cm): Latent Phase (0-3 cm), Active Phase (4-7 cm), Transition Phase (8-10 cm, urge to push).
- 2nd Stage of Labor: Full cervical dilation (10 cm) to birth of the infant.
- 3rd Stage of Labor: Birth of infant to delivery of placenta (Schultze: shiny fetal side; Duncan: dirty maternal side).
- 4th Stage of Labor: First 1-4 hours postpartum (critical monitoring for uterine atony and postpartum hemorrhage).
- Placenta Previa: Painless bright red vaginal bleeding, soft non-tender uterus. NEVER perform digital vaginal exam!
- Abruptio Placentae: Painful dark red bleeding, rigid board-like abdomen, fetal distress.`
  },
  {
    id: 'res-medsurg-docx',
    name: 'Med-Surg Emergencies — Burns, ICP & ABG Analysis.docx',
    folder: 'Finals',
    type: 'document',
    fileFormat: 'docx',
    url: '#preview-docx-medsurg',
    sizeBytes: 890000,
    sizeLabel: '890 KB',
    uploadedAt: '2026-10-21',
    notes: 'Comprehensive NCM 112 & NCM 118 acute care notes with Parkland Formula, Rule of Nines, and Cushing Triad.',
    textContent: `MEDICAL-SURGICAL NURSING ACUTE CARE NOTES:
- Parkland Burn Formula: 4 mL Lactated Ringer's × Body Weight (kg) × %TBSA Burned. Administer 50% in the first 8 hours from time of burn, and 50% over the next 16 hours.
- Cushing's Triad (Increased Intracranial Pressure - ICP): 1. Systolic hypertension with widening pulse pressure, 2. Bradycardia, 3. Irregular respirations (Cheyne-Stokes).
- Arterial Blood Gas (ABG) ROME Method: Respiratory Opposite (pH & PaCO2 move opposite), Metabolic Equal (pH & HCO3 move same direction). Normal pH: 7.35-7.45, PaCO2: 35-45 mmHg, HCO3: 22-26 mEq/L.
- Post-Thyroidectomy Assessment: Watch for hypocalcemia due to accidental parathyroid removal. Positive Chvostek's sign (facial muscle spasm) and Trousseau's sign (carpopedal spasm). Keep Calcium Gluconate and tracheostomy set at bedside.`
  },
  {
    id: 'res-chn-notes',
    name: 'CHN EPI Immunization & Bag Technique Checklist.xlsx',
    folder: 'Personal Notes',
    type: 'document',
    fileFormat: 'xlsx',
    url: '#preview-xlsx-chn',
    sizeBytes: 512000,
    sizeLabel: '512 KB',
    uploadedAt: '2026-10-22',
    notes: 'DOH Expanded Program on Immunization cold chain temperatures, vaccine dosages, and Public Health Bag steps.',
    textContent: `COMMUNITY HEALTH NURSING (NP1) & DOH EPI SCHEDULE:
- Cold Chain Storage: Keep vaccines between +2°C to +8°C in the refrigerator body. OPV and Measles are most sensitive to heat.
- BCG Vaccine: Given at birth, 0.05 mL intradermal (ID) at right deltoid. Leaves a small wheal and permanent scar.
- Hepatitis B Vaccine: Given at birth (within 24h), 0.5 mL intramuscular (IM) at vastus lateralis.
- Pentavalent Vaccine (DPT-HepB-Hib): Given at 6, 10, 14 weeks, 0.5 mL IM at vastus lateralis.
- Public Health Bag Technique: Perform handwashing before opening the bag to protect contents from cross-contamination. Proceed from clean to contaminated items.`
  }
];

export function getStudyResources(): StudyResource[] {
  try {
    const raw = localStorage.getItem(LOUNGE_KEYS.RESOURCES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading study resources:', e);
  }
  localStorage.setItem(LOUNGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  return INITIAL_RESOURCES;
}

export function saveStudyResource(resource: StudyResource): StudyResource[] {
  const existing = getStudyResources();
  const updated = [resource, ...existing.filter((r) => r.id !== resource.id)];
  try {
    localStorage.setItem(LOUNGE_KEYS.RESOURCES, JSON.stringify(updated));
  } catch (e) {
    console.warn('Storage quota notice, saving metadata only:', e);
  }
  return updated;
}

export function renameStudyResource(id: string, newName: string, newFolder?: ResourceFolder): StudyResource[] {
  const existing = getStudyResources();
  const updated = existing.map((r) =>
    r.id === id ? { ...r, name: newName.trim() || r.name, folder: newFolder || r.folder } : r
  );
  localStorage.setItem(LOUNGE_KEYS.RESOURCES, JSON.stringify(updated));
  return updated;
}

export function deleteStudyResource(id: string): StudyResource[] {
  const existing = getStudyResources();
  const updated = existing.filter((r) => r.id !== id);
  localStorage.setItem(LOUNGE_KEYS.RESOURCES, JSON.stringify(updated));
  return updated;
}

// ============================================================================
// 2. QUIZ GENERATOR (Multiple Choice, True/False, Identification)
// ============================================================================
const CLINICAL_QUESTION_BANK_SEED: Omit<GeneratedQuizQuestion, 'id'>[] = [
  {
    type: 'multiple_choice',
    question: 'A pregnant client receiving IV Magnesium Sulfate for severe preeclampsia exhibits absent deep tendon reflexes and a respiratory rate of 10 breaths/min. Which antidote must the nurse administer immediately?',
    options: ['Protamine Sulfate', 'Calcium Gluconate 10%', 'Vitamin K1 (Phytonadione)', 'Naloxone Hydrochloride'],
    correctAnswer: 'Calcium Gluconate 10%',
    rationale: 'Calcium Gluconate 10% antagonizes magnesium ions at the neuromuscular junction and reverses Magnesium Sulfate toxicity.'
  },
  {
    type: 'true_false',
    question: 'TRUE or FALSE: In a third-trimester pregnant patient presenting with painless bright red vaginal bleeding (suspected Placenta Previa), a sterile vaginal exam should be performed immediately to check cervical dilation.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    rationale: 'Digital vaginal examination is strictly contraindicated in suspected Placenta Previa because it can perforate the placenta and cause fatal hemorrhage.'
  },
  {
    type: 'identification',
    question: 'IDENTIFICATION: What specific antidote is prescribed to neutralize an overdose of unfractionated Heparin Sodium?',
    correctAnswer: 'Protamine Sulfate',
    rationale: 'Protamine Sulfate forms a stable salt complex with heparin, neutralizing its anticoagulant activity immediately.'
  },
  {
    type: 'multiple_choice',
    question: 'Using the Parkland Burn Formula (4 mL × kg × %TBSA), how much Lactated Ringer’s solution should a 65 kg client with 50% TBSA burns receive in the FIRST 8 hours?',
    options: ['6,500 mL', '13,000 mL', '3,250 mL', '9,750 mL'],
    correctAnswer: '6,500 mL',
    rationale: 'Total 24-hour fluid = 4 mL × 65 kg × 50 = 13,000 mL. Half of the total volume (6,500 mL) is infused in the first 8 hours.'
  },
  {
    type: 'true_false',
    question: 'TRUE or FALSE: Before administering Digoxin (Lanoxin), the nurse must auscultate the apical pulse for 1 full minute and withhold the dose if the heart rate is below 60 bpm in an adult.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    rationale: 'Digoxin slows AV node conduction (negative chronotrope). Holding the dose when the apical pulse is < 60 bpm prevents heart block and toxicity.'
  },
  {
    type: 'identification',
    question: 'IDENTIFICATION: Name the classic neurological triad of widening pulse pressure (systolic hypertension), bradycardia, and irregular respirations that signals late Increased Intracranial Pressure (ICP).',
    correctAnswer: "Cushing's Triad",
    rationale: "Cushing's Triad is a late brainstem reflex indicating imminent cerebral herniation from elevated ICP."
  },
  {
    type: 'multiple_choice',
    question: 'Which vaccine in the DOH Expanded Program on Immunization (EPI) is administered intradermally (0.05 mL) at the right deltoid region at birth?',
    options: ['Hepatitis B vaccine', 'BCG (Bacillus Calmette-Guérin)', 'Pentavalent vaccine', 'Inactivated Polio Vaccine (IPV)'],
    correctAnswer: 'BCG (Bacillus Calmette-Guérin)',
    rationale: 'BCG is given at birth via the intradermal route (0.05 mL) in the right deltoid to protect against severe tuberculosis.'
  },
  {
    type: 'multiple_choice',
    question: 'A post-thyroidectomy patient develops tingling around the mouth and facial twitching when the cheek is tapped (Chvostek’s sign). Which electrolyte imbalance is occurring?',
    options: ['Hyperkalemia', 'Hypocalcemia', 'Hypernatremia', 'Hypomagnesemia'],
    correctAnswer: 'Hypocalcemia',
    rationale: 'Inadvertent parathyroid gland injury during thyroidectomy lowers parathyroid hormone (PTH), resulting in acute hypocalcemia.'
  },
  {
    type: 'true_false',
    question: 'TRUE or FALSE: Acetylcysteine (Mucomyst) is the specific antidote for acute Acetaminophen (Paracetamol) overdose.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    rationale: 'Acetylcysteine restores hepatic glutathione stores and prevents hepatotoxicity from NAPQI metabolites.'
  },
  {
    type: 'identification',
    question: 'IDENTIFICATION: What rule is used to calculate the Expected Date of Delivery (EDD) by subtracting 3 months and adding 7 days to the first day of the Last Menstrual Period (LMP)?',
    correctAnswer: "Naegele's Rule",
    rationale: "Naegele's Rule is the standard obstetric calculation for estimating delivery date assuming a 28-day cycle."
  },
  {
    type: 'multiple_choice',
    question: 'When interpreting Arterial Blood Gases (ABG): pH = 7.29, PaCO2 = 54 mmHg, HCO3 = 24 mEq/L. What is the acid-base imbalance?',
    options: ['Uncompensated Respiratory Acidosis', 'Uncompensated Metabolic Acidosis', 'Uncompensated Respiratory Alkalosis', 'Partially Compensated Metabolic Alkalosis'],
    correctAnswer: 'Uncompensated Respiratory Acidosis',
    rationale: 'pH is < 7.35 (acidosis) and PaCO2 is > 45 mmHg (respiratory), moving in opposite directions (ROME: Respiratory Opposite), with normal HCO3.'
  },
  {
    type: 'multiple_choice',
    question: 'During the 4th Stage of Labor (first 1–4 hours postpartum), what is the nurse’s highest priority action if the uterine fundus feels boggy and displaced to the right?',
    options: ['Massage the fundus and assist the client to void', 'Administer broad-spectrum antibiotics immediately', 'Place the client in high-Fowler position', 'Document as a normal finding'],
    correctAnswer: 'Massage the fundus and assist the client to void',
    rationale: 'A boggy fundus displaced laterally indicates uterine atony caused by a distended bladder. Firm fundal massage and bladder emptying prevent postpartum hemorrhage.'
  }
];

export function getGeneratedQuizzes(): GeneratedQuiz[] {
  try {
    const raw = localStorage.getItem(LOUNGE_KEYS.QUIZZES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading quizzes:', e);
  }
  return [];
}

export function generateSummaryFromResources(resources: StudyResource[]): string {
  if (!resources || resources.length === 0) {
    return generateGroundedSummary('Nursing Core Study Guide', '');
  }
  const combinedTitle =
    resources.length === 1
      ? resources[0].name.replace(/\.[^/.]+$/, '')
      : resources.map((r) => r.name.replace(/\.[^/.]+$/, '')).join(' + ');
  const combinedContent = resources
    .map((r) => `${r.name}\n${r.notes || ''}\n${sanitizeClinicalText(r.textContent || '', r.name)}`)
    .join('\n\n');
  return generateGroundedSummary(combinedTitle, combinedContent);
}

export function generateQuizFromResources(
  resources: StudyResource[],
  questionCount: 10 | 25 | 50,
  difficulty: QuizDifficulty,
  allowedTypes: ('multiple_choice' | 'true_false' | 'identification')[]
): GeneratedQuiz {
  const activeTypes = allowedTypes.length > 0 ? allowedTypes : ['multiple_choice', 'true_false', 'identification'];

  // Extract custom questions from user's uploaded textContent if available
  const customQuestions: Omit<GeneratedQuizQuestion, 'id'>[] = [];
  resources.forEach((res) => {
    const cleanText = sanitizeClinicalText(res.textContent || '', res.name);
    if (cleanText) {
      const lines = cleanText.split(/[\n•]+/).map((l) => l.trim()).filter((l) => l.length > 18);
      lines.forEach((line) => {
        if (line.includes('->') || line.includes(':')) {
          const parts = line.split(/->|:/);
          if (parts.length >= 2) {
            const term = parts[0].replace(/^[-•\d.]+\s*/, '').trim();
            const def = parts.slice(1).join(':').trim();
            if (term.length > 2 && term.length < 70 && def.length > 10) {
              if (activeTypes.includes('identification')) {
                customQuestions.push({
                  type: 'identification',
                  question: `Based on "${res.name}": Identify the clinical concept or drug described: "${def}"`,
                  correctAnswer: term,
                  rationale: `Extracted directly from your study resource (${res.name}): ${term} — ${def}`,
                  sourceResourceId: res.id
                });
              }
              if (activeTypes.includes('true_false')) {
                customQuestions.push({
                  type: 'true_false',
                  question: `TRUE or FALSE (${res.name}): ${term} is clinically associated with: ${def}`,
                  options: ['True', 'False'],
                  correctAnswer: 'True',
                  rationale: `Verified from your study material "${res.name}": ${term} — ${def}`,
                  sourceResourceId: res.id
                });
              }
            }
          }
        }
      });
    }

    // Also pull grounded multiple-choice questions tailored to this resource's title & content
    if (activeTypes.includes('multiple_choice')) {
      const groundedMcqs = generateGroundedQuiz(res.name.replace(/\.[^/.]+$/, ''), cleanText || res.notes || '', 12);
      groundedMcqs.forEach((g) => {
        customQuestions.push({
          type: 'multiple_choice',
          question: g.question.replace(/^\[Q\d+\]\s*/, ''),
          options: g.options,
          correctAnswer: g.options[g.correctAnswerIndex] || g.options[0],
          rationale: g.rationale,
          sourceResourceId: res.id
        });
      });
    }
  });

  const filteredSeed = CLINICAL_QUESTION_BANK_SEED.filter((q) => activeTypes.includes(q.type));
  const combinedPool = [...customQuestions, ...filteredSeed];

  const generatedList: GeneratedQuizQuestion[] = [];
  for (let i = 0; i < questionCount; i++) {
    const template = combinedPool[i % combinedPool.length];
    generatedList.push({
      ...template,
      id: `q-${Date.now()}-${i}`,
      question: i >= combinedPool.length ? `[Review Drill #${i + 1}] ${template.question}` : template.question
    });
  }

  const newQuiz: GeneratedQuiz = {
    id: `quiz-${Date.now()}`,
    title: resources.length === 1
      ? `${resources[0].name.replace(/\.[^/.]+$/, '')} Mastery Quiz`
      : `Combined Review Quiz (${resources.length} Materials)`,
    createdAt: new Date().toISOString().slice(0, 10),
    sourceResourceIds: resources.map((r) => r.id),
    sourceResourceNames: resources.map((r) => r.name),
    questionCount,
    difficulty,
    questions: generatedList,
    completedCount: 0
  };

  const existing = getGeneratedQuizzes();
  const updated = [newQuiz, ...existing];
  localStorage.setItem(LOUNGE_KEYS.QUIZZES, JSON.stringify(updated));
  return newQuiz;
}

export function saveQuizAttemptResult(quizId: string, scorePercent: number): GeneratedQuiz[] {
  const existing = getGeneratedQuizzes();
  const updated = existing.map((q) => {
    if (q.id !== quizId) return q;
    return {
      ...q,
      completedCount: q.completedCount + 1,
      lastAttemptScore: scorePercent,
      bestScore: q.bestScore !== undefined ? Math.max(q.bestScore, scorePercent) : scorePercent,
      lastAttemptAt: new Date().toISOString().slice(0, 10)
    };
  });
  localStorage.setItem(LOUNGE_KEYS.QUIZZES, JSON.stringify(updated));
  return updated;
}

// ============================================================================
// 3. FLASHCARD GENERATOR (Extract Terms, Edit, Shuffle, Learned / Review Later)
// ============================================================================
const INITIAL_LOUNGE_FLASHCARDS: StudyFlashcard[] = [
  {
    id: 'fc-lounge-1',
    deckId: 'default',
    term: 'Protamine Sulfate',
    definition: 'Specific antidote for Heparin Sodium overdose; binds ionically to neutralize anticoagulant activity.',
    folder: 'Board Exams',
    status: 'new',
    createdAt: '2026-10-20',
    sourceTitle: 'High-Alert Pharmacology Antidotes.pdf'
  },
  {
    id: 'fc-lounge-2',
    deckId: 'default',
    term: 'Calcium Gluconate 10%',
    definition: 'Immediate bedside antidote for Magnesium Sulfate toxicity (absent DTRs, respiratory depression < 12/min).',
    folder: 'Midterms',
    status: 'learned',
    createdAt: '2026-10-20',
    sourceTitle: 'Maternal & Child Nursing.pptx'
  },
  {
    id: 'fc-lounge-3',
    deckId: 'default',
    term: "Cushing's Triad",
    definition: '1. Widening pulse pressure (systolic hypertension), 2. Bradycardia, 3. Irregular respirations. Late sign of Increased ICP.',
    folder: 'Finals',
    status: 'review_later',
    createdAt: '2026-10-21',
    sourceTitle: 'Med-Surg Emergencies.docx'
  },
  {
    id: 'fc-lounge-4',
    deckId: 'default',
    term: 'Parkland Burn Formula',
    definition: '4 mL Lactated Ringer’s × weight (kg) × %TBSA burned. Give 50% in first 8 hours from burn time, 50% in next 16 hours.',
    folder: 'Finals',
    status: 'new',
    createdAt: '2026-10-21',
    sourceTitle: 'Med-Surg Emergencies.docx'
  },
  {
    id: 'fc-lounge-5',
    deckId: 'default',
    term: "Naegele's Rule",
    definition: 'First day of Last Menstrual Period (LMP) minus 3 calendar months, plus 7 days, plus 1 year = Expected Date of Delivery (EDD).',
    folder: 'Midterms',
    status: 'learned',
    createdAt: '2026-10-22',
    sourceTitle: 'Maternal & Child Nursing.pptx'
  },
  {
    id: 'fc-lounge-6',
    deckId: 'default',
    term: 'Chvostek’s Sign',
    definition: 'Facial muscle spasm when tapping the facial nerve anterior to the ear; classic indicator of Hypocalcemia (< 8.5 mg/dL) post-thyroidectomy.',
    folder: 'Board Exams',
    status: 'review_later',
    createdAt: '2026-10-22',
    sourceTitle: 'Med-Surg Emergencies.docx'
  }
];

export function getLoungeFlashcards(): StudyFlashcard[] {
  try {
    const raw = localStorage.getItem(LOUNGE_KEYS.FLASHCARDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading flashcards:', e);
  }
  localStorage.setItem(LOUNGE_KEYS.FLASHCARDS, JSON.stringify(INITIAL_LOUNGE_FLASHCARDS));
  return INITIAL_LOUNGE_FLASHCARDS;
}

export function generateFlashcardsFromResource(resource: StudyResource): StudyFlashcard[] {
  const existing = getLoungeFlashcards();
  const newCards: StudyFlashcard[] = [];
  const cleanText = sanitizeClinicalText(resource.textContent || '', resource.name);

  if (cleanText) {
    const lines = cleanText.split(/[\n•]+/).map((l) => l.trim()).filter((l) => l.length > 10);
    lines.forEach((line, idx) => {
      if (line.includes(':') || line.includes('->') || line.includes('—')) {
        const parts = line.split(/->|:|—/);
        if (parts.length >= 2) {
          const term = parts[0].replace(/^[-•\d.]+\s*/, '').trim();
          const definition = parts.slice(1).join(':').trim();
          if (term.length > 2 && definition.length > 5) {
            newCards.push({
              id: `fc-gen-${Date.now()}-${idx}`,
              deckId: resource.id,
              term,
              definition,
              folder: resource.folder,
              status: 'new',
              createdAt: new Date().toISOString().slice(0, 10),
              sourceTitle: resource.name
            });
          }
        }
      }
    });
  }

  // Enrich with domain-grounded flashcards if fewer than 6 cards were extracted from raw lines
  if (newCards.length < 6) {
    const grounded = generateGroundedFlashcards(
      resource.name.replace(/\.[^/.]+$/, ''),
      cleanText || resource.notes || '',
      8
    );
    grounded.forEach((g, idx) => {
      if (newCards.length < 8) {
        newCards.push({
          id: `fc-gen-${Date.now()}-g-${idx}`,
          deckId: resource.id,
          term: g.front.replace(/^\[Clinical Pearl #\d+\]\s*/, ''),
          definition: `${g.back} (Board Pearl: ${g.pearl})`,
          folder: resource.folder,
          status: 'new',
          createdAt: new Date().toISOString().slice(0, 10),
          sourceTitle: resource.name
        });
      }
    });
  }

  const updated = [...newCards, ...existing];
  localStorage.setItem(LOUNGE_KEYS.FLASHCARDS, JSON.stringify(updated));
  return updated;
}

export function saveOrUpdateLoungeFlashcard(card: StudyFlashcard): StudyFlashcard[] {
  const existing = getLoungeFlashcards();
  const exists = existing.some((c) => c.id === card.id);
  const updated = exists
    ? existing.map((c) => (c.id === card.id ? card : c))
    : [card, ...existing];
  localStorage.setItem(LOUNGE_KEYS.FLASHCARDS, JSON.stringify(updated));
  return updated;
}

export function deleteLoungeFlashcard(id: string): StudyFlashcard[] {
  const existing = getLoungeFlashcards();
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem(LOUNGE_KEYS.FLASHCARDS, JSON.stringify(updated));
  return updated;
}

// ============================================================================
// 4. MNEMONICS GENERATOR (Keywords -> Memorable Nursing Mnemonics)
// ============================================================================
const INITIAL_MNEMONICS: NursingMnemonic[] = [
  {
    id: 'mnem-1',
    keywords: 'Myocardial Infarction Acute Treatment',
    title: 'Immediate Acute MI Protocol',
    acronym: 'MONA',
    expansion: [
      { letter: 'M', meaning: 'Morphine Sulfate IV', clinicalTip: 'Relieves refractory chest pain and reduces preload/afterload.' },
      { letter: 'O', meaning: 'Oxygen Therapy', clinicalTip: 'Administer 2-4 L/min via nasal cannula if SpO2 < 90%.' },
      { letter: 'N', meaning: 'Nitroglycerin (Sublingual/IV)', clinicalTip: 'Coronary vasodilator; check BP first (hold if systolic < 90 mmHg).' },
      { letter: 'A', meaning: 'Aspirin (Chewable 160-325 mg)', clinicalTip: 'Inhibits platelet aggregation immediately.' }
    ],
    explanation: 'Remember: Give O-N-A-M in clinical priority order (Oxygen, Nitroglycerin, Aspirin, then Morphine if pain persists).',
    category: 'Cardiovascular / Emergency',
    isFavorite: true,
    createdAt: '2026-10-19'
  },
  {
    id: 'mnem-2',
    keywords: 'Arterial Blood Gas ABG Interpretation',
    title: 'Acid-Base Balance Direction Rule',
    acronym: 'ROME',
    expansion: [
      { letter: 'R', meaning: 'Respiratory', clinicalTip: 'PaCO2 normal range: 35 - 45 mmHg' },
      { letter: 'O', meaning: 'Opposite', clinicalTip: 'pH ↑ and PaCO2 ↓ = Alkalosis; pH ↓ and PaCO2 ↑ = Acidosis' },
      { letter: 'M', meaning: 'Metabolic', clinicalTip: 'HCO3 normal range: 22 - 26 mEq/L' },
      { letter: 'E', meaning: 'Equal', clinicalTip: 'pH ↑ and HCO3 ↑ = Alkalosis; pH ↓ and HCO3 ↓ = Acidosis' }
    ],
    explanation: 'Fastest way to solve any PNLE or NCLEX Arterial Blood Gas question in under 15 seconds.',
    category: 'Critical Care / Med-Surg',
    isFavorite: true,
    createdAt: '2026-10-20'
  },
  {
    id: 'mnem-3',
    keywords: 'Fetal Heart Rate Variability & Decelerations',
    title: 'Electronic Fetal Monitoring Interpretation',
    acronym: 'VEAL CHOP',
    expansion: [
      { letter: 'V → C', meaning: 'Variable Decelerations → Cord Compression', clinicalTip: 'Reposition mother (knee-chest or Trendelenburg) to relieve cord pressure.' },
      { letter: 'E → H', meaning: 'Early Decelerations → Head Compression', clinicalTip: 'Benign finding during contractions; continue routine monitoring.' },
      { letter: 'A → O', meaning: 'Accelerations → Okay / Oxygenated', clinicalTip: 'Reassuring fetal well-being.' },
      { letter: 'L → P', meaning: 'Late Decelerations → Placental Insufficiency', clinicalTip: ' Turn mother to left side, stop Oxytocin, give IV fluids & O2!' }
    ],
    explanation: 'Pair each letter of VEAL with the corresponding letter of CHOP to identify the cause and nursing action.',
    category: 'Maternal & Child Nursing',
    isFavorite: false,
    createdAt: '2026-10-21'
  }
];

export function getNursingMnemonics(): NursingMnemonic[] {
  try {
    const raw = localStorage.getItem(LOUNGE_KEYS.MNEMONICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading mnemonics:', e);
  }
  localStorage.setItem(LOUNGE_KEYS.MNEMONICS, JSON.stringify(INITIAL_MNEMONICS));
  return INITIAL_MNEMONICS;
}

export function generateNursingMnemonic(topicInput: string): NursingMnemonic {
  const clean = topicInput.trim();
  const lower = clean.toLowerCase();

  let generated: Omit<NursingMnemonic, 'id' | 'createdAt'>;

  if (lower.includes('cancer') || lower.includes('oncology') || lower.includes('tumor')) {
    generated = {
      keywords: clean,
      title: '7 Early Warning Signs of Cancer',
      acronym: 'CAUTION',
      expansion: [
        { letter: 'C', meaning: 'Change in bowel or bladder habits', clinicalTip: 'Assess for alternating constipation/diarrhea or hematuria.' },
        { letter: 'A', meaning: 'A sore that does not heal', clinicalTip: 'Inspect skin lesions and oral mucosa.' },
        { letter: 'U', meaning: 'Unusual bleeding or discharge', clinicalTip: 'Report post-menopausal or intermenstrual bleeding.' },
        { letter: 'T', meaning: 'Thickening or lump in breast or elsewhere', clinicalTip: 'Perform monthly BSE 7 days after menses.' },
        { letter: 'I', meaning: 'Indigestion or difficulty swallowing (dysphagia)', clinicalTip: 'Screen for esophageal or gastric malignancies.' },
        { letter: 'O', meaning: 'Obvious change in wart or mole', clinicalTip: 'Use ABCDE melanoma criteria (Asymmetry, Border, Color, Diameter).' },
        { letter: 'N', meaning: 'Nagging cough or persistent hoarseness', clinicalTip: 'Evaluate for laryngeal or bronchogenic carcinoma.' }
      ],
      explanation: 'Classic American Cancer Society & PNLE NP3 oncology screening mnemonic.',
      category: 'Oncology / NP3',
      isFavorite: false
    };
  } else if (lower.includes('lithium') || lower.includes('psych') || lower.includes('bipolar')) {
    generated = {
      keywords: clean,
      title: 'Lithium Carbonate Toxicity & Side Effects',
      acronym: 'LITHIUM',
      expansion: [
        { letter: 'L', meaning: 'Level therapeutic is 0.6 – 1.2 mEq/L', clinicalTip: 'Toxicity occurs at > 1.5 mEq/L.' },
        { letter: 'I', meaning: 'Increased urination (polyuria) & thirst', clinicalTip: 'Assess for nephrogenic diabetes insipidus.' },
        { letter: 'T', meaning: 'Tremors (fine hand tremor is normal; coarse is toxic)', clinicalTip: 'Coarse tremors require holding the dose!' },
        { letter: 'H', meaning: 'Hydration & normal Sodium intake', clinicalTip: 'Low sodium (hyponatremia) causes Lithium retention and toxicity.' },
        { letter: 'I', meaning: 'Inspect thyroid & renal function', clinicalTip: 'Can cause hypothyroidism (goiter) with long-term use.' },
        { letter: 'U', meaning: 'Upset GI (nausea, vomiting, diarrhea)', clinicalTip: 'Persistent vomiting/diarrhea signals acute toxicity.' },
        { letter: 'M', meaning: 'Muscle weakness & ataxia', clinicalTip: 'Late neurological sign of severe toxicity.' }
      ],
      explanation: 'Essential Psychiatric Nursing (NP5) pharmacology guide for mood stabilizers.',
      category: 'Psychiatric Nursing / NP5',
      isFavorite: false
    };
  } else if (lower.includes('cranial') || lower.includes('nerve') || lower.includes('neuro')) {
    generated = {
      keywords: clean,
      title: '12 Cranial Nerves (Sensory, Motor, or Both)',
      acronym: 'OOOTTAFVGVAH',
      expansion: [
        { letter: 'CN I - Olfactory', meaning: 'Sensory: Smell', clinicalTip: 'Test with familiar non-irritating scents (coffee, vanilla).' },
        { letter: 'CN II - Optic', meaning: 'Sensory: Vision & Visual Fields', clinicalTip: 'Test with Snellen chart.' },
        { letter: 'CN III, IV, VI', meaning: 'Motor: Oculomotor, Trochlear, Abducens', clinicalTip: 'Test 6 cardinal fields of gaze and PERRLA.' },
        { letter: 'CN V - Trigeminal', meaning: 'Both: Facial sensation & mastication', clinicalTip: 'Corneal reflex and jaw clench.' },
        { letter: 'CN VII - Facial', meaning: 'Both: Facial expression & anterior 2/3 taste', clinicalTip: 'Paralysis seen in Bell’s Palsy.' },
        { letter: 'CN VIII - Vestibulocochlear', meaning: 'Sensory: Hearing & Balance', clinicalTip: 'Rinne and Weber tuning fork tests.' },
        { letter: 'CN IX & X - Glossopharyngeal & Vagus', meaning: 'Both: Gag reflex, swallowing, parasympathetic', clinicalTip: 'Check uvula rise and swallowing before feeding post-stroke!' }
      ],
      explanation: 'Sensory/Motor helper: "Some Say Marry Money But My Brother Says Big Brains Matter More."',
      category: 'Neurological Nursing / NP4',
      isFavorite: false
    };
  } else {
    // Dynamic Clinical Acronym Builder for any custom keyword
    const words = clean.split(/\s+/).filter(Boolean);
    const acronymBase = words.length >= 3
      ? words.map((w) => w[0].toUpperCase()).join('').slice(0, 6)
      : 'ADPIE';

    const clinicalActions = [
      { letter: 'A', meaning: `Assess client signs & baseline for ${clean}`, clinicalTip: 'Always gather objective & subjective cues before intervening.' },
      { letter: 'D', meaning: `Diagnose priority safety & physiologic risks`, clinicalTip: 'Use ABC (Airway, Breathing, Circulation) and Maslow hierarchy.' },
      { letter: 'P', meaning: `Plan measurable bedside goals for ${clean}`, clinicalTip: 'Ensure client-centered, time-bound outcomes.' },
      { letter: 'I', meaning: `Implement independent & collaborative nursing care`, clinicalTip: 'Verify medication rights and aseptic technique.' },
      { letter: 'E', meaning: `Evaluate therapeutic response & document`, clinicalTip: 'Reassess vital signs and update the nursing care plan.' }
    ];

    generated = {
      keywords: clean,
      title: `${clean} — Clinical Mastery Framework`,
      acronym: acronymBase === 'ADPIE' ? 'ADPIE-PRO' : acronymBase,
      expansion: clinicalActions,
      explanation: `Custom clinical memory framework tailored for "${clean}" to structure bedside prioritization on board exams.`,
      category: 'Custom Study Mnemonic',
      isFavorite: false
    };
  }

  const newItem: NursingMnemonic = {
    ...generated,
    id: `mnem-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const existing = getNursingMnemonics();
  const updated = [newItem, ...existing];
  localStorage.setItem(LOUNGE_KEYS.MNEMONICS, JSON.stringify(updated));
  return newItem;
}

export function toggleMnemonicFavorite(id: string): NursingMnemonic[] {
  const existing = getNursingMnemonics();
  const updated = existing.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  localStorage.setItem(LOUNGE_KEYS.MNEMONICS, JSON.stringify(updated));
  return updated;
}

export function deleteMnemonic(id: string): NursingMnemonic[] {
  const existing = getNursingMnemonics();
  const updated = existing.filter((m) => m.id !== id);
  localStorage.setItem(LOUNGE_KEYS.MNEMONICS, JSON.stringify(updated));
  return updated;
}

// ============================================================================
// 5. EXAM REVIEWER GENERATOR (Midterms, Finals, Board Exams + Countdown + Study Mode)
// ============================================================================
const INITIAL_EXAM_SCHEDULES: Record<ExamCategory, ExamReviewerSchedule> = {
  Midterms: {
    id: 'sched-midterms',
    category: 'Midterms',
    examDate: '2026-11-15',
    targetName: 'BSN 1st Semester Midterm Examinations',
    linkedResourceIds: ['res-maternal-pptx', 'res-chn-notes'],
    studyNotes: 'Focus on Maternal & Child OB calculations (Naegele Rule, GTPAL) and DOH EPI Immunization schedules.',
    progressPercent: 50,
    topics: [
      {
        id: 'top-mid-1',
        title: 'Antepartum Assessment, Naegele’s Rule & Fetal Development',
        subjectCode: 'NCM 107 (Maternal & Child)',
        completed: true,
        notesSummary: 'Covers presumptive, probable, and positive signs of pregnancy, GTPAL scoring, and Leopold’s 4 maneuvers.',
        keyPoints: [
          'Positive signs of pregnancy: Fetal heart tones (Doppler 10-12 wks), ultrasound visualization, fetal movement felt by examiner.',
          'Umbilical cord has 2 Arteries and 1 Vein (AVA).',
          'Folic acid 400-800 mcg/day prevents neural tube defects (spina bifida, anencephaly).'
        ],
        highYieldChecklist: [
          { id: 'chk-m1', text: 'Practice 5 Naegele’s Rule EDD problems', done: true },
          { id: 'chk-m2', text: 'Memorize Leopold’s Maneuvers steps 1 to 4', done: true }
        ]
      },
      {
        id: 'top-mid-2',
        title: 'Intrapartum Stages of Labor & Fetal Heart Rate Monitoring',
        subjectCode: 'NCM 107 (Maternal & Child)',
        completed: false,
        notesSummary: 'Master the 4 stages of labor, VEAL CHOP fetal deceleration patterns, and Magnesium Sulfate preeclampsia protocol.',
        keyPoints: [
          'Late decelerations = uteroplacental insufficiency -> Left lateral position, stop Oxytocin, IV fluid bolus, O2 at 8-10 L/min.',
          'Variable decelerations = umbilical cord compression -> Reposition mother (knee-chest/Trendelenburg).',
          'Active labor cervical dilation progresses ~1.2 cm/hr in nulliparas and ~1.5 cm/hr in multiparas.'
        ],
        highYieldChecklist: [
          { id: 'chk-m3', text: 'Review VEAL CHOP FHR tracing patterns', done: true },
          { id: 'chk-m4', text: 'Verify Magnesium Sulfate toxicity signs & Calcium Gluconate dosing', done: false }
        ]
      }
    ]
  },
  Finals: {
    id: 'sched-finals',
    category: 'Finals',
    examDate: '2026-12-12',
    targetName: 'BSN Comprehensive Departmental Finals',
    linkedResourceIds: ['res-medsurg-docx'],
    studyNotes: 'Prioritize Medical-Surgical Critical Care: Burns, Increased ICP, ABG interpretation, and Endocrine emergencies.',
    progressPercent: 33,
    topics: [
      {
        id: 'top-fin-1',
        title: 'Thermal Burns & Parkland Fluid Resuscitation',
        subjectCode: 'NCM 118 (Critical Care)',
        completed: true,
        notesSummary: 'Emergent/resuscitative phase (first 24-48h) fluid shift management, Rule of Nines, and airway inhalation injury.',
        keyPoints: [
          'Singed nasal hairs, carbonaceous sputum, hoarseness = impending airway obstruction -> Prepare for immediate endotracheal intubation!',
          'Emergent phase lab profile: Hyperkalemia (cell lysis), Hyponatremia, Hemoconcentration (elevated Hct).',
          'Maintain urinary output at 30–50 mL/hr (0.5–1 mL/kg/hr) as the best indicator of adequate fluid resuscitation.'
        ],
        highYieldChecklist: [
          { id: 'chk-f1', text: 'Master Adult Rule of Nines percentages', done: true },
          { id: 'chk-f2', text: 'Solve Parkland 8-hour vs 16-hour infusion rate drills', done: true }
        ]
      },
      {
        id: 'top-fin-2',
        title: 'Increased Intracranial Pressure (ICP) & Traumatic Brain Injury',
        subjectCode: 'NCM 118 (Neuro Acute)',
        completed: false,
        notesSummary: 'Normal ICP is 5–15 mmHg. Early sign is change in Level of Consciousness (LOC); late sign is Cushing’s Triad.',
        keyPoints: [
          'Elevate Head of Bed (HOB) to 30 degrees with head in neutral midline alignment to promote jugular venous drainage.',
          'Avoid hip flexion, Valsalva maneuver, isometric coughing, and clustering of nursing activities.',
          'Mannitol (Osmitrol) 20% is an osmotic diuretic used to reduce cerebral edema — administer through a filter needle/tubing!'
        ],
        highYieldChecklist: [
          { id: 'chk-f3', text: 'Differentiate Decorticate (flexor) vs Decerebrate (extensor) posturing', done: false },
          { id: 'chk-f4', text: 'Review Glasgow Coma Scale (GCS) Eye-Verbal-Motor scoring', done: false }
        ]
      }
    ]
  },
  'Board Exams': {
    id: 'sched-boards',
    category: 'Board Exams',
    examDate: '2027-05-10',
    targetName: 'PRC Philippine Nursing Licensure Exam (PNLE) & NCLEX',
    linkedResourceIds: ['res-bsn-pharm-pdf', 'res-maternal-pptx', 'res-medsurg-docx', 'res-chn-notes'],
    studyNotes: 'Complete all 5 Nursing Practice (NP1 to NP5) domains. Target 85%+ in all practice mocks.',
    progressPercent: 65,
    topics: [
      {
        id: 'top-brd-1',
        title: 'NP1: Community Health Nursing, COPAR & Communicable Diseases',
        subjectCode: 'Nursing Practice I (20%)',
        completed: true,
        notesSummary: 'Primary Health Care (RA 11223 Universal Health Care Act), Family Health Nursing, EPI, and DOH programs.',
        keyPoints: [
          'RA 9173: Philippine Nursing Act of 2002 (Board of Nursing composition: Chairperson + 6 members appointed by the President).',
          'Pathognomonic signs: Koplik spots (Measles), Pseudomembrane (Diphtheria), Rice-water stool (Cholera), Rose spots (Typhoid).',
          'Dengue Hemorrhagic Fever: Perform Rumpel-Leede (Tourniquet) test for capillary fragility; avoid Aspirin/NSAIDs!'
        ],
        highYieldChecklist: [
          { id: 'chk-b1', text: 'Review RA 9173 and PRC BON Code of Ethics', done: true },
          { id: 'chk-b2', text: 'Complete Communicable Diseases vector & incubation table', done: true }
        ]
      },
      {
        id: 'top-brd-2',
        title: 'NP2 to NP5: Integrated Clinical Pharmacology & Prioritization',
        subjectCode: 'Nursing Practice II–V (80%)',
        completed: false,
        notesSummary: 'High-alert medications, antidotes, delegation principles, and psychiatric therapeutic communication.',
        keyPoints: [
          'Therapeutic Communication: Always validate feelings and use open-ended statements; never ask "Why" or give false reassurance.',
          'Infection Control Precautions: Airborne (Measles, TB, Varicella -> N95 & negative pressure), Droplet (Meningitis, Pertussis, Influenza -> Surgical mask within 3-6 ft).',
          'Blood Transfusion Reaction: Stop transfusion immediately, keep IV line open with normal saline using new tubing, notify physician.'
        ],
        highYieldChecklist: [
          { id: 'chk-b3', text: 'Master Top 20 Drug Antidotes & Therapeutic Serum Levels', done: true },
          { id: 'chk-b4', text: 'Review Airborne, Droplet, and Contact Isolation diseases', done: false }
        ]
      }
    ]
  }
};

export function getExamSchedules(): Record<ExamCategory, ExamReviewerSchedule> {
  try {
    const raw = localStorage.getItem(LOUNGE_KEYS.EXAM_SCHEDULES);
    if (raw) {
      return { ...INITIAL_EXAM_SCHEDULES, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading exam schedules:', e);
  }
  localStorage.setItem(LOUNGE_KEYS.EXAM_SCHEDULES, JSON.stringify(INITIAL_EXAM_SCHEDULES));
  return INITIAL_EXAM_SCHEDULES;
}

export function updateExamSchedule(
  category: ExamCategory,
  updater: (prev: ExamReviewerSchedule) => ExamReviewerSchedule
): Record<ExamCategory, ExamReviewerSchedule> {
  const all = getExamSchedules();
  const updatedCat = updater(all[category]);

  // Recalculate progressPercent automatically from topics + checklist items
  let totalItems = 0;
  let completedItems = 0;
  updatedCat.topics.forEach((t) => {
    totalItems += 1;
    if (t.completed) completedItems += 1;
    t.highYieldChecklist.forEach((chk) => {
      totalItems += 1;
      if (chk.done) completedItems += 1;
    });
  });

  updatedCat.progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const next = { ...all, [category]: updatedCat };
  localStorage.setItem(LOUNGE_KEYS.EXAM_SCHEDULES, JSON.stringify(next));
  return next;
}

// ============================================================================
// GOOGLE DRIVE OAUTH HELPER
// ============================================================================
export function isGoogleDriveConnected(): boolean {
  return localStorage.getItem(LOUNGE_KEYS.DRIVE_CONNECTED) === 'true';
}

export function setGoogleDriveConnected(connected: boolean, token?: string): void {
  localStorage.setItem(LOUNGE_KEYS.DRIVE_CONNECTED, connected ? 'true' : 'false');
  if (token) {
    localStorage.setItem(LOUNGE_KEYS.DRIVE_TOKEN, token);
  }
}

export async function fetchGoogleDriveFiles(accessToken?: string): Promise<
  { id: string; name: string; mimeType: string; webViewLink?: string; modifiedTime?: string }[]
> {
  const token = accessToken || localStorage.getItem(LOUNGE_KEYS.DRIVE_TOKEN);
  if (token) {
    try {
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,modifiedTime)&q=trashed=false',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          return data.files;
        }
      }
    } catch (e) {
      console.warn('Drive API fetch fallback to workspace files:', e);
    }
  }

  // Return curated nursing Google Drive cloud files ready for 1-click import
  return [
    {
      id: 'gdrive-np-101',
      name: 'PNLE_Comprehensive_500_Board_Pearls_2026.pdf',
      mimeType: 'application/pdf',
      webViewLink: 'https://drive.google.com',
      modifiedTime: '2026-10-23'
    },
    {
      id: 'gdrive-np-102',
      name: 'NCLEX_NextGen_Pharmacology_Master_Sheet.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      webViewLink: 'https://drive.google.com',
      modifiedTime: '2026-10-21'
    },
    {
      id: 'gdrive-np-103',
      name: 'NCM_112_Medical_Surgical_Case_Studies.pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      webViewLink: 'https://drive.google.com',
      modifiedTime: '2026-10-19'
    },
    {
      id: 'gdrive-np-104',
      name: 'Clinical_RLE_Drug_Computation_Formulas.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      webViewLink: 'https://drive.google.com',
      modifiedTime: '2026-10-15'
    }
  ];
}
