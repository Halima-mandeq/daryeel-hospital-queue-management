import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { Patient, DoctorRoom, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { playHospitalChime } from '../utils/audio';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Volume2, 
  DoorOpen, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  QrCode, 
  Smartphone, 
  Check, 
  Search,
  ArrowRight,
  ShieldAlert,
  Flame,
  User
} from 'lucide-react';

interface EntranceKioskScannerProps {
  patients: Patient[];
  rooms: DoctorRoom[];
  onClose?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  lang?: 'so' | 'en';
  theme?: ThemePalette;
  initialTicketQuery?: string;
}

export function EntranceKioskScanner({
  patients,
  rooms,
  onClose,
  onSelectPatient,
  lang = 'so',
  theme = 'sapphire',
  initialTicketQuery = '',
}: EntranceKioskScannerProps) {
  const styles = getThemeStyles(theme);

  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scannedTicket, setScannedTicket] = useState<string | null>(null);
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(null);
  const [manualCode, setManualCode] = useState(initialTicketQuery);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // If initialTicketQuery is provided, resolve immediately
  useEffect(() => {
    if (initialTicketQuery) {
      resolveTicket(initialTicketQuery);
    }
  }, [initialTicketQuery]);

  // Start / stop camera when activeMode changes
  useEffect(() => {
    if (activeMode === 'camera' && !matchedPatient) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeMode, facingMode, matchedPatient]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          lang === 'so'
            ? 'Kamaraddu kuma shaqeyso browser-kan ama ruqsad ma haysato.'
            : 'Camera access is not supported or permitted on this browser.'
        );
        setActiveMode('manual');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(
        lang === 'so'
          ? 'Kamarada lama furi karin (Fadlan oggolow ruqsadda kamarada ama geli lambarka gacanta).'
          : 'Unable to start camera. Please grant camera permission or use manual search.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Continuous frame scanner using jsQR
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleRawScannedData(code.data);
        return; // stop scanning loop on hit
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Parse raw text or URL from QR code to extract ticket code
  const handleRawScannedData = (data: string) => {
    let ticketCode = data.trim();

    // Check if URL with query param ?ticket=XYZ
    try {
      if (data.includes('?ticket=') || data.includes('&ticket=')) {
        const url = new URL(data, window.location.origin);
        const param = url.searchParams.get('ticket');
        if (param) ticketCode = param;
      } else if (data.includes('ticket?id=')) {
        const url = new URL(data, window.location.origin);
        const param = url.searchParams.get('id');
        if (param) ticketCode = param;
      }
    } catch {}

    resolveTicket(ticketCode);
  };

  // Resolve ticket in patients list
  const resolveTicket = (ticketCode: string) => {
    const cleanCode = ticketCode.trim().toUpperCase();
    setScannedTicket(cleanCode);

    const found = patients.find(
      (p) =>
        p.ticketNumber.toUpperCase() === cleanCode ||
        p.phone.replace(/\s+/g, '') === cleanCode.replace(/\s+/g, '')
    );

    setMatchedPatient(found || null);

    // Audio & tactile feedback
    playHospitalChime();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {}
    }

    stopCamera();
  };

  // Handle uploaded ticket image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImagePreview(img.src);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleRawScannedData(code.data);
          } else {
            alert(
              lang === 'so'
                ? 'Lama helin QR Code sax ah sawirkan. Fadlan tijaabi sawir kale ama geli lambarka.'
                : 'No valid QR code detected in this image. Please try another image or enter ticket code.'
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    resolveTicket(manualCode);
  };

  const handleResetScan = () => {
    setMatchedPatient(null);
    setScannedTicket(null);
    setUploadedImagePreview(null);
    setManualCode('');
    if (activeMode === 'camera') {
      startCamera();
    }
  };

  // Queue position calculation
  const getQueuePosition = (patient: Patient) => {
    if (patient.status !== 'waiting') return 0;
    const ahead = patients.filter(
      (p) =>
        p.status === 'waiting' &&
        p.triageScore <= patient.triageScore &&
        p.registeredAt < patient.registeredAt
    );
    return ahead.length + 1;
  };

  // Spoken voice announcement
  const handleAnnounce = (patient: Patient) => {
    playHospitalChime();
    if (!('speechSynthesis' in window)) return;

    setIsSpeaking(true);
    const assigned = patient.assignedRoomId
      ? rooms.find((r) => r.id === patient.assignedRoomId)?.roomName
      : 'Qolka Dhakhtarka';

    let text = '';
    if (patient.status === 'called' || patient.status === 'in_consultation') {
      text =
        lang === 'so'
          ? `Kusoo dhowow DaryeelQoys. Tikidhka ${patient.ticketNumber}, ${patient.fullName}, hadda waa waqtigaagii! Fadlan toos u gal ${assigned}.`
          : `Welcome to DaryeelQoys. Ticket ${patient.ticketNumber}, ${patient.fullName}, it is your turn now! Please proceed to ${assigned}.`;
    } else {
      const pos = getQueuePosition(patient);
      text =
        lang === 'so'
          ? `Kusoo dhowow DaryeelQoys. Tikidhkaaga waa ${patient.ticketNumber}, ${patient.fullName}. Booskaaga safka waa lambar ${pos}. Waqtiga la qiyaasay waa ${patient.estimatedWaitMinutes} daqiiqo.`
          : `Welcome to DaryeelQoys. Your ticket is ${patient.ticketNumber}, ${patient.fullName}. Your queue position is number ${pos}. Estimated wait is ${patient.estimatedWaitMinutes} minutes.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'so' ? 'so-SO' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const assignedRoomObj = matchedPatient?.assignedRoomId
    ? rooms.find((r) => r.id === matchedPatient.assignedRoomId)
    : rooms[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col ${styles.cardBg} ${styles.cardBorder}`}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-sm ${styles.accentBg}`}>
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-extrabold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Skaanka Tikidhka Albaabka' : 'Hospital Entrance QR Scanner'}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
                  KIOSK LIVE
                </span>
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Ku qabo tikidhkaaga kamaradda si aad u hubiso booskaaga safka'
                  : 'Scan paper ticket or phone screen to verify queue status & room'}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* If NOT matched yet: Show Scanner Viewfinder / Options */}
          {!matchedPatient ? (
            <div className="space-y-5">
              {/* Scan Mode Selector Tabs */}
              <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                <button
                  onClick={() => setActiveMode('camera')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'camera'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Kamaradda Albaabka' : 'Live Camera'}</span>
                </button>

                <button
                  onClick={() => setActiveMode('upload')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'upload'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Soo Geli Sawirka' : 'Upload Image'}</span>
                </button>

                <button
                  onClick={() => setActiveMode('manual')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'manual'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Qor Lambarka' : 'Enter Code'}</span>
                </button>
              </div>

              {/* Mode 1: Live Camera Viewfinder */}
              {activeMode === 'camera' && (
                <div className="space-y-3">
                  <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video max-h-[320px] flex items-center justify-center border-4 border-slate-800 shadow-inner">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      playsInline
                    />

                    {/* Viewfinder Target Reticle */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />

                        {/* Animated Laser Scanning Line */}
                        <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-pulse top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Camera status badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl pointer-events-auto">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>{lang === 'so' ? 'Kamaraddu waa shidantahay' : 'Scanner active'}</span>
                      </div>

                      <button
                        onClick={() =>
                          setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                        }
                        className="underline text-[10px] font-bold hover:text-emerald-300 cursor-pointer"
                      >
                        {lang === 'so' ? 'Beddel Kamaradda' : 'Flip Camera'}
                      </button>
                    </div>

                    {/* Camera Error Message */}
                    {cameraError && (
                      <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <AlertCircle className="h-8 w-8 text-amber-400" />
                        <p className="text-xs max-w-xs">{cameraError}</p>
                        <button
                          onClick={() => setActiveMode('manual')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {lang === 'so' ? 'Isticmaal Qorista Tikidhka' : 'Use Manual Search Instead'}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    {lang === 'so'
                      ? '💡 Ku toosi QR Code-ka tikidhkaaga xariiqda cagaaran si toos ah ayuu u akhrin doonaa.'
                      : '💡 Hold your printed ticket QR code inside the green box to scan automatically.'}
                  </p>
                </div>
              )}

              {/* Mode 2: Upload Image of Ticket */}
              {activeMode === 'upload' && (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
                      <Upload className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'so' ? 'Dooro sawirka tikidhka QR-ka' : 'Choose Ticket QR Image'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PNG, JPG ama sawirka shaashadda taleefanka
                    </span>
                  </label>
                </div>
              )}

              {/* Mode 3: Manual Input Search */}
              {activeMode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <label className={`block text-xs font-semibold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Gali Lambarka Tikidhka (tusaale: M-008, P-014, E-001) ama Telefoon:' : 'Enter Ticket Number (e.g. M-008, P-014, E-001) or Phone:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. M-008"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-mono font-bold outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="h-4 w-4" />
                      <span>{lang === 'so' ? 'Baar' : 'Check'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Sample Test Barcodes */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">
                  {lang === 'so' ? 'Tikidho tijaabo ah (Ku dhufo si aad u tijaabiso skaanka):' : 'Quick Entrance Test Barcodes (Click to simulate scan):'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {patients.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => resolveTicket(p.ticketNumber)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:text-emerald-600 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{p.ticketNumber}</span>
                      <span className="text-[10px] text-slate-400">({p.fullName.split(' ')[0]})</span>
                      {p.status === 'called' && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Matched Patient Live Status Display! */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Entrance Welcome Header */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">
                      {lang === 'so' ? 'Skaanku Wuu Guuleystay! Kusoo Dhowow DaryeelQoys' : 'Scan Verified! Welcome to DaryeelQoys Clinic'}
                    </div>
                    <div className="text-xs opacity-90">
                      {lang === 'so' ? 'Booqashadaada waxaa loo diiwaangeliyay si toos ah' : 'Your entrance attendance is recorded in real-time'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAnnounce(matchedPatient)}
                  disabled={isSpeaking}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Volume2 className="h-4 w-4 text-emerald-600" />
                  <span>{isSpeaking ? '...' : lang === 'so' ? 'Codka Yeeridda' : 'Audio Chime'}</span>
                </button>
              </div>

              {/* Patient Core Card */}
              <div className={`rounded-3xl border p-6 shadow-sm ${styles.cardBg} ${styles.cardBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                        {matchedPatient.ticketNumber}
                      </span>
                      <div>
                        <h4 className={`text-lg sm:text-xl font-bold font-display ${styles.textPrimary}`}>
                          {matchedPatient.fullName}
                        </h4>
                        <p className={`text-xs ${styles.textSecondary}`}>
                          {matchedPatient.phone} · {matchedPatient.age} {lang === 'so' ? 'jir' : 'yrs'} ·{' '}
                          <span className="capitalize font-semibold">{matchedPatient.category}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide ${
                        matchedPatient.status === 'called'
                          ? 'bg-rose-600 text-white animate-pulse shadow-md'
                          : matchedPatient.status === 'in_consultation'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      <span>
                        {matchedPatient.status === 'called'
                          ? (lang === 'so' ? 'WAA LAGU WACAY! QOLKA GAL' : 'CALLED! PROCEED TO ROOM')
                          : matchedPatient.status === 'in_consultation'
                          ? (lang === 'so' ? 'HADDA AYAAD KU JIRTAA' : 'IN CONSULTATION')
                          : (lang === 'so' ? 'WAXAAD KU JIRTAA SAFKA' : 'WAITING IN QUEUE')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 3 Metric Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 text-center">
                  {/* Metric 1: Queue Position */}
                  <div className={`p-4 rounded-2xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {lang === 'so' ? 'Booskaaga Safka' : 'Queue Position'}
                    </span>
                    <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                      {matchedPatient.status === 'waiting'
                        ? `#${getQueuePosition(matchedPatient)}`
                        : 'HADDA'}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {matchedPatient.status === 'waiting'
                        ? (lang === 'so' ? `Waxaa kaa horreeya ${Math.max(0, getQueuePosition(matchedPatient) - 1)} bukaan` : `${Math.max(0, getQueuePosition(matchedPatient) - 1)} ahead of you`)
                        : (lang === 'so' ? 'Waa xilligaagii' : 'Your turn right now')}
                    </span>
                  </div>

                  {/* Metric 2: Estimated Wait */}
                  <div className={`p-4 rounded-2xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {lang === 'so' ? 'Qiyaasta Waqtiga' : 'Estimated Wait'}
                    </span>
                    <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {matchedPatient.status === 'waiting'
                        ? `~${matchedPatient.estimatedWaitMinutes}m`
                        : '0 min'}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {matchedPatient.status === 'waiting'
                        ? (lang === 'so' ? 'Daqiiqo ku dhowaad' : 'Minutes approximately')
                        : (lang === 'so' ? 'Dhakhtarka ayaa ku sugaya' : 'Doctor is ready')}
                    </span>
                  </div>

                  {/* Metric 3: Assigned Suite */}
                  <div className={`p-4 rounded-2xl border ${styles.cardInnerBg} ${styles.cardBorder}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {lang === 'so' ? 'Qolka Laguu Qoondeeyay' : 'Assigned Room'}
                    </span>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {assignedRoomObj?.roomName || 'Qolka 1aad'}
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mt-0.5">
                      🩺 {assignedRoomObj?.doctorName || 'Dr. Maryan Xasan'}
                    </span>
                  </div>
                </div>

                {/* Hospital Navigation & Directions Card */}
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-blue-900 dark:text-blue-200 uppercase tracking-wide text-[11px] block">
                      {lang === 'so' ? 'Tilmaanta Jidka ee Isbitaalka (Entrance Guide):' : 'Hospital Wayfinding & Route Guide:'}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {matchedPatient.category === 'maternal'
                        ? (lang === 'so'
                            ? 'Fadlan u leexo dhinaca Midig ee Dabaqa 1aad (Qeybta Hooyada & Dhalmada). Ku naso kuraasta buluugga ah ilaa shaashaddu kuugu yeerto.'
                            : 'Proceed to 1st Floor, Right Corridor (Maternal & OB/GYN Wing). Wait comfortably in the blue seating lounge until your ticket flashes.')
                        : matchedPatient.category === 'child'
                        ? (lang === 'so'
                            ? 'Fadlan toos u aad Dabaqa 1aad, Qolka 2aad ee Dhallaanka & Tallaalka. Miiska miisaanka ayaa kuugu dhow.'
                            : 'Proceed to 1st Floor, Room 2 (Pediatric & Vaccination Suite). Growth & weight measurement station is right by the door.')
                        : (lang === 'so'
                            ? 'Fadlan u gudub Qolka 3aad ee Gurmadka & Baaritaanka Guud ee dabaqa hoose.'
                            : 'Proceed to Ground Floor, Room 3 (Emergency & General Consultation).')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetScan}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Skaan Garee Tikidh Kale' : 'Scan Another Ticket'}</span>
                </button>

                {onSelectPatient && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPatient(matchedPatient);
                      if (onClose) onClose();
                    }}
                    className="w-full flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'so' ? 'Fur Bogga Faahfaahsan ee Safka' : 'Open Full Patient Queue View'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
