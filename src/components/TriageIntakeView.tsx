import React, { useState } from 'react';
import { Patient, TriageLevel, PatientCategory, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { TicketQRCode } from './TicketQRCode';
import { OfficialTicketSlipModal } from './OfficialTicketSlipModal';
import { 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  Activity, 
  Thermometer, 
  Printer, 
  Send,
  Sparkles,
  Baby,
  Stethoscope,
  X,
  FileCheck,
  ShieldAlert,
  QrCode
} from 'lucide-react';

interface TriageIntakeViewProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function TriageIntakeView({ patients, onAddPatient, lang, theme }: TriageIntakeViewProps) {
  const styles = getThemeStyles(theme);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [category, setCategory] = useState<PatientCategory>('maternal');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | ''>(24);
  const [symptoms, setSymptoms] = useState('');
  
  // Vitals
  const [temperature, setTemperature] = useState<number>(37.0);
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');
  const [heartRate, setHeartRate] = useState<number>(78);
  const [spO2, setSpO2] = useState<number>(98);

  // Issued Ticket Preview Modal
  const [issuedPatient, setIssuedPatient] = useState<Patient | null>(null);
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  // Quick symptom presets for fast triage
  const symptomPresets = [
    { label: lang === 'so' ? 'Dhiig-bax lama filaan ah (Degdeg)' : 'Acute Hemorrhage / Bleeding', level: 'emergency', desc: 'Dhiig-bax daran oo degdeg ah' },
    { label: lang === 'so' ? 'Qandho kulul & Fuuqbax' : 'High Fever & Dehydration', level: 'urgent', desc: 'Qandho 39°C ka badan iyo daciifnimo' },
    { label: lang === 'so' ? 'Baaritaanka Uurka (ANC)' : 'Routine ANC Checkup', level: 'routine', desc: 'Kormeerka caadiga ah ee hooyada' },
    { label: lang === 'so' ? 'Tallaalka Carruurta (MCH)' : 'Child Vaccination Visit', level: 'routine', desc: 'Tallaalka bilaha iyo miisaanka' },
    { label: lang === 'so' ? 'Neef-qabad / Xabad xanuun' : 'Severe Breathing Distress', level: 'emergency', desc: 'Neef-qabad iyo ogsajiin yari' },
  ];

  // Dynamic Triage Assessment
  const calculateTriage = (): { level: TriageLevel; score: number; reason: string } => {
    const sLow = symptoms.toLowerCase();
    const hasEmergencyKeywords = 
      sLow.includes('dhiig') || 
      sLow.includes('suux') || 
      sLow.includes('neef') || 
      sLow.includes('bleed') || 
      sLow.includes('seiz') || 
      sLow.includes('unconscious') ||
      category === 'emergency';

    if (hasEmergencyKeywords || spO2 < 93 || temperature >= 39.5 || heartRate > 125) {
      return {
        level: 'emergency',
        score: 1,
        reason: lang === 'so' 
          ? 'Xaalad Halis ah (Calaamadaha dhiig-baxa, neefta ama calaamadaha nolosha oo aad u sarreeya)' 
          : 'Emergency Priority 1 (Vitals unstable or acute critical distress detected)'
      };
    }

    if (temperature >= 38.4 || heartRate > 105 || symptoms.includes('qandho') || symptoms.includes('fever') || symptoms.includes('xanuun daran')) {
      return {
        level: 'urgent',
        score: 2,
        reason: lang === 'so'
          ? 'Xaalad Degdeg Dhexdhexaad ah (Qandho ama xanuun daran oo u baahan fiiro gaar ah)'
          : 'Urgent Priority 2 (Moderate fever or significant acute discomfort)'
      };
    }

    return {
      level: 'routine',
      score: 3,
      reason: lang === 'so'
        ? 'Xaalad Caadi ah (Baaritaan joogto ah, daryeelka hooyada ama tallaal)'
        : 'Routine Priority 3 (Standard consultation, scheduled ANC or vaccination)'
    };
  };

  const calculatedTriage = calculateTriage();

  const handleApplyPreset = (preset: typeof symptomPresets[0]) => {
    setSymptoms(preset.desc);
    if (preset.level === 'emergency') {
      setCategory('emergency');
      setHeartRate(115);
      setTemperature(38.8);
    } else if (preset.level === 'urgent') {
      setTemperature(39.2);
      setHeartRate(102);
    } else {
      setTemperature(36.8);
      setHeartRate(76);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    // Generate ticket code
    const prefix = 
      calculatedTriage.level === 'emergency' ? 'E' :
      category === 'maternal' ? 'M' :
      category === 'child' ? 'P' : 'R';

    const countOfPrefix = patients.filter(p => p.ticketNumber.startsWith(prefix)).length + 1;
    const ticketNumber = `${prefix}-${String(countOfPrefix).padStart(3, '0')}`;

    // Estimated wait time based on queue
    const waitingAhead = patients.filter(p => 
      p.status === 'waiting' && 
      (p.triageScore <= calculatedTriage.score)
    ).length;

    const estimatedWait = calculatedTriage.level === 'emergency' 
      ? 0 
      : Math.max(5, waitingAhead * 8);

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      ticketNumber,
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: typeof age === 'number' ? age : 25,
      gender,
      category,
      pregnancyWeek: category === 'maternal' && typeof pregnancyWeek === 'number' ? pregnancyWeek : undefined,
      symptoms: symptoms.trim() || (lang === 'so' ? 'Kormeer caadi ah' : 'Routine checkup'),
      triageLevel: calculatedTriage.level,
      triageScore: calculatedTriage.score,
      vitals: {
        temperature,
        bloodPressure,
        heartRate,
        spO2
      },
      status: 'waiting',
      registeredAt: new Date().toISOString(),
      estimatedWaitMinutes: estimatedWait
    };

    onAddPatient(newPatient);
    setIssuedPatient(newPatient);

    // Reset form
    setFullName('');
    setPhone('');
    setAge('');
    setSymptoms('');
  };

  // Waiting patients list
  const waitingPatients = patients
    .filter(p => p.status === 'waiting')
    .sort((a, b) => a.triageScore - b.triageScore);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Clinic Visual Header with Real Photography */}
      <div className={`mb-8 overflow-hidden rounded-3xl border transition-all ${styles.cardBorder} ${styles.cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
                  <HeartPulse className="h-3.5 w-3.5" />
                  {lang === 'so' ? 'Qaybta Triage-ka & Qaabilaadda' : 'Nurse Triage & Intake Desk'}
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${styles.textPrimary}`}>
                {lang === 'so' ? 'Diiwaangelinta Degdegga ah & Qiimaynta Triage-ka' : 'Rapid Patient Intake & Clinical Triage'}
              </h2>
              <p className={`text-sm ${styles.textSecondary} mt-2 max-w-2xl leading-relaxed`}>
                {lang === 'so'
                  ? 'Nidaamka DaryeelQoys wuxuu si degdeg ah u cabbiraa astaamaha nolosha (vitals) isagoo si otomaatig ah mudnaan u siinaya hooyooyinka uurka leh ee dhiig-baxaya iyo carruurta qandhada daran qaba.'
                  : 'Automated clinical scoring prioritizes high-acuity obstetric and pediatric emergencies to avert preventable maternal delays.'}
              </p>
            </div>

            {/* Quick Stats Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm ${styles.accentBg} text-white`}>
                  {waitingPatients.length}
                </div>
                <div>
                  <div className={`text-xs font-bold ${styles.textPrimary}`}>{lang === 'so' ? 'Bukaanka Safka ku Jira' : 'Waiting in Queue'}</div>
                  <div className="text-[11px] text-slate-400">{lang === 'so' ? 'Qolka sugitaanka' : 'Waiting room lounge'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-sm">
                  {waitingPatients.filter(p => p.triageLevel === 'emergency').length}
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-600">{lang === 'so' ? 'Degdeg Halis ah (Emergency)' : 'Critical Emergency'}</div>
                  <div className="text-[11px] text-slate-400">{lang === 'so' ? 'Mudnaanta 1aad' : 'Priority 1 immediate'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Clinic Photo in Banner */}
          <div className="lg:col-span-4 relative h-48 lg:h-auto min-h-[200px]">
            <img
              src={CLINIC_IMAGES.maternalCare}
              alt="Maternal Health Clinic"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent lg:bg-gradient-to-r lg:from-slate-900/30 lg:to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-medium p-2 rounded-lg bg-black/40 backdrop-blur-xs">
              {lang === 'so' ? 'Daryeel naxariis leh oo hooyada & ilmaha loogu adeego' : 'Dedicated compassionate maternal healthcare'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rapid Intake Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className={`text-base font-bold font-display flex items-center gap-2 ${styles.textPrimary}`}>
                  <User className={`h-4 w-4 ${styles.accentText}`} />
                  <span>{lang === 'so' ? 'Foomka Qaabilaadda Bukaanka' : 'New Patient Registration Form'}</span>
                </h3>
                <p className={`text-xs ${styles.textSecondary} mt-0.5`}>
                  {lang === 'so' ? 'Buuxi xogta bukaanka si aad u saarto tikidhka' : 'Enter clinical details to dispatch queue ticket'}
                </p>
              </div>

              {/* Triage Live Badge */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  {lang === 'so' ? 'Heerka Triage-ka:' : 'Computed Level:'}
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  calculatedTriage.level === 'emergency'
                    ? styles.emergencyBg
                    : calculatedTriage.level === 'urgent'
                    ? styles.urgentBg
                    : styles.routineBg
                }`}>
                  {calculatedTriage.level === 'emergency' 
                    ? (lang === 'so' ? 'CAS · DEGDEG (P-1)' : 'RED · EMERGENCY')
                    : calculatedTriage.level === 'urgent'
                    ? (lang === 'so' ? 'JAALLE · MUHIIM (P-2)' : 'YELLOW · URGENT')
                    : (lang === 'so' ? 'CAGAAR · CAADI (P-3)' : 'GREEN · ROUTINE')}
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className={`text-xs font-bold block mb-2 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Xaaladaha Caadiga ah (Ku dhufo si aad u doorato):' : 'Quick Symptom Presets (Click to autofill):'}
              </label>
              <div className="flex flex-wrap gap-2">
                {symptomPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors cursor-pointer ${
                      styles.isDark 
                        ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-500 hover:text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Magaca Buuxa ee Bukaanka *' : 'Patient Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'so' ? 'Tusaale: Xaliimo Cali Nuur' : 'e.g. Halima Ali Nur'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Telefoonka (SMS Tikidhka) *' : 'Phone Number (For SMS Ticket) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+252 61 XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              {/* Row 2: Category and Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Qaybta Bukaanka' : 'Patient Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PatientCategory)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-xs focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  >
                    <option value="maternal">{lang === 'so' ? 'Hooyo Uur leh (ANC)' : 'Maternal (ANC Visit)'}</option>
                    <option value="child">{lang === 'so' ? 'Ilmo / Dhallaan (Pediatric)' : 'Child / Infant'}</option>
                    <option value="adult">{lang === 'so' ? 'Bukaan Guud (Adult)' : 'General Adult'}</option>
                    <option value="emergency">{lang === 'so' ? 'Xaalad Degdeg ah (Critical)' : 'Emergency Trauma'}</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Da\'da (Sano)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="110"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className={`w-full rounded-xl border px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                    {category === 'maternal' 
                      ? (lang === 'so' ? 'Toddobaadka Uurka' : 'Pregnancy Week')
                      : (lang === 'so' ? 'Jinsiga' : 'Gender')}
                  </label>
                  {category === 'maternal' ? (
                    <input
                      type="number"
                      min="1"
                      max="42"
                      value={pregnancyWeek}
                      onChange={(e) => setPregnancyWeek(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 28"
                      className={`w-full rounded-xl border px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          gender === 'female' 
                            ? `${styles.accentBg} text-white` 
                            : `${styles.inputBg} ${styles.inputBorder} ${styles.textSecondary}`
                        }`}
                      >
                        {lang === 'so' ? 'Dheddig' : 'Female'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          gender === 'male' 
                            ? `${styles.accentBg} text-white` 
                            : `${styles.inputBg} ${styles.inputBorder} ${styles.textSecondary}`
                        }`}
                      >
                        {lang === 'so' ? 'Lab' : 'Male'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Vital Signs */}
              <div className={`rounded-2xl border p-4 transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${styles.textPrimary}`}>
                    <Activity className={`h-4 w-4 ${styles.accentText}`} />
                    <span>{lang === 'so' ? 'Calaamadaha Nolosha ee Kalkaalisada (Vital Signs)' : 'Clinical Vital Signs'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Auto Triage Input</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Temp */}
                  <div>
                    <label className={`block text-[11px] font-medium mb-1 ${styles.textSecondary}`}>
                      {lang === 'so' ? 'Heerkul (°C)' : 'Temp (°C)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 37.0)}
                      className={`w-full rounded-xl border px-2.5 py-2 text-xs font-mono font-bold focus:outline-none ${styles.inputBg} ${
                        temperature >= 38.5 ? 'border-rose-500 text-rose-600' : `${styles.inputBorder} ${styles.inputText}`
                      }`}
                    />
                  </div>

                  {/* BP */}
                  <div>
                    <label className={`block text-[11px] font-medium mb-1 ${styles.textSecondary}`}>
                      {lang === 'so' ? 'Cadaadis (BP)' : 'Blood Pressure'}
                    </label>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                      className={`w-full rounded-xl border px-2.5 py-2 text-xs font-mono font-bold focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>

                  {/* Pulse */}
                  <div>
                    <label className={`block text-[11px] font-medium mb-1 ${styles.textSecondary}`}>
                      {lang === 'so' ? 'Wadno-garaac (BPM)' : 'Heart Rate'}
                    </label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 75)}
                      className={`w-full rounded-xl border px-2.5 py-2 text-xs font-mono font-bold focus:outline-none ${styles.inputBg} ${
                        heartRate > 115 ? 'border-amber-500 text-amber-600' : `${styles.inputBorder} ${styles.inputText}`
                      }`}
                    />
                  </div>

                  {/* SpO2 */}
                  <div>
                    <label className={`block text-[11px] font-medium mb-1 ${styles.textSecondary}`}>
                      {lang === 'so' ? 'Ogsajiin (SpO2 %)' : 'Oxygen SpO2'}
                    </label>
                    <input
                      type="number"
                      value={spO2}
                      onChange={(e) => setSpO2(parseInt(e.target.value, 10) || 98)}
                      className={`w-full rounded-xl border px-2.5 py-2 text-xs font-mono font-bold focus:outline-none ${styles.inputBg} ${
                        spO2 < 93 ? 'border-rose-500 text-rose-600' : `${styles.inputBorder} ${styles.inputText}`
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Symptoms */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Calaamadaha Xanuunka ee Qofku Ka Cabanayo' : 'Chief Clinical Complaints / Symptoms'}
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={lang === 'so' ? 'Qor sababta imaatinka, xanuunka, iyo inta maalmood uu socday...' : 'Describe chief symptoms, duration, and patient state...'}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none resize-none transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              {/* Triage assessment notice */}
              <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                calculatedTriage.level === 'emergency'
                  ? styles.emergencyBg
                  : calculatedTriage.level === 'urgent'
                  ? styles.urgentBg
                  : styles.routineBg
              }`}>
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">{lang === 'so' ? 'Xukunka Triage-ka:' : 'Triage Assessment:'} </span>
                  <span>{calculatedTriage.reason}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                <Printer className="h-4 w-4" />
                <span>{lang === 'so' ? 'Soo Saar Tikidhka Safka & Dir SMS Ogeysiis ah' : 'Issue Queue Ticket & Dispatch SMS Alert'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Waiting Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className={`text-base font-bold font-display flex items-center gap-2 ${styles.textPrimary}`}>
                  <Clock className={`h-4 w-4 ${styles.accentText}`} />
                  <span>{lang === 'so' ? 'Bukaanka Hadda Safka Ku Jira' : 'Live Waiting Queue'}</span>
                </h3>
                <p className={`text-xs ${styles.textSecondary}`}>
                  {lang === 'so' ? 'Waxaa loo kala horraysiiyay heerka triage-ka' : 'Ordered strictly by clinical triage priority'}
                </p>
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
                {waitingPatients.length} {lang === 'so' ? 'Bukaan' : 'Patients'}
              </span>
            </div>

            {waitingPatients.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {lang === 'so' ? 'Ma jiraan bukaan safka hadda ku jira.' : 'No patients currently waiting in queue.'}
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {waitingPatients.map((pat) => (
                  <div
                    key={pat.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      pat.triageLevel === 'emergency'
                        ? styles.emergencyBg
                        : pat.triageLevel === 'urgent'
                        ? styles.urgentBg
                        : `${styles.cardBg} ${styles.cardBorder}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base">
                          {pat.ticketNumber}
                        </span>
                        <span className="opacity-40">·</span>
                        <span className="text-xs font-bold truncate">
                          {pat.fullName}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono font-bold uppercase">
                        {pat.triageLevel}
                      </span>
                    </div>

                    <p className="text-[11px] opacity-80 line-clamp-1 mb-2">
                      {pat.symptoms}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono border-t border-black/10 dark:border-white/10 pt-2 opacity-90">
                      <div className="flex items-center gap-2">
                        <span>{pat.vitals.temperature}°C</span>
                        <span>·</span>
                        <span>BP: {pat.vitals.bloodPressure}</span>
                        <span>·</span>
                        <span>HR: {pat.vitals.heartRate}</span>
                      </div>
                      <span className="font-sans font-bold">
                        ~{pat.estimatedWaitMinutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issued Ticket Modal Receipt */}
      {issuedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl ${styles.cardBg} ${styles.cardBorder}`}>
            <button
              onClick={() => setIssuedPatient(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${styles.badgeBg} ${styles.accentText} mb-2`}>
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Tikidhka Rasmiga ah ee Safka' : 'Official Clinic Queue Ticket'}
              </h3>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so' ? 'Xarunta Caafimaadka DaryeelQoys' : 'DaryeelQoys Maternal & Family Clinic'}
              </p>
            </div>

            {/* Ticket Slip */}
            <div className={`my-6 rounded-2xl border p-6 text-center shadow-inner ${styles.cardInnerBg} ${styles.cardBorder}`}>
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                {lang === 'so' ? 'Lambarkaaga Safka' : 'Your Queue Number'}
              </div>
              <div className={`text-5xl font-black font-mono tracking-wider mb-2 ${styles.accentText}`}>
                {issuedPatient.ticketNumber}
              </div>

              <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${styles.badgeBg} ${styles.badgeText} mb-3`}>
                {issuedPatient.fullName} · {issuedPatient.age} {lang === 'so' ? 'jir' : 'yrs'}
              </div>

              {/* Scannable QR Code */}
              <div className="py-2.5 px-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 my-3 flex flex-col items-center">
                <TicketQRCode
                  ticketNumber={issuedPatient.ticketNumber}
                  patientName={issuedPatient.fullName}
                  size={135}
                  showDetails={true}
                  showActions={true}
                  theme={theme}
                  lang={lang}
                  onOpenPrintSlip={() => setShowPrintSlip(true)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-left border-t border-black/5 dark:border-white/10 pt-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    {lang === 'so' ? 'Heerka Triage:' : 'Triage Level:'}
                  </span>
                  <span className={`font-bold capitalize ${styles.textPrimary}`}>{issuedPatient.triageLevel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    {lang === 'so' ? 'Waqtiga Sugitaanka:' : 'Estimated Wait:'}
                  </span>
                  <span className={`font-bold ${styles.accentText}`}>
                    ~{issuedPatient.estimatedWaitMinutes} {lang === 'so' ? 'Daqiiqo' : 'Minutes'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated SMS Alert */}
            <div className={`rounded-2xl border p-3.5 text-xs flex items-start gap-2.5 mb-5 ${styles.badgeBg} ${styles.accentBorder}`}>
              <Send className={`h-4 w-4 shrink-0 mt-0.5 ${styles.accentText}`} />
              <div className={styles.textPrimary}>
                <span className="font-bold">SMS Sent to {issuedPatient.phone}: </span>
                <span>
                  {lang === 'so'
                    ? `Kusoo dhowow DaryeelQoys. Tikidhkaagu waa ${issuedPatient.ticketNumber}. QR code-ka ku skaan garee albaabka markaad timaado.`
                    : `Welcome to DaryeelQoys. Your ticket is ${issuedPatient.ticketNumber}. Scan your QR code at the entrance kiosk when you arrive.`}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPrintSlip(true)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4 text-blue-600" />
                <span>{lang === 'so' ? 'Daabac Tikidhka' : 'Print Slip'}</span>
              </button>

              <button
                onClick={() => setIssuedPatient(null)}
                className={`flex-1 rounded-xl py-3 text-xs font-bold text-white transition-colors cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                {lang === 'so' ? 'Xidh Tikidhka' : 'Close Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Ticket Slip Modal */}
      {showPrintSlip && issuedPatient && (
        <OfficialTicketSlipModal
          patient={issuedPatient}
          onClose={() => setShowPrintSlip(false)}
          lang={lang}
          theme={theme}
        />
      )}
    </div>
  );
}
