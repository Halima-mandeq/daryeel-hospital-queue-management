import { useState } from 'react';
import { MaternalRecord, ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { 
  Baby, 
  Heart, 
  Calendar, 
  Send, 
  Check, 
  Plus, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  X,
  Phone
} from 'lucide-react';

interface MaternalVaccineViewProps {
  records: MaternalRecord[];
  onAddRecord: (record: MaternalRecord) => void;
  onSendSms: (id: string) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function MaternalVaccineView({
  records,
  onAddRecord,
  onSendSms,
  lang,
  theme,
}: MaternalVaccineViewProps) {
  const styles = getThemeStyles(theme);

  const [activeSubTab, setActiveSubTab] = useState<'maternal' | 'immunization'>('maternal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New Mother Form State
  const [motherName, setMotherName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | ''>(20);
  const [nextCheckupDate, setNextCheckupDate] = useState('');
  const [childName, setChildName] = useState('');
  const [childAgeMonths, setChildAgeMonths] = useState<number | ''>('');
  const [nextVaccineDue, setNextVaccineDue] = useState('Pentavalent 1 (Toddobaadka 6aad)');

  const handleTriggerSms = (record: MaternalRecord) => {
    onSendSms(record.id);
    setAlertMessage(
      lang === 'so'
        ? `Farriin SMS ah oo xusuusin ah ayaa loo diray ${record.motherName} (${record.phone}).`
        : `Reminder SMS successfully dispatched to ${record.motherName} (${record.phone}).`
    );
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motherName.trim() || !phone.trim()) return;

    const newRec: MaternalRecord = {
      id: `mat-${Date.now()}`,
      motherName: motherName.trim(),
      phone: phone.trim(),
      age: typeof age === 'number' ? age : 24,
      pregnancyWeeks: typeof pregnancyWeeks === 'number' ? pregnancyWeeks : 0,
      trimester: typeof pregnancyWeeks === 'number' && pregnancyWeeks > 27 ? 3 : (pregnancyWeeks && pregnancyWeeks > 13 ? 2 : 1),
      nextCheckupDate: nextCheckupDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      lastHbLevel: '11.8 g/dL',
      riskLevel: 'safe',
      childName: childName.trim() || undefined,
      childAgeMonths: typeof childAgeMonths === 'number' ? childAgeMonths : undefined,
      nextVaccineDue: childName.trim() ? nextVaccineDue : undefined,
      vaccineDate: childName.trim() ? nextCheckupDate : undefined,
      smsSent: false,
    };

    onAddRecord(newRec);
    setShowAddModal(false);
    // Reset
    setMotherName('');
    setPhone('');
    setChildName('');
  };

  const filteredRecords = records.filter(r => 
    r.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery) ||
    (r.childName && r.childName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Alert */}
      {alertMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-500/50 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 p-4 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Banner with Photo */}
      <div className={`overflow-hidden rounded-3xl border mb-8 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${styles.badgeBg} ${styles.badgeText} ${styles.accentBorder}`}>
                  <Baby className="h-3.5 w-3.5" />
                  {lang === 'so' ? 'Daryeelka Hooyada & Dhallaanka (MCH)' : 'Maternal & Child Health Portal'}
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Kormeerka Uurka & Jadwalka Tallaalka Carruurta' : 'Antenatal Registry & Child Vaccine Follow-Up'}
              </h2>
              <p className={`text-xs sm:text-sm mt-2 max-w-xl leading-relaxed ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Kormeer xilliyada booqashada hooyada (ANC Visits) iyo ogeysiinta SMS-ka ee tallaalka ilmaha si looga hortago dillaaca jadeecada iyo cudurrada carruurta.'
                  : 'Automated maternal ANC visit registry and child vaccine follow-up SMS reminders to prevent missed immunizations.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAddModal(true)}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
              >
                <Plus className="h-4 w-4" />
                <span>{lang === 'so' ? 'Diiwaangeli Hooyo / Ilmo Cusub' : 'Register Mother / Child'}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 relative h-48 md:h-auto min-h-[200px]">
            <img
              src={CLINIC_IMAGES.childVaccine}
              alt="Child Vaccine Care"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('maternal')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'maternal'
                ? styles.navActiveBg
                : `${styles.textSecondary} hover:${styles.textPrimary}`
            }`}
          >
            <Heart className="h-3.5 w-3.5 inline mr-1.5 text-rose-500" />
            <span>{lang === 'so' ? 'Hooyooyinka Uurka Leh (ANC Visits)' : 'Antenatal Care (ANC)'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('immunization')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'immunization'
                ? styles.navActiveBg
                : `${styles.textSecondary} hover:${styles.textPrimary}`
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 inline mr-1.5 text-teal-500" />
            <span>{lang === 'so' ? 'Tallaalka Carruurta (Vaccine Tracker)' : 'Child Vaccines (EPI)'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'so' ? 'Raadi magac ama telefoon...' : 'Search by mother or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded-2xl border pl-10 pr-4 py-2.5 text-xs focus:outline-none w-full sm:w-64 transition-colors ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
          />
        </div>
      </div>

      {/* Maternal Tab Content */}
      {activeSubTab === 'maternal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${styles.cardBg} ${styles.cardBorder}`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-base font-display ${styles.textPrimary}`}>{rec.motherName}</h3>
                    <p className={`text-xs font-mono mt-0.5 ${styles.textSecondary}`}>{rec.phone}</p>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    rec.riskLevel === 'high_risk' 
                      ? styles.emergencyBg 
                      : styles.routineBg
                  }`}>
                    {rec.riskLevel === 'high_risk' 
                      ? (lang === 'so' ? 'Kormeer Gaar ah' : 'High Risk') 
                      : (lang === 'so' ? 'Caafimaad Qabta' : 'Safe')}
                  </span>
                </div>

                <div className={`space-y-2 py-3.5 border-y text-xs font-mono border-slate-100 dark:border-slate-800 ${styles.textSecondary}`}>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium">{lang === 'so' ? 'Toddobaadka Uurka:' : 'Gestational Age:'}</span>
                    <span className={`font-bold ${styles.textPrimary}`}>
                      {rec.pregnancyWeeks > 0 ? `${rec.pregnancyWeeks} Toddobaad (Trimester ${rec.trimester})` : 'Dhashay'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium">{lang === 'so' ? 'Heerka Dhiigga (Hb):' : 'Hemoglobin:'}</span>
                    <span className={`font-bold ${styles.accentText}`}>{rec.lastHbLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium">{lang === 'so' ? 'Ballanta Xigta:' : 'Next ANC Date:'}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{rec.nextCheckupDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-2">
                <button
                  onClick={() => handleTriggerSms(rec)}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer ${
                    rec.smsSent
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      : `${styles.accentBg} text-white ${styles.accentHover}`
                  }`}
                >
                  {rec.smsSent ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Send className="h-3.5 w-3.5" />}
                  <span>
                    {rec.smsSent 
                      ? (lang === 'so' ? 'SMS Xusuusin Waa la Diray (Dib u dir)' : 'SMS Sent (Resend)') 
                      : (lang === 'so' ? 'Dir SMS Xusuusin ah' : 'Dispatch SMS Reminder')}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immunization Tab Content */}
      {activeSubTab === 'immunization' && (
        <div className="space-y-6">
          <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <h3 className={`text-sm font-bold font-display mb-3 flex items-center gap-2 ${styles.textPrimary}`}>
              <ShieldCheck className={`h-4 w-4 ${styles.accentText}`} />
              <span>{lang === 'so' ? 'Jadwalka Rasmiga ah ee Tallaalka Carruurta (National EPI Schedule)' : 'National Childhood Immunization Schedule'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className={`rounded-2xl border p-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <span className={`font-mono font-bold block mb-1 ${styles.accentText}`}>01. Dhalashada</span>
                <p className={styles.textSecondary}>BCG & OPV 0</p>
              </div>
              <div className={`rounded-2xl border p-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <span className={`font-mono font-bold block mb-1 ${styles.accentText}`}>02. 6 Toddobaad</span>
                <p className={styles.textSecondary}>Penta 1, OPV 1, Rota 1</p>
              </div>
              <div className={`rounded-2xl border p-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <span className={`font-mono font-bold block mb-1 ${styles.accentText}`}>03. 10 Toddobaad</span>
                <p className={styles.textSecondary}>Penta 2, OPV 2, Rota 2</p>
              </div>
              <div className={`rounded-2xl border p-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <span className={`font-mono font-bold block mb-1 ${styles.accentText}`}>04. 14 Toddobaad</span>
                <p className={styles.textSecondary}>Penta 3, OPV 3, IPV</p>
              </div>
              <div className={`rounded-2xl border p-3.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                <span className={`font-mono font-bold block mb-1 ${styles.accentText}`}>05. 9 Bilood</span>
                <p className={styles.textSecondary}>Jadeeco 1 & Vit A</p>
              </div>
            </div>
          </div>

          {/* Child Registry */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.filter(r => r.childName).map((rec) => (
              <div
                key={rec.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between shadow-sm transition-colors ${styles.cardBg} ${styles.cardBorder}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-bold text-base font-display ${styles.textPrimary}`}>{rec.childName}</h4>
                      <p className={`text-xs mt-0.5 ${styles.textSecondary}`}>
                        {lang === 'so' ? `Hooyada: ${rec.motherName}` : `Mother: ${rec.motherName}`}
                      </p>
                    </div>
                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${styles.badgeBg} ${styles.badgeText}`}>
                      {rec.childAgeMonths} {lang === 'so' ? 'bilood' : 'months'}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border text-xs font-mono mb-4 space-y-1.5 ${styles.cardInnerBg} ${styles.cardBorder}`}>
                    <div className="text-slate-400 text-[11px] uppercase">{lang === 'so' ? 'Tallaalka Ku Xiga:' : 'Next Vaccine Due:'}</div>
                    <div className={`font-bold text-sm ${styles.accentText}`}>{rec.nextVaccineDue || 'Tallaalka 6aad'}</div>
                    <div className="text-amber-600 dark:text-amber-400 font-bold">{rec.vaccineDate || '2026-10-02'}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSms(rec)}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white transition-colors cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'U Dir Hooyada SMS Xusuusin ah' : 'Dispatch Vaccine SMS to Mother'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl ${styles.cardBg} ${styles.cardBorder}`}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className={`text-lg font-bold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Diiwaangelinta Hooyo / Ilmo Cusub' : 'Register New Mother / Infant'}
              </h3>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so' ? 'Kudar diiwaanka xarunta si loogu xiro fariimaha xusuusinta tallaalka' : 'Add to clinic registry for automated immunization follow-up'}
              </p>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Magaca Hooyada *' : 'Mother Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'so' ? 'Tusaale: Safiyo Maxamuud Cali' : 'e.g. Safia Mohamud Ali'}
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Telefoonka *' : 'Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+252 61..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Toddobaadka Uurka' : 'Pregnancy Weeks'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="42"
                    placeholder="24"
                    value={pregnancyWeeks}
                    onChange={(e) => setPregnancyWeeks(e.target.value ? Number(e.target.value) : '')}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className={`text-xs font-bold block mb-2 ${styles.accentText}`}>
                  {lang === 'so' ? 'Haddii ay Ilmo Wadatana (Ikhtiyaari):' : 'If Child Included (Optional):'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                      {lang === 'so' ? 'Magaca Ilmaha' : 'Child Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'so' ? 'Tusaale: Khaalid' : 'e.g. Khalid'}
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                      {lang === 'so' ? 'Da\'da Ilmaha (Bilood)' : 'Age (Months)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      placeholder="6"
                      value={childAgeMonths}
                      onChange={(e) => setChildAgeMonths(e.target.value ? Number(e.target.value) : '')}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Ballanta Xigta ee Xarunta' : 'Next Clinic Visit Date'}
                </label>
                <input
                  type="date"
                  value={nextCheckupDate}
                  onChange={(e) => setNextCheckupDate(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 text-xs font-medium cursor-pointer ${styles.textSecondary}`}
                >
                  {lang === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer ${styles.accentBg} ${styles.accentHover}`}
                >
                  {lang === 'so' ? 'Keydi Diiwaanka' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
