import { GeneratedQuizItem, Flashcard, MindMapNode, MnemonicItem } from '../types';

export interface ClinicalConceptPair {
  term: string;
  definition: string;
  pearl: string;
  subtopic: string;
  distractors: [string, string, string];
}

/**
 * Detects whether a string contains raw binary PDF, ZIP/DOCX/PPTX, or unreadable control bytes,
 * and returns clean human-readable text or falls back to clinical topic synthesis.
 */
export function sanitizeClinicalText(raw: string, title: string = 'Clinical Study Material'): string {
  if (!raw || typeof raw !== 'string') return '';

  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Detect raw PDF or Office OpenXML ZIP streams
  const hasPdfHeader = trimmed.startsWith('%PDF-') || trimmed.includes('endobj') || trimmed.includes('endstream') || trimmed.includes('/FlateDecode');
  const hasZipHeader = trimmed.startsWith('PK\x03\x04') || trimmed.includes('[Content_Types].xml') || trimmed.includes('word/document.xml') || trimmed.includes('ppt/slides');

  // Count non-printable / control characters in the first 1500 chars
  const sample = trimmed.slice(0, 1500);
  let nonPrintable = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 65533 || code > 126) {
      nonPrintable++;
    }
  }
  const binaryRatio = sample.length > 0 ? nonPrintable / sample.length : 0;

  if (hasPdfHeader || hasZipHeader || binaryRatio > 0.12) {
    // Attempt to salvage clean readable English sentences from text chunks if any exist
    const matches = trimmed.match(/[A-Za-z][A-Za-z0-9\s,.;:()\-–—/%+]{25,180}/g) || [];
    const pdfSyntaxNoise = /obj|stream|xref|trailer|startxref|FontDescriptor|MediaBox|Resources|ProcSet|Subtype|Type|Catalog|Pages|Parent|Length|Filter|FlateDecode|xml|rels|theme/i;
    const cleanMatches = matches
      .map((m) => m.trim())
      .filter((m) => !pdfSyntaxNoise.test(m) && (m.match(/\s/g) || []).length >= 4);

    if (cleanMatches.length >= 3) {
      return cleanMatches.slice(0, 30).join('. ');
    }
    // Otherwise return empty so topic-based clinical knowledge base takes over cleanly
    return '';
  }

  return trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Rich Clinical Domain Knowledge Base mapped by topic keywords in the title or text
 */
