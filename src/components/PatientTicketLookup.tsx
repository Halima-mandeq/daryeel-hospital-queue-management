import React, { useState, useEffect } from 'react';
import { Patient, DoctorRoom, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { TicketQRCode } from './TicketQRCode';
import { OfficialTicketSlipModal } from './OfficialTicketSlipModal';
import { EntranceKioskScanner } from './EntranceKioskScanner';
import { 
  Search, 
  Clock, 
  AlertCircle, 
  Sparkles,
  CheckCircle2, 
  Phone,
  Volume2,
  Bell,
  RefreshCw,
  Activity,
  Heart,
  Thermometer,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  User,
  Tv,
  QrCode,
  Printer,
  Camera
} from 'lucide-react';
import { playHospitalChime } from '../utils/audio';

interface PatientTicketLookupProps {
  patients: Patient[];
  rooms: DoctorRoom[];
  lang: 'so' | 'en';
  theme: ThemePalette;
  onOpenLiveTv?: () => void;
  onOpenScanner?: () => void;
  initialTicketQuery?: string;
}

export function PatientTicketLookup({ 
  patients, 
  rooms, 
  lang, 
  theme,
  onOpenLiveTv,
  onOpenScanner,
  initialTicketQuery = '',
}: PatientTicketLookupProps) {
  const styles = getThemeStyles(theme);

  const [query, setQuery] = useState(initialTicketQuery);
  const [searched, setSearched] = useState(!!initialTicketQuery);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState<string | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);

  useEffect(() => {
    if (initialTicketQuery) {
      setQuery(initialTicketQuery);
      setSearched(true);
    }
  }, [initialTicketQuery]);

  // Auto-sync ticker to assure patients it's real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const matchedPatient = patients.find(p => 
    p.ticketNumber.toLowerCase() === query.trim().toLowerCase() ||
    p.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
  );

  const getQueuePosition = (patient: Patient) => {
    if (patient.status !== 'waiting') return 0;
    const ahead = patients.filter(p => 
      p.status === 'waiting' && 
      p.triageScore <= patient.triageScore && 
      p.registeredAt < patient.registeredAt
    );
    return ahead.length + 1;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (matchedPatient) {
      playHospitalChime();
    }
  };

  // Announce ticket via voice and chime
  const handleAnnounceTicket = (patient: Patient) => {
    playHospitalChime();
    if (!('speechSynthesis' in window)) return;

    setIsSpeaking(true);
    const roomName = patient.assignedRoomId 
      ? rooms.find(r => r.id === patient.assignedRoomId)?.roomName 
      : (lang === 'so' ? 'Qolka Dhakhtarka' : 'Consultation Room');

    let textToSpeak = '';
    if (patient.status === 'called') {
      textToSpeak = lang === 'so'
        ? `Fadlan digtooni. Tikidhka ${patient.ticketNumber}, ${patient.fullName}, fadlan u gudub ${roomName}.`
        : `Attention please. Ticket ${patient.ticketNumber}, ${patient.fullName}, please proceed to ${roomName}.`;
    } else if (patient.status === 'in_consultation') {
      textToSpeak = lang === 'so'
        ? `Tikidhka ${patient.ticketNumber}, ${patient.fullName}, hadda waxaad ku jirtaa qolka dhakhtarka.`
        : `Ticket ${patient.ticketNumber}, ${patient.fullName}, currently in doctor consultation.`;
    } else {
      const pos = getQueuePosition(patient);
      textToSpeak = lang === 'so'
        ? `Tikidhka ${patient.ticketNumber}, ${patient.fullName}. Booskaaga safka waa lambar ${pos}. Waqtiga la qiyaasay waa ${patient.estimatedWaitMinutes} daqiiqo.`
        : `Ticket ${patient.ticketNumber}, ${patient.fullName}. Your queue position is number ${pos}. Estimated wait is ${patient.estimatedWaitMinutes} minutes.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'so' ? 'so-SO' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Simulate SMS alert send
  const handleSendTestSms = (patient: Patient) => {
    setSmsSentNotice(
      lang === 'so'
        ? `Farriin SMS ah oo toos ah ayaa loo diray ${patient.phone}: "DaryeelQoys: Tikidhkaaga waa ${patient.ticketNumber}, booskaaga safka waa #${getQueuePosition(patient)}."`
        : `Live SMS dispatched to ${patient.phone}: "DaryeelQoys: Your ticket is ${patient.ticketNumber}, queue position #${getQueuePosition(patient)}."`
    );
    setTimeout(() => {
      setSmsSentNotice(null);
    }, 6000);
  };

  const currentlyWaitingPatients = patients.filter(p => p.status === 'waiting');
  const currentlyCalledPatients = patients.filter(p => p.status === 'called');

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Header with live status badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 shadow-xs bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{lang === 'so' ? 'Qaybta Gaarka ah ee Shaqaalaha (Kalkaaliye · Agaasime · Diiwaangalin)' : 'Staff Desk: Nurse · Director · Receptionist'}</span>
        </div>

        <h2 className={`text-2xl sm:text-4xl font-extrabold font-display tracking-tight ${styles.textPrimary}`}>
          {lang === 'so' ? 'Diiwaanka Safka & Hubinta Tikidhada' : 'Queue Roster & Ticket Verification'}
        </h2>
        <p className={`text-xs sm:text-sm mt-2 max-w-lg mx-auto ${styles.textSecondary}`}>
          {lang === 'so'
            ? 'Qaybtan waxaa loogu talagalay Kalkaaliyaha, Agaasimaha, iyo Diiwaangelinta si ay u baaraan booska safka bukaanka, waqtiga haray, iyo qolka dhakhtarka.'
            : 'Authorized clinical tool for Nurse, Hospital Director, and Receptionist to monitor patient queue positions, wait times, and room allocations.'}
        </p>

        {/* Live Sync Timestamp */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
          <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" />
          <span>
            {lang === 'so' ? 'Toos u cusbooneysiinaya: ' : 'Live synced: '}
            {lastSync.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* 2. Interactive Search Box */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm mb-8 transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'so' ? 'Gali Tikidhka ama Skaan garee QR Code:' : 'Enter Ticket Code or Scan QR Code:'}
          </span>
          <button
            type="button"
            onClick={() => onOpenScanner ? onOpenScanner() : setShowScannerModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Camera className="h-4 w-4" />
            <span>{lang === 'so' ? '📷 Skaanka Albaabka ee QR Code' : '📷 Entrance QR Scanner'}</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              required
              placeholder={lang === 'so' ? 'Gali Tikidhka (tusaale: M-008, P-014, E-001) ama Telefoon...' : 'Enter ticket (e.g. M-008, P-014, E-001) or phone...'}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              className={`w-full rounded-2xl border pl-12 pr-4 py-3.5 text-sm focus:outline-none font-mono font-bold transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
            />
          </div>
          <button
            type="submit"
            className={`rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${styles.accentBg} ${styles.accentHover}`}
          >
            <Search className="h-4 w-4" />
            <span>{lang === 'so' ? 'Raadi Booskaaga' : 'Check My Status'}</span>
          </button>
        </form>

        {/* Quick Sample Buttons */}
        <div className={`mt-5 flex flex-wrap items-center gap-2 text-xs ${styles.textSecondary}`}>
          <span className="font-semibold">{lang === 'so' ? 'Riix Tikidho diyaar ah:' : 'Click Quick Ticket:'}</span>
          {['E-001', 'M-008', 'P-014', 'M-009', 'P-015'].map((t) => {
            const pat = patients.find(p => p.ticketNumber === t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setQuery(t);
                  setSearched(true);
                  playHospitalChime();
                }}
                className={`font-mono text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  query.toUpperCase() === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : `${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder} hover:scale-105`
                }`}
              >
                <span>{t}</span>
                {pat?.status === 'called' && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SMS Dispatched Alert Toast */}
      {smsSentNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{smsSentNotice}</span>
        </div>
      )}

      {/* 3. Search Result: Detailed Patient Live Tracker */}
      {searched && (
        <div className="animate-in fade-in zoom-in-95 duration-200 mb-10">
          {matchedPatient ? (
            <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
              
              {/* Header card with name & status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-4xl font-black font-mono tracking-tight ${styles.accentText}`}>
                      {matchedPatient.ticketNumber}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold font-display ${styles.textPrimary}`}>
                        {matchedPatient.fullName}
                      </h3>
                      <p className={`text-xs mt-0.5 ${styles.textSecondary}`}>
                        {matchedPatient.phone} · {matchedPatient.age} {lang === 'so' ? 'jir' : 'yrs'} · {
                          matchedPatient.category === 'maternal' ? (lang === 'so' ? 'Hooyo Uur leh / Dhalmo' : 'Maternal / OB-GYN') :
                          matchedPatient.category === 'child' ? (lang === 'so' ? 'Ilmo Yar / Tallaal' : 'Pediatric / Neonatal') :
                          (lang === 'so' ? 'Guud / Gurmad' : 'General / Emergency')
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Status Pill & Voice Call Button */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-mono font-extrabold px-4 py-2 rounded-2xl flex items-center gap-2 ${
                    matchedPatient.status === 'in_consultation'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                      : matchedPatient.status === 'called'
                      ? 'bg-rose-600 text-white animate-pulse shadow-md font-black'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    <span>
                      {matchedPatient.status === 'in_consultation'
                        ? (lang === 'so' ? 'QOLKA AYAAD KU JIRTAA' : 'IN CONSULTATION')
                        : matchedPatient.status === 'called'
                        ? (lang === 'so' ? 'WAA LAGU WACAY! QOLKA TAG' : 'CALLED! GO TO ROOM')
                        : (lang === 'so' ? 'WAXAAD KU JIRTAA SAFKA' : 'WAITING IN QUEUE')}
                    </span>
                  </span>

                  <button
                    onClick={() => handleAnnounceTicket(matchedPatient)}
                    disabled={isSpeaking}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    title={lang === 'so' ? 'Dhageyso Codka U-yeeridda' : 'Listen to Voice Announcement'}
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>{isSpeaking ? (lang === 'so' ? 'Hadlaya...' : 'Speaking...') : (lang === 'so' ? 'Dhageyso Codka' : 'Voice Chime')}</span>
                  </button>
                </div>
              </div>

              {/* 4-Step Patient Journey Visual Progress */}
              <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {lang === 'so' ? 'Dadaalkaaga Caafimaad ee Maanta (Live Process):' : 'Your Hospital Care Progress:'}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {/* Step 1: Intake */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>1. {lang === 'so' ? 'Diiwaanka' : 'Registration'}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1">
                      {lang === 'so' ? 'Tikidhka waa la jaray' : 'Ticket Issued'}
                    </div>
                  </div>

                  {/* Step 2: Triage */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>2. {lang === 'so' ? 'Triage & Vitals' : 'Triage Intake'}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1">
                      {lang === 'so' ? 'Kala saarista degdegga' : 'Priority Assessed'}
                    </div>
                  </div>

                  {/* Step 3: Queue Waiting */}
                  <div className={`p-3 rounded-xl border ${
                    matchedPatient.status === 'waiting'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 font-bold text-amber-800 dark:text-amber-200 shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {matchedPatient.status === 'waiting' ? (
                        <Clock className="h-4 w-4 text-amber-600 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                      <span>3. {lang === 'so' ? 'Safka' : 'Queue Line'}</span>
                    </div>
                    <div className="text-[11px] mt-1 opacity-90">
                      {matchedPatient.status === 'waiting'
                        ? (lang === 'so' ? `Booska #${getQueuePosition(matchedPatient)}` : `Position #${getQueuePosition(matchedPatient)}`)
                        : (lang === 'so' ? 'Waa laguu yeeray' : 'Completed')}
                    </div>
                  </div>

                  {/* Step 4: Consultation */}
                  <div className={`p-3 rounded-xl border ${
                    matchedPatient.status === 'in_consultation' || matchedPatient.status === 'called'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 font-bold text-blue-800 dark:text-blue-200 shadow-xs animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      <User className="h-4 w-4" />
                      <span>4. {lang === 'so' ? 'Qolka Dhakhtarka' : 'Consultation'}</span>
                    </div>
                    <div className="text-[11px] mt-1">
                      {matchedPatient.status === 'called'
                        ? (lang === 'so' ? 'WAA LAGU SUGAYAA!' : 'CALLING YOU!')
                        : matchedPatient.status === 'in_consultation'
                        ? (lang === 'so' ? 'Gudaha ayaad ku jirtaa' : 'Inside Room')
                        : (lang === 'so' ? 'Safka sug' : 'Up Next')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Core Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                
                {/* 1. Queue Position */}
                <div className={`rounded-2xl border p-5 text-center transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {lang === 'so' ? 'Booskaaga Safka Hadda' : 'Current Queue Position'}
                  </span>
                  <div className={`text-4xl font-black font-mono ${styles.accentText}`}>
                    {matchedPatient.status === 'waiting' 
                      ? `#${getQueuePosition(matchedPatient)}` 
                      : (lang === 'so' ? 'HADDA' : 'NOW')}
                  </div>
                  <span className={`text-[11px] font-medium block mt-1 ${styles.textSecondary}`}>
                    {matchedPatient.status === 'waiting'
                      ? (lang === 'so' ? `Waxaa kaa horreeya ${Math.max(0, getQueuePosition(matchedPatient) - 1)} qof` : `${Math.max(0, getQueuePosition(matchedPatient) - 1)} patients ahead of you`)
                      : (lang === 'so' ? 'Fadlan toos u gal qolka dhakhtarka' : 'Please proceed to your assigned room')}
                  </span>
                </div>

                {/* 2. Estimated Wait Time */}
                <div className={`rounded-2xl border p-5 text-center transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {lang === 'so' ? 'Waqtiga La Qiyaasay' : 'Estimated Wait Time'}
                  </span>
                  <div className={`text-4xl font-black font-mono ${styles.accentText}`}>
                    {matchedPatient.status === 'waiting'
                      ? `~${matchedPatient.estimatedWaitMinutes}m`
                      : '0 min'}
                  </div>
                  <span className={`text-[11px] font-medium block mt-1 ${styles.textSecondary}`}>
                    {matchedPatient.status === 'waiting'
                      ? (lang === 'so' ? 'Daqiiqo ku dhowaad' : 'Minutes approximately')
                      : (lang === 'so' ? 'Xilligaagii ayaa la joogaa' : 'It is your turn!')}
                  </span>
                </div>

                {/* 3. Assigned Room & Doctor */}
                <div className={`rounded-2xl border p-5 text-center transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
                  <span className="text-xs text-slate-400 font-bold block mb-1">
                    {lang === 'so' ? 'Qolka Laguu Qoondeeyay' : 'Assigned Consultation Suite'}
                  </span>
                  <div className={`text-base font-extrabold mt-1 ${styles.textPrimary}`}>
                    {matchedPatient.assignedRoomId 
                      ? rooms.find(r => r.id === matchedPatient.assignedRoomId)?.roomName 
                      : (matchedPatient.category === 'maternal' ? 'Qolka 1aad (OB/GYN)' :
                         matchedPatient.category === 'child' ? 'Qolka 2aad (Pediatrics)' :
                         'Qolka 3aad (General & ER)')}
                  </div>
                  <span className={`text-[11px] font-semibold text-emerald-600 block mt-1`}>
                    {matchedPatient.assignedRoomId
                      ? rooms.find(r => r.id === matchedPatient.assignedRoomId)?.doctorName
                      : (lang === 'so' ? 'Dhakhtarka Qabilsan' : 'Attending Physician')}
                  </span>
                </div>
              </div>

              {/* Vitals Summary & Triage Classification */}
              <div className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>{lang === 'so' ? 'Cabbiraadda Vitals-ka Triage-ka' : 'Triage Recorded Telemetry & Vitals'}</span>
                  </span>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    matchedPatient.triageScore === 1 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : matchedPatient.triageScore === 2
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                  }`}>
                    {matchedPatient.triageScore === 1
                      ? (lang === 'so' ? 'Heerka 1aad: Degdeg Halis ah (P1)' : 'Level 1: Critical Emergency (P1)')
                      : matchedPatient.triageScore === 2
                      ? (lang === 'so' ? 'Heerka 2aad: Degdeg Dhexe (P2)' : 'Level 2: Urgent Priority (P2)')
                      : (lang === 'so' ? 'Heerka 3aad: Caadi / Tallaal (P3)' : 'Level 3: Routine / Standard (P3)')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'so' ? 'Dhiig-karka (BP)' : 'Blood Pressure'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {matchedPatient.vitals.bloodPressure || '120/80 mmHg'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'so' ? 'Kuleylka (Temp)' : 'Temperature'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {matchedPatient.vitals.temperature ? `${matchedPatient.vitals.temperature}°C` : '36.8°C'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'so' ? 'Garaaca Wadnaha' : 'Heart Rate'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {matchedPatient.vitals.heartRate ? `${matchedPatient.vitals.heartRate} bpm` : '78 bpm'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'so' ? 'Oksijiinta (SpO2)' : 'Oxygen (SpO2)'}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {matchedPatient.vitals.spO2 ? `${matchedPatient.vitals.spO2}%` : '99%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Official QR Ticket Pass */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <TicketQRCode
                      ticketNumber={matchedPatient.ticketNumber}
                      patientName={matchedPatient.fullName}
                      size={100}
                      showDetails={false}
                      showActions={false}
                      theme={theme}
                      lang={lang}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <QrCode className="h-4 w-4 text-emerald-600" />
                      <span>{lang === 'so' ? 'Tikidhka Rasmiga ah ee QR Code' : 'Official Patient QR Ticket'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {lang === 'so'
                        ? 'Bukaanku wuxuu ku skaan garayn karaa albaabka xarunta ama taleefanka gacanta si uu ula socdo safka.'
                        : 'Patient can scan this code at the hospital entrance kiosk or mobile camera to check real-time queue status.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowSlipModal(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>{lang === 'so' ? 'Daabac Tikidhka (Slip)' : 'Print Official Slip'}</span>
                  </button>
                </div>
              </div>

              {/* Patient Action Buttons: SMS Reminder & Emergency Help */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleSendTestSms(matchedPatient)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Bell className="h-4 w-4 text-amber-500" />
                  <span>{lang === 'so' ? 'U Dir Xusuusin SMS Telefoonkaaga' : 'Send Live SMS Notification'}</span>
                </button>

                <a
                  href="tel:999"
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-bold hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Miyaad xanuun daran dareemeysaa? Wac 999' : 'Feeling acute distress? Call 999'}</span>
                </a>
              </div>

            </div>
          ) : (
            <div className={`rounded-3xl border p-12 text-center ${styles.cardBg} ${styles.cardBorder}`}>
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <div className={`font-bold text-base mb-1 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Lama Helin Tikidhkaas' : 'Ticket Not Found in Active Queue'}
              </div>
              <p className={`text-xs max-w-md mx-auto ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Fadlan hubi lambarka tikidhka (tusaale M-008, P-014, E-001) ama la xiriir miiska qaabilaadda iyo diiwaanka ee isbitaalka.'
                  : 'Please verify the ticket code or consult with the front desk reception team.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Real-time Queue Overview (When not searched or for general context) */}
      <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
              {lang === 'so' ? 'Xaaladda Safka ee Hadda (Live Queue Snapshot)' : 'Live Hospital Waiting Room Snapshot'}
            </h3>
          </div>
          
          {onOpenLiveTv && (
            <button
              onClick={onOpenLiveTv}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              <Tv className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Fur Shaashadda TV' : 'Open TV View'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Currently Called / In Consultation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-600 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{lang === 'so' ? 'Qolalka Hadda Lagu Jiro / La Wacay' : 'Now Being Seen / Called'}</span>
            </span>

            {currentlyCalledPatients.length > 0 ? (
              <div className="space-y-2">
                {currentlyCalledPatients.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">{p.ticketNumber}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{p.fullName}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {p.assignedRoomId ? rooms.find(r => r.id === p.assignedRoomId)?.roomName : 'Qolka'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">
                {lang === 'so' ? 'Dhammaan qolalka way diyaar yihiin' : 'All consultation rooms available'}
              </p>
            )}
          </div>

          {/* Currently Waiting */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-amber-600 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {lang === 'so' ? `Safka Sugitaanka (${currentlyWaitingPatients.length} Bukaan)` : `Waiting in Lounge (${currentlyWaitingPatients.length} Patients)`}
              </span>
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {currentlyWaitingPatients.slice(0, 5).map((p, idx) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    setQuery(p.ticketNumber);
                    setSearched(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{p.ticketNumber}</span>
                  </div>
                  <span className="text-slate-500">{p.fullName.split(' ')[0]}</span>
                  <span className="font-mono text-slate-400">~{p.estimatedWaitMinutes}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Entrance Kiosk QR Scanner Modal */}
      {showScannerModal && (
        <EntranceKioskScanner
          patients={patients}
          rooms={rooms}
          onClose={() => setShowScannerModal(false)}
          onSelectPatient={(p) => {
            setQuery(p.ticketNumber);
            setSearched(true);
            setShowScannerModal(false);
          }}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Official Printable Ticket Slip Modal */}
      {showSlipModal && matchedPatient && (
        <OfficialTicketSlipModal
          patient={matchedPatient}
          rooms={rooms}
          onClose={() => setShowSlipModal(false)}
          lang={lang}
          theme={theme}
        />
      )}

    </div>
  );
}
