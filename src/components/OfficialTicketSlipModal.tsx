import { useRef } from 'react';
import { Patient, DoctorRoom, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { TicketQRCode } from './TicketQRCode';
import { 
  Printer, 
  X, 
  HeartPulse, 
  MapPin, 
  Clock, 
  User, 
  Calendar, 
  ShieldCheck, 
  Download,
  Share2
} from 'lucide-react';

interface OfficialTicketSlipModalProps {
  patient: Patient;
  rooms?: DoctorRoom[];
  onClose: () => void;
  lang?: 'so' | 'en';
  theme?: ThemePalette;
}

export function OfficialTicketSlipModal({
  patient,
  rooms = [],
  onClose,
  lang = 'so',
  theme = 'sapphire',
}: OfficialTicketSlipModalProps) {
  const styles = getThemeStyles(theme);
  const printRef = useRef<HTMLDivElement>(null);

  const assignedRoom = patient.assignedRoomId
    ? rooms.find((r) => r.id === patient.assignedRoomId)
    : rooms[0];

  const handlePrint = () => {
    window.print();
  };

  const getPriorityLabel = () => {
    if (patient.triageLevel === 'emergency') {
      return {
        text: lang === 'so' ? 'DEGDEG HALIS AH (P-1)' : 'CRITICAL EMERGENCY (P-1)',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
      };
    }
    if (patient.triageLevel === 'urgent') {
      return {
        text: lang === 'so' ? 'MUHIIM DEGDEG (P-2)' : 'URGENT PRIORITY (P-2)',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    return {
      text: lang === 'so' ? 'CAADI / TALLAAL (P-3)' : 'ROUTINE / ANC (P-3)',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  };

  const priority = getPriorityLabel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh] ${styles.cardBg} ${styles.cardBorder}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Ticket Area */}
        <div ref={printRef} className="print:p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 text-slate-900 dark:text-white">
          {/* Hospital Header */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="font-extrabold font-display text-sm tracking-tight text-slate-900 dark:text-white">
                DaryeelQoys Clinic
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Isbitaalka Takhasusiga ee Hooyada, Dhallaanka & Gurmadka
            </p>
            <div className="text-[9px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="h-2.5 w-2.5 text-rose-500" />
              <span>Wadada Maka Al-Mukarama, Degmada Hodan, Muqdisho</span>
            </div>
          </div>

          {/* Ticket Number & Triage Level */}
          <div className="text-center py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
              {lang === 'so' ? 'LAMBARKA TIKIDHKA EE SAFKA' : 'OFFICIAL QUEUE NUMBER'}
            </span>
            <div className="text-5xl font-black font-mono tracking-wider text-blue-600 dark:text-blue-400 my-1">
              {patient.ticketNumber}
            </div>

            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${priority.color}">
              {priority.text}
            </div>
          </div>

          {/* Prominent QR Code */}
          <div className="my-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
            <TicketQRCode
              ticketNumber={patient.ticketNumber}
              patientName={patient.fullName}
              size={150}
              showDetails={false}
              showActions={false}
              theme={theme}
              lang={lang}
            />
            <div className="mt-2 text-center px-4">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                {lang === 'so' ? 'Ku skaan garee albaabka isbitaalka' : 'Scan at Entrance Kiosk'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'so'
                  ? 'Si aad u ogaato booskaaga safka & qolka dhakhtarka'
                  : 'Check queue position, room & doctor details'}
              </span>
            </div>
          </div>

          {/* Patient Clinical Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-200 dark:border-slate-800 py-3 my-3">
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Bukaanka:' : 'Patient:'}</span>
              <span className="font-bold truncate block">{patient.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Telefoonka:' : 'Phone:'}</span>
              <span className="font-mono font-bold block">{patient.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Qeybta:' : 'Department:'}</span>
              <span className="font-semibold block capitalize">
                {patient.category === 'maternal'
                  ? 'Hooyada (ANC)'
                  : patient.category === 'child'
                  ? 'Dhallaanka (Peds)'
                  : 'Guud'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'so' ? 'Qiyaasta Sugitaanka:' : 'Est. Wait:'}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 block font-mono">
                ~{patient.estimatedWaitMinutes} {lang === 'so' ? 'daqiiqo' : 'min'}
              </span>
            </div>
          </div>

          {/* Assigned Room */}
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-blue-700 dark:text-blue-300 block">
                {lang === 'so' ? 'Qolka La Qoondeeyay:' : 'Assigned Room:'}
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {assignedRoom?.roomName || 'Qolka 1aad'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block">
                {assignedRoom?.doctorName || 'Dr. Maryan Xasan'}
              </span>
            </div>
          </div>

          {/* Bottom Timestamp & Notice */}
          <div className="mt-3 text-center text-[9px] text-slate-400 space-y-0.5">
            <div>
              Diiwaangashay: {new Date(patient.registeredAt || Date.now()).toLocaleTimeString()} ·{' '}
              {new Date(patient.registeredAt || Date.now()).toLocaleDateString()}
            </div>
            <div className="font-semibold text-slate-500">
              {lang === 'so'
                ? 'Fadlan hayso tikidhkan ilaa inta booqashadaadu ka dhammaanayso.'
                : 'Please keep this ticket slip until your clinical visit concludes.'}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>{lang === 'so' ? 'Daabac Tikidhka (Print)' : 'Print Ticket Slip'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'so' ? 'Xidh' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
