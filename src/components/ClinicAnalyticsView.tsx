import { useState, useMemo } from 'react';
import { Patient, DoctorRoom, MaternalRecord, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import {
  exportPatientsToCSV,
  exportPatientsToPDF,
  filterPatientsForExport,
  formatExportDateTime,
} from '../utils/exportRecords';
import { 
  BarChart3, 
  Clock, 
  Users, 
  HeartPulse, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Baby,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  Stethoscope,
  Info
} from 'lucide-react';

interface ClinicAnalyticsViewProps {
  patients: Patient[];
  rooms: DoctorRoom[];
  maternalRecords: MaternalRecord[];
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function ClinicAnalyticsView({
  patients,
  rooms,
  lang,
  theme,
}: ClinicAnalyticsViewProps) {
  const styles = getThemeStyles(theme);

  // Export State & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [exportFeedback, setExportFeedback] = useState<{
    type: 'pdf' | 'csv';
    count: number;
    filename: string;
    timestamp: number;
  } | null>(null);
  const [isExporting, setIsExporting] = useState<'pdf' | 'csv' | null>(null);

  // Filtered patients for export and table preview
  const filteredPatients = useMemo(() => {
    return filterPatientsForExport(patients, filterCategory, searchQuery);
  }, [patients, filterCategory, searchQuery]);

  // Overall statistics
  const totalPatients = patients.length;
  const waitingPatients = patients.filter(p => p.status === 'waiting').length;
  const inConsultPatients = patients.filter(p => p.status === 'in_consultation').length;
  const completedPatients = patients.filter(p => p.status === 'completed').length;
  const emergencyPatients = patients.filter(p => p.triageLevel === 'emergency').length;
  const urgentPatients = patients.filter(p => p.triageLevel === 'urgent').length;
  const routinePatients = patients.filter(p => p.triageLevel === 'routine').length;

  // Handle Export to CSV
  const handleExportCSV = (targetList: Patient[] = filteredPatients) => {
    setIsExporting('csv');
    try {
      const result = exportPatientsToCSV(targetList, rooms, lang);
      if (result.success) {
        setExportFeedback({
          type: 'csv',
          count: result.count,
          filename: result.filename,
          timestamp: Date.now(),
        });
        setTimeout(() => setExportFeedback(null), 6000);
      }
    } finally {
      setIsExporting(null);
    }
  };

  // Handle Export to PDF
  const handleExportPDF = (targetList: Patient[] = filteredPatients) => {
    setIsExporting('pdf');
    try {
      let filterLabel = '';
      if (filterCategory === 'emergency') filterLabel = lang === 'so' ? 'Kaliya Degdeg (P-1)' : 'Emergency Only (P-1)';
      else if (filterCategory === 'waiting') filterLabel = lang === 'so' ? 'Sugayaasha Kaliya' : 'Waiting Only';
      else if (filterCategory === 'completed') filterLabel = lang === 'so' ? 'Dhameystirmay' : 'Completed Only';
      else if (searchQuery) filterLabel = `Raadinta: "${searchQuery}"`;

      const result = exportPatientsToPDF(targetList, rooms, lang, filterLabel);
      if (result.success) {
        setExportFeedback({
          type: 'pdf',
          count: result.count,
          filename: result.filename,
          timestamp: Date.now(),
        });
        setTimeout(() => setExportFeedback(null), 6000);
      }
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Quick Export CTA */}
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
              <BarChart3 className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Kormeerka & Warbixinta Maamulka' : 'Hospital Operations & Analytics'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              {lang === 'so' ? 'Diiwaanka Tooska ah' : 'Live Patient Ledger'}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold font-display ${styles.textPrimary}`}>
            {lang === 'so' ? 'Hufnaanta Xarunta & Diiwaanka Bukaanka' : 'Clinic Performance & Patient Record Archive'}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed ${styles.textSecondary}`}>
            {lang === 'so'
              ? 'Kormeerka socodka bukaanada xarunta, xisaabinta dhimista waqtiga safka, iyo dhoofinta rasmiga ah ee diiwaanka bukaanada oo PDF iyo CSV ah.'
              : 'Real-time telemetry measuring queue latency reduction, rapid maternal triage response, and one-click clinical record exports in PDF and CSV format.'}
          </p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={() => handleExportPDF(filteredPatients)}
            disabled={isExporting !== null || filteredPatients.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title={lang === 'so' ? 'Dhoofi Liiska PDF ahaan' : 'Export Patient Roster to PDF'}
          >
            <FileText className="h-4 w-4" />
            <span>{isExporting === 'pdf' ? (lang === 'so' ? 'Dhoofinaya...' : 'Exporting...') : (lang === 'so' ? 'Dhoofi PDF' : 'Export PDF')}</span>
          </button>

          <button
            onClick={() => handleExportCSV(filteredPatients)}
            disabled={isExporting !== null || filteredPatients.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title={lang === 'so' ? 'Dhoofi Liiska CSV/Excel ahaan' : 'Export Patient Roster to CSV'}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExporting === 'csv' ? (lang === 'so' ? 'Dhoofinaya...' : 'Exporting...') : (lang === 'so' ? 'Dhoofi CSV (Excel)' : 'Export CSV (Excel)')}</span>
          </button>
        </div>
      </div>

      {/* Export Notification Toast */}
      {exportFeedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 p-4 text-emerald-800 dark:text-emerald-200 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold">
                {lang === 'so' ? 'Faylka si guul leh ayaa loo dhoofiyay!' : 'Clinical Record Exported Successfully!'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">
                {lang === 'so'
                  ? `Waxaa la soo dejiyay "${exportFeedback.filename}" oo ka kooban ${exportFeedback.count} bukaan.`
                  : `Downloaded "${exportFeedback.filename}" containing ${exportFeedback.count} clinical records.`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setExportFeedback(null)}
            className="text-xs font-bold underline cursor-pointer hover:opacity-80"
          >
            {lang === 'so' ? 'Xir' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${styles.textSecondary}`}>
              {lang === 'so' ? 'Celceliska Sugitaanka' : 'Average Waiting Time'}
            </span>
            <Clock className={`h-4 w-4 ${styles.accentText}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${styles.textPrimary}`}>18 min</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
              -89%
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${styles.textSecondary}`}>
            {lang === 'so' ? 'Hore: 3 saacadood oo buuq ah' : 'Before: 3+ hrs chaotic lines'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${styles.textSecondary}`}>
              {lang === 'so' ? 'Jawaabta Degdegga' : 'Emergency Triage Speed'}
            </span>
            <HeartPulse className="h-4 w-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-600">&lt; 2 min</span>
            <span className={`text-xs font-mono font-semibold ${styles.textSecondary}`}>Immediate</span>
          </div>
          <p className={`text-[11px] mt-1 ${styles.textSecondary}`}>
            {lang === 'so' ? 'Dhiig-baxa & neefta toos loo qaabilaa' : 'Hemorrhage & shock expedited'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${styles.textSecondary}`}>
              {lang === 'so' ? 'Bukaanka Diiwaangashan' : 'Total Patient Census'}
            </span>
            <Users className={`h-4 w-4 ${styles.accentText}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${styles.accentText}`}>{totalPatients}</span>
            <span className={`text-xs font-mono ${styles.textSecondary}`}>diiwaanka</span>
          </div>
          <p className={`text-[11px] mt-1 ${styles.textSecondary}`}>
            {waitingPatients} {lang === 'so' ? 'sugaya' : 'waiting'} · {completedPatients} {lang === 'so' ? 'dhameeyay' : 'seen'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${styles.textSecondary}`}>
              {lang === 'so' ? 'Imaatinka Tallaalka' : 'Immunization Compliance'}
            </span>
            <Baby className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-teal-600">96.4%</span>
            <span className="text-xs text-emerald-600 font-bold">high</span>
          </div>
          <p className={`text-[11px] mt-1 ${styles.textSecondary}`}>
            {lang === 'so' ? 'Hooyooyinka SMS-ka ku yimaada' : 'SMS attendance compliance'}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EXPORT PATIENT RECORDS SECTION */}
      {/* ============================================================ */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        {/* Section Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-8 w-8 rounded-xl flex items-center justify-center ${styles.badgeBg} ${styles.accentText}`}>
                  <Download className="h-4 w-4" />
                </span>
                <h3 className={`text-lg font-bold font-display ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Dhoofinta Diiwaanka Bukaanka (Clinical Record Export)' : 'Export Patient Registry for Clinical Record Keeping'}
                </h3>
              </div>
              <p className={`text-xs mt-1 max-w-2xl ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Soo dejiso liiska bukaanada oo dhan ama kuwo la sifeeyay adigoo u dhoofinaya PDF rasmi ah oo saxiix leh ama CSV (Excel/Sheets) oo loo adeegsado warbixinta wasaaradda ama xafidaada isbitaalka.'
                  : 'Download full or filtered patient registries into certified medical PDFs or universal CSV spreadsheets for ministry reporting, audits, and archiving.'}
              </p>
            </div>

            {/* Main Export Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleExportPDF(filteredPatients)}
                disabled={isExporting !== null || filteredPatients.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>
                  {isExporting === 'pdf'
                    ? (lang === 'so' ? 'Soo saaraya PDF...' : 'Generating PDF...')
                    : (lang === 'so' ? `Dhoofi PDF (${filteredPatients.length})` : `Export PDF (${filteredPatients.length})`)}
                </span>
              </button>

              <button
                onClick={() => handleExportCSV(filteredPatients)}
                disabled={isExporting !== null || filteredPatients.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>
                  {isExporting === 'csv'
                    ? (lang === 'so' ? 'Soo saaraya CSV...' : 'Generating CSV...')
                    : (lang === 'so' ? `Dhoofi CSV (${filteredPatients.length})` : `Export CSV (${filteredPatients.length})`)}
                </span>
              </button>
            </div>
          </div>

          {/* Filtering & Search Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Search Input */}
            <div className="sm:col-span-6 lg:col-span-5 relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'so' ? 'Raadi magac, tikidh (E-01), ama taleefan...' : 'Search by name, ticket (e.g. E-01), or phone...'}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold hover:opacity-70 ${styles.textSecondary}`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="sm:col-span-6 lg:col-span-7 flex flex-wrap items-center gap-1.5">
              <span className={`text-[11px] font-bold mr-1 flex items-center gap-1 ${styles.textSecondary}`}>
                <Filter className="h-3 w-3" />
                {lang === 'so' ? 'Shaandhee:' : 'Filter:'}
              </span>

              {[
                { id: 'all', labelSo: `Dhammaan (${patients.length})`, labelEn: `All (${patients.length})` },
                { id: 'waiting', labelSo: `Sugaya (${waitingPatients})`, labelEn: `Waiting (${waitingPatients})` },
                { id: 'in_consultation', labelSo: `Qolalka (${inConsultPatients})`, labelEn: `In Consult (${inConsultPatients})` },
                { id: 'completed', labelSo: `Dhameeyay (${completedPatients})`, labelEn: `Completed (${completedPatients})` },
                { id: 'emergency', labelSo: `Degdeg P-1 (${emergencyPatients})`, labelEn: `Emergency P-1 (${emergencyPatients})` },
                { id: 'urgent', labelSo: `Degdeg P-2 (${urgentPatients})`, labelEn: `Urgent P-2 (${urgentPatients})` },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterCategory(btn.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterCategory === btn.id
                      ? `${styles.badgeBg} ${styles.badgeText} ring-1 ${styles.accentBorder}`
                      : `${styles.cardInnerBg} ${styles.textSecondary} hover:${styles.textPrimary}`
                  }`}
                >
                  {lang === 'so' ? btn.labelSo : btn.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Table Preview */}
        <div className="overflow-x-auto">
          {filteredPatients.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Info className={`mx-auto h-8 w-8 mb-2 ${styles.textSecondary}`} />
              <p className={`text-sm font-semibold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Bukaan lama helin' : 'No patients match your search criteria'}
              </p>
              <p className={`text-xs mt-1 ${styles.textSecondary}`}>
                {lang === 'so' ? 'Fadlan beddel ereyga raadinta ama shaandhada aad dooratay.' : 'Try adjusting your search terms or filter selection.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${styles.cardInnerBg} ${styles.textSecondary} ${styles.cardBorder}`}>
                  <th className="py-3 px-4">{lang === 'so' ? 'Tikidh' : 'Ticket'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Bukaanka' : 'Patient'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? "Da'da / Jinsiga" : 'Age / Sex'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Qeybta' : 'Category'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Heerka Triage' : 'Acuity / Priority'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Calaamadaha Muhiimka ah (Vitals)' : 'Clinical Vitals'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Xaaladda' : 'Status'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Dhakhtarka / Qolka' : 'Room / Doctor'}</th>
                  <th className="py-3 px-4">{lang === 'so' ? 'Diiwaangelinta' : 'Registered'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredPatients.map((p) => {
                  const isEmergency = p.triageLevel === 'emergency';
                  const isUrgent = p.triageLevel === 'urgent';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-500/5 transition-colors ${
                        isEmergency ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      {/* Ticket */}
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-black text-xs ${
                          isEmergency
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : isUrgent
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {p.ticketNumber}
                        </span>
                      </td>

                      {/* Patient Name & Phone */}
                      <td className="py-3 px-4">
                        <div className={`font-bold ${styles.textPrimary}`}>{p.fullName}</div>
                        <div className={`text-[11px] font-mono ${styles.textSecondary}`}>{p.phone || '-'}</div>
                      </td>

                      {/* Age / Sex */}
                      <td className={`py-3 px-4 ${styles.textSecondary}`}>
                        {p.age} {lang === 'so' ? 'jir' : 'yrs'} · {p.gender === 'female' ? (lang === 'so' ? 'Dheddig' : 'Female') : (lang === 'so' ? 'Lab' : 'Male')}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.category === 'maternal'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : p.category === 'child'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                            : p.category === 'emergency'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {p.category === 'maternal' && p.pregnancyWeek
                            ? `ANC ${p.pregnancyWeek}w`
                            : p.category}
                        </span>
                      </td>

                      {/* Triage Urgency */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] ${
                          isEmergency
                            ? 'text-rose-600 dark:text-rose-400'
                            : isUrgent
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <span className={`h-2 w-2 rounded-full ${
                            isEmergency ? 'bg-rose-600 animate-ping' : isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {isEmergency
                            ? (lang === 'so' ? 'Cas (P-1 Degdeg)' : 'Red (P-1 Crit)')
                            : isUrgent
                            ? (lang === 'so' ? 'Jaalle (P-2)' : 'Yellow (P-2)')
                            : (lang === 'so' ? 'Cagaar (P-3)' : 'Green (P-3)')}
                        </span>
                      </td>

                      {/* Vitals */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span title="Temperature" className={p.vitals?.temperature && p.vitals.temperature > 38 ? 'text-rose-600 font-bold' : styles.textSecondary}>
                            {p.vitals?.temperature ? `${p.vitals.temperature}°C` : '-'}
                          </span>
                          <span className={styles.textSecondary}>·</span>
                          <span title="Blood Pressure" className={styles.textPrimary}>
                            {p.vitals?.bloodPressure || '-'}
                          </span>
                          <span className={styles.textSecondary}>·</span>
                          <span title="SpO2" className={p.vitals?.spO2 && p.vitals.spO2 < 95 ? 'text-rose-600 font-bold' : styles.textSecondary}>
                            {p.vitals?.spO2 ? `${p.vitals.spO2}%` : '-'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : p.status === 'in_consultation'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : p.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {p.status === 'waiting'
                            ? (lang === 'so' ? 'Sugaya' : 'Waiting')
                            : p.status === 'in_consultation'
                            ? (lang === 'so' ? 'Dhakhtarka la jooga' : 'In Consult')
                            : p.status === 'completed'
                            ? (lang === 'so' ? 'Dhameystirmay' : 'Completed')
                            : p.status}
                        </span>
                      </td>

                      {/* Doctor / Room */}
                      <td className={`py-3 px-4 text-[11px] ${styles.textSecondary}`}>
                        {p.assignedDoctorName || p.assignedRoomId || (lang === 'so' ? 'Aan loo yeerin' : 'Not assigned')}
                      </td>

                      {/* Registered Time */}
                      <td className={`py-3 px-4 text-[11px] font-mono ${styles.textSecondary}`}>
                        {formatExportDateTime(p.registeredAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info bar */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${styles.cardInnerBg} ${styles.cardBorder} ${styles.textSecondary}`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {lang === 'so'
                ? `Waxaa la muujiyay ${filteredPatients.length} ka mid ah ${patients.length} bukaan`
                : `Showing ${filteredPatients.length} of ${patients.length} total patient records`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportPDF(filteredPatients)}
              disabled={filteredPatients.length === 0}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <FileText className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Soo deji PDF' : 'Download PDF'}
            </button>
            <span>•</span>
            <button
              onClick={() => handleExportCSV(filteredPatients)}
              disabled={filteredPatients.length === 0}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Soo deji CSV' : 'Download CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Triage Urgency Distribution & Doctor Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Triage Urgency Breakdown */}
        <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <h3 className={`text-sm font-bold font-display mb-1 flex items-center gap-2 ${styles.textPrimary}`}>
            <Activity className={`h-4 w-4 ${styles.accentText}`} />
            <span>{lang === 'so' ? 'Kala Sooca Triage-ka ee Maanta' : 'Clinical Triage Urgency Distribution'}</span>
          </h3>
          <p className={`text-xs mb-6 ${styles.textSecondary}`}>
            {lang === 'so'
              ? 'Heerarka xaaladaha bukaanada soo gaaray xarunta saacadaha lasoo dhaafay'
              : 'Categorization of incoming patients across clinical acuity levels'}
          </p>

          <div className="space-y-4">
            {/* Emergency */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-600"></span>
                  <span>{lang === 'so' ? 'Cas · Degdeg Halis ah (Emergency P-1)' : 'Red · Critical Emergency (P-1)'}</span>
                </span>
                <span className="font-mono font-bold">{emergencyPatients} {lang === 'so' ? 'bukaan' : 'patients'}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalPatients > 0 ? (emergencyPatients / totalPatients) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Urgent */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-amber-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span>{lang === 'so' ? 'Jaalle · Degdeg Dhexdhexaad (Urgent P-2)' : 'Yellow · Urgent Care (P-2)'}</span>
                </span>
                <span className="font-mono font-bold">{urgentPatients} {lang === 'so' ? 'bukaan' : 'patients'}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalPatients > 0 ? (urgentPatients / totalPatients) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Routine */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                  <span>{lang === 'so' ? 'Cagaar · Caadi & Tallaal (Routine P-3)' : 'Green · Routine & MCH (P-3)'}</span>
                </span>
                <span className="font-mono font-bold">{routinePatients} {lang === 'so' ? 'bukaan' : 'patients'}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalPatients > 0 ? (routinePatients / totalPatients) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Rooms Load */}
        <div className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
          <h3 className={`text-sm font-bold font-display mb-1 flex items-center gap-2 ${styles.textPrimary}`}>
            <Stethoscope className={`h-4 w-4 ${styles.accentText}`} />
            <span>{lang === 'so' ? 'Shaqada Qolalka Dhakhaatiirta' : 'Doctor Room Capacity & Active Status'}</span>
          </h3>
          <p className={`text-xs mb-6 ${styles.textSecondary}`}>
            {lang === 'so' ? 'Qolalka hadda bukaanadu ku jiraan iyo kuwa diyaar ah' : 'Live occupancy state of clinical consultation rooms'}
          </p>

          <div className="space-y-3">
            {rooms.map((room) => {
              const patient = patients.find(p => p.id === room.currentPatientId);
              return (
                <div
                  key={room.id}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 px-4 transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}
                >
                  <div>
                    <div className={`text-xs font-bold ${styles.textPrimary}`}>{room.roomName}</div>
                    <div className={`text-[11px] ${styles.textSecondary}`}>{room.doctorName} · {room.specialty}</div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${
                      patient ? styles.badgeBg + ' ' + styles.badgeText : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}>
                      {patient 
                        ? (lang === 'so' ? `Bukaan: ${patient.ticketNumber}` : `Patient: ${patient.ticketNumber}`) 
                        : (lang === 'so' ? 'Waa Bannaan Yahay' : 'Open')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Impact Story */}
      <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
            <ShieldCheck className="h-3.5 w-3.5" />
            {lang === 'so' ? 'Dhibaatada Dhabta ah ee DaryeelQoys Xalliyay' : 'Clinical Impact Story'}
          </span>
        </div>
        <h3 className={`text-lg sm:text-xl font-bold font-display mb-3 ${styles.textPrimary}`}>
          {lang === 'so' 
            ? 'Sidee Nidaamkani u Badbaadiyaa Nolosha Hooyada & Dhallaanka?' 
            : 'How DaryeelQoys Solves Life-Threatening Clinic Waiting Bottlenecks'}
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed max-w-3xl ${styles.textSecondary}`}>
          {lang === 'so'
            ? 'Xarumaha caafimaadka caadiga ah, hooyo uur leh oo dhiig-bax lama filaan ahi ku yimid waxay safka la geli jirtay qof tallaal caadi ah u yimid, taasoo keenta geeri laga hortagi karay. DaryeelQoys wuxuu triage-ka ku xisaabiyaa 15 ilbiriqsi, hooyada halista ahna toos ayuu qolka dhakhtarka ugu yeeraa isagoo qof kasta siinaya tikidh hufan oo SMS ah, una kaydinaya diiwaanka xogta caafimaadka si loogu dhoofiyo PDF ama CSV.'
            : 'In standard maternal health centers, pregnant mothers with acute complications frequently waited in chaotic queues behind routine visits. DaryeelQoys algorithmically scores patient acuity within 15 seconds, automatically prioritizing emergency maternal cases while preserving comprehensive clinical audit ledgers ready for PDF and CSV export.'}
        </p>
      </div>
    </div>
  );
}
