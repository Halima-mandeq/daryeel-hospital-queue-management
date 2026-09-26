import { useState, useEffect, useRef } from 'react';
import { 
  Baby, 
  Clock, 
  HeartPulse, 
  Stethoscope, 
  CheckCircle2, 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Pill, 
  PhoneCall, 
  ShieldCheck,
  ChevronRight,
  Volume2,
  DoorOpen,
  MapPin,
  Sparkles,
  PlayCircle,
  RotateCcw,
  Check,
  QrCode,
  Printer
} from 'lucide-react';
import { Patient, DoctorRoom, UserProfile, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { 
  playHospitalChime, 
  requestNotificationPermission, 
  sendBrowserNotification 
} from '../../utils/audioNotification';
import { TicketQRCode } from '../TicketQRCode';
import { OfficialTicketSlipModal } from '../OfficialTicketSlipModal';

interface PatientDashboardProps {
  currentUser: UserProfile;
  patients: Patient[];
  rooms: DoctorRoom[];
  onTriggerCall?: (patientId: string, roomId: string) => void;
  onResetPatientStatus?: (patientId: string) => void;
  onBackToWebsite?: () => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function PatientDashboard({
  currentUser,
  patients,
  rooms,
  onTriggerCall,
  onResetPatientStatus,
  onBackToWebsite,
  lang,
  theme,
}: PatientDashboardProps) {
  const styles = getThemeStyles(theme);

  // Match the patient by ticket or name or phone or fallback to first maternal patient
  const targetTicket = currentUser.patientTicket;
  const myRecord =
    (targetTicket ? patients.find((p) => p.ticketNumber.toUpperCase() === targetTicket.toUpperCase()) : undefined) ||
    patients.find((p) => p.id === currentUser.id) ||
    patients.find((p) => p.fullName.toLowerCase() === currentUser.name.toLowerCase()) ||
    (currentUser.phone ? patients.find((p) => p.phone.replace(/\s+/g, '') === currentUser.phone?.replace(/\s+/g, '')) : undefined) ||
    patients.find((p) => p.category === 'maternal') ||
    patients[0];

  // Find assigned room or target room for the patient's category
  const assignedRoom = rooms.find((r) => {
    if (myRecord?.assignedRoomId) return r.id === myRecord.assignedRoomId;
    if (myRecord?.assignedDoctorName) return r.doctorName === myRecord.assignedDoctorName;
    if (myRecord?.category === 'maternal') return r.specialty.toLowerCase().includes('dhalmad') || r.specialty.toLowerCase().includes('hooy');
    if (myRecord?.category === 'child') return r.specialty.toLowerCase().includes('carruur') || r.specialty.toLowerCase().includes('pediatr');
    if (myRecord?.category === 'emergency') return r.specialty.toLowerCase().includes('degdeg') || r.specialty.toLowerCase().includes('emerg');
    return r.id === 'room-1';
  }) || rooms[0];

  // Calculate how many patients are ahead in queue
  const waitingPatients = patients.filter((p) => p.status === 'waiting');
  const myIndex = waitingPatients.findIndex((p) => p.id === myRecord?.id);
  const patientsAhead = myIndex >= 0 ? myIndex : 0;

  // Track state for turn alert modal
  const [showTurnModal, setShowTurnModal] = useState(false);
  const [hasDismissedModal, setHasDismissedModal] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const prevStatusRef = useRef<string | undefined>(myRecord?.status);

  // Request browser notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Listen for real-time status change to 'in_consultation'
  useEffect(() => {
    if (!myRecord) return;

    // Check if status transitioned to in_consultation
    if (myRecord.status === 'in_consultation' && prevStatusRef.current !== 'in_consultation') {
      playHospitalChime();
      sendBrowserNotification(
        lang === 'so' ? '🔔 WAA WAQTIGAAGII!' : '🔔 YOUR TURN HAS ARRIVED!',
        lang === 'so' 
          ? `Soo gal! Fadlan u gudub ${assignedRoom.roomName} (${assignedRoom.doctorName}) hadda!`
          : `Come in! Please proceed to ${assignedRoom.roomName} (${assignedRoom.doctorName}) now!`
      );
      setShowTurnModal(true);
      setHasDismissedModal(false);
    }

    prevStatusRef.current = myRecord.status;
  }, [myRecord?.status, assignedRoom, lang]);

  // Handler: Manual simulation button so user can test the live turn notification immediately!
  const handleSimulateTurnNotification = () => {
    if (!myRecord) return;
    playHospitalChime();
    setShowTurnModal(true);
    setHasDismissedModal(false);

    if (onTriggerCall) {
      onTriggerCall(myRecord.id, assignedRoom.id);
    }
  };

  const handleResetToWaiting = () => {
    if (!myRecord) return;
    setShowTurnModal(false);
    setHasDismissedModal(false);
    if (onResetPatientStatus) {
      onResetPatientStatus(myRecord.id);
    }
  };

  const isMyTurnNow = myRecord?.status === 'in_consultation';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. TURN ARRIVED POPUP MODAL (WAA WAQTIGAAGII) */}
      {showTurnModal && !hasDismissedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-4 border-emerald-500 shadow-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Ambient pulse background */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Pulsing Bell Icon */}
            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-400 border-2 border-white"></span>
              </span>
              <Bell className="h-12 w-12 animate-bounce" />
            </div>

            {/* Announcement text */}
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                {lang === 'so' ? 'YEERIDDA TOOSKA AH EE ISBITAALKA' : 'HOSPITAL LIVE ANNOUNCEMENT'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                {lang === 'so' ? 'SOO GAL, WAA WAQTIGAAGII!' : 'COME IN, IT IS YOUR TURN!'}
              </h2>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {myRecord?.ticketNumber}
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'so' ? 'Bukaanka:' : 'Patient:'} <span className="font-bold text-slate-900 dark:text-white">{myRecord?.fullName}</span>
              </p>
            </div>

            {/* Room Directions Card */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 text-left flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                <DoorOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400">
                  {lang === 'so' ? 'Fadlan toos u gal:' : 'Please proceed to:'}
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {assignedRoom.roomName}
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300">
                  🩺 {assignedRoom.doctorName} ({assignedRoom.specialty})
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-rose-500" />
                  <span>Dabaqa 1aad, Albaabka Midig ee Qeybta Hooyada</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => playHospitalChime()}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="h-4 w-4 text-emerald-600" />
                <span>{lang === 'so' ? 'Dhageyso Codka Mar Kale' : 'Replay Chime'}</span>
              </button>

              <button
                onClick={() => setHasDismissedModal(true)}
                className="w-full flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                <span>{lang === 'so' ? 'Waan Maqlay - Waan Galayaa' : 'Acknowledge & Enter Room'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Patient Welcome Banner */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                {lang === 'so' ? 'Bogga Bukaanka & Safkaaga' : 'Patient Queue Portal'}
              </span>
              <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                Tikidh: {myRecord?.ticketNumber}
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-extrabold font-display ${styles.textPrimary}`}>
              {currentUser.name}
            </h1>
            <p className={`text-xs ${styles.textSecondary}`}>
              {currentUser.title} · {currentUser.phone || '+252 61 577 8899'}
            </p>
          </div>
        </div>

        {/* Emergency Hotline & Notification Test */}
        <div className="flex flex-wrap items-center gap-3">
          {onBackToWebsite && (
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-all cursor-pointer"
            >
              <span>{lang === 'so' ? 'Bogga Isbitaalka' : 'Hospital Home'}</span>
            </button>
          )}

          <button
            onClick={handleSimulateTurnNotification}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs transition-all cursor-pointer"
            title="Tijaabi u-yeeridda iyo codka gaarka ah ee bukaanka"
          >
            <Bell className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>{lang === 'so' ? '🔔 Tijaabi U-yeeridda (Test Alert)' : 'Test Turn Alert'}</span>
          </button>

          <a
            href="tel:999"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Gurmad: 999</span>
          </a>
        </div>
      </div>

      {/* 3. PROMINENT LIVE ALERT BANNER (IF IT IS TURN NOW) */}
      {isMyTurnNow ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Bell className="h-8 w-8 text-white animate-bounce" />
            </div>
            <div>
              <div className="inline-block text-[11px] font-black uppercase tracking-wider bg-white text-emerald-800 px-2.5 py-0.5 rounded-full mb-1">
                {lang === 'so' ? 'DHAKHTARKII WUU KUU YEERAY!' : 'DOCTOR IS CALLING YOU NOW!'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display">
                {lang === 'so' ? 'SOO GAL, WAA WAQTIGAAGII!' : 'COME IN, IT IS YOUR TURN!'}
              </h2>
              <p className="text-xs text-white/90 mt-1">
                {lang === 'so'
                  ? `Fadlan hadda u gudub ${assignedRoom.roomName} oo ay ku sugan tahay ${assignedRoom.doctorName}.`
                  : `Please proceed to ${assignedRoom.roomName} with ${assignedRoom.doctorName} immediately.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => playHospitalChime()}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              <span>{lang === 'so' ? 'Codka Yeeridda' : 'Play Sound'}</span>
            </button>

            <button
              onClick={handleResetToWaiting}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Ku celi bukaanka safka sugitaanka si aad mar kale u tijaabiso"
            >
              <RotateCcw className="h-4 w-4 text-emerald-600" />
              <span>{lang === 'so' ? 'Ku celi Safka' : 'Reset to Waiting'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className={`font-semibold ${styles.textPrimary}`}>
              {lang === 'so'
                ? `Waxaad ku jirtaa safka qolka: ${assignedRoom.roomName} (${assignedRoom.doctorName}). Waxaa kaa horreeya ${patientsAhead} bukaan.`
                : `You are in line for: ${assignedRoom.roomName} (${assignedRoom.doctorName}). ${patientsAhead} patients ahead.`}
            </span>
          </div>

          <button
            onClick={handleSimulateTurnNotification}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {lang === 'so' ? 'Riix si aad u tijaabiso yeeridda →' : 'Click to test call alert →'}
          </button>
        </div>
      )}

      {/* 4. MAIN TICKET STATUS & TARGET ROOM DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Live Ticket Status & Position (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <h2 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Xaaladda Safkaaga ee Tooska ah' : 'Live Queue & Waiting Status'}
                </h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                {lang === 'so' ? 'Isku xiran Toos' : 'Live Broadcast'}
              </span>
            </div>

            {/* Ticket Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-800/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">
                    {lang === 'so' ? 'Lambarkaaga Tikidha' : 'Your Ticket Number'}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400 mt-1">
                    {myRecord?.ticketNumber}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {myRecord?.fullName} · {myRecord?.category}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs uppercase font-bold text-slate-400">
                    {lang === 'so' ? 'Xaaladda Hadda' : 'Current Status'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide ${
                      isMyTurnNow
                        ? 'bg-emerald-600 text-white animate-pulse shadow-md'
                        : myRecord?.status === 'waiting'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {isMyTurnNow
                        ? (lang === 'so' ? '🔔 WAA WAQTIGAAGII (SOO GAL)' : '🔔 CALLED - PLEASE ENTER')
                        : myRecord?.status === 'waiting'
                        ? (lang === 'so' ? 'SAFKA AYAA LAGU JIRAA' : 'WAITING IN QUEUE')
                        : (lang === 'so' ? 'DHAMEYSTIRMAY' : 'COMPLETED')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Waiting Stats */}
              {!isMyTurnNow && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40">
                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'so' ? 'Bukaanada Kaa Horreeya' : 'Patients Ahead'}
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                      {patientsAhead} {lang === 'so' ? 'Qof' : 'Patients'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'so' ? 'Qiyaasta Waqtiga' : 'Estimated Time'}
                    </div>
                    <div className="text-2xl font-black font-mono text-blue-600 mt-0.5">
                      ~ {patientsAhead * 10 || 8} min
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-3">
                <Bell className="h-5 w-5 shrink-0 text-blue-600" />
                <span>
                  {isMyTurnNow
                    ? (lang === 'so' ? 'Fadlan toos u gal qolka baaritaanka, dhakhtarka ayaa ku sugaya.' : 'Please enter the room now, doctor is waiting for you.')
                    : (lang === 'so'
                        ? 'Fadlan ku naso qolka sugitaanka. Shaashadda TV-ga iyo taleefankaaga ayaa kuugu yeeri doona markay soo gaarto doortaadu.'
                        : 'Please relax in the waiting lounge. Large screen TV and your device will alert you when your turn arrives.')}
                </span>
              </div>

              {/* QR Entrance Pass Strip */}
              {myRecord && (
                <div className="pt-4 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0 bg-white p-1 rounded-xl shadow-xs border border-slate-200">
                      <TicketQRCode
                        ticketNumber={myRecord.ticketNumber}
                        patientName={myRecord.fullName}
                        size={84}
                        showDetails={false}
                        showActions={false}
                        theme={theme}
                        lang={lang}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <QrCode className="h-4 w-4 text-emerald-600" />
                        <span>{lang === 'so' ? 'QR Code-ka Skaanka Albaabka' : 'Entrance Scannable QR Code'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {lang === 'so'
                          ? 'Ku qabo kamaradda albaabka si aad u hubiso booskaaga safka waqti kasta.'
                          : 'Scan at hospital entrance kiosk to check real-time queue status anytime.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowPrintSlip(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{lang === 'so' ? 'Daabac Tikidhka (QR)' : 'Print Official Slip'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prescriptions & Doctor Advice (If visited) */}
            {myRecord?.prescriptions && myRecord.prescriptions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
                  <Pill className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Dawooyinka Laguu Qoray (Prescriptions)' : 'Prescriptions From Doctor'}</span>
                </div>
                <div className="space-y-2">
                  {myRecord.prescriptions.map((rx, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                      💊 <span className="font-bold">{rx}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: The Specific Room & Doctor You Are Waiting For (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Target Room & Doctor Card */}
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-emerald-600" />
                <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Qolka & Dhakhtarkaaga' : 'Your Assigned Room & Doctor'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {assignedRoom.id.toUpperCase()}
              </span>
            </div>

            {/* Room Info Display */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-300 dark:border-emerald-800">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">
                    {lang === 'so' ? 'Qolka Baaritaanka' : 'Consultation Room'}
                  </div>
                  <div className={`text-lg font-black ${styles.textPrimary}`}>
                    {assignedRoom.roomName}
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    {assignedRoom.specialty}
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {assignedRoom.doctorName.split(' ')[1]?.[0] || 'Dr'}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {lang === 'so' ? 'Dhakhtarka Kula Kulmaya' : 'Attending Doctor'}
                  </div>
                  <div className={`font-bold text-xs ${styles.textPrimary}`}>
                    {assignedRoom.doctorName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lang === 'so' ? 'Diyaar ku ah qolka' : 'Available on duty'}
                  </div>
                </div>
              </div>

              {/* Location Directions */}
              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span className={styles.textSecondary}>
                  {lang === 'so'
                    ? 'Dabaqa 1aad: Albaabka midig ee Qeybta Dhalmada & ANC'
                    : '1st Floor: Right wing, Maternal & Neonatal Ward'}
                </span>
              </div>
            </div>
          </div>

          {/* Child Vaccine & Maternal Health Reminder */}
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <Baby className="h-5 w-5 text-teal-600" />
              <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Jadwalka Tallaalka Dhallaanka' : 'Child Vaccine Schedule'}
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'BCG & Polio 0', age: 'Dhalashada (Birth)', status: 'Dhameystirmay', done: true },
                { name: 'Penta 1 + Rota 1', age: '6 Toddobaad', status: 'Dhameystirmay', done: true },
                { name: 'Penta 2 + Rota 2', age: '10 Toddobaad', status: 'Dhameystirmay', done: true },
                { name: 'Penta 3 + Measles 1', age: '14 Toddobaad', status: 'Xilliga ku xiga: 28 Okt 2026', done: false },
              ].map((v, i) => (
                <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${styles.cardInnerBg} ${styles.cardBorder}`}>
                  <div>
                    <div className={`font-bold ${styles.textPrimary}`}>{v.name}</div>
                    <div className="text-[10px] text-slate-400">{v.age}</div>
                  </div>
                  <div>
                    {v.done ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{v.status}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{v.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Official Printable Ticket Slip Modal */}
      {showPrintSlip && myRecord && (
        <OfficialTicketSlipModal
          patient={myRecord}
          rooms={rooms}
          onClose={() => setShowPrintSlip(false)}
          lang={lang}
          theme={theme}
        />
      )}
    </div>
  );
}
