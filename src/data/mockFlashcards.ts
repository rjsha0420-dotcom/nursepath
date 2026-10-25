import { Flashcard } from '../types';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    deckId: 'deck-pharm',
    category: 'High-Alert Pharmacology',
    front: 'What is the absolute antidote for Heparin overdose, and what is its maximum IV single dose?',
    back: 'Protamine Sulfate (1 mg neutralizes ~100 USP units of heparin). Maximum single dose is 50 mg given by slow IV push over 10 minutes to avoid severe hypotension or bradycardia.',
    pearl: 'High-yield board pearl: 1 mg Protamine per 100 units heparin. Keep bedside ready in cath labs and cardiac units.',
    evidenceLevel: 'Level I (Systematic Review)',
    reps: 2,
    interval: 6,
    easeFactor: 2.5,
    dueDate: new Date(Date.now() - 3600000).toISOString(),
    tags: ['Pharmacology', 'Antidote', 'Safety']
  },
  {
    id: 'fc-2',
    deckId: 'deck-pharm',
    category: 'High-Alert Pharmacology',
    front: 'What are the classic early toxic signs of Digoxin (Lanoxin), and what serum electrolyte imbalance severely potentiates this toxicity?',
    back: 'Early signs: GI symptoms (anorexia, nausea, vomiting, abdominal discomfort), followed by neurological/visual disturbances (yellow-green halos, blurred vision). Hypokalemia (< 3.5 mEq/L) potentiates toxicity because digoxin binds competitively to the Na+/K+ ATPase pump.',
    pearl: 'Always check apical pulse for 1 full minute (hold if < 60 bpm in adults) and check serum K+ before giving.',
    evidenceLevel: 'Level I (Clinical Practice Guideline)',
    reps: 3,
    interval: 12,
    easeFactor: 2.6,
    dueDate: new Date().toISOString(),
    tags: ['Cardiac', 'Pharmacology', 'Electrolytes']
  },
  {
    id: 'fc-3',
    deckId: 'deck-mcn',
    category: 'Maternal & Child Health',
    front: 'Explain the VEAL CHOP mnemonic for Electronic Fetal Heart Monitoring (EFM) tracings.',
    back: 'V = Variable Decelerations → C = Cord Compression\nE = Early Decelerations → H = Head Compression (Benign)\nA = Accelerations → O = Oxygenation OK (Reassuring)\nL = Late Decelerations → P = Placental Insufficiency (Priority Emergency!)',
    pearl: 'Late decelerations require immediate intrauterine resuscitation: Turn mother to Left Lateral position, 10L O2 via non-rebreather, IV fluid bolus, stop Oxytocin/Pitocin, notify MD.',
    evidenceLevel: 'Level I (ACOG Practice Bulletin)',
    reps: 1,
    interval: 1,
    easeFactor: 2.4,
    dueDate: new Date().toISOString(),
    tags: ['OB', 'Maternal', 'FetalMonitoring']
  },
  {
    id: 'fc-4',
    deckId: 'deck-neuro',
    category: 'Critical Care & Neuro',
    front: 'What are the 3 physiological signs of Cushing\'s Triad in increased Intracranial Pressure (ICP)?',
    back: '1. Widening Pulse Pressure (severe systolic hypertension with stable or falling diastolic BP)\n2. Bradycardia (slow, bounding pulse)\n3. Irregular or Cheyne-Stokes Respirations (bradypnea/ataxic breathing).',
    pearl: 'Cushing\'s Triad indicates impending brainstem herniation! Opposite of shock (shock = hypotension, tachycardia, tachypnea).',
    evidenceLevel: 'Level I (Neurocritical Care Guideline)',
    reps: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    tags: ['Neuro', 'ICU', 'Emergency']
  },
  {
    id: 'fc-5',
    deckId: 'deck-graduate',
    category: 'Graduate Epistemology (MSN/PhD)',
    front: 'What are the 4 metaparadigm concepts of nursing, and who first formalized their conceptual definitions?',
    back: 'The 4 metaparadigms are:\n1. Person (the recipient of care, individuals, families, communities)\n2. Environment (internal and external conditions influencing the person)\n3. Health (the degree of wellness or illness experienced)\n4. Nursing (the actions, characteristics, and attributes of the nurse delivering care).\nFormalized by Jacqueline Fawcett (1984).',
    pearl: 'Essential question for CHED CMO 5 s.2024 MSN Comprehensive Exams and PhD qualifying exams.',
    evidenceLevel: 'Expert Theoretical Consensus',
    reps: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    tags: ['Theory', 'Metaparadigm', 'MSN', 'PhD']
  },
  {
    id: 'fc-6',
    deckId: 'deck-epi',
    category: 'Community Health & DOH Programs',
    front: 'In the DOH Expanded Program on Immunization (EPI), what temperature must the cold chain vaccine refrigerator maintain?',
    back: 'Standard EPI cold chain temperature for health centers is +2°C to +8°C (+35.6°F to +46.4°F) for heat-sensitive vaccines (Pentavalent, Hep B, BCG, DPT). OPV / Measles can be stored at -15°C to -25°C in freezer compartments.',
    pearl: 'Never freeze Pentavalent or Hep B vaccines! Perform the Shake Test if freezing is suspected.',
    evidenceLevel: 'Level I (WHO Vaccine Management Standard)',
    reps: 1,
    interval: 2,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    tags: ['Community', 'DOH', 'EPI', 'PublicHealth']
  }
];
