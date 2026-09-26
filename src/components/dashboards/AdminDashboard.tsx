import { useState } from 'react';
import { 
  Building2, 
  BarChart3, 
  Users, 
  Clock, 
  HeartPulse, 
  TrendingDown, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Activity, 
  Stethoscope, 
  Baby,
  Calendar,
  Plus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  DoorOpen,
  Phone,
  Trash2,
  KeyRound,
  Search,
  Sparkles,
  Share2,
  Database,
  Server
} from 'lucide-react';
import { Patient, DoctorRoom, UserProfile, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { exportPatientsToPDF, exportPatientsToCSV } from '../../utils/exportRecords';
import { DoctorManagementModal } from './DoctorManagementModal';
import { LaravelBackendModal } from './LaravelBackendModal';

interface AdminDashboardProps {
  currentUser: UserProfile;
  patients: Patient[];
  rooms: DoctorRoom[];
  users: UserProfile[];
  onAddDoctor: (
    doctorData: {
      name: string;
      email: string;
      password: string;
      specialty: string;
      department: string;
      phone: string;
      avatar: string;
      roomOption: 'new' | 'existing';
      existingRoomId?: string;
      newRoomName?: string;
    }
  ) => void;
  onUpdateDoctorPassword: (doctorId: string, newPass: string) => void;
  onDeleteDoctor: (doctorId: string) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function AdminDashboard({
  currentUser,
  patients,
  rooms,
  users,
  onAddDoctor,
  onUpdateDoctorPassword,
  onDeleteDoctor,
  lang,
  theme,
}: AdminDashboardProps) {
  const styles = getThemeStyles(theme);

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'doctors'>('overview');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isLaravelModalOpen, setIsLaravelModalOpen] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [searchDoctorQuery, setSearchDoctorQuery] = useState('');
  
  // Password edit state
  const [editingPasswordDoctorId, setEditingPasswordDoctorId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Metrics
  const totalPatients = patients.length;
  const waitingPatients = patients.filter((p) => p.status === 'waiting').length;
  const inConsultation = patients.filter((p) => p.status === 'in_consultation').length;
  const completed = patients.filter((p) => p.status === 'completed').length;
  const emergencyCount = patients.filter((p) => p.triageLevel === 'emergency').length;
  const urgentCount = patients.filter((p) => p.triageLevel === 'urgent').length;
  const routineCount = patients.filter((p) => p.triageLevel === 'routine').length;

  // Filter doctors
  const doctorsList = users.filter((u) => u.role === 'doctor');
  const filteredDoctors = doctorsList.filter((doc) => {
    const q = searchDoctorQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.email.toLowerCase().includes(q) ||
      (doc.specialty && doc.specialty.toLowerCase().includes(q)) ||
      (doc.department && doc.department.toLowerCase().includes(q))
    );
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (doc: UserProfile) => {
    const pass = doc.password || 'daryeel2026';
    const text = lang === 'so'
      ? `🏥 *ISBITAALKA DARYEELQOYS*\n*Cinwaanka Dhakhtarka:*\n👨‍⚕️ Magaca: ${doc.name}\n📧 Gmail/Email: ${doc.email}\n🔑 Furaha Sirta (Password): ${pass}\n🚪 Qolka: ${doc.roomName || 'Qolka Baaritaanka'}\nTakhasuska: ${doc.specialty || doc.title}\n\nKa gal: Web-ka Isbitaalka -> Dooro "Dhakhtar" ama geli Email/Password.`
      : `🏥 *DARYEELQOYS HOSPITAL*\n*Doctor Account Details:*\n👨‍⚕️ Name: ${doc.name}\n📧 Email: ${doc.email}\n🔑 Password: ${pass}\n🚪 Room: ${doc.roomName || 'Consultation Room'}\nSpecialty: ${doc.specialty || doc.title}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(doc.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const handleCopySingleField = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleSavePassword = (docId: string) => {
    if (newPasswordVal.trim().length >= 4) {
      onUpdateDoctorPassword(docId, newPasswordVal.trim());
      setEditingPasswordDoctorId(null);
      setNewPasswordVal('');
      setExportFeedback(lang === 'so' ? 'Furaha sirta ah si guul leh ayaa loo beddelay!' : 'Password updated successfully!');
      setTimeout(() => setExportFeedback(null), 4000);
    }
  };

  const handleExportPDF = () => {
    const res = exportPatientsToPDF(patients, rooms, lang);
    if (res.success) {
      setExportFeedback(`PDF Exported: ${res.filename} (${res.count} records)`);
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  const handleExportCSV = () => {
    const res = exportPatientsToCSV(patients, rooms, lang);
    if (res.success) {
      setExportFeedback(`CSV Exported: ${res.filename} (${res.count} records)`);
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Executive Banner */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-purple-50 dark:bg-purple-950 text-purple-600 border-purple-200 dark:border-purple-800">
                Agaasinka Guud (Hospital General Director)
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                {lang === 'so' ? 'Kormeerka & Maamulka Shaqaalaha' : 'Staff Administration'}
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

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Backend Laravel & MySQL */}
          <button
            onClick={() => setIsLaravelModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            title="Laravel REST API & MySQL Database"
          >
            <Database className="h-4 w-4" />
            <span>{lang === 'so' ? 'Backend (Laravel & MySQL)' : 'Laravel & MySQL'}</span>
          </button>

          {/* Add Doctor CTA */}
          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'so' ? '+ Ku Dar Dhakhtar Cusub' : '+ Add New Doctor'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>{lang === 'so' ? 'Warbixin (PDF)' : 'Export Audit PDF'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{lang === 'so' ? 'Excel (CSV)' : 'Export Census CSV'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Admin */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-slate-100 dark:hover:bg-slate-800`
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>{lang === 'so' ? 'Kormeerka Guud & Qolalka' : 'Hospital Overview & Rooms'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('doctors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'doctors'
              ? 'bg-blue-600 text-white shadow-sm'
              : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-slate-100 dark:hover:bg-slate-800`
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          <span>{lang === 'so' ? 'Maamulka Dhakhaatiirta & Gmail-ka' : 'Doctor Management & Passwords'}</span>
          <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
            {doctorsList.length}
          </span>
        </button>
      </div>

      {/* Feedback Toast */}
      {exportFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-bold">{exportFeedback}</span>
          </div>
          <button onClick={() => setExportFeedback(null)} className="underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW & AUDIT */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className={`p-6 rounded-3xl border shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>{lang === 'so' ? 'Celceliska Waqtiga Safka' : 'Avg Queue Latency'}</span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-blue-600">18 min</span>
                <span className="text-xs text-emerald-600 font-bold">-89% improvement</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Hore: 3+ saacadood oo buuq ah</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>{lang === 'so' ? 'Bukaanka Isbitaalka (Census)' : 'Total Patient Census'}</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-purple-600">{totalPatients}</span>
                <span className="text-xs text-slate-400">{waitingPatients} safka ku jira</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{completed} la dhameeyay maanta</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>{lang === 'so' ? 'Degdegga Halista ah (P-1)' : 'Critical Emergency Response'}</span>
                <HeartPulse className="h-4 w-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-rose-600">&lt; 2 min</span>
                <span className="text-xs text-slate-400">{emergencyCount} xaaladood</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">0 dhimasho dhalmo ama dhiig-bax</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>{lang === 'so' ? 'Imaatinka Tallaalka Hooyada' : 'Immunization Compliance'}</span>
                <Baby className="h-4 w-4 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-teal-600">96.4%</span>
                <span className="text-xs text-emerald-600 font-bold">Heer Sare</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">SMS xusuusin ah oo toos ah</p>
            </div>
          </div>

          {/* Room Occupancy & Doctor Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-7 shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-sm font-bold font-display flex items-center gap-2 ${styles.textPrimary}`}>
                    <Stethoscope className="h-4 w-4 text-purple-600" />
                    <span>{lang === 'so' ? 'Shaqada Qolalka Dhakhaatiirta ee Hadda' : 'Clinical Room Occupancy'}</span>
                  </h3>
                  <p className={`text-xs ${styles.textSecondary}`}>
                    {lang === 'so' ? 'Kormeerka tooska ah ee qolalka ay dhakhaatiirtu bukaanada ku hayaan' : 'Live consultation room occupancy and availability telemetry'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddDoctorModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Ku dar Qol/Dhakhtar' : 'Add Room'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {rooms.map((room) => {
                  const currentPt = patients.find((p) => p.id === room.currentPatientId);
                  return (
                    <div key={room.id} className={`p-4 rounded-2xl border flex items-center justify-between ${styles.cardInnerBg} ${styles.cardBorder}`}>
                      <div>
                        <div className={`text-xs font-bold ${styles.textPrimary}`}>{room.roomName}</div>
                        <div className="text-[11px] text-slate-500">{room.doctorName} · {room.specialty}</div>
                      </div>

                      <div className="text-right">
                        {currentPt ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                            <span>Bukaan: {currentPt.ticketNumber} ({currentPt.fullName})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span>Waa Bannaan Yahay (Open)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Triage Priority Distribution */}
            <div className={`lg:col-span-5 rounded-3xl border p-6 sm:p-7 shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
              <h3 className={`text-sm font-bold font-display mb-1 flex items-center gap-2 ${styles.textPrimary}`}>
                <Activity className="h-4 w-4 text-purple-600" />
                <span>{lang === 'so' ? 'Kala Sooca Triage-ka' : 'Triage Priority Breakdown'}</span>
              </h3>
              <p className={`text-xs mb-6 ${styles.textSecondary}`}>
                {lang === 'so' ? 'Tirada bukaanada loo kala soocay heerarka halista' : 'Proportional breakdown of clinical urgency categories'}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-rose-600">P-1 Degdeg Halis (Emergency)</span>
                    <span className="font-mono">{emergencyCount} bukaan</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${totalPatients > 0 ? (emergencyCount / totalPatients) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-amber-600">P-2 Degdeg Dhexdhexaad (Urgent)</span>
                    <span className="font-mono">{urgentCount} bukaan</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalPatients > 0 ? (urgentCount / totalPatients) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-emerald-600">P-3 Caadi & Tallaal (Routine)</span>
                    <span className="font-mono">{routineCount} bukaan</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${totalPatients > 0 ? (routineCount / totalPatients) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR MANAGEMENT & CREDENTIALS */}
      {activeAdminTab === 'doctors' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${styles.cardBg} ${styles.cardBorder}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800">
                  Diiwaanka Dhakhaatiirta (Physician Roster)
                </span>
                <span className="text-xs text-slate-400">· {doctorsList.length} Dhakhtar ayaa diiwaangashan</span>
              </div>
              <h2 className={`text-lg sm:text-xl font-black font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Maamulka Dhakhaatiirta, Gmail-ka & Furaha Sirta' : 'Doctor Accounts, Gmail & Password Control'}
              </h2>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Agaasimaha Guud ahaan, waxaad halkan ku dari kartaa dhakhtar cusub, waxaad siin kartaa Gmail iyo Password, sidoo kalana waad beddeli kartaa.'
                  : 'As Hospital Director, register new physicians, assign custom Gmail & credentials, or reset access codes.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'so' ? 'Raadi dhakhtar, gmail, takhasus...' : 'Search doctor, email...'}
                  value={searchDoctorQuery}
                  onChange={(e) => setSearchDoctorQuery(e.target.value)}
                  className={`pl-8 pr-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              {/* Add Doctor Button */}
              <button
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>{lang === 'so' ? 'Dhakhtar Cusub' : 'Add Doctor'}</span>
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const isPasswordVisible = visiblePasswords[doc.id] || false;
              const docPassword = doc.password || 'daryeel2026';
              const assignedRoom = rooms.find((r) => r.id === doc.assignedRoomId);
              const isEditingThisPass = editingPasswordDoctorId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${styles.cardBg} ${styles.cardBorder}`}
                >
                  <div>
                    {/* Top: Photo & Basic Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                            {doc.specialty || doc.title.split('(')[0]}
                          </span>

                          <button
                            onClick={() => onDeleteDoctor(doc.id)}
                            title={lang === 'so' ? 'Ka saar dhakhtarkan' : 'Remove doctor'}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <h3 className={`text-base font-extrabold font-display truncate mt-1 ${styles.textPrimary}`}>
                          {doc.name}
                        </h3>
                        <p className={`text-[11px] truncate ${styles.textSecondary}`}>
                          {doc.department}
                        </p>
                      </div>
                    </div>

                    {/* Room and Phone */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                        <DoorOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Qolka</div>
                          <div className={`text-xs font-bold truncate ${styles.textPrimary}`}>
                            {doc.roomName || assignedRoom?.roomName || 'Qolka Baaritaanka'}
                          </div>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                        <Phone className="h-4 w-4 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Taleefan</div>
                          <div className={`text-xs font-mono font-bold truncate ${styles.textPrimary}`}>
                            {doc.phone || '+252 61 XXXX'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Credentials Box (Gmail & Password) */}
                    <div className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-2 mb-4">
                      <div className="text-[11px] font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                        <span>{lang === 'so' ? 'Xogta Gelitaanka Dhakhtarka:' : 'Doctor Login Credentials:'}</span>
                      </div>

                      {/* Gmail row */}
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {doc.email}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopySingleField(doc.email, `${doc.id}-email`)}
                          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedId === `${doc.id}-email` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      {/* Password row */}
                      {isEditingThisPass ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={newPasswordVal}
                            onChange={(e) => setNewPasswordVal(e.target.value)}
                            placeholder="Geli password cusub..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono outline-none bg-white dark:bg-slate-900 border-blue-400"
                          />
                          <button
                            onClick={() => handleSavePassword(doc.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Keydi
                          </button>
                          <button
                            onClick={() => setEditingPasswordDoctorId(null)}
                            className="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs cursor-pointer"
                          >
                            Xir
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-2 min-w-0">
                            <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                              {isPasswordVisible ? docPassword : '••••••••'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => togglePasswordVisibility(doc.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                              title={isPasswordVisible ? 'Qari' : 'Muuji'}
                            >
                              {isPasswordVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>

                            <button
                              onClick={() => handleCopySingleField(docPassword, `${doc.id}-pass`)}
                              className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                              title="Copy Password"
                            >
                              {copiedId === `${doc.id}-pass` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingPasswordDoctorId(doc.id);
                        setNewPasswordVal(docPassword);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      {lang === 'so' ? 'Beddel Password-ka' : 'Change Password'}
                    </button>

                    <button
                      onClick={() => handleCopyCredentials(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                    >
                      {copiedId === doc.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{lang === 'so' ? 'Waa La Koobiyeey!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{lang === 'so' ? 'Koobiyeey Fariinta' : 'Copy WhatsApp Message'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDoctors.length === 0 && (
            <div className={`p-12 text-center rounded-3xl border ${styles.cardBg} ${styles.cardBorder}`}>
              <Stethoscope className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Lama helin dhakhtar xogtiisa' : 'No doctors found'}
              </h3>
              <p className={`text-xs mt-1 ${styles.textSecondary}`}>
                {lang === 'so' ? 'Isku day raadin kale ama guji badhanka "+ Ku Dar Dhakhtar Cusub".' : 'Try another search query or click "+ Add New Doctor".'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Doctor Modal */}
      <DoctorManagementModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onAddDoctor={(data) => {
          onAddDoctor(data);
          setExportFeedback(lang === 'so' ? `Dhakhtarka ${data.name} si guul leh ayaa loo diiwaangeliyay!` : `Doctor ${data.name} registered successfully!`);
          setTimeout(() => setExportFeedback(null), 5000);
          setActiveAdminTab('doctors');
        }}
        existingRooms={rooms}
        lang={lang}
        theme={theme}
      />

      {/* Laravel & MySQL Backend Integration Modal */}
      <LaravelBackendModal
        isOpen={isLaravelModalOpen}
        onClose={() => setIsLaravelModalOpen(false)}
        lang={lang}
        theme={theme}
      />
    </div>
  );
}
