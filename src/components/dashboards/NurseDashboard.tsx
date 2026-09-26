import { useState } from 'react';
import { 
  Syringe, 
  HeartPulse, 
  AlertTriangle, 
  Users, 
  Activity, 
  Baby, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Sparkles,
  Clock,
  Thermometer,
  FileSpreadsheet
} from 'lucide-react';
import { Patient, UserProfile, ThemePalette, PatientCategory, TriageLevel } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';

interface NurseDashboardProps {
  currentUser: UserProfile;
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function NurseDashboard({
  currentUser,
  patients,
  onAddPatient,
  lang,
  theme,
}: NurseDashboardProps) {
  const styles = getThemeStyles(theme);

  // Form State for Triage Intake
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [category, setCategory] = useState<PatientCategory>('maternal');
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(32);
  const [symptoms, setSymptoms] = useState('');
  
  // Vitals State
  const [temperature, setTemperature] = useState<number>(37.2);
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');
  const [heartRate, setHeartRate] = useState<number>(82);
  const [spO2, setSpO2] = useState<number>(98);

  const [createdFeedback, setCreatedFeedback] = useState<string | null>(null);

  // Auto Acuity Calculation
  const calculateTriageAcuity = (): { level: TriageLevel; score: number; reason: string } => {
    // Critical Conditions
    if (spO2 < 92) {
      return { level: 'emergency', score: 1, reason: 'Oxygen saturation dangerously low (<92%)' };
    }
    if (temperature > 39.5 || temperature < 35.5) {
      return { level: 'emergency', score: 1, reason: 'Severe hyperthermia or hypothermia' };
    }
    const bpParts = bloodPressure.split('/').map((n) => parseInt(n.trim(), 10));
    if (bpParts.length === 2 && (bpParts[0] >= 160 || bpParts[1] >= 110)) {
      return { level: 'emergency', score: 1, reason: 'Severe hypertension / Pre-eclampsia danger' };
    }
    if (category === 'maternal' && (symptoms.toLowerCase().includes('dhiig') || symptoms.toLowerCase().includes('bleed'))) {
      return { level: 'emergency', score: 1, reason: 'Maternal acute hemorrhage' };
    }

    // Urgent Conditions (Yellow)
    if (temperature >= 38.5 || spO2 < 95 || (bpParts[0] && bpParts[0] >= 140)) {
      return { level: 'urgent', score: 2, reason: 'Elevated vitals requiring accelerated assessment' };
    }

    return { level: 'routine', score: 3, reason: 'Stable vitals, routine MCH / standard outpatient' };
  };

  const acuity = calculateTriageAcuity();

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    // Generate unique ticket number prefix
    const prefix =
      acuity.level === 'emergency' ? 'E' : category === 'maternal' ? 'M' : category === 'child' ? 'P' : 'R';
    const randomNum = Math.floor(10 + Math.random() * 90);
    const ticketNumber = `${prefix}-${randomNum}`;

    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      ticketNumber,
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender,
      category,
      pregnancyWeek: category === 'maternal' ? Number(pregnancyWeek) : undefined,
      symptoms: symptoms.trim() || (lang === 'so' ? 'Baaritaan caadi ah' : 'Routine checkup'),
      triageLevel: acuity.level,
      triageScore: acuity.score,
      vitals: {
        temperature: Number(temperature),
        bloodPressure: bloodPressure.trim(),
        heartRate: Number(heartRate),
        spO2: Number(spO2),
      },
      status: 'waiting',
      registeredAt: new Date().toISOString(),
      estimatedWaitMinutes: acuity.level === 'emergency' ? 2 : acuity.level === 'urgent' ? 15 : 30,
    };

    onAddPatient(newPatient);
    setCreatedFeedback(ticketNumber);
    setFullName('');
    setPhone('');
    setSymptoms('');

