import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Plus, 
  FileText, 
  Sparkles, 
  Activity, 
  Filter, 
  User, 
  ChevronRight,
  X,
  Calendar,
  Check,
  Building2,
  Phone
} from 'lucide-react';
import { LabTestOrder, LabTestCatalogItem, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { LAB_TEST_CATALOG } from '../../data/mockLabData';

interface LaboratoryDashboardProps {
  orders: LabTestOrder[];
  onUpdateOrderStatus: (
    orderId: string, 
    status: LabTestOrder['status'], 
    resultValue?: string, 
    isAbnormal?: boolean, 
    notes?: string
  ) => void;
  onAddOrder?: (newOrder: LabTestOrder) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export const LaboratoryDashboard: React.FC<LaboratoryDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddOrder,
  lang,
  theme,
}) => {
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals
  const [activeOrderForResult, setActiveOrderForResult] = useState<LabTestOrder | null>(null);
  const [resultInput, setResultInput] = useState('');
  const [resultAbnormal, setResultAbnormal] = useState(false);
  const [resultNotes, setResultNotes] = useState('');

  const [printOrder, setPrintOrder] = useState<LabTestOrder | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New Manual Order Form State
  const [manualTicket, setManualTicket] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualAge, setManualAge] = useState<number>(30);
  const [manualGender, setManualGender] = useState<'female' | 'male'>('female');
  const [manualTestCode, setManualTestCode] = useState('CBC');
  const [manualPriority, setManualPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.testNameSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.testCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || order.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'ordered' || o.status === 'sample_collected' || o.status === 'analyzing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const abnormalCount = orders.filter(o => o.isAbnormal && o.status === 'completed').length;

  const handleOpenResultModal = (order: LabTestOrder) => {
    setActiveOrderForResult(order);
    setResultInput(order.resultValue || '');
    setResultAbnormal(order.isAbnormal || false);
    setResultNotes(order.notes || '');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderForResult) return;

    onUpdateOrderStatus(
      activeOrderForResult.id,
      'completed',
      resultInput,
      resultAbnormal,
      resultNotes
    );

    setActiveOrderForResult(null);
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = LAB_TEST_CATALOG.find(c => c.code === manualTestCode) || LAB_TEST_CATALOG[0];

    const newOrder: LabTestOrder = {
      id: `lab-${Date.now()}`,
      ticketNumber: manualTicket.toUpperCase() || `L-${Math.floor(10 + Math.random() * 89)}`,
      patientId: `pat-${Date.now()}`,
      patientName: manualName || 'Bukaan Guud',
      patientAge: Number(manualAge),
      patientGender: manualGender,
      testCode: catalogItem.code,
      testNameSo: catalogItem.nameSo,
      testNameEn: catalogItem.nameEn,
      category: catalogItem.category,
      sampleType: catalogItem.sampleType,
      doctorName: 'Dr. Maryan Xasan Faarax',
      doctorRoom: 'Qolka 1aad (OB/GYN)',
      priority: manualPriority,
      status: 'ordered',
      orderedAt: new Date().toISOString(),
      normalRange: catalogItem.normalRange,
      costUSD: catalogItem.costUSD,
    };

    if (onAddOrder) {
      onAddOrder(newOrder);
    }
    setShowNewOrderModal(false);
    setManualTicket('');
    setManualName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <FlaskConical className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-2xl font-black ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Qaybta Shaybaarka & Baaritaanka' : 'Laboratory & Diagnostic Center'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  LIMS v2.6
                </span>
              </div>
              <p className={`text-xs mt-1 ${styles.textSecondary}`}>
                {lang === 'so' 
                  ? 'Falanqeynta dhiigga, kaadida, baarista duumada, ultrasound-ka iyo diiwaanka natiijooyinka dhakhaatiirta' 
                  : 'Diagnostic pathology, specimen analysis, imaging, and instant doctor reporting'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowCatalogModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${styles.cardBorder} hover:bg-slate-100 dark:hover:bg-slate-800 ${styles.textPrimary}`}
            >
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>{lang === 'so' ? 'Qiimaha & Liiska Baaritaanka' : 'Test Catalog & Prices'}</span>
            </button>
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'so' ? 'Dalbo Baaritaan Cusub' : 'New Lab Request'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'so' ? 'Wadarta Baaritaanka' : 'Total Orders'}</span>
            <Activity className="h-4 w-4 text-indigo-500" />
          </div>
          <div className={`text-2xl font-black mt-2 ${styles.textPrimary}`}>{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{lang === 'so' ? 'Maanta oo dhan' : 'Recorded today'}</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{lang === 'so' ? 'Sugaya Natiijo' : 'Pending Analysis'}</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{lang === 'so' ? 'Shaybaarka ku jira' : 'In process or queued'}</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lang === 'so' ? 'Dhammaystiran' : 'Completed'}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{lang === 'so' ? 'Dhakhtarka loo diray' : 'Sent to physician'}</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{lang === 'so' ? 'Xaalad Aan Caadi Ahayn' : 'Abnormal / Critical'}</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{abnormalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{lang === 'so' ? 'Digniin degdeg ah' : 'Requires medical alert'}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'so' ? 'Raadi magaca bukaanka, tikidhka, ama nooca baaritaanka...' : 'Search patient name, ticket, test...'}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-bold`}
          >
            <option value="all">{lang === 'so' ? 'Dhammaan Xaaladaha' : 'All Status'}</option>
            <option value="ordered">{lang === 'so' ? 'La Dalbaday (Ordered)' : 'Ordered'}</option>
            <option value="sample_collected">{lang === 'so' ? 'Muunada La Qaaday' : 'Sample Taken'}</option>
            <option value="completed">{lang === 'so' ? 'Dhammaystiran' : 'Completed'}</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-bold`}
          >
            <option value="all">{lang === 'so' ? 'Qaybaha oo Dhan' : 'All Categories'}</option>
            <option value="hematology">{lang === 'so' ? 'Dhiigga (Hematology)' : 'Hematology'}</option>
            <option value="parasitology">{lang === 'so' ? 'Duumada & Saxarada' : 'Parasitology'}</option>
            <option value="biochemistry">{lang === 'so' ? 'Sonkorta & Bio' : 'Biochemistry'}</option>
            <option value="urinalysis">{lang === 'so' ? 'Kaadida (Urine)' : 'Urinalysis'}</option>
            <option value="ultrasound">{lang === 'so' ? 'Ultrasound Scan' : 'Ultrasound'}</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xs ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">{lang === 'so' ? 'Tikidh & Bukaanka' : 'Ticket & Patient'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Baaritaanka' : 'Test Requested'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Dhakhtarka' : 'Ordering Doctor'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Xaaladda' : 'Status'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Natiijada' : 'Result & Findings'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'so' ? 'Ficillo' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FlaskConical className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-semibold">{lang === 'so' ? 'Lama helin dalabyo baaritaan oo u dhigma' : 'No lab orders found'}</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isCompleted = order.status === 'completed';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-xs text-slate-800 dark:text-slate-200">
                            {order.ticketNumber}
                          </span>
                          <div>
                            <div className={`font-bold ${styles.textPrimary}`}>{order.patientName}</div>
                            <div className="text-[11px] text-slate-400">
                              {order.patientAge} {lang === 'so' ? 'jir' : 'yrs'} • {order.patientGender === 'female' ? 'Dheddig' : 'Lab'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {lang === 'so' ? order.testNameSo : order.testNameEn}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{order.testCode}</span>
                          <span>• {order.sampleType}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">{order.doctorName}</div>
                        <div className="text-[11px] text-slate-400">{order.doctorRoom}</div>
                      </td>

                      <td className="py-4 px-4">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{lang === 'so' ? 'Dhammaystiran' : 'Completed'}</span>
                          </span>
                        ) : order.status === 'sample_collected' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            <span>{lang === 'so' ? 'Muunada la helay' : 'Testing'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <span>{lang === 'so' ? 'Sugaya Muunad' : 'Awaiting Sample'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        {order.resultValue ? (
                          <div>
                            <div className={`font-semibold text-xs flex items-center gap-1.5 ${
                              order.isAbnormal ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {order.isAbnormal && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                              <span>{order.resultValue}</span>
                            </div>
                            {order.normalRange && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Ref: {order.normalRange}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">{lang === 'so' ? 'Weli lama gelin' : 'Pending results'}</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCompleted && (
                            <button
                              onClick={() => handleOpenResultModal(order)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              {lang === 'so' ? 'Geli Natiijada' : 'Enter Result'}
                            </button>
                          )}

                          {isCompleted && (
                            <>
                              <button
                                onClick={() => handleOpenResultModal(order)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
                                title={lang === 'so' ? 'Wax ka beddel' : 'Edit result'}
                              >
                                {lang === 'so' ? 'Wax Ka Beddel' : 'Edit'}
                              </button>
                              <button
                                onClick={() => setPrintOrder(order)}
                                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                                title={lang === 'so' ? 'Daabac Warqadda Natiijada' : 'Print Lab Report'}
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Enter / Edit Lab Result */}
      {activeOrderForResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Galinta Natiijada Shaybaarka' : 'Enter Diagnostic Result'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {activeOrderForResult.ticketNumber} • {activeOrderForResult.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveOrderForResult(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs">
                <div className="font-bold text-indigo-900 dark:text-indigo-200">
                  {lang === 'so' ? activeOrderForResult.testNameSo : activeOrderForResult.testNameEn} ({activeOrderForResult.testCode})
                </div>
                <div className="text-indigo-700 dark:text-indigo-300 mt-1">
                  <strong>{lang === 'so' ? 'Heerka Caadiga ah (Reference):' : 'Normal Range:'}</strong> {activeOrderForResult.normalRange}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'so' ? 'Natiijada La Helay (Result Value):' : 'Observed Result:'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder={lang === 'so' ? 'Tusaale: Hb: 11.4 g/dL ama Negative / Positive...' : 'e.g. Hb: 11.4 g/dL or Negative / Positive...'}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <input
                  type="checkbox"
                  id="abnormalCheck"
                  checked={resultAbnormal}
                  onChange={(e) => setResultAbnormal(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="abnormalCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5">
                  <AlertTriangle className={`h-4 w-4 ${resultAbnormal ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{lang === 'so' ? 'Calaamadee: Xaalad Aan Caadi Ahayn (Abnormal / Critical)' : 'Mark as Abnormal / Critical Finding'}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'so' ? 'Faallada Farsamayaqaanka (Technician Clinical Notes):' : 'Technician Remarks:'}
                </label>
                <input
                  type="text"
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                  placeholder={lang === 'so' ? 'Talooyin ama faallo ku saabsan muunada...' : 'Optional clinical comments...'}
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveOrderForResult(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md"
                >
                  {lang === 'so' ? 'Keydi & U Dir Dhakhtarka' : 'Save & Report to Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Official Printable Lab Report Slip */}
      {printOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg rounded-3xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 border border-slate-200 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lang === 'so' ? 'Nuqulka Rasmiga ah ee Shaybaarka' : 'Official Lab Diagnostic Report'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Daabac' : 'Print'}</span>
                </button>
                <button
                  onClick={() => setPrintOrder(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Official Hospital Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-md">
                DH
              </div>
              <h2 className="text-base font-black tracking-wide uppercase">
                ISBITAALKA GUUD EE DARYEEL QOYS
              </h2>
              <p className="text-[11px] font-semibold text-slate-600">
                QAYBTA BAARITAANKA GUUD & SHAYBAARKA (DEPARTMENT OF PATHOLOGY)
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Mogadishu, Somalia • Tel: +252 61 511 2233 • Email: lab@daryeelqoys.so
              </p>
            </div>

            {/* Patient & Order Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">{lang === 'so' ? 'Magaca Bukaanka:' : 'Patient Name:'}</span>
                <strong className="text-slate-900">{printOrder.patientName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">{lang === 'so' ? 'Tikidhka Safka:' : 'Ticket #:'}</span>
                <strong className="text-indigo-600 font-bold text-sm">{printOrder.ticketNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">{lang === 'so' ? 'Da\'da & Jinsiga:' : 'Age / Gender:'}</span>
                <span>{printOrder.patientAge} jir • {printOrder.patientGender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">{lang === 'so' ? 'Dhakhtarka Dalbaday:' : 'Ordering Doctor:'}</span>
                <span>{printOrder.doctorName}</span>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 border-b pb-1">
                {lang === 'so' ? 'NATIIJADA BAARITAANKA (TEST FINDINGS)' : 'TEST RESULTS'}
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-[10px] text-slate-500 uppercase">
                    <th className="py-2">{lang === 'so' ? 'Nooca Baaritaanka' : 'Investigation'}</th>
                    <th className="py-2">{lang === 'so' ? 'Natiijada' : 'Result'}</th>
                    <th className="py-2">{lang === 'so' ? 'Heerka Caadiga' : 'Reference'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold">{printOrder.testNameSo} ({printOrder.testCode})</td>
                    <td className={`py-2.5 font-bold ${printOrder.isAbnormal ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                      {printOrder.resultValue || 'N/A'}
                    </td>
                    <td className="py-2.5 text-slate-600 text-[11px]">{printOrder.normalRange}</td>
                  </tr>
                </tbody>
              </table>

              {printOrder.notes && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700">{lang === 'so' ? 'Faallo / Talo:' : 'Clinical Remark:'} </span>
                  <span className="text-slate-600">{printOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Official Stamp & Signature Area */}
            <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
              <div>
                <div className="w-20 h-20 rounded-full border-2 border-indigo-700/40 text-indigo-700 flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-tighter transform -rotate-12 select-none">
                  <span>DARYEEL</span>
                  <span>LABORATORY</span>
                  <span>VERIFIED</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-script text-lg text-slate-800 italic underline">Khadar M. Nuur</div>
                <div className="font-bold text-[11px] text-slate-900">Khadar Maxamuud Nuur</div>
                <div className="text-[10px] text-slate-500">Madaxa Shaybaarka & Baaritaanka</div>
                <div className="text-[9px] text-slate-400 mt-1">
                  Taariikhda: {new Date(printOrder.completedAt || printOrder.orderedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Test Catalog & Standard Prices */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-indigo-500" />
                <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Liiska Baaritaannada & Qiimaha Rasmiga ah' : 'Laboratory Test Menu & Price List'}
                </h3>
              </div>
              <button onClick={() => setShowCatalogModal(false)} className="p-1.5 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {LAB_TEST_CATALOG.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {item.code}
                      </span>
                      <strong className={`text-xs ${styles.textPrimary}`}>{item.nameSo}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Muunada: {item.sampleType} • Waqtiga: ~{item.standardTurnaroundMinutes} daqiiqo • Ref: {item.normalRange}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ${item.costUSD.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: New Lab Order */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Dalbo Baaritaan Cusub' : 'Order New Lab Test'}
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="p-1.5 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'so' ? 'Lambarka Tikidhka:' : 'Ticket Number:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="E-001, M-14, ama R-33..."
                  value={manualTicket}
                  onChange={(e) => setManualTicket(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'so' ? 'Magaca Bukaanka:' : 'Patient Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Magaca buuxa..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Da'da (Age):</label>
                  <input
                    type="number"
                    value={manualAge}
                    onChange={(e) => setManualAge(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Jinsiga (Gender):</label>
                  <select
                    value={manualGender}
                    onChange={(e) => setManualGender(e.target.value as 'female' | 'male')}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                  >
                    <option value="female">Dheddig (Female)</option>
                    <option value="male">Lab (Male)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'so' ? 'Dooro Nooca Baaritaanka:' : 'Select Test:'}
                </label>
                <select
                  value={manualTestCode}
                  onChange={(e) => setManualTestCode(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-bold`}
                >
                  {LAB_TEST_CATALOG.map((cat) => (
                    <option key={cat.id} value={cat.code}>
                      {cat.code} - {cat.nameSo} (${cat.costUSD})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Degdegsiimada (Priority):</label>
                <select
                  value={manualPriority}
                  onChange={(e) => setManualPriority(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                >
                  <option value="routine">Caadi (Routine)</option>
                  <option value="urgent">Degdeg Dhexdhexaad ah (Urgent)</option>
                  <option value="emergency">Gurmad Degdeg ah (Emergency)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border text-slate-600 dark:text-slate-300"
                >
                  {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  {lang === 'so' ? 'Dir Dalabka' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
