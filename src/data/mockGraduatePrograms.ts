import { MSNTrack, DoctoralTrack } from '../types';

export const CHED_MSN_PROGRAM: MSNTrack = {
  id: 'ched-msn-2024',
  title: 'Master of Science in Nursing (MSN) / Master in Nursing (MN)',
  degreeName: 'Master of Science in Nursing (MSN)',
  chedBasis: 'CHED Memorandum Order (CMO) No. 5, Series of 2024',
  pqfLevel: 7,
  totalUnits: 42,
  duration: '2 to 3 Academic Years',
  tracks: ['Academic / Thesis Track', 'Professional / Non-Thesis Track'],
  coreCourses: [
    {
      code: 'NUR 701',
      title: 'Advanced Theoretical Foundations & Epistemology in Nursing',
      units: 3,
      description: 'Philosophical paradigms, metaparadigm of nursing, concept analysis (Walker & Avant), evaluation of grand and middle-range nursing theories.'
    },
    {
      code: 'NUR 702',
      title: 'Advanced Pathophysiology Across the Lifespan',
      units: 3,
      description: 'Cellular biology, genetic basis of disease, hemodynamic alterations, neuroendocrine pathways, and multi-organ failure mechanisms.'
    },
    {
      code: 'NUR 703',
      title: 'Advanced Pharmacotherapeutics for Clinical Practice',
      units: 3,
      description: 'Pharmacokinetics, pharmacodynamics, toxicokinetics, adverse drug reactions, off-label prescribing, and evidence-based pharmacologic regimens.'
    },
    {
      code: 'NUR 704',
      title: 'Advanced Physical Assessment & Clinical Reasoning',
      units: 3,
      description: 'Diagnostic reasoning, high-fidelity physical examination, differential diagnosis formulation, and ordering/interpretation of diagnostic studies.'
    },
    {
      code: 'NUR 705',
      title: 'Biostatistics, Epidemiology & Health Analytics',
      units: 3,
      description: 'Parametric and non-parametric inferential statistics, SPSS/R/Jamovi data modeling, relative risk, odds ratios, and epidemiological surveillance.'
    },
    {
      code: 'NUR 706',
      title: 'Nursing Informatics & Digital Health Technologies',
      units: 3,
      description: 'Electronic health record (EHR) governance, telehealth, AI in clinical decision support, healthcare big data ethics, and privacy regulations.'
    }
  ],
  specializations: [
    'Adult Health & Critical Care Nursing Specialist (CNS)',
    'Maternal, Child & Adolescent Nursing Specialist',
    'Psychiatric & Mental Health Nursing Specialist',
    'Nursing Service Administration & Healthcare Leadership',
    'Community & Primary Healthcare Nurse Specialist'
  ],
  careerOutcomes: [
    'Clinical Nurse Specialist (CNS) / Nurse Practitioner (NP)',
    'Chief Nursing Officer (CNO) / Director of Nursing',
    'Nursing Faculty / University Assistant Professor (CHED-mandated minimum for teaching)',
    'Clinical Research Nurse Coordinator / Quality Improvement Lead'
  ]
};