    setTimeout(() => setCreatedFeedback(null), 6000);
  };

  const waitingList = patients.filter((p) => p.status === 'waiting');
  const emergencyCount = waitingList.filter((p) => p.triageLevel === 'emergency').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Nurse Header */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-200 dark:border-rose-800">
                Triage Station #1
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {lang === 'so' ? 'Shaqada Way Socotaa' : 'Station Active'}
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

        {/* Emergency Count Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-600">Bukaanada Halista ah (ER)</div>
              <div className="text-lg font-black font-mono text-rose-700 dark:text-rose-300">
                {emergencyCount} {lang === 'so' ? 'Bukaan' : 'Critical'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {createdFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <span className="font-bold">Bukaanka si guul leh ayaa loo diiwaangeliyay!</span>
              <span className="ml-2 font-mono font-black underline">Tikidh: {createdFeedback}</span>
              <span className="ml-2 opacity-80">(SMS ogeysiis ah ayaa loo diray taleefankiisa).</span>
            </div>
          </div>
          <button onClick={() => setCreatedFeedback(null)} className="font-bold text-xs underline cursor-pointer">
            OK
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Rapid Triage & Vitals Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-rose-600" />
                <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Diiwaangelinta Triage-ka & Vitals-ka' : 'Rapid Patient Intake & Vitals Assessment'}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">Standard 15-Sec Protocol</span>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-5 text-xs">
              {/* Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Magaca Buuxa ee Bukaanka *' : 'Patient Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'so' ? 'Tusaale: Deeqo Cali Axmed' : 'e.g. Deeqo Ali'}
                    className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Taleefanka Bukaanka (SMS Tikidh) *' : 'Phone Number (SMS Recipient) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+252 61..."
                    className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>Da'da (Age)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>Jinsiga (Sex)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  >
                    <option value="female">Dheddig (Female)</option>
                    <option value="male">Lab (Male)</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>Qeybta (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  >
                    <option value="maternal">Hooyo Uur Leh (ANC)</option>
                    <option value="child">Dhallaanka (Pediatric)</option>
                    <option value="emergency">Degdeg Guud (ER)</option>
                    <option value="adult">Qof Weyn (Adult)</option>
                  </select>
                </div>
              </div>

              {category === 'maternal' && (
                <div>
                  <label className={`block font-bold mb-1.5 text-purple-600 dark:text-purple-400`}>
                    {lang === 'so' ? 'Toddobaadyada Uurka (Gestational Weeks)' : 'Pregnancy Week'}
                  </label>
                  <input
                    type="number"
                    value={pregnancyWeek}
                    onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                    placeholder="32"
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              )}

              {/* Vitals Capture Box */}
              <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4" />
                    <span>Cabbiraadda Vitals-ka Tooska ah</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-rose-200/60 dark:bg-rose-900 px-2 py-0.5 rounded">
                    Auto-Acuity Scoring
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-center font-mono font-bold ${styles.inputBg} ${styles.inputBorder} ${temperature > 38 ? 'text-rose-600 border-rose-400' : styles.inputText}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">BP (mmHg)</label>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                      className={`w-full p-2 rounded-lg border text-center font-mono font-bold ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-center font-mono font-bold ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      value={spO2}
                      onChange={(e) => setSpO2(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-center font-mono font-bold ${styles.inputBg} ${styles.inputBorder} ${spO2 < 95 ? 'text-rose-600 border-rose-400' : 'text-emerald-600'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Chief Symptoms */}
              <div>
                <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Cabashada Bukaanka (Symptoms / Chief Complaint)' : 'Clinical Symptoms'}
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={lang === 'so' ? 'Tusaale: Dhiig-bax lama filaan ah, xummad daran, neef qabatin...' : 'Describe chief symptoms...'}
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              {/* Calculated Triage Level Badge Preview */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Heerka Halista ee La Xisaabiyay:</div>
                  <div className="text-xs font-extrabold mt-0.5 text-slate-900 dark:text-white">
                    {acuity.level === 'emergency' ? '🚨 Cas (P-1 Emergency) - Daryeel Degdeg ah' : acuity.level === 'urgent' ? '⚠️ Jaalle (P-2 Urgent)' : '✅ Cagaar (P-3 Routine)'}
                  </div>
                  <div className="text-[11px] text-slate-500">{acuity.reason}</div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {lang === 'so' ? 'Diiwaangeli & Soo Saari Tikidh' : 'Triage & Issue Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Live Triage Queue Backlog (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-600" />
                <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Safka Hadda ee Triage-ka' : 'Triage Queue Backlog'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {waitingList.length} bukaan
              </span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {waitingList.map((p) => {
                const isEmerg = p.triageLevel === 'emergency';
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isEmerg
                        ? 'border-rose-300 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/40'
                        : `${styles.cardInnerBg} ${styles.cardBorder}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-md ${
                        isEmerg ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        {p.ticketNumber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {p.vitals?.temperature}°C · {p.vitals?.bloodPressure}
                      </span>
                    </div>

                    <div className={`text-xs font-bold mt-1.5 ${styles.textPrimary}`}>{p.fullName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{p.symptoms}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
