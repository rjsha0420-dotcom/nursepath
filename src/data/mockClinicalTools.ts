import { DrugItem, LabItem, CPDRecord } from '../types';

export interface SpecialtyReviewer {
  id: string;
  name: string;
  acronym: string;
  boardAgency: string; // e.g. AACN, ONCC, BCEN, ANCC
  description: string;
  keyTopics: string[];
  sampleQuestionsCount: number;
  credentialLevel: string;
}

export const SPECIALTY_REVIEWERS: SpecialtyReviewer[] = [
  {
    id: 'spec-ccrn',
    name: 'Critical Care Registered Nurse (Adult)',
    acronym: 'CCRN',
    boardAgency: 'AACN Certification Corporation',
    description: 'Comprehensive review for nurses providing direct care to acutely and critically ill adult patients in ICUs, trauma units, and step-downs.',
    keyTopics: ['Hemodynamic Monitoring (Arterial lines, CVP, Swan-Ganz)', 'Mechanical Ventilation & ARDS', 'Vasoactive Infusions & Shock States', 'Neuro Trauma & ICP Control'],
    sampleQuestionsCount: 150,
    credentialLevel: 'Advanced Clinical Practice'
  },
  {
    id: 'spec-cen',
    name: 'Certified Emergency Nurse',
    acronym: 'CEN',
    boardAgency: 'Board of Certification for Emergency Nursing (BCEN)',
    description: 'Mastery of emergency assessment, emergency trauma triage (ESI Level 1-5), acute resuscitation, and rapid clinical decision making.',
    keyTopics: ['Triage & Mass Casualty (START/SALT)', 'Toxicology & Antidotes', 'Trauma Primary & Secondary Survey', 'Shock & Resuscitation'],
    sampleQuestionsCount: 150,
    credentialLevel: 'Advanced Emergency Practice'
  },
  {
    id: 'spec-pedia',
    name: 'Certified Pediatric Nurse',
    acronym: 'CPN',
    boardAgency: 'Pediatric Nursing Certification Board (PNCB)',
    description: 'Evidence-based pediatric inpatient, outpatient, and critical assessment, developmental stages (Piaget/Erikson), and pediatric pharmacokinetics.',
    keyTopics: ['Pediatric Fluid Resuscitation (Holliday-Segar)', 'Congenital Heart Defects (Cyanotic vs Acyanotic)', 'Pediatric Assessment Triangle (PAT)', 'Child Abuse & Advocacy'],
    sampleQuestionsCount: 120,
    credentialLevel: 'Pediatric Specialty'
  },
  {
    id: 'spec-ob',
    name: 'Inpatient Obstetric Nursing',
    acronym: 'RNC-OB',
    boardAgency: 'National Certification Corporation (NCC)',
    description: 'Perinatal nursing, electronic fetal monitoring (NICHD Category I, II, III), high-risk intrapartum conditions, postpartum hemorrhage protocols.',
    keyTopics: ['Fetal Heart Tracings & Decelerations (VEAL CHOP)', 'Pre-eclampsia & Eclampsia Mgmt', 'Stage 1-4 Labor Complications', 'Postpartum Hemorrhage QBL'],
    sampleQuestionsCount: 130,
    credentialLevel: 'Maternal-Newborn Specialty'
  },
  {
    id: 'spec-psych',
    name: 'Psychiatric-Mental Health Nursing',
    acronym: 'PMHN-BC',
    boardAgency: 'American Nurses Credentialing Center (ANCC)',
    description: 'Assessment and therapeutic intervention for major depressive disorder, bipolar affective disorders, schizophrenia, addiction, and crisis de-escalation.',
    keyTopics: ['De-escalation & Restraint Regulations', 'Neuroleptic Malignant Syndrome vs Serotonin Syndrome', 'Lithium & Clozapine Therapeutic Ranges', 'Suicide Risk Assessment (Columbia C-SSRS)'],
    sampleQuestionsCount: 110,
    credentialLevel: 'Behavioral Health Specialty'
  },
  {
    id: 'spec-oncology',
    name: 'Oncology Certified Nurse',
    acronym: 'OCN',
    boardAgency: 'Oncology Nursing Certification Corporation (ONCC)',
    description: 'Biotherapy, chemotherapy safety, oncologic emergencies (Tumor Lysis Syndrome, Superior Vena Cava Syndrome, Spinal Cord Compression), and palliative care.',
    keyTopics: ['Chemotherapy Extravasation Protocols', 'Neutropenic Fever & Absolute Neutrophil Count (ANC)', 'Tumor Lysis Syndrome Electrolytes', 'Radiation Precautions'],
    sampleQuestionsCount: 115,
    credentialLevel: 'Oncology Practice'
  },
  {
    id: 'spec-medsurg',
    name: 'Certified Medical-Surgical Registered Nurse',
    acronym: 'CMSRN',
    boardAgency: 'Medical-Surgical Nursing Certification Board (MSNCB)',
    description: 'Adult health continuum across complex multi-system medical disorders and perioperative surgical management.',
    keyTopics: ['Sepsis Hour-1 Bundle & SOFA Score', 'Perioperative DVT & Atelectasis Prevention', 'Chronic Kidney Disease Stages 1-5', 'Diabetic Ketoacidosis vs HHS'],
    sampleQuestionsCount: 140,
    credentialLevel: 'Core Practice Excellence'
  },
  {
    id: 'spec-gero',
    name: 'Gerontological Nursing',
    acronym: 'GERO-BC',
    boardAgency: 'American Nurses Credentialing Center (ANCC)',
    description: 'Specialized geriatric care addressing polypharmacy (Beers Criteria), dementia vs delirium vs depression, fall risk prevention, and frailty.',
    keyTopics: ['Beers Criteria Potentially Inappropriate Medications', 'Confusion Assessment Method (CAM)', 'Pressure Injury Staging 1-4 & Unstageable', 'End of Life & Advance Directives'],
    sampleQuestionsCount: 100,
    credentialLevel: 'Geriatric Excellence'
  },
  {
    id: 'spec-community',
    name: 'Advanced Community & Public Health Nursing',
    acronym: 'APHN-BC',
    boardAgency: 'ANCC / Global Health Authorities',
    description: 'Epidemiology, biostatistics, primary health care, environmental health, and community empowerment frameworks.',
    keyTopics: ['Epidemiological Triad & Disease Surveillance', 'DOH National Tuberculosis Program (NTP DOTS)', 'Water Sanitation & Vector-Borne Control', 'Program Planning (PRECEDE-PROCEED)'],
    sampleQuestionsCount: 100,
    credentialLevel: 'Public Health Leadership'
  },
  {
    id: 'spec-leadership',
    name: 'Nurse Executive / Leadership Certification',
    acronym: 'NE-BC',
    boardAgency: 'American Nurses Credentialing Center (ANCC)',
    description: 'Transformational executive leadership, health economics, staffing ratios, Magnet hospital recognition standards, and quality governance.',
    keyTopics: ['Transformational vs Servant Leadership', 'Just Culture & Root Cause Analysis (RCA)', 'Hospital Budgeting & Variance Analysis', 'Magnet Designation Key Domains'],
    sampleQuestionsCount: 125,
    credentialLevel: 'Executive Leadership'
  }
];

