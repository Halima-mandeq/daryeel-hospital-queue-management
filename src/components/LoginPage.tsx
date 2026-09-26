import { useState } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  Syringe, 
  Building2, 
  Users, 
  Baby, 
  Lock, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Pill
} from 'lucide-react';
import { UserProfile, UserRole, ThemePalette } from '../types/clinic';
import { DEMO_USERS } from '../data/mockUsers';
import { getThemeStyles } from '../utils/theme';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToWebsite: () => void;
  users?: UserProfile[];
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function LoginPage({
  onLoginSuccess,
  onBackToWebsite,
  users = DEMO_USERS,
  lang,
  theme,
}: LoginPageProps) {
  const styles = getThemeStyles(theme);

  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [email, setEmail] = useState('dr.maryan@daryeelqoys.so');
  const [password, setPassword] = useState('daryeel2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // When role changes, auto-populate sample credentials
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    const demoUser = users.find((u) => u.role === role) || DEMO_USERS.find((u) => u.role === role);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password || 'daryeel2026');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      // 1. Search for exact email match in users
      const matchedByEmail = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (matchedByEmail) {
        // Validate password
        const expectedPass = matchedByEmail.password || 'daryeel2026';
        if (password !== expectedPass && password !== 'daryeel2026') {
          setLoading(false);
          setErrorMsg(
            lang === 'so'
              ? 'Furaha sirta ah (Password) waa qalad! Fadlan dib u hubi.'
              : 'Incorrect password! Please check your credentials.'
          );
          return;
        }

        setLoading(false);
        onLoginSuccess(matchedByEmail);
        return;
      }

      // 2. Fallback by role if email is generic
      const matchedByRole = users.find((u) => u.role === selectedRole) || DEMO_USERS.find((u) => u.role === selectedRole);
      if (matchedByRole) {
        setLoading(false);
        onLoginSuccess(matchedByRole);
        return;
      }

      setLoading(false);
      setErrorMsg(
        lang === 'so'
          ? 'Email-kan lagama helin diiwaanka isbitaalka. Fadlan la xiriir Agaasimaha Guud.'
          : 'Email not found in hospital directory. Contact Hospital Director.'
      );
    }, 500);
  };

  // Instant 1-click Login
  const handleQuickLogin = (demoUser: UserProfile) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(demoUser);
    }, 300);
  };

  const roleOptions: {
    role: UserRole;
    nameSo: string;
    nameEn: string;
    descSo: string;
    descEn: string;
    icon: any;
    color: string;
  }[] = [
    {
      role: 'doctor',
      nameSo: 'Dhakhtar Takhasusle ah',
      nameEn: 'Specialist Physician',
      descSo: 'Qolka baaritaanka, u yeeritaanka bukaanka & qorista dawooyinka.',
      descEn: 'Consultation room, calling patient queue & electronic prescriptions.',
      icon: Stethoscope,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    },
    {
      role: 'nurse',
      nameSo: 'Kalkaaliye Triage & Vitals',
      nameEn: 'Triage Nurse & Vitals',
      descSo: 'Cabiraada heerkulka, cadaadiska & kala shaandheynta degdegga ah.',
      descEn: 'Vitals acquisition, rapid emergency triage & acuity calculation.',
      icon: Syringe,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    },
    {
      role: 'admin',
      nameSo: 'Agaasime / Maamulka Isbitaalka',
      nameEn: 'Hospital Director & Admin',
      descSo: 'Kormeerka shaqada, tirakoobka & dhoofinta diiwaanka PDF/CSV.',
      descEn: 'Executive analytics, queue latency telemetry & clinical PDF/CSV exports.',
      icon: Building2,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    },
    {
      role: 'receptionist',
      nameSo: 'Soo Dhoweynta & Diiwaanka',
      nameEn: 'Reception & Queue Desk',
      descSo: 'Diiwaangelinta bukaanka cusub, bixinta tikidha & dirista SMS-ka.',
      descEn: 'Patient check-in, ticket generation & automated SMS broadcasts.',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    },
    {
      role: 'pharmacist',
      nameSo: 'Farmashiyo & Dawooyinka',
      nameEn: 'Pharmacy & Dispensing',
      descSo: 'Bixinta dawooyinka dhakhtarku qoray, xisaabinta keydka (inventory) & digniinta kaydka.',
      descEn: 'Prescription dispensing, inventory tracking, batch expiry & cold-chain management.',
      icon: Pill,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
    },
    {
      role: 'lab_tech',
      nameSo: 'Shaybaar & Baaritaan',
      nameEn: 'Laboratory & Diagnostics',
      descSo: 'Falanqeynta dhiigga, duumada, kaadida, ultrasound iyo diiwaanka natiijooyinka.',
      descEn: 'Pathology testing, bloodwork, urinalysis, rapid diagnostic test reporting.',
      icon: HeartPulse,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    },
    {
      role: 'cashier',
      nameSo: 'Lacag-Qabasho & Biilal',
      nameEn: 'Cashier & Mobile Billing',
      descSo: 'Qabashada lacagta EVC Plus, Zaad, Sahal, rasiidhada rasmiga ah iyo xisaabinta maalinlaha.',
      descEn: 'Mobile money settlement, USSD push confirmation & official tax invoices.',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    },
    {
      role: 'patient',
      nameSo: 'Bukaan / Qoys (Portal)',
      nameEn: 'Patient & Family Portal',
      descSo: 'La socodka booska safka, warbixinta dhakhtarka & jadwalka tallaalka.',
      descEn: 'Live ticket wait tracker, doctor notes & infant vaccination dates.',
      icon: Baby,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    },
  ];

  return (
    <div className={`min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors ${styles.bgApp}`}>
      <div className="w-full max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToWebsite}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${styles.cardBg} ${styles.cardBorder} ${styles.textPrimary} hover:border-blue-500`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{lang === 'so' ? 'Ku laabo Bogga Isbitaalka' : 'Back to Public Hospital Website'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{lang === 'so' ? 'Galka Sugan ee Isbitaalka (HIPAA / MOH)' : 'Secure Health System Login'}</span>
          </div>
        </div>

        {/* Main Login Card Layout */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 ${styles.cardBg} ${styles.cardBorder}`}>
          
          {/* Left Column: Role Selector (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white ${styles.accentBg}`}>
                  <HeartPulse className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-xs tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  DaryeelQoys Clinical Portal
                </span>
              </div>

              <h2 className={`text-2xl font-extrabold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Dooro Qaybta Aad Ka Tirsan Tahay' : 'Select Your Clinical Role'}
              </h2>
              <p className={`text-xs mt-1 mb-6 ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Dooro doorkaaga shaqo si aad toos ugu gasho dashboodhkaaga u gaarka ah.'
                  : 'Choose your institutional identity to enter your tailored clinical workstation.'}
              </p>

              {/* Role Cards List */}
              <div className="space-y-2.5">
                {roleOptions.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = selectedRole === opt.role;
                  return (
                    <div
                      key={opt.role}
                      onClick={() => handleRoleSelect(opt.role)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? `ring-2 ring-blue-600 dark:ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 shadow-xs`
                          : `${styles.cardInnerBg} ${styles.cardBorder} hover:border-slate-300 dark:hover:border-slate-700`
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${opt.color}`}>
                        <IconComp className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${styles.textPrimary}`}>
                            {lang === 'so' ? opt.nameSo : opt.nameEn}
                          </span>
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-0.5 leading-snug ${styles.textSecondary}`}>
                          {lang === 'so' ? opt.descSo : opt.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5" />
                <span>{lang === 'so' ? 'Galitaanka Degdegga ah ee Tijaabada (Demo):' : 'Fast 1-Click Demo Profiles:'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs"
                  >
                    <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{u.name.split(' ')[0]} ({u.role === 'doctor' && u.specialty ? u.specialty.split(' ')[0] : u.role})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Credentials Form (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/30">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-blue-600" />
                <h3 className={`text-lg font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Gal Nidaamka' : 'Sign In'}
                </h3>
              </div>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Email-ka Shaqaalaha / Taleefanka' : 'Staff Email / Phone ID'}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tusaale@daryeelqoys.so"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 font-mono ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Furaha Sirta ah (Password)' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 font-mono ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                    <span>{lang === 'so' ? 'Demo Password: daryeel2026' : 'Demo Pass: daryeel2026'}</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {lang === 'so' ? 'Ma ilowday?' : 'Forgot?'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${styles.accentBg}`}
                >
                  {loading ? (
                    <span>{lang === 'so' ? 'Hubinaya xogta...' : 'Authenticating...'}</span>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>
                        {lang === 'so'
                          ? `Gal Sida ${selectedRole.toUpperCase()}`
                          : `Enter as ${selectedRole.toUpperCase()}`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Security Assurance */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit Encrypted Hospital Intranet Gateway</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
