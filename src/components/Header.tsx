import { 
  HeartPulse, 
  Users, 
  Tv, 
  Stethoscope, 
  Baby, 
  Search, 
  BarChart3, 
  PhoneCall, 
  Palette,
  LogIn,
  LogOut,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Syringe,
  UserCheck,
  Pill,
  Camera,
  QrCode,
  FlaskConical,
  CreditCard
} from 'lucide-react';
import { ThemePalette, UserProfile } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';

export type ActiveTab = 
  | 'website' 
  | 'login' 
  | 'dashboard' 
  | 'triage' 
  | 'display' 
  | 'doctor' 
  | 'mch' 
  | 'patient' 
  | 'analytics'
  | 'pharmacy'
  | 'laboratory'
  | 'billing';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  lang: 'so' | 'en';
  setLang: (lang: 'so' | 'en') => void;
  waitingCount: number;
  emergencyCount: number;
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  onOpenScanner?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  lang,
  setLang,
  waitingCount,
  emergencyCount,
  theme,
  setTheme,
  onOpenScanner,
}: HeaderProps) {
  const styles = getThemeStyles(theme);

  const themeOptions: { id: ThemePalette; nameSo: string; nameEn: string; color: string }[] = [
    { id: 'sapphire', nameSo: 'Bluu Caafimaad', nameEn: 'Medical Sapphire', color: 'bg-blue-600' },
    { id: 'emerald', nameSo: 'Cagaar Caafimaad', nameEn: 'Clinical Emerald', color: 'bg-emerald-600' },
    { id: 'warm', nameSo: 'Kalgacal / Hooyo', nameEn: 'Warm Maternal', color: 'bg-rose-600' },
    { id: 'dark', nameSo: 'Madow / TV', nameEn: 'Midnight Dark', color: 'bg-slate-900 border border-slate-700' },
  ];

  // Role permissions: Only granted AFTER Login
  const role = currentUser?.role;

  const canSeeTriage = role === 'nurse' || role === 'admin';
  const canSeeDoctor = role === 'doctor' || role === 'admin';
  const canSeeMch = role === 'nurse' || role === 'admin';
  const canSeeAnalytics = role === 'admin';
  const canSeePharmacy = role === 'pharmacist' || role === 'admin' || role === 'doctor';
  // ONLY for Nurse (kalkaaliye), Admin (agaasime), Receptionist (diiwaangalin) after login!
  const canSeeTicketCheck = !!currentUser && (role === 'receptionist' || role === 'nurse' || role === 'admin');

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${styles.headerBg} ${styles.headerBorder}`}>
      
      {/* 1. TOP UTILITY BAR (Hospital Status & Emergency Hotline) */}
      <div className={`border-b px-3 sm:px-4 py-1.5 text-xs transition-colors ${
        styles.isDark ? 'border-slate-800/80 bg-slate-900/80 text-slate-300' : 'border-slate-100 bg-slate-50/90 text-slate-600'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          
          {/* Emergency & MCH Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">
                {lang === 'so' ? 'Xarunta Hooyada & Dhallaanka (24/7 Furan)' : 'MCH & Emergency Center (Open 24/7)'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <span>·</span>
              <span>{lang === 'so' ? 'Gurmadka Degdegga:' : 'Emergency:'}</span>
              <a href="tel:999" className="text-rose-600 font-bold hover:underline flex items-center gap-1">
                <PhoneCall className="h-3 w-3" />
                <span>999 / +252 61 500 0011</span>
              </a>
            </div>
          </div>

          {/* Right: Live Queue Count, Themes, & Language */}
          <div className="flex items-center gap-2.5 text-xs">
            
            {/* Live Queue Count */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <span className={styles.textMuted}>{lang === 'so' ? 'Safka Hadda:' : 'Queue:'}</span>
              <span className={`font-bold ${styles.accentText}`}>{waitingCount}</span>
              {emergencyCount > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-600 font-bold animate-pulse">
                    {emergencyCount} {lang === 'so' ? 'Degdeg' : 'Crit'}
                  </span>
                </>
              )}
            </div>

            {/* COLOR PALETTE THEME SWITCHER */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  title={`${lang === 'so' ? opt.nameSo : opt.nameEn}`}
                  className={`flex items-center gap-1 p-1 rounded transition-all cursor-pointer ${
                    theme === opt.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${opt.color}`}></span>
                </button>
              ))}
            </div>

            {/* Language Switch */}
            <div className="flex items-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setLang('so')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  lang === 'so' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                SO
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER & ROLE-GATED NAVIGATION */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('website')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md transition-all group-hover:scale-105 ${styles.accentBg}`}>
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-display text-lg sm:text-xl font-extrabold tracking-tight ${styles.textPrimary}`}>
                  DaryeelQoys
                </h1>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
                  MCH & SMART TRIAGE
                </span>
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Isbitaalka Takhasusiga ee Hooyada, Dhallaanka & Gurmadka'
                  : 'Premier Maternal, Neonatal & Emergency Hospital System'}
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            
            {/* 1. Public Hospital Website (Visible to EVERYONE) */}
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'website'
                  ? styles.navActiveBg
                  : `${styles.navInactiveText} ${styles.navInactiveHover}`
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'so' ? 'Bogga Isbitaalka' : 'Hospital Website'}</span>
            </button>

            {/* 2. Shaashadda Safka TV (Visible to EVERYONE) */}
            <button
              onClick={() => setActiveTab('display')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'display'
                  ? styles.navActiveBg
                  : `${styles.navInactiveText} ${styles.navInactiveHover}`
              }`}
            >
              <Tv className="h-4 w-4" />
              <span>{lang === 'so' ? 'Shaashadda Safka (TV)' : 'Waiting TV'}</span>
            </button>

            {/* 3. Entrance QR Scanner (Visible to EVERYONE) */}
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                title={lang === 'so' ? 'Skaan garee QR Tikidhka albaabka' : 'Scan ticket QR code at hospital entrance'}
              >
                <Camera className="h-4 w-4 text-emerald-600" />
                <span>{lang === 'so' ? 'Skaanka Albaabka' : 'Entrance Scan'}</span>
              </button>
            )}

            {/* ================= IF LOGGED IN: SHOW ROLE-SPECIFIC WORKSPACE ================= */}
            {currentUser && (
              <>
                {/* Dedicated Role Dashboard */}
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border border-purple-200 dark:border-purple-800 ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>
                    {currentUser.role === 'doctor'
                      ? (lang === 'so' ? 'Qolka Dhakhtarka' : 'Doctor Room')
                      : currentUser.role === 'nurse'
                      ? (lang === 'so' ? 'Triage Desk' : 'Nurse Triage')
                      : currentUser.role === 'admin'
                      ? (lang === 'so' ? 'Maamulka Isbitaalka' : 'Admin Audit')
                      : currentUser.role === 'receptionist'
                      ? (lang === 'so' ? 'Soo Dhoweynta' : 'Reception')
                      : currentUser.role === 'pharmacist'
                      ? (lang === 'so' ? 'Farmashiyaha' : 'Pharmacy Desk')
                      : currentUser.role === 'lab_tech'
                      ? (lang === 'so' ? 'Shaybaarka' : 'Laboratory')
                      : currentUser.role === 'cashier'
                      ? (lang === 'so' ? 'Lacag-Qabashada' : 'Cashier Billing')
                      : (lang === 'so' ? 'Dashboodhka Bukaanka' : 'My Patient Dashboard')}
                  </span>
                </button>

                {/* Staff Queue & Ticket Management (Only Nurse, Admin, Receptionist) */}
                {canSeeTicketCheck && (
                  <button
                    onClick={() => setActiveTab('patient')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'patient'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <Search className="h-4 w-4 text-amber-600" />
                    <span>{lang === 'so' ? 'Diiwaanka Safka & Tikidhada' : 'Queue & Tickets'}</span>
                  </button>
                )}

                {/* Triage / Qaabilaadda (Only Nurse & Admin) */}
                {canSeeTriage && (
                  <button
                    onClick={() => setActiveTab('triage')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'triage'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <Users className="h-4 w-4 text-teal-600" />
                    <span>{lang === 'so' ? 'Qaabilaadda' : 'Triage Intake'}</span>
                  </button>
                )}

                {/* Consultations / Qolalka (Only Doctor & Admin) */}
                {canSeeDoctor && (
                  <button
                    onClick={() => setActiveTab('doctor')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'doctor'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    <span>{lang === 'so' ? 'Qolalka' : 'Consultations'}</span>
                  </button>
                )}

                {/* MCH & Vaccines (Only Nurse & Admin) */}
                {canSeeMch && (
                  <button
                    onClick={() => setActiveTab('mch')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'mch'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <Baby className="h-4 w-4 text-rose-500" />
                    <span>{lang === 'so' ? 'Hooyada & Tallaalka' : 'MCH'}</span>
                  </button>
                )}

                {/* Analytics / Warbixinta (Only Admin) */}
                {canSeeAnalytics && (
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'analytics'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span>{lang === 'so' ? 'Warbixinta' : 'Analytics'}</span>
                  </button>
                )}

                {/* Pharmacy Desk (Pharmacist, Admin, Doctor) */}
                {canSeePharmacy && currentUser.role !== 'pharmacist' && (
                  <button
                    onClick={() => setActiveTab('pharmacy')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'pharmacy'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <Pill className="h-4 w-4 text-teal-600" />
                    <span>{lang === 'so' ? 'Farmashiyaha' : 'Pharmacy'}</span>
                  </button>
                )}

                {/* Laboratory Desk (Lab Tech, Admin, Doctor) */}
                {(currentUser.role === 'lab_tech' || currentUser.role === 'admin' || currentUser.role === 'doctor') && (
                  <button
                    onClick={() => setActiveTab('laboratory')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'laboratory'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <FlaskConical className="h-4 w-4 text-indigo-600" />
                    <span>{lang === 'so' ? 'Shaybaarka' : 'Laboratory'}</span>
                  </button>
                )}

                {/* Billing & Cashier Desk (Cashier, Admin, Receptionist) */}
                {(currentUser.role === 'cashier' || currentUser.role === 'admin' || currentUser.role === 'receptionist') && (
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === 'billing'
                        ? styles.navActiveBg
                        : `${styles.navInactiveText} ${styles.navInactiveHover}`
                    }`}
                  >
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>{lang === 'so' ? 'Lacag-Qabashada' : 'Billing & EVC'}</span>
                  </button>
                )}

                {/* Logged in User Profile badge & Sign out */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div 
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-emerald-500 transition-all"
                    title={`${currentUser.name} (${currentUser.title})`}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
                    />
                    <div className="text-left hidden xl:block">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                        {currentUser.name.split(' ')[0]}
                      </div>
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {currentUser.role === 'patient' ? (lang === 'so' ? 'BUKAAN' : 'PATIENT') : currentUser.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer text-xs"
                    title={lang === 'so' ? 'Ka bax nidaamka' : 'Sign Out'}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{lang === 'so' ? 'Ka bax' : 'Logout'}</span>
                  </button>
                </div>
              </>
            )}

            {/* ================= IF NOT LOGGED IN: CLEAR "LOGIN" BUTTON ================= */}
            {!currentUser && (
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer ml-1.5 ${styles.accentBg}`}
              >
                <LogIn className="h-4 w-4" />
                <span>{lang === 'so' ? 'Gal Nidaamka' : 'Portal Login'}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
