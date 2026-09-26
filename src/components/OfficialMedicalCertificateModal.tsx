import React, { useState } from 'react';
import { 
  FileCheck, 
  Baby, 
  Printer, 
  X, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Check, 
  User, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';

interface OfficialMedicalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPatientName?: string;
  defaultTicketNumber?: string;
  doctorName?: string;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export const OfficialMedicalCertificateModal: React.FC<OfficialMedicalCertificateModalProps> = ({
  isOpen,
  onClose,
  defaultPatientName = 'Xaliimo Nuur Warsame',
  defaultTicketNumber = 'M-14',
  doctorName = 'Dr. Maryan Xasan Faarax',
  lang,
  theme,
}) => {
  const styles = getThemeStyles(theme);

  const [certType, setCertType] = useState<'sick_leave' | 'birth_cert'>('sick_leave');

  // Sick Leave State
  const [patientName, setPatientName] = useState(defaultPatientName);
  const [diagnosis, setDiagnosis] = useState('Severe Acute Bronchitis & High Grade Fever');
  const [daysGranted, setDaysGranted] = useState(4);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [workplace, setWorkplace] = useState('Hay\'adda / Shirkadda / Dugsiga Bukaanka');
  const [doctorNotes, setDoctorNotes] = useState('Bukaanka waxaa la farayaa nasasho sariireed oo buuxda iyo cabitaanka biyo diirran.');

  // Birth Certificate State
  const [childName, setChildName] = useState('Maxamed Nuur Warsame');
  const [motherName, setMotherName] = useState(defaultPatientName);
  const [fatherName, setFatherName] = useState('Nuur Warsame Cilmi');
  const [birthDateTime, setBirthDateTime] = useState(`${new Date().toISOString().split('T')[0]} 04:30`);
  const [babyWeight, setBabyWeight] = useState('3.4 kg');
  const [babyGender, setBabyGender] = useState<'Wiil (Male)' | 'Gabar (Female)'>('Wiil (Male)');
  const [deliveryType, setDeliveryType] = useState('Dhalmo Caadi ah (Spontaneous Vaginal Delivery)');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 border border-slate-200 overflow-y-auto max-h-[92vh] my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCertType('sick_leave')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                certType === 'sick_leave' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? '1. Warqadda Fasaxa Caafimaadka (Sick Leave)' : 'Sick Leave Certificate'}</span>
            </button>
            <button
              onClick={() => setCertType('birth_cert')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                certType === 'birth_cert' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Baby className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? '2. Warqadda Dhalashada (Birth Notice)' : 'Birth Certificate'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Daabac' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL CERTIFICATE TEMPLATE */}
        <div className="border-4 border-double border-slate-900 p-6 sm:p-8 rounded-2xl relative">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 text-xl font-black">
              DQH
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-widest uppercase">
              ISBITAALKA GUUD EE DARYEEL QOYS
            </h1>
            <p className="text-xs font-bold tracking-wide text-slate-700 uppercase">
              DARYEEL QOYS GENERAL & TEACHING HOSPITAL
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Ministry of Health Certified • Hodan District, Mogadishu, Somalia • Tell: +252 61 511 2233
            </p>
          </div>

          {/* SICK LEAVE CERTIFICATE */}
          {certType === 'sick_leave' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-block px-4 py-1 rounded-full border-2 border-slate-900 font-black text-xs uppercase tracking-wider bg-slate-50">
                  SHAHAAHADA FASAXA CAAFIMAADKA (MEDICAL SICK LEAVE CERTIFICATE)
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  REF NO: MED-SL-2026-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-3 font-serif">
                <p>
                  Waxaa halkan lagu caddaynayaa in bukaanka magaciisu yahay{' '}
                  <strong className="font-sans font-bold underline text-sm">{patientName}</strong>{' '}
                  (Tikidhka: <span className="font-mono font-bold">{defaultTicketNumber}</span>), 
                  lagu baaray qaybta bukaan-socodka ee isbitaalka maanta oo ay taariikhdu tahay{' '}
                  <strong>{startDate}</strong>.
                </p>

                <p>
                  Baaritaan caafimaad oo qoto dheer ka dib, waxaa la ogaaday inuu la ildaran yahay xaalad caafimaad oo ah:{' '}
                  <strong className="font-sans font-bold text-slate-900 underline">{diagnosis}</strong>.
                </p>

                <p>
                  Sidaa darteed, sababo caafimaad awgood, bukaanka waxaa la siiyay fasax caafimaad oo dhan{' '}
                  <strong className="font-sans font-bold text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {daysGranted} Maalmood ({daysGranted} Days)
                  </strong>, 
                  laga bilaabo taariikhda <strong>{startDate}</strong>.
                </p>

                {doctorNotes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold font-sans">Talooyinka Dhakhtarka: </span>
                    <span>{doctorNotes}</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 italic pt-2">
                  Warqaddan waxaa loo gudbin karaa maamulka shaqada ama waxbarashada ee {workplace}.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-4 items-end">
                <div>
                  <div className="w-20 h-20 rounded-full border-2 border-blue-800 text-blue-800 flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-tighter transform -rotate-12 select-none">
                    <span>DARYEEL</span>
                    <span>HOSPITAL</span>
                    <span>OFFICIAL STAMP</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-script text-xl italic underline text-slate-800">{doctorName}</div>
                  <div className="font-bold text-xs">{doctorName}</div>
                  <div className="text-[10px] text-slate-600">Dhakhtarka Baaritaanka Sameeyay (MD)</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">MOH License: SOM-MED-84920</div>
                </div>
              </div>
            </div>
          )}

          {/* BIRTH CERTIFICATE / NOTIFICATION */}
          {certType === 'birth_cert' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-block px-4 py-1 rounded-full border-2 border-emerald-800 text-emerald-900 font-black text-xs uppercase tracking-wider bg-emerald-50">
                  WARQADDA RASMIGA AH EE DHALASHADA (CERTIFICATE OF LIVE BIRTH)
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  BIRTH REG NO: BTH-SOM-2026-{Math.floor(10000 + Math.random() * 90000)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Magaca Ilmaha (Baby's Full Name):</span>
                  <strong className="text-sm font-bold text-slate-900">{childName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Jinsiga (Gender):</span>
                  <strong className="text-slate-900">{babyGender}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Magaca Hooyada (Mother's Name):</span>
                  <span className="font-bold">{motherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Magaca Aabaha (Father's Name):</span>
                  <span className="font-bold">{fatherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Waqtiga & Taariikhda Dhalashada:</span>
                  <span>{birthDateTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Miisaanka Dhalashada (Weight):</span>
                  <strong className="text-emerald-700">{babyWeight}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase">Nooca Dhalmada (Delivery Mode):</span>
                  <span>{deliveryType}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-4 items-end">
                <div>
                  <div className="w-20 h-20 rounded-full border-2 border-emerald-800 text-emerald-800 flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-tighter transform -rotate-12 select-none">
                    <span>MATERNITY</span>
                    <span>BIRTH REGISTER</span>
                    <span>VERIFIED</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-script text-xl italic underline text-slate-800">Dr. Maryan Xasan</div>
                  <div className="font-bold text-xs">{doctorName}</div>
                  <div className="text-[10px] text-slate-600">Agaasimaha Qaybta Umusha & Dhalmada</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Isbitaalka Daryeel Qoys</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
