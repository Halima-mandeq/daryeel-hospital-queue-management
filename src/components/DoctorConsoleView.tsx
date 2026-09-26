import { useState } from 'react';
import { Patient, DoctorRoom, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { playHospitalChime } from '../utils/audio';
import { 
  Stethoscope, 
  Volume2, 
  CheckCircle2, 
  UserCheck, 
  Pill, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Trash2,
  Activity
} from 'lucide-react';

interface DoctorConsoleViewProps {
  rooms: DoctorRoom[];
  patients: Patient[];
  onCallNextPatient: (roomId: string) => void;
  onCompletePatient: (patientId: string, doctorNotes: string, prescriptions: string[]) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function DoctorConsoleView({
  rooms,
  patients,
  onCallNextPatient,
  onCompletePatient,
  lang,
  theme,
}: DoctorConsoleViewProps) {
  const styles = getThemeStyles(theme);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || 'room-1');
  const [doctorNotes, setDoctorNotes] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [newMed, setNewMed] = useState<string>('');

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const activePatient = patients.find(p => p.id === currentRoom?.currentPatientId);

  const doctorPhotoMap: Record<string, string> = {
    'room-1': CLINIC_IMAGES.doctors.maryan,
    'room-2': CLINIC_IMAGES.doctors.guuleed,
    'room-3': CLINIC_IMAGES.doctors.sahra,
    'room-4': CLINIC_IMAGES.doctors.faadumo,
  };

  const medPresets = [
    'Folic Acid 5mg + Iron Sulfate (Hooyada Uurka)',
    'Paracetamol 500mg Tablets',
    'ORS Rehydration Salts + Zinc (Shuban/Fuuqbax)',
    'Amoxicillin 250mg Suspension (Carruurta)',
    'Multivitamin & Calcium Syrup',
    'Ultrasound Scan Referral (Baaritaan Ultrasound)'
  ];

  const handleAddPreset = (med: string) => {
    if (!prescriptions.includes(med)) {
      setPrescriptions([...prescriptions, med]);
    }
  };

  const handleAddCustomMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.trim() && !prescriptions.includes(newMed.trim())) {
      setPrescriptions([...prescriptions, newMed.trim()]);
      setNewMed('');
    }
  };

  const handleRemoveMed = (index: number) => {
    setPrescriptions(prescriptions.filter((_, idx) => idx !== index));
  };

  const handleCallNext = () => {
    playHospitalChime();
    onCallNextPatient(selectedRoomId);
    setDoctorNotes('');
    setPrescriptions([]);
  };

  const handleComplete = () => {
    if (activePatient) {
      onCompletePatient(activePatient.id, doctorNotes, prescriptions);
      setDoctorNotes('');
      setPrescriptions([]);
    }
  };

  const waitingPatients = patients.filter(p => p.status === 'waiting');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Console Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
              <Stethoscope className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Qolka Dhakhtarka & Kalkaalisada' : 'Doctor Consultation Console'}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold font-display ${styles.textPrimary}`}>
            {lang === 'so' ? 'Qaabilaadda Bukaanka & Qorista Daawada' : 'Clinical Assessment & Prescription Orders'}
          </h2>
        </div>

        {/* Room Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className={`text-xs font-semibold shrink-0 ${styles.textSecondary}`}>
            {lang === 'so' ? 'Dooro Qolka:' : 'Select Room:'}
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRoomId === room.id
                    ? styles.navActiveBg
                    : `${styles.textSecondary} hover:${styles.textPrimary}`
                }`}
              >
                {room.roomName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Room Doctor Profile Card with Real Photo */}
      <div className={`mb-8 rounded-3xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-center gap-4">
          <img
            src={doctorPhotoMap[currentRoom.id] || CLINIC_IMAGES.doctors.maryan}
            alt={currentRoom.doctorName}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-base sm:text-lg font-display ${styles.textPrimary}`}>
                {currentRoom.doctorName}
              </h3>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${styles.badgeBg} ${styles.badgeText}`}>
                {currentRoom.title}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${styles.textSecondary}`}>{currentRoom.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCallNext}
            className={`inline-flex items-center gap-2 rounded-2xl py-3 px-6 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
          >
            <Volume2 className="h-4 w-4" />
            <span>
              {activePatient 
                ? (lang === 'so' ? 'Wac Bukaanka Xiga (Call Next)' : 'Call Next Patient') 
                : (lang === 'so' ? 'Wac Bukaanka Koowaad' : 'Call Next in Queue')}
            </span>
          </button>
        </div>
      </div>

      {/* Active Consultation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Patient Profile & Clinical Assessment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activePatient ? (
            <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
              {/* Patient Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-3xl font-black font-mono ${styles.accentText}`}>
                      {activePatient.ticketNumber}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <h3 className={`text-lg sm:text-xl font-bold font-display ${styles.textPrimary}`}>
                      {activePatient.fullName}
                    </h3>
                  </div>
                  <div className={`text-xs font-mono ${styles.textSecondary}`}>
                    {activePatient.phone} · {activePatient.age} {lang === 'so' ? 'sano jir' : 'years old'} · {activePatient.gender}
                    {activePatient.pregnancyWeek && (
                      <span className={`ml-2 font-sans font-bold ${styles.accentText}`}>
                        · {lang === 'so' ? `Uurka: Toddobaadka ${activePatient.pregnancyWeek}aad` : `Week ${activePatient.pregnancyWeek} of Pregnancy`}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  activePatient.triageLevel === 'emergency'
                    ? styles.emergencyBg
                    : activePatient.triageLevel === 'urgent'
                    ? styles.urgentBg
                    : styles.routineBg
                }`}>
                  {activePatient.triageLevel.toUpperCase()}
                </span>
              </div>

              {/* Vitals Summary */}
              <div className={`rounded-2xl border p-4 mb-6 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-500">
                  <Activity className={`h-4 w-4 ${styles.accentText}`} />
                  <span>{lang === 'so' ? 'Calaamadaha Nolosha ee Kalkaalisadu Cabirtay' : 'Recorded Vital Signs'}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className={`rounded-xl border p-2 ${styles.cardBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Heerkul' : 'Temp'}</span>
                    <span className={`text-sm font-bold font-mono ${
                      activePatient.vitals.temperature >= 38.5 ? 'text-rose-600' : styles.textPrimary
                    }`}>
                      {activePatient.vitals.temperature}°C
                    </span>
                  </div>
                  <div className={`rounded-xl border p-2 ${styles.cardBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Cadaadis' : 'BP'}</span>
                    <span className={`text-sm font-bold font-mono ${styles.textPrimary}`}>
                      {activePatient.vitals.bloodPressure}
                    </span>
                  </div>
                  <div className={`rounded-xl border p-2 ${styles.cardBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Garaac' : 'Pulse'}</span>
                    <span className={`text-sm font-bold font-mono ${styles.textPrimary}`}>
                      {activePatient.vitals.heartRate} bpm
                    </span>
                  </div>
                  <div className={`rounded-xl border p-2 ${styles.cardBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className={`text-sm font-bold font-mono ${
                      activePatient.vitals.spO2 < 93 ? 'text-rose-600' : styles.accentText
                    }`}>
                      {activePatient.vitals.spO2}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${styles.textSecondary}`}>
                  {lang === 'so' ? 'Calaamadaha Xanuunka ee Qofku Ka Cabanayo:' : 'Chief Complaints:'}
                </div>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${styles.cardInnerBg} ${styles.cardBorder} ${styles.textPrimary}`}>
                  {activePatient.symptoms}
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              <div>
                <div className={`text-xs font-bold mb-2 flex items-center gap-1.5 ${styles.textPrimary}`}>
                  <FileText className={`h-4 w-4 ${styles.accentText}`} />
                  <span>{lang === 'so' ? 'Qoraalka Baaritaanka Dhakhtarka & Talooyinka' : 'Doctor Clinical Consultation Notes'}</span>
                </div>
                <textarea
                  rows={4}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder={lang === 'so' ? 'Qor baaritaanka aad samaysay, natiijada ultrasound-ka ama talooyinka hooyada...' : 'Enter clinical findings, diagnosis, and patient advice...'}
                  className={`w-full rounded-2xl border p-3.5 text-xs focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>
            </div>
          ) : (
            <div className={`rounded-3xl border border-dashed p-12 text-center ${styles.cardBorder} ${styles.cardBg}`}>
              <Stethoscope className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h4 className={`text-base font-bold font-display mb-1 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Qolku Waa Diyaar' : 'Consultation Room Ready'}
              </h4>
              <p className={`text-xs max-w-sm mx-auto mb-6 ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Guji badhanka "Wac Bukaanka Xiga" si aad qolka ugu yeerto bukaanka ugu horreeya safka.'
                  : 'Click "Call Next Patient" to admit the highest-priority patient waiting in the queue.'}
              </p>
              <button
                onClick={handleCallNext}
                className={`inline-flex items-center gap-2 rounded-2xl py-3 px-6 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                <Volume2 className="h-4 w-4" />
                <span>{lang === 'so' ? 'Wac Bukaanka Ku Xiga' : 'Call Next in Line'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Prescriptions & Action Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className={`text-sm font-bold font-display flex items-center gap-2 ${styles.textPrimary}`}>
                <Pill className={`h-4 w-4 ${styles.accentText}`} />
                <span>{lang === 'so' ? 'Qorista Daawada & Shaybaarka' : 'Prescription & Lab Orders'}</span>
              </h3>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${styles.badgeBg} ${styles.badgeText}`}>
                {prescriptions.length} {lang === 'so' ? 'Dawo' : 'Items'}
              </span>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <span className={`text-[11px] font-semibold block mb-2 ${styles.textSecondary}`}>
                {lang === 'so' ? 'Dawooyinka Caadiga ah (Hooyada & Carruurta):' : 'Quick Clinical Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {medPresets.map((med, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(med)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                      styles.isDark 
                        ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    + {med}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Med Input */}
            <form onSubmit={handleAddCustomMed} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                placeholder={lang === 'so' ? 'Qor dawo kale ama baaritaan...' : 'Add medication or test...'}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
              />
              <button
                type="submit"
                className={`rounded-xl px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            {/* Prescriptions List */}
            <div className="space-y-2 mb-6 min-h-[120px]">
              {prescriptions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-mono">
                  {lang === 'so' ? 'Weli wax dawo ah laguma darin.' : 'No medications prescribed yet.'}
                </div>
              ) : (
                prescriptions.map((med, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-xl border p-2.5 px-3 text-xs ${styles.cardInnerBg} ${styles.cardBorder} ${styles.textPrimary}`}
                  >
                    <span className={`font-mono text-[11px] font-bold mr-2 ${styles.accentText}`}>0{idx + 1}.</span>
                    <span className="flex-1 truncate">{med}</span>
                    <button
                      onClick={() => handleRemoveMed(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Complete Visit Button */}
            {activePatient && (
              <button
                onClick={handleComplete}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'so' ? 'Dhamaystir Booqashada & U Dir Farmashiyaha' : 'Complete Visit & Send to Pharmacy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