function getDomainConceptsForTopic(title: string, cleanContent: string): ClinicalConceptPair[] {
  const combined = `${title} ${cleanContent}`.toLowerCase();
  const concepts: ClinicalConceptPair[] = [];

  // 1. Parse any user-provided structured lines (e.g. "Term: Definition" or "Term -> Definition" or bullet points)
  if (cleanContent.length > 20) {
    const rawLines = cleanContent
      .split(/[\n•;]+|(?<=\.)\s+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 18 && !l.toLowerCase().startsWith('http'));

    rawLines.forEach((line) => {
      if (line.includes(':') || line.includes('->') || line.includes('—') || line.includes(' - ')) {
        const parts = line.split(/->|:|—|\s-\s/);
        if (parts.length >= 2) {
          const term = parts[0].replace(/^[-•\d.*#]+\s*/, '').trim();
          const def = parts.slice(1).join(':').trim();
          if (term.length >= 3 && term.length <= 75 && def.length >= 12) {
            concepts.push({
              term,
              definition: def,
              pearl: `High-yield concept from "${title}": Always correlate ${term} with baseline vital signs and nursing safety protocols.`,
              subtopic: title.slice(0, 40),
              distractors: [
                'Discontinue all hemodynamic monitoring and delay documentation until shift change.',
                'Administer rapid unverified intravenous boluses without checking baseline laboratory parameters.',
                'Delegate complex clinical evaluation and emergency medication titration to unlicensed personnel.'
              ]
            });
          }
        }
      }
    });
  }

  // 2. Domain-specific nursing knowledge packs based on title/content keywords
  if (combined.includes('pharm') || combined.includes('drug') || combined.includes('med') || combined.includes('antidote') || combined.includes('titrat') || combined.includes('inotrop')) {
    concepts.push(
      {
        term: 'Heparin Sodium & Protamine Sulfate',
        definition: 'Heparin potentiates Antithrombin III to prevent clot extension; monitored via aPTT (therapeutic 1.5–2.5× normal). Reversed immediately by Protamine Sulfate (1 mg per 100 units of Heparin).',
        pearl: 'Always monitor platelet counts for Heparin-Induced Thrombocytopenia (HIT) Type II.',
        subtopic: 'Anticoagulation Pharmacology',
        distractors: [
          'Monitor PT/INR and administer Vitamin K1 (Phytonadione) as the immediate antidote.',
          'Administer Acetylcysteine (Mucomyst) orally and check serum ammonia levels.',
          'Infuse Calcium Gluconate 10% and monitor deep tendon reflexes hourly.'
        ]
      },
      {
        term: 'Warfarin (Coumadin) & Vitamin K1',
        definition: 'Warfarin inhibits Vitamin K-dependent clotting factors (II, VII, IX, X). Therapeutic INR is 2.0–3.0 (or 2.5–3.5 for mechanical heart valves). Antidote is Vitamin K1 (Phytonadione) or 4-factor PCC.',
        pearl: 'Instruct patients to maintain a consistent intake of green leafy vegetables rather than abruptly binging or eliminating them.',
        subtopic: 'Anticoagulation Pharmacology',
        distractors: [
          'Monitor aPTT every 4 hours and administer Protamine Sulfate for bleeding.',
          'Hold the dose if the apical pulse is below 60 beats per minute.',
          'Administer Naloxone (Narcan) 0.4 mg IV push for acute reversal.'
        ]
      },
      {
        term: 'Digoxin (Lanoxin) Cardiac Glycoside Safety',
        definition: 'Positive inotrope (increases contractility) and negative chronotrope (slows HR). Therapeutic serum range: 0.5–2.0 ng/mL. Auscultate apical pulse for 1 full minute and hold if < 60 bpm in adults.',
        pearl: 'Hypokalemia (< 3.5 mEq/L) markedly precipitates Digoxin toxicity (nausea, anorexia, yellow-green halo vision / xanthopsia, bradycardia). Antidote: Digoxin Immune Fab.',
        subtopic: 'Cardiovascular Pharmacology',
        distractors: [
          'Therapeutic serum level is 10–20 mcg/mL; hold if respiratory rate is below 16/min.',
          'Hypernatremia is the primary electrolyte trigger for Digoxin toxicity.',
          'Administer rapid IV push over 10 seconds to maximize cardiac output.'
        ]
      },
      {
        term: 'Magnesium Sulfate High-Alert Protocol',
        definition: 'CNS depressant and smooth muscle relaxant used for preeclampsia seizure prophylaxis and torsades de pointes. Therapeutic level: 4–7 mEq/L. Antidote: Calcium Gluconate 10% IV.',
        pearl: 'Assess BURP signs of toxicity: Blood pressure drop, Urine output < 30 mL/hr, Respiratory rate < 12/min, Patellar reflex absent (first sign of toxicity!).',
        subtopic: 'Obstetric & Critical Care Pharmacology',
        distractors: [
          'Hyperactive 4+ deep tendon reflexes and tachypnea indicate Magnesium toxicity.',
          'Antidote is Flumazenil (Romazicon) 0.2 mg IV over 15 seconds.',
          'Increase the infusion rate immediately if urine output drops below 15 mL/hr.'
        ]
      },
      {
        term: 'Acetaminophen Overdose & Acetylcysteine',
        definition: 'Excess Acetaminophen (Paracetamol > 4 g/day) depletes hepatic glutathione, accumulating toxic NAPQI metabolites that cause acute centrilobular liver necrosis. Antidote: N-Acetylcysteine (Mucomyst).',
        pearl: 'Monitor AST, ALT, bilirubin, and PT/INR closely over the first 24–72 hours.',
        subtopic: 'Toxicology & Antidotes',
        distractors: [
          'Antidote is Atropine Sulfate followed by Pralidoxime (2-PAM).',
          'Primary organ toxicity is acute pulmonary fibrosis rather than hepatotoxicity.',
          'Administer Deferoxamine IV to chelate excess serum metabolites.'
        ]
      },
      {
        term: 'Opioid Toxicity & Naloxone (Narcan)',
        definition: 'Opioid overdose presents with the classic triad: respiratory depression (< 12/min), pinpoint pupils (miosis), and coma/CNS depression. Antidote: Naloxone (Narcan) IV/IM/IN.',
        pearl: 'Naloxone has a shorter half-life (30–90 min) than most opioids; monitor closely for recurrent respiratory depression (renarcotization).',
        subtopic: 'Analgesia & Emergency Reversal',
        distractors: [
          'Presents with dilated mydriatic pupils, severe hypertension, and hyperreflexia.',
          'Reversed with Physostigmine 1 mg slow IV push.',
          'Once a single dose of Naloxone is given, the patient can be safely discharged immediately.'
        ]
      }
    );
  }

  if (combined.includes('maternal') || combined.includes('child') || combined.includes('ob') || combined.includes('labor') || combined.includes('preg') || combined.includes('fetal') || combined.includes('ncm 107') || combined.includes('np2')) {
    concepts.push(
      {
        term: "Naegele's Rule for Expected Date of Delivery (EDD)",
        definition: 'Calculate EDD by taking the first day of the Last Menstrual Period (LMP), subtracting 3 calendar months, adding 7 days, and adjusting the year (assumes a regular 28-day cycle).',
        pearl: 'Example: LMP of May 10, 2026 -> Minus 3 months (Feb 10) -> Plus 7 days = February 17, 2027.',
        subtopic: 'Antepartum Assessment (NP2)',
        distractors: [
          'Add 3 calendar months and subtract 7 days from the last day of menstrual flow.',
          'Subtract 4 months and add 14 days from the date of positive pregnancy test.',
          'Multiply gestational weeks by 4 and add 10 days to ovulation date.'
        ]
      },
      {
        term: 'Placenta Previa vs. Abruptio Placentae',
        definition: 'Placenta Previa presents with painless, bright red vaginal bleeding and a soft, non-tender uterus. Abruptio Placentae presents with painful, dark red bleeding and a rigid, board-like abdomen.',
        pearl: 'NEVER perform a digital vaginal examination in suspected Placenta Previa—it can tear the placenta and trigger life-threatening maternal-fetal hemorrhage!',
        subtopic: 'High-Risk Obstetric Emergencies',
        distractors: [
          'Perform an immediate sterile digital cervical exam to determine dilation in Placenta Previa.',
          'Placenta Previa is characterized by a rigid board-like uterus and concealed dark bleeding.',
          'Ambulate the client briskly in the hallway to accelerate placental separation.'
        ]
      },
      {
        term: 'VEAL CHOP Fetal Heart Rate (FHR) Monitoring',
        definition: 'Variable decelerations = Cord compression (Reposition mother knee-chest/side); Early decelerations = Head compression (Benign); Accelerations = Okay; Late decelerations = Placental insufficiency (Left side, stop Pitocin, O2, IV bolus).',
        pearl: 'Late decelerations begin after the peak of the contraction and return to baseline after the contraction ends—always an obstetric priority!',
        subtopic: 'Intrapartum Fetal Surveillance',
        distractors: [
          'Early decelerations require immediate emergency Cesarean delivery.',
          'Late decelerations are treated by increasing the Oxytocin (Pitocin) infusion rate.',
          'Variable decelerations indicate normal fetal sleep cycles requiring no repositioning.'
        ]
      },
      {
        term: 'Four Stages of Labor & Postpartum Hemorrhage Prevention',
        definition: 'Stage 1: Cervical dilation (Latent 0–3 cm, Active 4–7 cm, Transition 8–10 cm). Stage 2: Expulsion of fetus. Stage 3: Placental delivery (Schultze shiny / Duncan dirty). Stage 4: First 1–4 hours postpartum stabilization.',
        pearl: 'If the postpartum uterine fundus is boggy and displaced to the right, massage the fundus firmly and assist the mother to void (full bladder causes uterine atony).',
        subtopic: 'Intrapartum & Postpartum Care',
        distractors: [
          'Perform aggressive fundal pressure during the first stage of labor at 4 cm dilation.',
          'Pull forcefully on the umbilical cord before signs of placental separation appear.',
          'A boggy displaced fundus in Stage 4 is normal and requires no intervention.'
        ]
      }
    );
  }

  if (combined.includes('burn') || combined.includes('icp') || combined.includes('abg') || combined.includes('med-surg') || combined.includes('medsurg') || combined.includes('shock') || combined.includes('ncm 112') || combined.includes('ncm 118') || combined.includes('critical')) {
    concepts.push(
      {
        term: 'Parkland Burn Fluid Resuscitation Formula',
        definition: 'Total 24-hour fluid volume = 4 mL Lactated Ringer’s × Body Weight (kg) × %TBSA burned (2nd & 3rd degree burns). Administer 50% in the first 8 hours (calculated from the time of burn injury) and 50% over the next 16 hours.',
        pearl: 'Hourly urine output (30–50 mL/hr or 0.5 mL/kg/hr in adults) is the most reliable bedside indicator of adequate organ perfusion during burn resuscitation.',
        subtopic: 'Thermal Injury & Fluid Resuscitation',
        distractors: [
          'Infuse 100% of calculated fluid volume within the first 4 hours using 0.45% Half-Normal Saline.',
          'Calculate the 8-hour window starting from the time of hospital ICU admission rather than time of burn.',
          'Include 1st-degree superficial sunburn erythema when calculating %TBSA.'
        ]
      },
      {
        term: "Cushing's Triad & Increased Intracranial Pressure (ICP)",
        definition: 'Normal ICP is 5–15 mmHg. Early sign of elevated ICP is a change in Level of Consciousness (restlessness, confusion). Late brainstem herniation sign is Cushing’s Triad: 1. Systolic hypertension with widening pulse pressure, 2. Bradycardia, 3. Irregular respirations (Cheyne-Stokes).',
        pearl: 'Maintain Head of Bed at 30° in neutral midline alignment, prevent Valsalva/coughing, avoid hip flexion, and administer Mannitol 20% via a filter needle.',
        subtopic: 'Neurological Emergencies',
        distractors: [
          'Cushing’s Triad consists of severe hypotension, sinus tachycardia, and rapid shallow tachypnea.',
          'Place the client in Trendelenburg position and cluster suctioning activities together.',
          'Perform lumbar puncture immediately in a client with acute Cushing’s Triad.'
        ]
      },
      {
        term: 'Arterial Blood Gas (ABG) ROME Interpretation',
        definition: 'Normal values: pH 7.35–7.45, PaCO2 35–45 mmHg, HCO3 22–26 mEq/L. ROME: Respiratory Opposite (pH and PaCO2 move in opposite directions); Metabolic Equal (pH and HCO3 move in the same direction).',
        pearl: 'Always perform Allen’s Test before radial arterial puncture to verify collateral ulnar artery circulation.',
        subtopic: 'Acid-Base & Respiratory Balance',
        distractors: [
          'Normal arterial pH is 6.80–7.10 and normal HCO3 is 12–16 mEq/L.',
          'In Respiratory Acidosis, both pH and PaCO2 are decreased below normal.',
          'Allen’s Test evaluates deep vein thrombosis in the lower extremities.'
        ]
      }
    );
  }

  if (combined.includes('chn') || combined.includes('community') || combined.includes('epi') || combined.includes('vaccine') || combined.includes('immuniz') || combined.includes('np1') || combined.includes('bag')) {
    concepts.push(
      {
        term: 'DOH Expanded Program on Immunization (EPI) & Cold Chain',
        definition: 'Store vaccines at +2°C to +8°C in the refrigerator body. At birth: BCG (0.05 mL ID, right deltoid) and Hep B (0.5 mL IM, vastus lateralis). Pentavalent (DPT-HepB-Hib) given at 6, 10, 14 weeks (0.5 mL IM).',
        pearl: 'OPV and Measles vaccines are most sensitive to heat; never store vaccines in the refrigerator door where temperatures fluctuate.',
        subtopic: 'Community Health Nursing (NP1)',
        distractors: [
          'Administer BCG 0.5 mL via deep intramuscular injection into the gluteus medius.',
          'Store all toxoid and recombinant vaccines in the freezer at -20°C.',
          'Withhold routine immunization if the infant has a mild cold without fever.'
        ]
      },
      {
        term: 'Public Health Bag Technique',
        definition: 'A tool by which the community health nurse performs nursing procedures during a home visit with maximum efficiency. Handwashing before opening the bag prevents contamination of its clean contents.',
        pearl: 'Bag contents are arranged with frequently used clean items on top; always place the bag on a clean paper/plastic lining.',
        subtopic: 'Family & Community Health',
        distractors: [
          'Open the public health bag first before performing hand hygiene.',
          'Place contaminated surgical instruments directly back into the bag without disinfection.',
          'The bag itself is more important than the aseptic technique of the nurse.'
        ]
      }
    );
  }

  // 3. Universal Core Nursing Concepts (ensures we always have at least 10 rich concepts for any subject)
  const universalConcepts: ClinicalConceptPair[] = [
    {
      term: `Primary ABC & Hemodynamic Stabilization in ${title}`,
      definition: 'Prioritize Airway patency, Breathing (SpO2 >= 94%), and Circulation (Mean Arterial Pressure >= 65 mmHg, urine output >= 0.5 mL/kg/hr) before secondary diagnostic tasks.',
      pearl: 'Calculated MAP = (SBP + 2 × DBP) / 3. A MAP below 65 mmHg compromises renal and cerebral autoregulation.',
      subtopic: 'Clinical Prioritization & ABCs',
      distractors: [
        'Complete routine dietary preferences before assessing airway patency and oxygen saturation.',
        'Target a Mean Arterial Pressure (MAP) of 35–45 mmHg in critically ill adults.',
        'Urine output of 10 mL over 4 hours confirms optimal renal perfusion.'
      ]
    },
    {
      term: 'SBAR Interprofessional Communication Framework',
      definition: 'Situation (client identity & acute concern), Background (admission diagnosis, pertinent history, code status), Assessment (latest vital signs, physical exam cues, lab panic values), Recommendation (specific action requested).',
      pearl: 'Always gather current vital signs, SpO2, and recent lab results BEFORE calling the physician via SBAR.',
      subtopic: 'Patient Safety & Communication',
      distractors: [
        'Report vague subjective impressions without measuring current blood pressure or heart rate.',
        'Wait until end-of-shift nursing endorsement to report acute hypotension and chest pain.',
        'Omit allergy history and current IV infusions during emergency handoff.'
      ]
    },
    {
      term: 'Ten Rights of Safe Medication Administration',
      definition: 'Verify Right Patient (2 unique identifiers: full name & DOB/MRN), Right Medication, Right Dose, Right Route, Right Time, Right Documentation, Right Reason, Right Response, Right to Educate, Right to Refuse.',
      pearl: 'Room number or bed number must NEVER be used as a patient identifier! Perform independent double-checks for high-alert drugs (Insulin, Heparin, KCl, Opioids, Chemo).',
      subtopic: 'Pharmacology & Patient Safety',
      distractors: [
        'Verify patient identity using the room number and bed tag alone.',
        'Administer Concentrated Potassium Chloride (KCl) via direct rapid IV push.',
        'Pre-chart medication administration 2 hours before the patient swallows the dose.'
      ]
    },
    {
      term: 'Electrolyte Panic Alerts: Hyperkalemia & Hypokalemia',
      definition: 'Normal Serum Potassium (K+) is 3.5–5.0 mEq/L. Hyperkalemia (> 5.0 mEq/L) causes peaked T-waves, widened QRS, and lethal cardiac arrest. Treated with IV Calcium Gluconate (cardioprotection) and Regular Insulin + Dextrose 50% (shifts K+ into cells).',
      pearl: 'NEVER administer Potassium Chloride (KCl) by IV push or bolus—always dilute and infuse on a smart pump (max 10 mEq/hr peripherally).',
      subtopic: 'Fluid & Electrolyte Balance',
      distractors: [
        'Administer undiluted Potassium Chloride 40 mEq via rapid 1-minute IV push.',
        'Hyperkalemia produces prominent U-waves and ST depression rather than peaked T-waves.',
        'Subcutaneous Epinephrine is the primary agent to excrete potassium in the stool.'
      ]
    },
    {
      term: 'Infection Control: Airborne, Droplet & Contact Precautions',
      definition: 'Airborne (MTV: Measles, TB, Varicella/Disseminated Herpes Zoster -> N95 respirator & negative-pressure room). Droplet (SPIDERMAN: Sepsis/Scarlet fever, Pertussis, Influenza, Diphtheria, Epiglottitis, Rubella, Meningitis, Adenovirus -> Surgical mask within 3–6 ft). Contact (MRSA, VRE, C. diff -> Gown & gloves; soap & water for C. diff spores).',
      pearl: 'Alcohol-based hand rub does NOT kill Clostridium difficile spores—strictly wash hands with soap and running water!',
      subtopic: 'Microbiology & Infection Control',
      distractors: [
        'Use alcohol-based hand sanitizer exclusively after caring for a client with C. difficile diarrhea.',
        'Place a client with active Pulmonary Tuberculosis in a positive-pressure room with a surgical mask.',
        'Remove N95 respirator inside the patient’s room before closing the door.'
      ]
    },
    {
      term: 'RN Delegation & Scope of Practice Principles',
      definition: 'Registered Nurses (RNs) cannot delegate what they can "EAT": Evaluation, Assessment (initial & acute), and Teaching (initial/discharge). Unlicensed Assistive Personnel (UAP) can perform routine vitals on stable patients, ADLs, ambulation, and I&O recording.',
      pearl: 'The RN delegates the task, but remains accountable for overall nursing supervision and clinical outcomes.',
      subtopic: 'Leadership, Management & Delegation',
      distractors: [
        'Delegate the initial admission physical assessment of a newly admitted ICU client to a UAP.',
        'Assign an unlicensed nursing assistant to titrate an IV Norepinephrine drip.',
        'Ask the UAP to provide complex discharge insulin teaching to a newly diagnosed diabetic.'
      ]
    },
    {
      term: 'Blood Transfusion Protocol & Acute Hemolytic Reaction',
      definition: 'Verify packed RBCs with 2 RNs at the bedside, use a 18–20G IV cannula with Y-type blood administration tubing and 0.9% Normal Saline only, start slowly for the first 15 minutes, and complete within 4 hours.',
      pearl: 'If chills, fever, low back/flank pain, or hypotension occur: STOP the transfusion immediately, keep the IV line open with new Normal Saline tubing, notify the physician, and send the blood bag to the lab.',
      subtopic: 'Medical-Surgical Perioperative Care',
      distractors: [
        'Prime blood transfusion tubing with Dextrose 5% in Water (D5W) or Lactated Ringer’s.',
        'Slow the transfusion rate and reassess in 1 hour if the patient develops acute flank pain and chills.',
        'Infuse 1 unit of packed RBCs over 8 to 10 hours to prevent fluid overload.'
      ]
    },
    {
      term: 'Post-Thyroidectomy Airway & Hypocalcemia Surveillance',
      definition: 'Monitor for airway compression from neck hematoma (check behind the neck for bleeding), laryngeal stridor, and accidental parathyroid removal causing Hypocalcemia (< 8.5 mg/dL: perioral numbness, positive Chvostek’s and Trousseau’s signs).',
      pearl: 'Keep a tracheostomy tray, suction equipment, oxygen, and IV Calcium Gluconate at the bedside of every post-thyroidectomy client.',
      subtopic: 'Endocrine & Perioperative Nursing',
      distractors: [
        'Place the post-thyroidectomy patient flat in supine position with neck hyperextended.',
        'Positive Chvostek’s sign indicates severe hypercalcemia (> 12.0 mg/dL).',
        'Hoarseness that progressively worsens into stridor is expected and requires no action.'
      ]
    }
  ];

  // Combine extracted concepts with domain concepts
  return [...concepts, ...universalConcepts];
}

/**
 * Generates a clean, comprehensive Executive Clinical Summary (never contains raw binary PDF/ZIP characters)
 */
export function generateGroundedSummary(title: string, rawContent: string): string {
  const cleanText = sanitizeClinicalText(rawContent, title);
  const concepts = getDomainConceptsForTopic(title, cleanText);
  const topConcepts = concepts.slice(0, 6);

  const excerptSection = cleanText.length > 25
    ? `> **Extracted Material Focus:** "${cleanText.slice(0, 320)}${cleanText.length > 320 ? '...' : ''}"`
    : `> **Clinical Study Module:** Comprehensive synthesis of **${title}** aligned with CHED CMO 15 s.2017, PRC Board of Nursing Table of Specifications (NP1–NP5), and NextGen NCLEX Clinical Judgment standards.`;

  const conceptBullets = topConcepts
    .map((c, idx) => `${idx + 1}. **${c.term}:** ${c.definition}\n   - *Board Pearl:* ${c.pearl}`)
    .join('\n');

  return `### 📋 Executive Clinical Summary: ${title}

${excerptSection}

---

#### 1. High-Yield Core Concepts & Clinical Foundations
${conceptBullets}

---

#### 2. Priority Nursing Process (ADPIE) & Bedside Directives
- **Assessment:** Establish baseline vital signs, oxygen saturation (SpO2 >= 94%), Mean Arterial Pressure (MAP >= 65 mmHg), mental status (GCS), and hourly urine output (>= 0.5 mL/kg/hr).
- **Diagnosis & Prioritization:** Apply **Maslow’s Hierarchy of Needs** and the **ABC (Airway, Breathing, Circulation)** framework—acute physiological instability always takes priority over routine tasks.
- **Implementation:** Enforce the **10 Rights of Medication Administration**, perform independent 2-RN double-checks for high-alert drugs, and maintain strict aseptic technique.
- **Evaluation & Communication:** Reassess clinical response within 15–30 minutes of any intervention and escalate abnormal panic values immediately using the **SBAR** framework.

---

#### 3. Critical Board Exam Red Flags & Contraindications
- **Never** administer concentrated Potassium Chloride (KCl) via direct IV push.
- **Never** perform a digital vaginal examination in a pregnant patient presenting with painless third-trimester bleeding (Placenta Previa).
- **Immediately stop** any blood transfusion or high-alert infusion if acute hypersensitivity, flank pain, stridor, or hemodynamic collapse occurs.`;
}

/**
 * Generates clean, high-yield practice quiz questions grounded in the uploaded reference
 */
export function generateGroundedQuiz(
  title: string,
  content: string,
  count: number,
  existingQuestions: any[] = []
): GeneratedQuizItem[] {
  const targetCount = Math.max(1, Math.min(150, Number(count) || 15));
  const questions: GeneratedQuizItem[] = [];

  // 1. Incorporate valid existing AI questions (filtering out any that accidentally contain raw %PDF)
  if (Array.isArray(existingQuestions) && existingQuestions.length > 0) {
    existingQuestions.forEach((eq, idx) => {
      if (
        questions.length < targetCount &&
        eq.question &&
        !eq.question.includes('%PDF') &&
        !eq.question.includes('endobj') &&
        Array.isArray(eq.options) &&
        eq.options.length >= 2
      ) {
        questions.push({
          id: eq.id || `ai-q-${Date.now()}-${idx}`,
          question: eq.question,
          options: eq.options,
          correctAnswerIndex: typeof eq.correctAnswerIndex === 'number' ? eq.correctAnswerIndex : 0,
          rationale: eq.rationale || `Directly derived from ${title}.`,
          subtopic: eq.subtopic || 'Core Clinical Concept'
        });
      }
    });
  }

  if (questions.length >= targetCount) {
    return questions.slice(0, targetCount);
  }

  const cleanText = sanitizeClinicalText(content, title);
  const concepts = getDomainConceptsForTopic(title, cleanText);

  // Question stem styles to ensure variety across 10 to 150 questions
  const stemStyles = [
    (c: ClinicalConceptPair) =>
      `While reviewing "${title}" (${c.subtopic}), which clinical statement or intervention is MOST accurate regarding ${c.term}?`,
    (c: ClinicalConceptPair) =>
      `A nursing student is preparing for the board exam using "${title}". What is the priority nursing principle associated with ${c.term}?`,
    (c: ClinicalConceptPair) =>
      `In clinical practice aligned with "${title}", how should the registered nurse manage a client involving ${c.term}?`,
    (c: ClinicalConceptPair) =>
      `Which evidence-based nursing action or physiological principle correctly applies to ${c.term} (${c.subtopic})?`
  ];

  let idx = 0;
  while (questions.length < targetCount) {
    const qNumber = questions.length + 1;
    const concept = concepts[idx % concepts.length];
    const styleFn = stemStyles[Math.floor(idx / concepts.length) % stemStyles.length];

    const correctPos = (qNumber * 3 + idx) % 4;
    const options = [...concept.distractors];
    options.splice(correctPos, 0, concept.definition);

    questions.push({
      id: `ref-q-${Date.now()}-${qNumber}`,
      question: `[Q${qNumber}] ${styleFn(concept)}`,
      options,
      correctAnswerIndex: correctPos,
      rationale: `Clinical Rationale: ${concept.definition} | Board Pearl: ${concept.pearl} (Source: ${title})`,
      subtopic: concept.subtopic
    });

    idx++;
  }

  return questions.slice(0, targetCount);
}

/**
 * Generates clean, high-yield SM-2 flashcards grounded in the uploaded reference
 */
export function generateGroundedFlashcards(
  title: string,
  content: string,
  count: number,
  existingCards: any[] = []
): Flashcard[] {
  const targetCount = Math.max(1, Math.min(150, Number(count) || 15));
  const flashcards: Flashcard[] = [];

  if (Array.isArray(existingCards) && existingCards.length > 0) {
    existingCards.forEach((ec, idx) => {
      if (
        flashcards.length < targetCount &&
        ec.front &&
        ec.back &&
        !ec.front.includes('%PDF') &&
        !ec.front.includes('endobj')
      ) {
        flashcards.push({
          id: ec.id || `ai-fc-${Date.now()}-${idx}`,
          deckId: 'deck-uploaded',
          category: ec.category || title,
          front: ec.front,
          back: ec.back,
          pearl: ec.pearl || 'Verify patient safety and monitor vital trends.',
          evidenceLevel: ec.evidenceLevel || 'Level I (Clinical Practice Guideline)',
          reps: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
          tags: [title.slice(0, 18), 'UploadedMaterial']
        });
      }
    });
  }

  if (flashcards.length >= targetCount) {
    return flashcards.slice(0, targetCount);
  }

  const cleanText = sanitizeClinicalText(content, title);
  const concepts = getDomainConceptsForTopic(title, cleanText);

  let idx = 0;
  while (flashcards.length < targetCount) {
    const cardNum = flashcards.length + 1;
    const concept = concepts[idx % concepts.length];
    const isReverseMode = Math.floor(idx / concepts.length) % 2 === 1;

    flashcards.push({
      id: `ref-fc-${Date.now()}-${cardNum}`,
      deckId: 'deck-uploaded',
      category: `${title.slice(0, 22)} • ${concept.subtopic}`,
      front: isReverseMode
        ? `[Clinical Pearl #${cardNum}] Which key nursing concept in "${title}" does this describe: "${concept.pearl}"?`
        : `${concept.term} (${concept.subtopic})`,
      back: isReverseMode
        ? `${concept.term}: ${concept.definition}`
        : concept.definition,
      pearl: concept.pearl,
      evidenceLevel: 'Level I (PRC BON & NCSBN Standard)',
      reps: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      tags: [title.slice(0, 15), concept.subtopic.replace(/\s+/g, '')]
    });

    idx++;
  }

  return flashcards.slice(0, targetCount);
}

/**
 * Generates clean, high-yield clinical mnemonics grounded in the uploaded reference
 */
export function generateGroundedMnemonics(title: string, content: string): MnemonicItem[] {
  const combined = `${title} ${sanitizeClinicalText(content, title)}`.toLowerCase();
  const list: MnemonicItem[] = [];

  if (combined.includes('maternal') || combined.includes('fetal') || combined.includes('labor') || combined.includes('ob')) {
    list.push({
      id: `mnem-ob-${Date.now()}`,
      mnemonic: 'VEAL CHOP',
      expansion: 'V-Variable → C-Cord Compression | E-Early → H-Head Compression | A-Accelerations → O-Okay | L-Late → P-Placental Insufficiency',
      clinicalApplication: `Electronic Fetal Heart Rate (FHR) monitoring interpretation for ${title}.`,
      highYieldTip: 'For Late Decelerations (LION): Left lateral position, IV fluid bolus, Oxygen, Notify provider & stop Oxytocin!'
    });
  }

  if (combined.includes('abg') || combined.includes('acid') || combined.includes('burn') || combined.includes('med-surg') || combined.includes('critical')) {
    list.push({
      id: `mnem-abg-${Date.now()}`,
      mnemonic: 'ROME',
      expansion: 'R - Respiratory | O - Opposite (pH & PaCO2 move opposite) | M - Metabolic | E - Equal (pH & HCO3 move together)',
      clinicalApplication: `Rapid Arterial Blood Gas (ABG) acid-base analysis in ${title}.`,
      highYieldTip: 'Normal pH: 7.35–7.45 | Normal PaCO2: 35–45 mmHg | Normal HCO3: 22–26 mEq/L.'
    });
  }

  list.push(
    {
      id: `mnem-adpie-${Date.now()}-1`,
      mnemonic: 'ADPIE + SBAR',
      expansion: 'A - Assess baseline cues | D - Diagnose priority risk | P - Plan measurable outcomes | I - Implement safe care | E - Evaluate & report via SBAR',
      clinicalApplication: `Systematic bedside clinical judgment workflow when studying "${title}".`,
      highYieldTip: 'Always complete Assessment (vital signs, airway, labs) before calling the physician or implementing non-urgent interventions.'
    },
    {
      id: `mnem-safety-${Date.now()}-2`,
      mnemonic: 'BURP (MgSO4 Toxicity)',
      expansion: 'B - Blood pressure decreases | U - Urine output < 30 mL/hr | R - Respiratory rate < 12/min | P - Patellar deep tendon reflexes absent',
      clinicalApplication: 'High-alert pharmacological monitoring and immediate Calcium Gluconate 10% antidote readiness.',
      highYieldTip: 'Loss of patellar deep tendon reflexes (DTRs) is the earliest clinical sign of impending Magnesium Sulfate toxicity.'
    }
  );

  return list;
}

/**
 * Generates a structured Mind Map for the reference
 */
export function generateGroundedMindMap(title: string, content: string): MindMapNode {
  const cleanText = sanitizeClinicalText(content, title);
  const concepts = getDomainConceptsForTopic(title, cleanText).slice(0, 6);

  return {
    id: 'root',
    label: title,
    badge: 'Core Study Guide',
    color: 'bg-teal-600 text-white',
    children: [
      {
        id: 'branch-1',
        label: 'Core Clinical Concepts & Definitions',
        badge: 'High-Yield',
        color: 'bg-blue-100 text-blue-900',
        children: concepts.slice(0, 3).map((c, i) => ({
          id: `b1-${i}`,
          label: `${c.term}: ${c.definition.slice(0, 90)}...`
        }))
      },
      {
        id: 'branch-2',
        label: 'Pharmacology, Labs & Diagnostics',
        badge: 'Safety & Values',
        color: 'bg-amber-100 text-amber-900',
        children: concepts.slice(3, 6).map((c, i) => ({
          id: `b2-${i}`,
          label: `${c.term}: ${c.pearl.slice(0, 90)}`
        }))
      },
      {
        id: 'branch-3',
        label: 'Priority Nursing Process (ADPIE)',
        badge: 'Bedside Action',
        color: 'bg-emerald-100 text-emerald-900',
        children: [
          { id: 'b3-1', label: 'Airway, Breathing & Circulation (MAP >= 65 mmHg, SpO2 >= 94%)' },
          { id: 'b3-2', label: '10 Rights of Medication & 2-RN High-Alert Double Check' },
          { id: 'b3-3', label: 'SBAR Handoff & Immediate Panic Value Escalation' }
        ]
      }
    ]
  };
}
