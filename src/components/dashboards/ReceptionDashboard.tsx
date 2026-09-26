import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  Calendar, 
  Baby, 
  Stethoscope,
  Tv,
  Printer,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Patient, DoctorRoom, UserProfile, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { OfficialTicketSlipModal } from '../OfficialTicketSlipModal';

interface ReceptionDashboardProps {
  currentUser: UserProfile;
  patients: Patient[];
  rooms: DoctorRoom[];
  onAddPatient: (patient: Patient) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function ReceptionDashboard({
  currentUser,
  patients,
  rooms,
  onAddPatient,
  lang,
  theme,
}: ReceptionDashboardProps) {
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickCategory, setQuickCategory] = useState<'maternal' | 'child' | 'adult' | 'emergency'>('maternal');
  const [printedTicket, setPrintedTicket] = useState<string | null>(null);
  const [selectedPatientForSlip, setSelectedPatientForSlip] = useState<Patient | null>(null);

  // Filter patients by search
  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.ticketNumber.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const handleQuickCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;

    const prefix = quickCategory === 'emergency' ? 'E' : quickCategory === 'maternal' ? 'M' : quickCategory === 'child' ? 'P' : 'R';
    const randNum = Math.floor(10 + Math.random() * 90);
    const ticketNumber = `${prefix}-${randNum}`;

    const newPatient: Patient = {
      id: `pt-rec-${Date.now()}`,
      ticketNumber,
      fullName: quickName.trim(),
      phone: quickPhone.trim(),
      age: quickCategory === 'child' ? 2 : 26,
      gender: 'female',
      category: quickCategory,
      pregnancyWeek: quickCategory === 'maternal' ? 28 : undefined,
      symptoms: lang === 'so' ? 'Soo Dhoweynta: Baaritaan Joogto ah' : 'Reception check-in: General Visit',
      triageLevel: quickCategory === 'emergency' ? 'emergency' : 'routine',
      triageScore: quickCategory === 'emergency' ? 1 : 3,
      vitals: {
        temperature: 37.0,
        bloodPressure: '120/80',
        heartRate: 78,
        spO2: 98,
      },
      status: 'waiting',
      registeredAt: new Date().toISOString(),
      estimatedWaitMinutes: 18,
    };

    onAddPatient(newPatient);
    setPrintedTicket(ticketNumber);
    setSelectedPatientForSlip(newPatient);
    setQuickName('');
    setQuickPhone('');
    setTimeout(() => setPrintedTicket(null), 7000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Reception Header */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800">
                Xafiiska Soo Dhoweynta & Diiwaanka
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {lang === 'so' ? 'Furan 24/7' : 'Station Open'}
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

        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60">
            <div className="text-[10px] uppercase font-bold text-emerald-600">Tikidhada Maanta La Bixiyay</div>
            <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
              {patients.length} Tikidh
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Success Print Feedback */}
      {printedTicket && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">Tikidhka si guul leh ayaa loo daabacay!</div>
              <div className="font-mono text-xs font-black underline mt-0.5">Lambarka: {printedTicket}</div>
              <div className="text-[11px] opacity-80">QR Code-ka waxaa lagu skaan garayn karaa albaabka xarunta.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedPatientForSlip && (
              <button
                type="button"
                onClick={() => setSelectedPatientForSlip(selectedPatientForSlip)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                <span>{lang === 'so' ? 'Daabac Tikidhka QR' : 'Print QR Slip'}</span>
              </button>
            )}
            <button onClick={() => setPrintedTicket(null)} className="font-bold underline cursor-pointer px-2">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Quick Check-in & Search Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Ticket Issuance Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <Plus className="h-5 w-5 text-emerald-600" />
              <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Bixi Tikidh Cusub (Quick Intake)' : 'Fast Ticket Check-In'}
              </h2>
            </div>

            <form onSubmit={handleQuickCheckin} className="space-y-4 text-xs">
              <div>
                <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Magaca Bukaanka *' : 'Patient Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder={lang === 'so' ? 'Tusaale: Sahra Cumar Cali' : 'e.g. Sahra Omar'}
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Taleefanka (SMS-ka Safka) *' : 'Phone Number (SMS Recipient) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="+252 61..."
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Qeybta Bukaanka' : 'Category'}
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                >
                  <option value="maternal">Hooyo Uur Leh (Maternal ANC)</option>
                  <option value="child">Ilmo / Dhallaan (Pediatrics)</option>
                  <option value="emergency">Degdeg Halis ah (Emergency ER)</option>
                  <option value="adult">Qof Weyn oo Guud (Adult)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>{lang === 'so' ? 'Daabac Tikidhka & Dir SMS' : 'Print Ticket & Send SMS'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Patient Lookup Directory (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-600" />
                <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Baar Bukaanka & Diiwaanka' : 'Patient Search & Ticket Verification'}
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {filteredPatients.length} bukaan la helay
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'so' ? 'Ku baar magac, tikidh (M-14), ama taleefan...' : 'Search by name, ticket, or phone...'}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
              />
            </div>

            {/* Table of Patients */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold flex items-center justify-center text-xs">
                      {p.ticketNumber}
                    </span>
                    <div>
                      <div className={`font-bold ${styles.textPrimary}`}>{p.fullName}</div>
                      <div className="text-[11px] text-slate-400">📞 {p.phone} · {p.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPatientForSlip(p)}
                      title={lang === 'so' ? 'Daabac Tikidhka QR' : 'Print QR Slip'}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5 text-blue-600" />
                    </button>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'waiting'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : p.status === 'in_consultation'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.assignedDoctorName ? p.assignedDoctorName.split(' ')[0] : 'Safka ku jira'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Printable Ticket Slip Modal */}
      {selectedPatientForSlip && (
        <OfficialTicketSlipModal
          patient={selectedPatientForSlip}
          rooms={rooms}
          onClose={() => setSelectedPatientForSlip(null)}
          lang={lang}
          theme={theme}
        />
      )}
    </div>
  );
}