export const CLINICAL_DRUGS: DrugItem[] = [
  {
    id: 'drug-norepi',
    genericName: 'Norepinephrine bitartrate',
    brandNames: ['Levophed'],
    drugClass: 'Vasoactive Sympathomimetic Inotrope / Vasopressor',
    indications: 'First-line vasopressor for septic shock, cardiogenic shock, and severe hypotension refractory to fluid resuscitation.',
    mechanism: 'Potent alpha-1 receptor agonist causing marked peripheral vasoconstriction with modest beta-1 inotropic cardiac stimulation.',
    standardDose: '0.01 - 3 mcg/kg/min IV infusion titrated to Mean Arterial Pressure (MAP) >= 65 mmHg.',
    ivAdministration: {
      pushRate: 'NEVER direct IV push (except during code arrest). Continuous infusion only.',
      dilution: '4 mg in 250 mL D5W or NS (concentration 16 mcg/mL).',
      compatibility: ['D5W', 'Normal Saline', 'Incompatible with alkaline solutions']
    },
    highAlert: true,
    blackBoxWarning: 'Severe tissue necrosis and sloughing if extravasation occurs. Infuse via central venous catheter whenever possible. Antidote: Phentolamine mesylate.',
    antidote: 'Phentolamine (Regitine) 5-10 mg diluted in 10-15 mL saline injected subcutaneously around extravasation site.',
    nursingConsiderations: [
      'Titrate continuously against arterial line blood pressure and MAP',
      'Correct hypovolemia prior to initiating vasopressor therapy',
      'Assess peripheral pulses, capillary refill, and urine output every hour'
    ],
    monitoringParameters: ['Continuous BP/MAP', 'Heart rate/rhythm', 'Urine output >= 0.5 mL/kg/hr', 'Peripheral perfusion'],
    patientTeaching: ['Explain that blood pressure is being carefully assisted and continuously monitored by machine.'],
    pregnancyCategory: 'C'
  },
  {
    id: 'drug-heparin',
    genericName: 'Heparin Sodium',
    brandNames: ['Hepalean'],
    drugClass: 'Parenteral Anticoagulant',
    indications: 'Prophylaxis and treatment of venous thromboembolism (DVT/PE), acute coronary syndromes, atrial fibrillation.',
    mechanism: 'Potentiates antithrombin III, inactivating thrombin (Factor IIa) and Factor Xa to prevent fibrin clot formation.',
    standardDose: 'Bolus 80 units/kg IV, followed by continuous maintenance infusion 18 units/kg/hr.',
    ivAdministration: {
      pushRate: 'Bolus over 1 minute.',
      dilution: '25,000 units in 250 mL or 500 mL D5W/NS.',
      compatibility: ['D5W', '0.9% NaCl', 'Avoid co-infusing with other medications']
    },
    highAlert: true,
    blackBoxWarning: 'Risk of fatal hemorrhage and Heparin-Induced Thrombocytopenia (HIT). Monitor platelet count every 2-3 days.',
    antidote: 'Protamine Sulfate (1 mg neutralizes ~100 units of heparin; max 50 mg slow IV).',
    nursingConsiderations: [
      'Two-nurse independent double check before initiating or changing infusion rates',
      'Titrate according to hospital weight-based nomogram using anti-Xa or aPTT (target 1.5 - 2.5x control)',
      'Watch for signs of bleeding: hematuria, melena, epistaxis, petechiae, drop in Hgb/Hct'
    ],
    monitoringParameters: ['aPTT or Anti-Xa levels q6h until stable', 'Platelet count (discontinue if platelets drop > 50%)', 'Hemoglobin & Hematocrit'],
    patientTeaching: ['Use soft-bristled toothbrush and electric razor', 'Report any unusual bruising or black tarry stools immediately'],
    pregnancyCategory: 'C'
  },
  {
    id: 'drug-insulin-reg',
    genericName: 'Insulin Regular (Human)',
    brandNames: ['Humulin R', 'Novolin R'],
    drugClass: 'Short-Acting Insulin / Antidiabetic',
    indications: 'Diabetic Ketoacidosis (DKA), Hyperosmolar Hyperglycemic State (HHS), hyperkalemia shifting, sliding-scale prandial control.',
    mechanism: 'Lowers blood glucose by facilitating cellular uptake of glucose into skeletal muscle and adipose tissue and inhibiting hepatic glucose output.',
    standardDose: 'DKA: 0.1 units/kg IV bolus, then 0.1 units/kg/hr continuous infusion.',
    ivAdministration: {
      pushRate: 'Can be given direct IV push in emergencies or as continuous infusion.',
      dilution: '100 units in 100 mL Normal Saline (1 unit/mL concentration). Prime and flush 20 mL of line before connecting (insulin binds to plastic tubing).',
      compatibility: ['0.9% NaCl', 'D5W']
    },
    highAlert: true,
    antidote: 'Dextrose 50% IV (D50W) 25-50 mL or Glucagon 1 mg IM/SC.',
    nursingConsiderations: [
      'ONLY Regular insulin can be administered intravenously',
      'Check bedside capillary blood glucose every 1 hour while on continuous infusion',
      'Monitor serum potassium closely; insulin shifts potassium into cells, risking severe hypokalemia'
    ],
    monitoringParameters: ['Hourly capillary blood glucose', 'Basic metabolic panel (potassium, sodium)', 'Anion gap and venous pH'],
    patientTeaching: ['Recognize hypoglycemia symptoms: diaphoresis, tremors, tachycardia, confusion, dizziness.'],
    pregnancyCategory: 'B'
  },
  {
    id: 'drug-mag-sulfate',
    genericName: 'Magnesium Sulfate',
    brandNames: ['Mag Sulfate'],
    drugClass: 'Electrolyte Replenisher / Anticonvulsant / Tocolytic',
    indications: 'Prevention and treatment of eclamptic seizures in pre-eclampsia, Torsades de Pointes, severe hypomagnesemia.',
    mechanism: 'Blocks neuromuscular transmission and decreases acetylcholine release at motor endplate; CNS depressant.',
    standardDose: 'Pre-eclampsia: 4 - 6 g IV loading dose over 20-30 min, then 1 - 2 g/hr continuous infusion.',
    ivAdministration: {
      pushRate: 'Continuous infusion via dedicated volumetric infusion pump. Never free-flow.',
      dilution: '40 g in 1000 mL or premixed bags.',
      compatibility: ['D5W', 'Normal Saline']
    },
    highAlert: true,
    blackBoxWarning: 'Risk of maternal and fetal magnesium toxicity. Watch for respiratory depression, loss of deep tendon reflexes (DTRs), and cardiac arrest.',
    antidote: 'Calcium Gluconate 10% (1 gram IV given slowly over 3 to 5 minutes). Keep bedside ready at all times.',
    nursingConsiderations: [
      'Hourly assessment: Patellar Deep Tendon Reflexes (DTRs must be present, >= +1)',
      'Respiratory rate must remain >= 12 breaths per minute',
      'Urine output must remain >= 30 mL/hour (magnesium is excreted exclusively by kidneys)'
    ],
    monitoringParameters: ['Hourly DTRs', 'Respiratory rate', 'Urine output', 'Therapeutic serum Mg level: 4 - 7 mEq/L (9.6 - 16.8 mg/dL)'],
    patientTeaching: ['Infusion may produce a warm flushing feeling. Report shortness of breath or extreme muscle weakness.'],
    pregnancyCategory: 'D'
  },
  {
    id: 'drug-digoxin',
    genericName: 'Digoxin',
    brandNames: ['Lanoxin'],
    drugClass: 'Cardiac Glycoside / Inotropic Agent',
    indications: 'Heart failure with reduced ejection fraction, rate control in chronic atrial fibrillation.',
    mechanism: 'Inhibits Na+/K+ ATPase pump, increasing intracellular calcium in myocytes, yielding positive inotropy (increased force of contraction) and negative chronotropy (slowed AV node conduction).',
    standardDose: 'Oral: 0.125 - 0.25 mg daily. IV: slowly over at least 5 minutes.',
    ivAdministration: {
      pushRate: 'Administer over a minimum of 5 minutes. Rapid administration causes intense vasoconstriction.',
      dilution: 'Undiluted or diluted in 4-fold volume of D5W or NS.',
      compatibility: ['D5W', '0.9% NaCl']
    },
    highAlert: true,
    blackBoxWarning: 'Narrow therapeutic index (0.5 - 0.9 ng/mL for heart failure; up to 2.0 ng/mL for AFib). Hypokalemia markedly increases risk of digitalis toxicity.',
    antidote: 'Digoxin Immune Fab (DigiFab).',
    nursingConsiderations: [
      'Always auscultate apical heart rate for 1 FULL MINUTE prior to administration. Hold dose if apical HR < 60 bpm in adults (or < 90 in infants)',
      'Check serum potassium and creatinine before giving dose',
      'Early toxicity signs: anorexia, nausea, vomiting, yellow-green halos around lights, bradycardia, PVCs'
    ],
    monitoringParameters: ['Apical pulse', 'Serum Digoxin level', 'Serum potassium (K+), Magnesium (Mg++), and Creatinine'],
    patientTeaching: ['Teach patient how to check radial pulse before taking tablet', 'Call doctor if pulse < 60 bpm or vision turns yellow/green'],
    pregnancyCategory: 'C'
  }
];

