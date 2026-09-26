import { useState, useEffect } from 'react';
import { Patient, DoctorRoom, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { playHospitalChime, announceCallingPatient } from '../utils/audio';
import { 
  Tv, 
  Volume2, 
  Maximize2, 
  Clock, 
  User, 
  HeartPulse, 
  AlertCircle,
  Stethoscope,
  Mic
} from 'lucide-react';

interface WaitingRoomDisplayProps {
  patients: Patient[];
  rooms: DoctorRoom[];
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function WaitingRoomDisplay({ patients, rooms, lang, theme }: WaitingRoomDisplayProps) {
  const styles = getThemeStyles(theme);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTestChime = () => {
    playHospitalChime();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Next in queue
  const upcomingQueue = patients
    .filter(p => p.status === 'waiting')
    .sort((a, b) => a.triageScore - b.triageScore)
    .slice(0, 6);

  const getDoctorImage = (idx: number) => {
    const imgList = [
      CLINIC_IMAGES.doctors.maryan,
      CLINIC_IMAGES.doctors.guuleed,
      CLINIC_IMAGES.doctors.sahra,
      CLINIC_IMAGES.doctors.faadumo,
    ];
    return imgList[idx % imgList.length];
  };

  return (
    <div className={`min-h-[85vh] px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between transition-colors duration-200 ${
      styles.isDark ? 'bg-slate-950 text-white' : 'bg-slate-100/70 text-slate-900'
    }`}>
      {/* Top TV Bar */}
      <div>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-8 gap-4 ${
          styles.isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.accentBg} text-white shadow-md`}>
              <Tv className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
                {lang === 'so' ? 'Boodhka Safka ee Qolka Sugitaanka' : 'Waiting Hall Live Queue TV'}
              </h2>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so' ? 'Fadlan la soco shaashadda, dhagaysona wicitaanka' : 'Please watch the screen and listen for your audio call'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className={`rounded-xl border px-4 py-2 font-mono text-base font-bold shadow-xs ${
              styles.isDark ? 'border-slate-800 bg-slate-900 text-teal-400' : 'border-slate-200 bg-white text-blue-600'
            }`}>
              {currentTime}
            </div>

            {/* Test Chime */}
            <button
              onClick={handleTestChime}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                styles.isDark ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Test hospital call chime"
            >
              <Volume2 className={`h-4 w-4 ${styles.accentText}`} />
              <span className="hidden sm:inline">{lang === 'so' ? 'Dhawaaqa' : 'Chime'}</span>
            </button>

            {/* Somali Voice Announce */}
            <button
              onClick={() => {
                const activeRoomWithPat = rooms.find(r => r.currentPatientId);
                const activePat = activeRoomWithPat ? patients.find(p => p.id === activeRoomWithPat.currentPatientId) : null;
                if (activePat && activeRoomWithPat) {
                  announceCallingPatient(activePat.ticketNumber, activeRoomWithPat.roomName, activeRoomWithPat.doctorName, lang);
                } else {
                  announceCallingPatient('E-01', 'Qolka saddexaad', 'Dr. Maryan Xasan', lang);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Codka Soomaaliga ee Safka (Somali Voice Announcement)"
            >
              <Mic className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Dhawaaq Cod Soomaali' : 'Somali Voice Call'}</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className={`rounded-xl border p-2 shadow-xs transition-colors cursor-pointer ${
                styles.isDark ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900'
              }`}
              title="Toggle Fullscreen for TV Display"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section 1: NOW SERVING (HADDA WAXAA SOCDA) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className={`text-sm sm:text-base font-black uppercase tracking-widest font-display ${styles.accentText}`}>
                {lang === 'so' ? 'HADDA WAXAA LA WACAYAA (NOW SERVING)' : 'NOW SERVING PATIENTS'}
              </h3>
            </div>
            <span className={`text-xs font-mono font-medium ${styles.textMuted}`}>
              {rooms.length} {lang === 'so' ? 'Qolal Shaqaynaya' : 'Active Doctor Rooms'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {rooms.map((room, idx) => {
              const currentPatient = patients.find(p => p.id === room.currentPatientId);

              return (
                <div
                  key={room.id}
                  className={`relative overflow-hidden rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
                    currentPatient
                      ? `${styles.cardBg} border-2 ${styles.accentBorder} ring-2 ring-blue-500/20 shadow-md`
                      : `${styles.cardBg} opacity-80 ${styles.cardBorder}`
                  }`}
                >
                  <div>
                    {/* Room Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                      <span className={`font-display font-extrabold text-sm tracking-wide ${styles.textPrimary}`}>
                        {room.roomName}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        currentPatient ? styles.badgeBg + ' ' + styles.badgeText : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {currentPatient ? (lang === 'so' ? 'SOCDA' : 'BUSY') : (lang === 'so' ? 'DIYAAR' : 'OPEN')}
                      </span>
                    </div>

                    {/* Ticket Big Display */}
                    <div className="text-center py-4">
                      {currentPatient ? (
                        <>
                          <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                            {lang === 'so' ? 'Lambarka Bukaanka' : 'Ticket Number'}
                          </div>
                          <div className={`text-5xl font-black font-mono tracking-wider animate-in zoom-in-95 duration-200 ${styles.accentText}`}>
                            {currentPatient.ticketNumber}
                          </div>
                          <div className={`text-xs font-semibold mt-2 truncate ${styles.textPrimary}`}>
                            {currentPatient.fullName}
                          </div>
                        </>
                      ) : (
                        <div className="py-6 text-slate-400 text-xs font-mono">
                          {lang === 'so' ? 'Qolku waa bannaan yahay' : 'Room is ready for next'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Info with Real Avatar */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-3">
                    <img
                      src={getDoctorImage(idx)}
                      alt={room.doctorName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                    />
                    <div className="truncate">
                      <div className={`font-bold text-xs truncate ${styles.textPrimary}`}>{room.doctorName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{room.specialty}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: UPCOMING IN QUEUE (KUWA XIGA) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm sm:text-base font-black uppercase tracking-widest font-display flex items-center gap-2 ${styles.textPrimary}`}>
              <Clock className={`h-4 w-4 ${styles.accentText}`} />
              <span>{lang === 'so' ? 'KUWA XIGA EE SAFKA KU JIRA (NEXT IN LINE)' : 'UPCOMING TICKETS IN QUEUE'}</span>
            </h3>
            <span className={`text-xs font-medium ${styles.textSecondary}`}>
              {lang === 'so' ? 'Fadlan ku sug qolka sugitaanka' : 'Please remain seated in the waiting hall'}
            </span>
          </div>

          <div className={`rounded-3xl border overflow-hidden shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            {upcomingQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {lang === 'so' ? 'Dhammaan bukaankii safka ku jiray waa la qaabilay.' : 'All waiting patients have been served.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingQueue.map((pat, idx) => (
                  <div
                    key={pat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-mono font-bold ${styles.badgeBg} ${styles.badgeText}`}>
                        0{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xl font-extrabold font-mono tracking-wider ${styles.textPrimary}`}>
                            {pat.ticketNumber}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className={`text-xs font-bold ${styles.textPrimary}`}>
                            {pat.fullName}
                          </span>
                        </div>
                        <div className={`text-[11px] ${styles.textSecondary} mt-0.5`}>
                          {pat.category === 'maternal' ? (lang === 'so' ? 'Hooyo Uur leh (ANC)' : 'Maternal ANC') :
                           pat.category === 'child' ? (lang === 'so' ? 'Ilmo / Dhallaan' : 'Child Care') :
                           pat.category === 'emergency' ? (lang === 'so' ? 'Degdeg ah' : 'Emergency') :
                           (lang === 'so' ? 'Bukaan Guud' : 'General Visit')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      {/* Urgency */}
                      <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                        pat.triageLevel === 'emergency'
                          ? styles.emergencyBg
                          : pat.triageLevel === 'urgent'
                          ? styles.urgentBg
                          : styles.routineBg
                      }`}>
                        {pat.triageLevel === 'emergency'
                          ? (lang === 'so' ? 'Cas · Degdeg ah' : 'Emergency')
                          : pat.triageLevel === 'urgent'
                          ? (lang === 'so' ? 'Jaalle · Muhiim' : 'Urgent')
                          : (lang === 'so' ? 'Cagaar · Caadi' : 'Routine')}
                      </span>

                      {/* Estimated wait */}
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block uppercase">
                          {lang === 'so' ? 'Waqtiga' : 'Est. Wait'}
                        </span>
                        <span className={`font-bold ${styles.accentText}`}>
                          ~{pat.estimatedWaitMinutes} {lang === 'so' ? 'Daqiiqo' : 'Mins'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hospital Scrolling Notice Ticker */}
      <div className={`mt-8 rounded-2xl border p-3 px-5 flex items-center justify-between text-xs shadow-xs ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-center gap-2 font-bold shrink-0 text-rose-600">
          <AlertCircle className="h-4 w-4" />
          <span>{lang === 'so' ? 'Ogeysiis Caafimaad:' : 'Notice:'}</span>
        </div>

        <div className={`truncate px-4 text-xs font-medium ${styles.textSecondary}`}>
          {lang === 'so'
            ? 'Hooyooyinka uurka leh iyo carruurta qandhada kulul leh waxaa la siinayaa mudnaan degdeg ah. Fadlan haddii xaaladdaadu cuslaato u sheeg kalkaalisada qaabilaadda.'
            : 'Mothers with acute symptoms and febrile infants receive immediate triage priority. Please notify the triage nurse immediately if your condition worsens.'}
        </div>

        <div className={`shrink-0 font-mono text-[11px] font-bold hidden sm:block ${styles.accentText}`}>
          DaryeelQoys Clinic
        </div>
      </div>
    </div>
  );
}