export const DOCTORAL_TRACKS: DoctoralTrack[] = [
  {
    degreeType: 'PhD',
    fullName: 'Doctor of Philosophy in Nursing (PhD in Nursing)',
    pqfLevel: 8,
    focus: 'Scientific Discovery, Epistemology & Theory Generation',
    chedBasis: 'CHED CMO Guidelines for Level 8 Doctoral Programs / ICN Advanced Practice Guidelines',
    competencies: [
      'Original theoretical framework and model development',
      'Execution of randomized controlled trials (RCTs) or advanced qualitative inquiry',
      'High-impact peer-reviewed publishing in Scopus / Web of Science indexed journals',
      'Grant writing for national (PCHRD/DOST) and international (WHO, NIH, Sigma) research funding'
    ],
    qualifyingExamTopics: [
      'Nursing Epistemology & Philosophy of Science',
      'Advanced Quantitative & Qualitative Methodologies',
      'Biostatistical Modeling & Structural Equation Modeling (SEM)',
      'Ethics in Biomedical & Behavioral Research (IRB/PHREB)'
    ],
    dissertationRequirements: [
      'Substantive, original contribution to nursing science body of knowledge',
      'Formal oral defense before panel of 5 doctoral scholars',
      'At least one published or accepted article in an international peer-reviewed journal'
    ],
    internationalEquivalents: 'Equivalent to US/UK/Canada PhD in Nursing. Standard terminal research degree recognized globally for tenure-track professorship.'
  },
  {
    degreeType: 'DScN',
    fullName: 'Doctor of Science in Nursing (DScN)',
    pqfLevel: 8,
    focus: 'Translational Clinical Science & Applied Bio-behavioral Research',
    chedBasis: 'CHED PQF Level 8 Specialized Science Framework',
    competencies: [
      'Translational clinical trials and bedside intervention science',
      'Biomarker research and bio-behavioral physiological monitoring',
      'Clinical epidemiology and outcomes research in tertiary medical centers',
      'Evidence synthesis and clinical practice guideline (CPG) formulation'
    ],
    qualifyingExamTopics: [
      'Pathophysiological Biomarkers & Clinical Measurement',
      'Translational Research Methodologies (T1 to T4 Translation)',
      'Systematic Review & Meta-Analysis (PRISMA Guidelines)',
      'Healthcare Technology Assessment (HTA)'
    ],
    dissertationRequirements: [
      'Clinical scientific investigation with measurable clinical endpoints or patient outcome improvements',
      'Validation of clinical assessment tools or biological intervention protocols'
    ],
    internationalEquivalents: 'Recognized internationally as an advanced clinical science doctorate, common in European and select Asian research institutes.'
  },
  {
    degreeType: 'DNP',
    fullName: 'Doctor of Nursing Practice (DNP)',
    pqfLevel: 8,
    focus: 'Clinical Leadership, Quality Improvement & Systems-Level Translation',
    chedBasis: 'AACN Essentials of Doctoral Education for Advanced Nursing Practice / ICN Standards',
    competencies: [
      'Healthcare policy analysis and systemic advocacy',
      'Organizational leadership, economics, and healthcare financing',
      'Implementation science (IHI Model for Improvement, PDSA cycles, Lean Six Sigma)',
      'Advanced health informatics and population health management'
    ],
    qualifyingExamTopics: [
      'Translational Evidence-Based Practice (EBP Frameworks: Iowa Model, Johns Hopkins)',
      'Healthcare Policy, Finance & Regulatory Environments',
      'Population Health & Global Health Disparities',
      'Quality Improvement & Patient Safety Systems'
    ],
    dissertationRequirements: [
      'DNP Quality Improvement Capstone Project (System-level intervention with quantifiable clinical or financial outcome)',
      'Dissemination via conference presentation and clinical monograph'
    ],
    internationalEquivalents: 'Premier terminal practice doctorate in the United States and Canada for executive nurse leaders and autonomous Advanced Practice Registered Nurses (APRNs).'
  }
];

export const RESEARCH_METHODS_TOOLKIT = [
  {
    method: 'Quantitative: Randomized Controlled Trial (RCT)',
    icon: 'Activity',
    description: 'Gold standard for clinical intervention efficacy. Requires power analysis (G*Power) to ensure adequate sample size (1 - Beta = 0.80, alpha = 0.05).',
    phases: ['Random allocation', 'Blinding / Masking', 'Control group comparator', 'Intention-to-treat (ITT) analysis']
  },
  {
    method: 'Qualitative: Descriptive Phenomenology (Colaizzi / Giorgi)',
    icon: 'MessageSquare',
    description: 'Investigates the essence of lived human experiences. Requires bracketing (epoche) to mitigate researcher bias.',
    phases: ['Purposive sampling', 'In-depth semi-structured interviews', 'Extracting significant statements & formulated meanings', 'Member checking & audit trail']
  },
  {
    method: 'Mixed-Methods: Convergent Parallel Design',
    icon: 'GitFork',
    description: 'Simultaneous collection of quantitative and qualitative data to triangulate findings and obtain comprehensive clinical insight.',
    phases: ['Parallel data collection', 'Independent analysis', 'Joint display matrix integration', 'Meta-inferences formulation']
  },
  {
    method: 'Systematic Review & Meta-Analysis (PRISMA 2020)',
    icon: 'Layers',
    description: 'Rigorous synthesis of all available evidence adhering to PRISMA checklist and PROSPERO protocol registration.',
    phases: ['Literature search string (MeSH terms)', 'Duplicate screening', 'Cochrane Risk of Bias assessment (RoB 2)', 'Forest plot generation']
  }
];