export const CLINICAL_LABS: LabItem[] = [
  {
    id: 'lab-abg',
    name: 'Arterial Blood Gas (ABG) Panel',
    category: 'ABG',
    conventionalRange: 'pH: 7.35-7.45 | PaCO2: 35-45 mmHg | HCO3: 22-26 mEq/L | PaO2: 80-100 mmHg | SaO2: 95-100%',
    siUnits: 'pH: 7.35-7.45 | PaCO2: 4.7-6.0 kPa | HCO3: 22-26 mmol/L',
    criticalLow: 'pH < 7.20 | PaO2 < 60 mmHg | HCO3 < 10 mEq/L',
    criticalHigh: 'pH > 7.60 | PaCO2 > 65 mmHg | HCO3 > 40 mEq/L',
    causesHigh: ['Metabolic Alkalosis: vomiting, gastric suctioning, excessive antacids', 'Respiratory Acidosis (High CO2): COPD, hypoventilation, opioid overdose'],
    causesLow: ['Metabolic Acidosis: DKA, renal failure, lactic acidosis, severe diarrhea', 'Respiratory Alkalosis (Low CO2): hyperventilation, panic attack, early asthma'],
    nursingImplications: [
      'Perform Allen\'s Test prior to radial artery puncture to confirm adequate ulnar collateral circulation',
      'Apply direct firm pressure to arterial puncture site for at least 5 minutes (longer if on anticoagulants)',
      'Transport syringe immediately on crushed ice to the laboratory'
    ],
    priorityAlert: 'ROME Memory Rule: Respiratory Opposite (pH & CO2 opposite directions), Metabolic Equal (pH & HCO3 same direction).'
  },
  {
    id: 'lab-potassium',
    name: 'Serum Potassium (K+)',
    category: 'Electrolytes',
    conventionalRange: '3.5 - 5.0 mEq/L',
    siUnits: '3.5 - 5.0 mmol/L',
    criticalLow: '< 2.8 mEq/L (Severe Hypokalemia)',
    criticalHigh: '> 6.0 mEq/L (Severe Hyperkalemia)',
    causesHigh: ['Renal failure', 'Cellular breakdown (crush trauma, burns, hemolysis)', 'Acidosis', 'ACE inhibitors, Spironolactone'],
    causesLow: ['Loop diuretics (Furosemide)', 'Vomiting/diarrhea', 'Alkalosis', 'Excessive insulin without potassium replacement'],
    nursingImplications: [
      'Hyperkalemia ECG: Tall peaked T waves, prolonged PR, wide QRS, risk of ventricular fibrillation/asystole',
      'Hypokalemia ECG: Flattened T waves, ST depression, prominent U waves, frequent PVCs',
      'NEVER IV PUSH POTASSIUM. Max 10 mEq/hr peripheral line, max 20 mEq/hr central line'
    ],
    priorityAlert: 'Potassium disturbances directly threaten cardiac conduction. Attach cardiac monitor immediately for values < 3.0 or > 5.5 mEq/L.'
  },
  {
    id: 'lab-sodium',
    name: 'Serum Sodium (Na+)',
    category: 'Electrolytes',
    conventionalRange: '135 - 145 mEq/L',
    siUnits: '135 - 145 mmol/L',
    criticalLow: '< 120 mEq/L (Risk of cerebral edema & seizures)',
    criticalHigh: '> 160 mEq/L (Risk of intracellular dehydration & intracranial hemorrhage)',
    causesHigh: ['Diabetes Insipidus', 'Profuse diaphoresis', 'Osmotic diuresis', 'Severe dehydration'],
    causesLow: ['SIADH (Syndrome of Inappropriate ADH)', 'Heart failure fluid overload', 'Excessive hypotonic IV fluids (D5W)', 'Diuretics'],
    nursingImplications: [
      'Neurological checks are priority: confusion, lethargy, seizures, coma',
      'Implement seizure precautions when sodium < 125 mEq/L',
      'Correct hyponatremia SLOWLY (max 8-10 mEq/L in 24 hours) to avoid Central Pontine Myelinolysis (Osmotic Demyelination Syndrome)'
    ],
    priorityAlert: 'Rapid sodium correction causes irreversible brainstem demyelination. Administer 3% hypertonic saline only via infusion pump in ICU settings.'
  },
  {
    id: 'lab-troponin',
    name: 'High-Sensitivity Troponin I / T',
    category: 'Cardiac',
    conventionalRange: 'Troponin I: < 0.04 ng/mL | High-Sensitivity: < 14 ng/L (females), < 22 ng/L (males)',
    siUnits: '< 0.04 mcg/L',
    criticalLow: 'N/A',
    criticalHigh: '> 0.40 ng/mL or rising delta between 0h and 3h serial draws',
    causesHigh: ['Acute Myocardial Infarction (STEMI/NSTEMI)', 'Myocarditis', 'Severe heart failure decompensation', 'Massive pulmonary embolism'],
    causesLow: ['Normal cardiac status'],
    nursingImplications: [
      'Gold standard biomarker for myocardial necrosis; rises within 2-4 hours, peaks at 24 hours, remains elevated 7-14 days',
      'Serial testing at presentation, 1-3 hours post-onset',
      'Implement immediate acute coronary syndrome protocol: MONA/O-BAM (Oxygen, Nitroglycerin, Aspirin 325 mg chewed, Morphine/analgesic, Beta blocker)'
    ],
    priorityAlert: 'Rising troponin combined with ischemic ECG changes requires immediate cath lab activation for primary PCI.'
  }
];

