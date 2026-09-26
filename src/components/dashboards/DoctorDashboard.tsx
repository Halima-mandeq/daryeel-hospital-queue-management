import { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  HeartPulse, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Pill, 
  ArrowRight, 
  ChevronRight,
  Activity,
  Send,
  Sparkles,
  PhoneCall,
  Bed,
  Check,
  FlaskConical,
  FileCheck,
  History
} from 'lucide-react';
import { Patient, DoctorRoom, UserProfile, ThemePalette, LabTestOrder } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { MedicalHistoryModal } from '../MedicalHistoryModal';
import { OfficialMedicalCertificateModal } from '../OfficialMedicalCertificateModal';
import { LAB_TEST_CATALOG } from '../../data/mockLabData';

interface DoctorDashboardProps {
  currentUser: UserProfile;
  patients: Patient[];
  rooms: DoctorRoom[];
  labOrders?: LabTestOrder[];
  onOrderLabTest?: (order: LabTestOrder) => void;
  onCallNextPatient: (roomId: string) => void;
  onCompletePatient: (patientId: string, doctorNotes: string, prescriptions: string[]) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function DoctorDashboard({
  currentUser,
  patients,
  rooms,
  labOrders = [],
  onOrderLabTest,
  onCallNextPatient,
  onCompletePatient,
  lang,
  theme,
}: DoctorDashboardProps) {
  const styles = getThemeStyles(theme);

  // Match doctor's assigned room or fallback to room-1
  const assignedRoom = rooms.find((r) => r.id === currentUser.assignedRoomId) || rooms[0];
  const activePatient = patients.find((p) => p.id === assignedRoom?.currentPatientId);

  // Doctor's clinical notes & prescription inputs
  const [notes, setNotes] = useState('');
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [quickDosage, setQuickDosage] = useState('');

  // Modals state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [selectedLabCode, setSelectedLabCode] = useState('CBC');
  const [labPriority, setLabPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');

  // Active patient lab orders
  const patientLabTests = labOrders.filter(l => l.ticketNumber === activePatient?.ticketNumber);

  // Queue of patients waiting
  const waitingPatients = patients
    .filter((p) => p.status === 'waiting')
    .sort((a, b) => {
      if (a.triageScore !== b.triageScore) return a.triageScore - b.triageScore;
      return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    });

  // Completed patients today by this room or generally
  const completedPatients = patients.filter((p) => p.status === 'completed');

  const handleAddPrescription = (med: string) => {
    if (!med.trim()) return;
    setPrescriptions((prev) => [...prev, med.trim()]);
    setPrescriptionInput('');
  };

  const handleFinishConsultation = () => {
    if (!activePatient) return;
    onCompletePatient(activePatient.id, notes, prescriptions);
    setNotes('');
    setPrescriptions([]);
  };

  const commonMeds = [
    'Amoxicillin 500mg (3x Maalintii - 5 Maalmood)',
    'Paracetamol 500mg (Haddii xummad jirto)',
    'Ferrous Sulphate + Folic Acid (Hooyada Uurka leh)',
    'Oral Rehydration Salts (ORS) + Zinc',
    'Artemether-Lumefantrine (Malaria)',
    'Ceftriaxone 1g IV (Degdeg)',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Doctor Header Banner */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
                {assignedRoom ? assignedRoom.roomName : 'Qolka Baaritaanka'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {lang === 'so' ? 'Qolku Waa Furan Yahay' : 'Room Operational'}
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-extrabold font-display ${styles.textPrimary}`}>
              {currentUser.name}
            </h1>
            <p className={`text-xs ${styles.textSecondary}`}>
              {currentUser.title} · {currentUser.department}
            </p>
          </div>
        </div>

        {/* Quick Room Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => assignedRoom && onCallNextPatient(assignedRoom.id)}
            disabled={waitingPatients.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>
              {lang === 'so'
                ? `U Yeer Bukaanka Xiga (${waitingPatients.length} Sugaya)`
                : `Call Next Patient (${waitingPatients.length} Waiting)`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Patient In Consultation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Bukaanka Hadda Qolka Kula Jooga' : 'Active Patient Under Consultation'}
                </h2>
              </div>
              {activePatient && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {activePatient.ticketNumber}
                </span>
              )}
            </div>

            {activePatient ? (
              <div className="pt-5 space-y-6">
                {/* Patient Overview Card */}
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {activePatient.fullName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {activePatient.age} {lang === 'so' ? 'jir' : 'years'} · {activePatient.gender === 'female' ? (lang === 'so' ? 'Dheddig' : 'Female') : (lang === 'so' ? 'Lab' : 'Male')}
                      {activePatient.pregnancyWeek && ` · Uurka: ${activePatient.pregnancyWeek} Toddobaad`}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono">
                      📞 {activePatient.phone}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      activePatient.triageLevel === 'emergency'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : activePatient.triageLevel === 'urgent'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                      {activePatient.triageLevel === 'emergency' ? 'P-1 Degdeg Halis' : activePatient.triageLevel === 'urgent' ? 'P-2 Degdeg' : 'P-3 Caadi'}
                    </span>
                  </div>
                </div>

                {/* Quick Clinical Tool Buttons: EHR, Lab, Sick Leave */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <History className="h-4 w-4 text-blue-600" />
                    <span>{lang === 'so' ? 'Taariikhda Bukaanka (EHR)' : 'Medical History (EHR)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLabOrderModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <FlaskConical className="h-4 w-4 text-indigo-600" />
                    <span>{lang === 'so' ? 'Dalbo Baaritaan (Lab Order)' : 'Order Lab Test'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <FileCheck className="h-4 w-4 text-purple-600" />
                    <span>{lang === 'so' ? 'Warqadda Fasaxa (Sick Leave)' : 'Medical Certificate'}</span>
                  </button>
                </div>

                {/* Live Diagnostic Findings from Laboratory */}
                {patientLabTests.length > 0 && (
                  <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <FlaskConical className="h-4 w-4 text-indigo-600" />
                        <span>{lang === 'so' ? 'Natiijooyinka Shaybaarka ee Bukaankan:' : 'Diagnostic Lab Results for Patient:'}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {patientLabTests.length} {lang === 'so' ? 'baaritaan' : 'tests'}
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {patientLabTests.map((t) => (
                        <div key={t.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{t.testNameSo} ({t.testCode})</span>
                            {t.resultValue ? (
                              <div className={`mt-0.5 font-semibold ${t.isAbnormal ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                                {t.isAbnormal && '⚠️ '} {t.resultValue}
                              </div>
                            ) : (
                              <div className="text-[11px] text-amber-600 italic">Muunada baaritaanka ayaa lagu guda jiraa...</div>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            t.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {t.status === 'completed' ? (lang === 'so' ? 'Dhammaystiran' : 'Completed') : (lang === 'so' ? 'Socda' : 'In Lab')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient Vitals Grid */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'so' ? 'Calaamadaha Muhiimka ah (Clinical Vitals)' : 'Baseline Clinical Vitals'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className={`p-3 rounded-xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Heerkulka</div>
                      <div className={`text-base font-black font-mono mt-0.5 ${activePatient.vitals?.temperature > 38 ? 'text-rose-600' : styles.textPrimary}`}>
                        {activePatient.vitals?.temperature}°C
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Cadaadiska (BP)</div>
                      <div className={`text-base font-black font-mono mt-0.5 ${styles.textPrimary}`}>
                        {activePatient.vitals?.bloodPressure || '-'}
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Garaaca (HR)</div>
                      <div className={`text-base font-black font-mono mt-0.5 ${styles.textPrimary}`}>
                        {activePatient.vitals?.heartRate} bpm
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">SpO2 (O2)</div>
                      <div className={`text-base font-black font-mono mt-0.5 ${activePatient.vitals?.spO2 < 95 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {activePatient.vitals?.spO2}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className={`p-3.5 rounded-xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                    {lang === 'so' ? 'Cabashada Bukaanka (Chief Complaint)' : 'Chief Complaint & Symptoms'}
                  </div>
                  <p className={`text-xs leading-relaxed ${styles.textPrimary}`}>
                    {activePatient.symptoms}
                  </p>
                </div>

                {/* Doctor Clinical Notes */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Qoraalka Baaritaanka Dhakhtarka (Clinical Examination Notes)' : 'Physician Assessment & Findings'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'so' ? 'Qor natiijada baaritaanka, cudurka la tuhunsan yahay...' : 'Document clinical examination, diagnosis, lab tests requested...'}
                    className={`w-full p-3 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                {/* Electronic Prescription Pad */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold flex items-center gap-1.5 ${styles.textPrimary}`}>
                      <Pill className="h-4 w-4 text-purple-600" />
                      <span>{lang === 'so' ? 'Qorista Dawooyinka (Electronic Prescription - Rx)' : 'Electronic Prescriptions (Rx)'}</span>
                    </label>
                  </div>

                  {/* Added Prescriptions */}
                  {prescriptions.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {prescriptions.map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 text-xs border border-purple-200 dark:border-purple-800">
                          <span className="font-medium">💊 {med}</span>
                          <button
                            onClick={() => setPrescriptions(prescriptions.filter((_, idx) => idx !== i))}
                            className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prescriptionInput}
                      onChange={(e) => setPrescriptionInput(e.target.value)}
                      placeholder={lang === 'so' ? 'Qor daawada, xaddiga iyo xilliga la qaadanayo...' : 'Medicine name, dosage, and frequency...'}
                      className={`flex-1 p-2.5 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPrescription(prescriptionInput);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddPrescription(prescriptionInput)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {lang === 'so' ? 'Ku dar' : 'Add'}
                    </button>
                  </div>

                  {/* Fast Med Presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">Quick:</span>
                    {commonMeds.map((m, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddPrescription(m)}
                        className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                      >
                        + {m.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complete Consultation Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {lang === 'so' ? 'Bukaanku wuxuu u gudbi doonaa farmashiyaha/soo dhoweynta.' : 'Patient will be moved to completed/pharmacy.'}
                  </span>

                  <button
                    onClick={handleFinishConsultation}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{lang === 'so' ? 'Dhameystir Baaritaanka & Dawooyinka' : 'Complete Consultation & Dispense'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Qolku Waa Bannaan Yahay' : 'Room Currently Available'}
                </h3>
                <p className={`text-xs max-w-sm mx-auto ${styles.textSecondary}`}>
                  {lang === 'so'
                    ? 'Guji badhanka hoose si aad ugu yeerto bukaanka xiga ee safka ugu horreeya marka loo eego heerka halista.'
                    : 'Click below to summon the highest priority triage patient waiting outside.'}
                </p>
                <button
                  onClick={() => assignedRoom && onCallNextPatient(assignedRoom.id)}
                  disabled={waitingPatients.length === 0}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Users className="h-4 w-4" />
                  <span>{lang === 'so' ? 'U Yeer Bukaanka Xiga Hadda' : 'Call Next Patient Now'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upcoming Queue Roster (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Bukaanada Safka Ku Jira' : 'Patients Waiting In Queue'}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {waitingPatients.length} {lang === 'so' ? 'bukaan' : 'waiting'}
              </span>
            </div>

            {waitingPatients.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {lang === 'so' ? 'Ma jiraan bukaan sugaya safka xilligan.' : 'No patients currently queued.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[500px] overflow-y-auto pr-1">
                {waitingPatients.map((p, idx) => {
                  const isEmerg = p.triageLevel === 'emergency';
                  return (
                    <div key={p.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          isEmerg
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {p.ticketNumber}
                        </span>
                        <div>
                          <div className={`text-xs font-bold ${styles.textPrimary}`}>{p.fullName}</div>
                          <div className="text-[11px] text-slate-400">
                            {p.age}y · {p.category} · {p.symptoms.substring(0, 24)}...
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEmerg
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {p.triageLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today's Completed summary */}
          <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <h3 className={`text-xs font-bold font-display uppercase tracking-wider mb-2 ${styles.textPrimary}`}>
              {lang === 'so' ? 'Bukaanada Maanta La Dhameystiray' : 'Consultations Completed Today'}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-600">{completedPatients.length}</span>
              <span className="text-xs text-slate-400">{lang === 'so' ? 'bukaan' : 'patients discharged'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 1. Medical History EHR Modal */}
      {showHistoryModal && (
        <MedicalHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          ticketNumber={activePatient?.ticketNumber || 'M-14'}
          patientName={activePatient?.fullName}
          lang={lang}
          theme={theme}
        />
      )}

      {/* 2. Official Medical Certificate / Sick Leave Modal */}
      {showCertModal && (
        <OfficialMedicalCertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          defaultPatientName={activePatient?.fullName || 'Xaliimo Nuur Warsame'}
          defaultTicketNumber={activePatient?.ticketNumber || 'M-14'}
          doctorName={currentUser.name}
          lang={lang}
          theme={theme}
        />
      )}

      {/* 3. Quick Lab Order Modal */}
      {showLabOrderModal && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="h-5 w-5 text-indigo-600" />
                <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Dalbo Baaritaan Shaybaar' : 'Order Laboratory Investigation'}
                </h3>
              </div>
              <button onClick={() => setShowLabOrderModal(false)} className="p-1.5 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">{lang === 'so' ? 'Bukaanka loo dirayo:' : 'Patient:'}</span>
                <strong className="text-slate-900 dark:text-slate-100 text-sm">
                  {activePatient.fullName} ({activePatient.ticketNumber})
                </strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'so' ? 'Dooro Baaritaanka Loo Baahan Yahay:' : 'Select Diagnostic Investigation:'}
                </label>
                <select
                  value={selectedLabCode}
                  onChange={(e) => setSelectedLabCode(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-bold`}
                >
                  {LAB_TEST_CATALOG.map((item) => (
                    <option key={item.id} value={item.code}>
                      {item.code} - {item.nameSo} (${item.costUSD.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'so' ? 'Heerka Degdegsiimada:' : 'Clinical Urgency / Priority:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'routine', label: 'Caadi' },
                    { id: 'urgent', label: 'Degdeg' },
                    { id: 'emergency', label: 'Stat/Halis' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setLabPriority(p.id as any)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        labPriority === p.id 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shadow-xs' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLabOrderModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border text-slate-600 dark:text-slate-300"
                >
                  {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const catalogItem = LAB_TEST_CATALOG.find(c => c.code === selectedLabCode) || LAB_TEST_CATALOG[0];
                    const newLabOrder: LabTestOrder = {
                      id: `lab-${Date.now()}`,
                      ticketNumber: activePatient.ticketNumber,
                      patientId: activePatient.id,
                      patientName: activePatient.fullName,
                      patientAge: activePatient.age,
                      patientGender: activePatient.gender,
                      testCode: catalogItem.code,
                      testNameSo: catalogItem.nameSo,
                      testNameEn: catalogItem.nameEn,
                      category: catalogItem.category,
                      sampleType: catalogItem.sampleType,
                      doctorName: currentUser.name,
                      doctorRoom: assignedRoom ? assignedRoom.roomName : 'Qolka Baaritaanka',
                      priority: labPriority,
                      status: 'ordered',
                      orderedAt: new Date().toISOString(),
                      normalRange: catalogItem.normalRange,
                      costUSD: catalogItem.costUSD,
                    };
                    if (onOrderLabTest) {
                      onOrderLabTest(newLabOrder);
                    }
                    setShowLabOrderModal(false);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'U Dir Shaybaarka' : 'Send to Lab'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
