import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Calculator, 
  FileText, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronDown,
  Layers,
  Heart
} from 'lucide-react';
import { CLINICAL_DRUGS, CLINICAL_LABS, SPECIALTY_REVIEWERS, MOCK_CPD_RECORDS } from '../../data/mockClinicalTools';
import { DrugItem, LabItem, UserProfile } from '../../types';

interface ClinicalToolsPageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const ClinicalToolsPage: React.FC<ClinicalToolsPageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'drug_guide' | 'abg_calc' | 'iv_calc' | 'lab_values' | 'specialties' | 'cpd'>('drug_guide');

  // Drug search state
  const [drugSearch, setDrugSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<DrugItem>(CLINICAL_DRUGS[0]);

  const filteredDrugs = CLINICAL_DRUGS.filter((d) => 
    d.genericName.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.drugClass.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.brandNames.some((b) => b.toLowerCase().includes(drugSearch.toLowerCase()))
  );

  // ABG Calculator state
  const [ph, setPh] = useState<string>('7.32');
  const [paco2, setPaco2] = useState<string>('48');
  const [hco3, setHco3] = useState<string>('24');

  const analyzeABG = () => {
    const numPh = parseFloat(ph);
    const numCo2 = parseFloat(paco2);
    const numHco3 = parseFloat(hco3);

    if (isNaN(numPh) || isNaN(numCo2) || isNaN(numHco3)) {
      return { interpretation: 'Please enter valid numerical values.', alert: 'neutral' };
    }

    const isAcidemic = numPh < 7.35;
    const isAlkalemic = numPh > 7.45;
    const isNormalPh = !isAcidemic && !isAlkalemic;

    const co2High = numCo2 > 45;
    const co2Low = numCo2 < 35;
    const hco3High = numHco3 > 26;
    const hco3Low = numHco3 < 22;

    if (isAcidemic) {
      if (co2High && !hco3Low) {
        return { interpretation: 'Uncompensated Respiratory Acidosis (e.g. COPD, Hypoventilation, Opioid overdose)', alert: 'danger' };
      }
      if (hco3Low && !co2High) {
        return { interpretation: 'Uncompensated Metabolic Acidosis (e.g. DKA, Lactic acidosis, Renal failure, Severe diarrhea)', alert: 'danger' };
      }
      if (co2High && hco3High) {
        return { interpretation: 'Partially Compensated Respiratory Acidosis (Kidneys retaining HCO3 to buffer PaCO2)', alert: 'warning' };
      }
    } else if (isAlkalemic) {
      if (co2Low && !hco3High) {
        return { interpretation: 'Uncompensated Respiratory Alkalosis (e.g. Hyperventilation, Anxiety, Early Sepsis)', alert: 'danger' };
      }
      if (hco3High && !co2Low) {
        return { interpretation: 'Uncompensated Metabolic Alkalosis (e.g. Severe Vomiting, Nasogastric suctioning, Diuretic excess)', alert: 'danger' };
      }
      if (co2High && hco3High) {
        return { interpretation: 'Partially Compensated Metabolic Alkalosis (Lungs hypoventilating to retain CO2)', alert: 'warning' };
      }
    } else {
      if (co2High && hco3High) {
        return { interpretation: 'Fully Compensated Respiratory Acidosis or Metabolic Alkalosis (Normal pH with abnormal buffers)', alert: 'normal' };
      }
      return { interpretation: 'Normal Arterial Blood Gas (Normal acid-base equilibrium)', alert: 'normal' };
    }

    return { interpretation: 'Mixed Acid-Base Disturbance. Correlate with client clinical condition and anion gap.', alert: 'warning' };
  };

  // IV Drip Calculator state
  const [volumeMl, setVolumeMl] = useState<number>(1000);
  const [timeHours, setTimeHours] = useState<number>(8);
  const [dripFactor, setDripFactor] = useState<number>(15); // standard macro 15 gtts/mL
  const flowRateMlHr = timeHours > 0 ? Math.round(volumeMl / timeHours) : 0;
  const dripRateGtts = timeHours > 0 ? Math.round((volumeMl * dripFactor) / (timeHours * 60)) : 0;

  // Lab Search
  const [labSearch, setLabSearch] = useState('');
  const filteredLabs = CLINICAL_LABS.filter((l) => 
    l.name.toLowerCase().includes(labSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(labSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🩺 Specialist Practitioner & Bedside Tools
            </span>
            <span className="text-teal-300 text-xs font-semibold">Evidence-Based Clinical Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hospital Bedside References & 10 Specialty Certifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Essential tools for hospital staff nurses and clinical preceptors: High-alert drug administration with IV push rates & antidotes, advanced ABG analysis, IV infusion calculators, critical lab alerts, and CCRN/CEN certification prep.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'drug_guide', label: '💊 Bedside Drug Database', badge: 'Push Rates & Antidotes' },
          { id: 'abg_calc', label: '🫁 Advanced ABG Analyzer', badge: 'ROME Calculator' },
          { id: 'iv_calc', label: '💧 IV Drip & Dose Calculator', badge: 'mL/hr & gtts' },
          { id: 'lab_values', label: '🧪 Critical Lab Values Guide', badge: 'Conventional & SI' },
          { id: 'specialties', label: '🏅 10 Clinical Specialty Reviews', badge: 'CCRN • CEN • CPN' },
          { id: 'cpd', label: '📋 PRC CPD Hours Tracker', badge: 'PRC & Global Units' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Drug Database */}
      {activeTab === 'drug_guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={drugSearch}
                onChange={(e) => setDrugSearch(e.target.value)}
                placeholder="Search generic, brand, or class..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredDrugs.map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => setSelectedDrug(drug)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedDrug.id === drug.id
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{drug.genericName}</span>
                    {drug.highAlert && (
                      <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                        High Alert
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{drug.drugClass}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Drug Details */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedDrug.drugClass}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedDrug.genericName}
                </h2>
                <p className="text-xs text-slate-500">
                  Brand Names: {selectedDrug.brandNames.join(', ')}
                </p>
              </div>

              {selectedDrug.antidote && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900">
                  <span className="font-bold block text-[10px] uppercase">Specific Antidote:</span>
                  <strong>{selectedDrug.antidote}</strong>
                </div>
              )}
            </div>

            {/* IV Administration Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4 text-blue-700" />
                <span>IV Administration & Push Rate Standards</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Push Rate:</span>
                  <strong className="text-blue-950">{selectedDrug.ivAdministration.pushRate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Dilution:</span>
                  <strong className="text-blue-950">{selectedDrug.ivAdministration.dilution}</strong>
                </div>
              </div>
            </div>

            {/* Nursing Considerations */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Priority Nursing Considerations & Monitoring:
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {selectedDrug.nursingConsiderations.map((nc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{nc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABG Analyzer */}
      {activeTab === 'abg_calc' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              Interactive Arterial Blood Gas (ABG) Analyzer
            </h2>
            <p className="text-xs text-slate-500">
              Enter bedside ABG values to determine primary disturbance and renal/pulmonary compensation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">pH (7.35 - 7.45)</label>
              <input
                type="number"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full p-2.5 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PaCO2 (35 - 45 mmHg)</label>
              <input
                type="number"
                step="1"
                value={paco2}
                onChange={(e) => setPaco2(e.target.value)}
                className="w-full p-2.5 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">HCO3 (22 - 26 mEq/L)</label>
              <input
                type="number"
                step="1"
                value={hco3}
                onChange={(e) => setHco3(e.target.value)}
                className="w-full p-2.5 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Result Card */}
          {(() => {
            const analysis = analyzeABG();
            return (
              <div className={`p-5 rounded-2xl border-2 space-y-2 ${
                analysis.alert === 'danger'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : analysis.alert === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <span className="text-[10px] font-black uppercase tracking-wider block">Clinical Interpretation</span>
                <h3 className="text-base font-black">{analysis.interpretation}</h3>
              </div>
            );
          })()}

          {/* ROME Mnemonic Quick Ref */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <strong className="block text-slate-900 font-bold">ROME Method Reminder:</strong>
            <p><strong>R - O</strong>: Respiratory Opposite (pH ↑ with PaCO2 ↓ = Alkalosis; pH ↓ with PaCO2 ↑ = Acidosis)</p>
            <p><strong>M - E</strong>: Metabolic Equal (pH ↑ with HCO3 ↑ = Alkalosis; pH ↓ with HCO3 ↓ = Acidosis)</p>
          </div>
        </div>
      )}

      {/* TAB 3: IV Drip Calculator */}
      {activeTab === 'iv_calc' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              High-Precision IV Infusion Rate Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Calculate automated infusion pump rate (mL/hr) and gravity drip rate (gtts/min).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Volume to Infuse (mL)</label>
              <input
                type="number"
                value={volumeMl}
                onChange={(e) => setVolumeMl(Number(e.target.value))}
                className="w-full p-2.5 font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Time (Hours)</label>
              <input
                type="number"
                value={timeHours}
                onChange={(e) => setTimeHours(Number(e.target.value))}
                className="w-full p-2.5 font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Drop Factor (gtts/mL)</label>
              <select
                value={dripFactor}
                onChange={(e) => setDripFactor(Number(e.target.value))}
                className="w-full p-2.5 font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value={15}>15 gtts/mL (Standard Macro)</option>
                <option value={20}>20 gtts/mL (Macro)</option>
                <option value={10}>10 gtts/mL (Blood set)</option>
                <option value={60}>60 gtts/mL (Microdrip / Pedia)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Infusion Pump Setting</span>
              <div className="text-3xl font-black text-blue-900 mt-1">{flowRateMlHr}</div>
              <span className="text-xs text-slate-600 font-medium">mL / hour</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-bold text-teal-700 uppercase block">Gravity Drip Setting</span>
              <div className="text-3xl font-black text-teal-900 mt-1">{dripRateGtts}</div>
              <span className="text-xs text-slate-600 font-medium">drops / min (gtts/min)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Lab Values Guide */}
      {activeTab === 'lab_values' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={labSearch}
              onChange={(e) => setLabSearch(e.target.value)}
              placeholder="Search lab test (e.g. Potassium, Sodium, Troponin, Creatinine)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLabs.map((lab) => (
              <div key={lab.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                    {lab.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{lab.siUnits}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{lab.name}</h3>
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Normal Range:</span>
                  <strong className="text-slate-900 text-sm">{lab.conventionalRange}</strong>
                </div>
                <div className="text-xs space-y-1 pt-1">
                  <div className="text-rose-700 font-semibold text-[11px]">
                    Critical Alerts: &lt; {lab.criticalLow} | &gt; {lab.criticalHigh}
                  </div>
                  <p className="text-[11px] text-slate-600">{lab.priorityAlert}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 10 Specialty Certification Reviews */}
      {activeTab === 'specialties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIALTY_REVIEWERS.map((spec) => (
            <div key={spec.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-indigo-50 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  {spec.acronym} • {spec.boardAgency}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">{spec.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{spec.description}</p>
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Key Blueprint Focus:</span>
                  {spec.keyTopics.slice(0, 3).map((t, idx) => (
                    <div key={idx} className="text-[11px] text-slate-700 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{spec.sampleQuestionsCount} Mock Items</span>
                <span className="font-bold text-indigo-700">{spec.credentialLevel}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: CPD Hours Tracker */}
      {activeTab === 'cpd' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Continuing Professional Development (CPD) Unit Tracker
              </h2>
              <p className="text-xs text-slate-500">
                PRC Board of Nursing License Renewal (RA 10912 CPD Act) & Global Revalidation Logs.
              </p>
            </div>
            <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-lg border border-teal-200">
              Total Logged: 15 / 15 Units Required
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_CPD_RECORDS.map((cpd) => (
              <div key={cpd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {cpd.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{cpd.title}</h4>
                  <p className="text-slate-500 text-[11px]">Provider: {cpd.provider} • Date: {cpd.dateCompleted}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-teal-700">+{cpd.units} Units</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">PRC Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