export const MOCK_CPD_RECORDS: CPDRecord[] = [
  {
    id: 'cpd-1',
    title: 'Advanced Cardiac Life Support (ACLS) Provider Certification',
    provider: 'Philippine Heart Association / American Heart Association',
    dateCompleted: '2026-04-15',
    category: 'PRC Credit Units',
    units: 15,
    certificateRef: 'PHA-ACLS-2026-9041',
    evidenceType: 'Accredited Provider Certificate'
  },
  {
    id: 'cpd-2',
    title: 'Infection Prevention and Antimicrobial Stewardship in Critical Care',
    provider: 'Infection Control Nurses Association of the Philippines (ICNAP)',
    dateCompleted: '2026-07-22',
    category: 'PRC Credit Units',
    units: 8,
    certificateRef: 'ICNAP-2026-8812',
    evidenceType: 'Seminar Attendance'
  },
  {
    id: 'cpd-3',
    title: 'UK NMC Revalidation: Reflective Practice & Practice-Related Feedback',
    provider: 'NHS Trust Clinical Education Unit',
    dateCompleted: '2026-08-30',
    category: 'UK NMC Revalidation',
    units: 12,
    certificateRef: 'NHS-NMC-REF-4421',
    evidenceType: 'Reflective Accounts Form Signed by Confirmer'
  }
];
