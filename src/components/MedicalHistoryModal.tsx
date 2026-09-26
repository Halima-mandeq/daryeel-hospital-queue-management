import React, { useState } from 'react';
import { 
  FileText, 
  HeartPulse, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldAlert, 
  Pill, 
  FlaskConical, 
  Stethoscope, 
  Printer, 
  X,
  ChevronDown,
  Sparkles,
  Plus
} from 'lucide-react';
import { ThemePalette, PatientMedicalRecord, PatientHistoryVisit } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { PATIENT_MEDICAL_RECORDS } from '../data/mockMedicalRecords';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
  patientName?: string;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  ticketNumber = 'M-14',
  patientName,
  lang,
  theme,
}) => {
  const styles = getThemeStyles(theme);

  // Retrieve matching record or fallback
  const record: PatientMedicalRecord = PATIENT_MEDICAL_RECORDS[ticketNumber] || {
    patientPhoneOrTicket: ticketNumber,
    fullName: patientName || 'Bukaan Guud',
    dateOfBirthOrAge: '30 sano jir',
    gender: 'female',
    bloodType: 'O+',
    allergies: ['Lama sheegin (No known drug allergies)'],
    chronicConditions: ['None reported'],
    emergencyContact: {
      name: 'Ehel Dhow',
      relationship: 'Qoyska',
      phone: '+252 61 500 0000',
    },
    visits: [
      {
        id: 'vis-init',
        date: new Date().toISOString().split('T')[0],
        doctorName: 'Dr. Maryan Xasan Faarax',
        department: 'Qaybta Guud',
        chiefComplaint: 'Booqashadii maanta ee diiwaangelinta',
        diagnosis: 'Under routine evaluation',
        treatmentNotes: 'Bukaanka waxaa la socda baaritaan guud.',
        vitalsSummary: 'BP: 120/80 | Temp: 36.8°C | SpO2: 98%',
        prescriptions: ['Standard Clinical Multivitamin'],
      }
    ],
  };

  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(record.visits[0]?.id || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Diiwaanka & Taariikhda Caafimaad (EHR)' : 'Electronic Health Record (EHR)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {ticketNumber}
                </span>
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                {record.fullName} • {record.dateOfBirthOrAge} • {record.gender === 'female' ? 'Dheddig' : 'Lab'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={lang === 'so' ? 'Daabac taariikhda caafimaad' : 'Print medical summary'}
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Vital Health Alerts Bar (Blood Group, Allergies, Chronic) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900">
          {/* Blood Group */}
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              {record.bloodType}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 block">
                {lang === 'so' ? 'Kooxda Dhiigga' : 'Blood Group'}
              </span>
              <strong className="text-xs text-rose-900 dark:text-rose-200">{record.bloodType}</strong>
            </div>
          </div>

          {/* Allergies */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">
                {lang === 'so' ? 'Xasaasiyadda Dawooyinka' : 'Drug Allergies'}
              </span>
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                {record.allergies.join(', ')}
              </span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {lang === 'so' ? 'Qofka Degdegga (Emergency Contact)' : 'Emergency Contact'}
              </span>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{record.emergencyContact.name}</div>
              <div className="text-[10px] text-slate-500">{record.emergencyContact.phone}</div>
            </div>
          </div>
        </div>

        {/* Chronological Visits Timeline */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Taariikhda Booqashooyinkii Hore ee Isbitaalka:' : 'Past Clinical Encounters:'}</span>
            </h4>
            <span className="text-xs text-slate-400">
              {record.visits.length} {lang === 'so' ? 'booqasho diiwaangashan' : 'visits recorded'}
            </span>
          </div>

          <div className="space-y-3">
            {record.visits.map((visit) => {
              const isExpanded = expandedVisitId === visit.id;
              return (
                <div 
                  key={visit.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div 
                    onClick={() => setExpandedVisitId(isExpanded ? null : visit.id)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {visit.date} • {visit.doctorName}
                        </div>
                        <div className="text-[11px] text-slate-500">{visit.chiefComplaint}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {visit.diagnosis}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Visit Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          {lang === 'so' ? 'Calaamadaha Nolosha ee Xilligaas (Vitals):' : 'Vitals on Encounter:'}
                        </span>
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{visit.vitalsSummary}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          {lang === 'so' ? 'Faallada & Qoraalka Dhakhtarka:' : 'Physician Clinical Notes:'}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{visit.treatmentNotes}</p>
                      </div>

                      {visit.prescriptions && visit.prescriptions.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                            <Pill className="h-3 w-3 text-emerald-500" />
                            <span>{lang === 'so' ? 'Dawooyinkii Loo Qoray:' : 'Prescribed Medications:'}</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {visit.prescriptions.map((med, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
                                • {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {visit.labTestsConducted && visit.labTestsConducted.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                            <FlaskConical className="h-3 w-3 text-indigo-500" />
                            <span>{lang === 'so' ? 'Natiijooyinkii Shaybaarka ee Maalintaas:' : 'Lab Results on Encounter:'}</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {visit.labTestsConducted.map((lab, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono">
                                {lab}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>{lang === 'so' ? 'Xogta waxaa si toos ah u xaqiijiyay nidaamka isbitaalka' : 'Record verified by hospital clinical database'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'so' ? 'Xir Daaqadda' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
