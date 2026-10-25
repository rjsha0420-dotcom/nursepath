import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  FileCheck,
  Award
} from 'lucide-react';
import { HospitalRotationRecord, CommunityLogbookEntry } from '../../../types';
import { CHED_CLINICAL_REQUIREMENTS } from '../../../data/mockCurriculum';
import { 
  getHospitalRotations, 
  saveHospitalRotation, 
  deleteHospitalRotation,
  getCommunityLogbook,
  saveCommunityLogbookEntry,
  deleteCommunityLogbookEntry
} from '../../../services/storageService';

export const ClinicalLogbook: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'hospitals' | 'community' | 'requirements'>('hospitals');
  const [hospitalRotations, setHospitalRotations] = useState<HospitalRotationRecord[]>([]);
  const [communityEntries, setCommunityEntries] = useState<CommunityLogbookEntry[]>([]);

  // Add Hospital Placement state
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [departmentWard, setDepartmentWard] = useState<HospitalRotationRecord['departmentWard']>('Operating Room (OR)');
  const [rotationType, setRotationType] = useState<HospitalRotationRecord['rotationType']>('Major Scrub');
  const [dateStarted, setDateStarted] = useState('');
  const [dateEnded, setDateEnded] = useState('');
  const [hoursCompleted, setHoursCompleted] = useState<number>(160);
  const [caseCount, setCaseCount] = useState<number>(5);
  const [clinicalInstructor, setClinicalInstructor] = useState('');
  const [hospitalNotes, setHospitalNotes] = useState('');

  // Add Community Entry state
  const [isAddingCommunity, setIsAddingCommunity] = useState(false);
  const [commLocation, setCommLocation] = useState('');
  const [rhuName, setRhuName] = useState('');
  const [commActivities, setCommActivities] = useState('');
  const [commPeople, setCommPeople] = useState('');
  const [clientFamily, setClientFamily] = useState('');
  const [healthFindings, setHealthFindings] = useState('');
  const [commInterventions, setCommInterventions] = useState('');
  const [commHours, setCommHours] = useState<number>(8);

  useEffect(() => {
    setHospitalRotations(getHospitalRotations());
    setCommunityEntries(getCommunityLogbook());
  }, []);

  const handleSaveHospitalRotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim()) return;

    const newRecord: HospitalRotationRecord = {
      id: 'rot-' + Date.now(),
      affiliatedHospital: hospitalName.trim(),
      departmentWard,
      rotationType,
      dateStarted: dateStarted || new Date().toISOString().slice(0, 10),
      dateEnded: dateEnded || new Date().toISOString().slice(0, 10),
      hoursCompleted: Number(hoursCompleted) || 0,
      caseCount: Number(caseCount) || 0,
      clinicalInstructor: clinicalInstructor.trim() || 'Clinical Coordinator, RN, MAN',
      status: 'verified',
      notes: hospitalNotes.trim() || undefined
    };

    saveHospitalRotation(newRecord);
    setHospitalRotations(getHospitalRotations());
    setHospitalName('');
    setHospitalNotes('');
    setIsAddingHospital(false);
  };

  const handleDeleteHospitalRotation = (id: string) => {
    deleteHospitalRotation(id);
    setHospitalRotations(getHospitalRotations());
  };

  const handleSaveCommunityEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commLocation.trim()) return;

    const newEntry: CommunityLogbookEntry = {
      id: 'chn-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      assignedLocation: commLocation.trim(),
      rhuOrBhsName: rhuName.trim() || 'Barangay Health Station',
      activitiesConducted: commActivities 
        ? commActivities.split(',').map((a) => a.trim()) 
        : ['Home Visit', 'Bag Technique Demonstration'],
      peopleInteracted: commPeople 
        ? commPeople.split(',').map((p) => p.trim()) 
        : ['Barangay Health Worker (BHW)', 'Family Head'],
      clientOrFamilyName: clientFamily.trim() || undefined,
      healthAssessmentFindings: healthFindings.trim() || 'General community health assessment completed.',
      interventionsProvided: commInterventions.trim() || 'Health education and vital signs monitoring conducted.',
      hoursSpent: Number(commHours) || 8,
      verifiedByPreceptor: true
    };

    saveCommunityLogbookEntry(newEntry);
    setCommunityEntries(getCommunityLogbook());
    setCommLocation('');
    setRhuName('');
    setCommActivities('');
    setCommPeople('');
    setClientFamily('');
    setHealthFindings('');
    setCommInterventions('');
    setIsAddingCommunity(false);
  };

  const handleDeleteCommunityEntry = (id: string) => {
    deleteCommunityLogbookEntry(id);
    setCommunityEntries(getCommunityLogbook());
  };

  const totalHospitalHours = hospitalRotations.reduce((acc, curr) => acc + curr.hoursCompleted, 0);
  const totalCommunityHours = communityEntries.reduce((acc, curr) => acc + curr.hoursSpent, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PRC Resolution No. 2004-179 & CMO 15 s.2017
          </span>
          <span className="text-teal-300 text-xs font-semibold">Verified Clinical Logbook</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Clinical Hours (RLE) & Community Health Nursing Logbook
        </h2>
        <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-3xl leading-relaxed">
          Monitor your affiliated hospital rotations, special rotations (OR, DR, ICU, ER), and public health community placements tracking location, activities, and stakeholders.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-teal-300" />
            <span>Hospital Hours Logged: <strong>{totalHospitalHours} hrs</strong></span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-teal-300" />
            <span>Community Hours Logged: <strong>{totalCommunityHours} hrs</strong></span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <Award className="w-4 h-4 text-teal-300" />
            <span>Total Verified RLE: <strong>{totalHospitalHours + totalCommunityHours} hrs</strong></span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('hospitals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'hospitals'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Affiliated Hospitals & Rotations ({hospitalRotations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('community')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'community'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Community Health (CHN) Logbook ({communityEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('requirements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'requirements'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Mandated Board Requirements</span>
        </button>
      </div>

      {/* SUB-TAB 1: Affiliated Hospital Rotations */}
      {activeSubTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Hospital Placements & Special Rotations
              </h4>
              <p className="text-xs text-slate-500">
                Accredited affiliated hospitals where clinical competencies and cases were completed.
              </p>
            </div>
            <button
              onClick={() => setIsAddingHospital(!isAddingHospital)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingHospital ? 'Cancel' : 'Log New Placement'}</span>
            </button>
          </div>

          {/* Add Hospital Form */}
          {isAddingHospital && (
            <form
              onSubmit={handleSaveHospitalRotation}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn"
            >
              <h5 className="font-bold text-xs text-slate-800">New Hospital RLE Placement</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Affiliated Hospital Name *
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Philippine General Hospital (PGH) / UST Hospital"
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Department / Ward *
                  </label>
                  <select
                    value={departmentWard}
                    onChange={(e) => setDepartmentWard(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  >
                    <option value="Operating Room (OR)">Operating Room (OR)</option>
                    <option value="Delivery Room (DR)">Delivery Room (DR)</option>
                    <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU/CCU)</option>
                    <option value="Emergency Room (ER)">Emergency Room (ER)</option>
                    <option value="Pediatrics">Pediatric Ward</option>
                    <option value="Medical Ward">Medical-Surgical Ward</option>
                    <option value="Psychiatric Facility">Psychiatric Facility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Rotation Focus
                  </label>
                  <select
                    value={rotationType}
                    onChange={(e) => setRotationType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  >
                    <option value="Major Scrub">Major Scrub Cases</option>
                    <option value="Minor Scrub">Minor Scrub Cases</option>
                    <option value="Spontaneous Delivery">Spontaneous Deliveries</option>
                    <option value="Cord Care">Newborn Cord Care</option>
                    <option value="Critical Care">Critical Care / Hemodynamics</option>
                    <option value="Emergency Triage">Emergency Triage</option>
                    <option value="General Ward">General Bedside Care</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Hours Completed
                  </label>
                  <input
                    type="number"
                    value={hoursCompleted}
                    onChange={(e) => setHoursCompleted(Number(e.target.value))}
                    min={1}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Cases Completed
                  </label>
                  <input
                    type="number"
                    value={caseCount}
                    onChange={(e) => setCaseCount(Number(e.target.value))}
                    min={0}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Clinical Instructor
                  </label>
                  <input
                    type="text"
                    value={clinicalInstructor}
                    onChange={(e) => setClinicalInstructor(e.target.value)}
                    placeholder="e.g. Prof. Santos, RN, MAN"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Cases & Clinical Highlights
                </label>
                <textarea
                  value={hospitalNotes}
                  onChange={(e) => setHospitalNotes(e.target.value)}
                  rows={2}
                  placeholder="Record specific surgical procedures scrubbed, patient diagnoses, or specialized equipment operated..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-teal-600"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingHospital(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                >
                  Save Hospital Placement
                </button>
              </div>
            </form>
          )}

          {/* Hospital Rotations Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitalRotations.map((rot) => (
              <div
                key={rot.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {rot.affiliatedHospital}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 mt-1 inline-block">
                      {rot.departmentWard} • {rot.rotationType}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                {rot.notes && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {rot.notes}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  <div>
                    Hours: <strong className="text-slate-900">{rot.hoursCompleted} Hours</strong>
                  </div>
                  <div>
                    Cases: <strong className="text-slate-900">{rot.caseCount} Verified</strong>
                  </div>
                  <div className="col-span-2 text-[10px] text-slate-500">
                    Preceptor: <span className="font-medium text-slate-700">{rot.clinicalInstructor}</span> ({rot.dateStarted} to {rot.dateEnded})
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDeleteHospitalRotation(rot.id)}
                    className="text-slate-400 hover:text-rose-600 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Entry</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Community Health Nursing (CHN) Field Logbook */}
      {activeSubTab === 'community' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Community Health Nursing (CHN) Field Logbook
              </h4>
              <p className="text-xs text-slate-500">
                Track assigned barangay location, community health activities, and people/stakeholders interacted with.
              </p>
            </div>
            <button
              onClick={() => setIsAddingCommunity(!isAddingCommunity)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCommunity ? 'Cancel' : 'Log Community Duty'}</span>
            </button>
          </div>

          {/* Add Community Duty Form */}
          {isAddingCommunity && (
            <form
              onSubmit={handleSaveCommunityEntry}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn"
            >
              <h5 className="font-bold text-xs text-slate-800">New Community Duty Entry</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Assigned Location (Barangay, City) *
                  </label>
                  <input
                    type="text"
                    value={commLocation}
                    onChange={(e) => setCommLocation(e.target.value)}
                    placeholder="e.g. Barangay Commonwealth, Quezon City"
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    RHU / Barangay Health Station Name
                  </label>
                  <input
                    type="text"
                    value={rhuName}
                    onChange={(e) => setRhuName(e.target.value)}
                    placeholder="e.g. Commonwealth Rural Health Center"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Community Activities Conducted (comma separated)
                  </label>
                  <input
                    type="text"
                    value={commActivities}
                    onChange={(e) => setCommActivities(e.target.value)}
                    placeholder="e.g. Home Visit, Bag Technique, EPI Vaccination, FNCP"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    People / Stakeholders Interacted With (comma separated)
                  </label>
                  <input
                    type="text"
                    value={commPeople}
                    onChange={(e) => setCommPeople(e.target.value)}
                    placeholder="e.g. BHW Ate Susan, Rural Health Midwife, Family Head"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Health Assessment Findings & Interventions Provided
                </label>
                <textarea
                  value={healthFindings}
                  onChange={(e) => setHealthFindings(e.target.value)}
                  rows={2}
                  placeholder="Clinical assessment (vital signs, immunization status, water source, nutrition) and public health nursing interventions provided..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-teal-600"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCommunity(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                >
                  Save Community Entry
                </button>
              </div>
            </form>
          )}

          {/* Community Entries Cards */}
          <div className="space-y-4">
            {communityEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-teal-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-teal-700" />
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {entry.assignedLocation}
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                        {entry.rhuOrBhsName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-slate-500">{entry.date}</span>
                    <span className="bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded">
                      {entry.hoursSpent} Hours
                    </span>
                  </div>
                </div>

                {/* Activities Conducted */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Activities Conducted:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.activitiesConducted.map((act, idx) => (
                      <span
                        key={idx}
                        className="bg-teal-50 text-teal-900 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-teal-200/60"
                      >
                        ✓ {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* People Interacted With */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Stakeholders & People Interacted With:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.peopleInteracted.map((person, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        👥 {person}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clinical Findings */}
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div>
                    <strong className="text-slate-900">Assessment Findings:</strong> {entry.healthAssessmentFindings}
                  </div>
                  {entry.interventionsProvided && (
                    <div>
                      <strong className="text-slate-900">Interventions & Health Teaching:</strong> {entry.interventionsProvided}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-teal-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Public Health Preceptor Verified</span>
                  </span>
                  <button
                    onClick={() => handleDeleteCommunityEntry(entry.id)}
                    className="text-slate-400 hover:text-rose-600 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Mandated Board Requirements */}
      {activeSubTab === 'requirements' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            CHED CMO 15 s.2017 & PRC Board of Nursing Mandated Cases
          </h3>
          <p className="text-xs text-slate-500">
            Mandatory clinical requirements for eligibility to take the Philippine Nurse Licensure Examination (PNLE):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {CHED_CLINICAL_REQUIREMENTS.map((item, idx) => {
              const percent = Math.min(100, Math.round((item.completedCount / item.requiredCount) * 100));
              const isComplete = item.completedCount >= item.requiredCount;

              return (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isComplete ? '100% Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Mandated: {item.requiredCount}</span>
                    <span className="font-bold text-teal-800">{item.completedCount} Logged ({percent}%)</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-teal-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Accredited Facility: {item.minimumLevel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
