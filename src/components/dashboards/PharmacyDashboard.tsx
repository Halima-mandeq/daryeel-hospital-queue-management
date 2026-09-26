import { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Package, 
  Filter, 
  Printer, 
  Thermometer, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  ArrowUpRight, 
  Check, 
  X, 
  Sparkles,
  Trash2,
  RefreshCw,
  TrendingDown,
  Building2,
  UserCheck
} from 'lucide-react';
import { 
  UserProfile, 
  ThemePalette, 
  PharmacyItem, 
  PrescriptionOrder, 
  MedicineCategory 
} from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';

interface PharmacyDashboardProps {
  currentUser: UserProfile;
  pharmacyItems: PharmacyItem[];
  prescriptions: PrescriptionOrder[];
  onDispensePrescription: (prescriptionId: string, pharmacistName: string, notes?: string) => void;
  onAddPharmacyItem: (newItem: PharmacyItem) => void;
  onUpdateStock: (itemId: string, newStock: number) => void;
  onDeletePharmacyItem: (itemId: string) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function PharmacyDashboard({
  currentUser,
  pharmacyItems,
  prescriptions,
  onDispensePrescription,
  onAddPharmacyItem,
  onUpdateStock,
  onDeletePharmacyItem,
  lang,
  theme,
}: PharmacyDashboardProps) {
  const styles = getThemeStyles(theme);

  // Active view tab inside pharmacy dashboard
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'inventory' | 'alerts'>('prescriptions');

  // Search & Filter for Inventory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Prescriptions Filter
  const [rxStatusFilter, setRxStatusFilter] = useState<'all' | 'pending' | 'dispensed'>('pending');

  // Modal: Add New Medication
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMedData, setNewMedData] = useState<Partial<PharmacyItem>>({
    name: '',
    genericName: '',
    category: 'antibiotic',
    form: 'tablets',
    dosage: '',
    stock: 50,
    unit: 'xabbo (tablets)',
    minStockAlert: 20,
    batchNo: `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    storageLocation: 'Khaanada A-1',
    priceUSD: 2.0,
    requiresPrescription: true,
  });

  // Modal: Dispense & Print Slip
  const [selectedRxForSlip, setSelectedRxForSlip] = useState<PrescriptionOrder | null>(null);
  const [dispenseNotes, setDispenseNotes] = useState('');

  // Calculations & Analytics
  const pendingCount = prescriptions.filter((p) => p.status === 'pending').length;
  const dispensedCount = prescriptions.filter((p) => p.status === 'dispensed').length;
  const lowStockItems = pharmacyItems.filter((m) => m.stock <= m.minStockAlert);
  const expiringSoonItems = pharmacyItems.filter((m) => {
    const exp = new Date(m.expiryDate).getTime();
    const now = Date.now();
    const daysLeft = (exp - now) / (1000 * 3600 * 24);
    return daysLeft <= 90; // expiring within 90 days
  });

  // Filtered Inventory List
  const filteredItems = pharmacyItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLowStock = !filterLowStockOnly || item.stock <= item.minStockAlert;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Filtered Prescriptions
  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (rxStatusFilter === 'all') return true;
    return rx.status === rxStatusFilter;
  });

  // Handler: Add New Medicine
  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedData.name || !newMedData.genericName) return;

    const created: PharmacyItem = {
      id: `med-${Date.now()}`,
      name: newMedData.name.trim(),
      genericName: newMedData.genericName.trim(),
      category: (newMedData.category as MedicineCategory) || 'antibiotic',
      form: newMedData.form || 'tablets',
      dosage: newMedData.dosage?.trim() || 'Standard Dose',
      stock: Number(newMedData.stock) || 10,
      unit: newMedData.unit?.trim() || 'units',
      minStockAlert: Number(newMedData.minStockAlert) || 15,
      batchNo: newMedData.batchNo?.trim() || `BATCH-${Date.now()}`,
      expiryDate: newMedData.expiryDate || '2026-12-31',
      storageLocation: newMedData.storageLocation?.trim() || 'Khaanada Guud',
      priceUSD: Number(newMedData.priceUSD) || 1.0,
      requiresPrescription: newMedData.requiresPrescription ?? true,
    };

    onAddPharmacyItem(created);
    setIsAddModalOpen(false);
    setNewMedData({
      name: '',
      genericName: '',
      category: 'antibiotic',
      form: 'tablets',
      dosage: '',
      stock: 50,
      unit: 'xabbo (tablets)',
      minStockAlert: 20,
      batchNo: `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      storageLocation: 'Khaanada A-1',
      priceUSD: 2.0,
      requiresPrescription: true,
    });
  };

  // Handler: Confirm Dispense
  const handleConfirmDispense = (rx: PrescriptionOrder) => {
    onDispensePrescription(rx.id, currentUser.name, dispenseNotes);
    setSelectedRxForSlip(null);
    setDispenseNotes('');
  };

  const getCategoryBadgeColor = (category: MedicineCategory) => {
    switch (category) {
      case 'maternal':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'pediatric':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'antibiotic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'emergency_iv':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'analgesic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors ${styles.bgApp}`}>
      
      {/* 1. TOP HEADER & PHARMACIST IDENTITY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Pill className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-extrabold font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Qeybta Farmashiyaha & Bixinta Dawooyinka' : 'Hospital Central Pharmacy Desk'}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {lang === 'so' ? 'Gudaha Keliya (Private)' : 'Internal Clinical Only'}
              </span>
            </div>
            <p className={`text-xs ${styles.textSecondary}`}>
              {lang === 'so' 
                ? `${currentUser.name} (${currentUser.title}) · Diyaarinta & Bixinta Dawooyinka Dhakhaatiirta` 
                : `${currentUser.name} (${currentUser.title}) · Electronic Prescriptions & Stock Management`}
            </p>
          </div>
        </div>

        {/* Cold Chain Monitor & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
            <Thermometer className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>{lang === 'so' ? 'Qaboojiyaha Cold-Chain: 3.6°C (Badqab)' : 'Cold Chain Storage: 3.6°C (Optimal)'}</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'so' ? 'Ku dar Dawo Cusub' : 'Add Medication'}</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Pending Prescriptions */}
        <div 
          onClick={() => { setActiveTab('prescriptions'); setRxStatusFilter('pending'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            activeTab === 'prescriptions' && rxStatusFilter === 'pending'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20'
              : `${styles.cardBg} ${styles.cardBorder}`
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-600">
            <span>{lang === 'so' ? 'Sugaya Bixin (Queue)' : 'Pending Dispense'}</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-2 text-slate-900 dark:text-white">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {lang === 'so' ? 'Bukaanada dawooyinka sugaya' : 'Patients waiting at pharmacy'}
          </span>
        </div>

        {/* Card 2: Dispensed Today */}
        <div 
          onClick={() => { setActiveTab('prescriptions'); setRxStatusFilter('dispensed'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            activeTab === 'prescriptions' && rxStatusFilter === 'dispensed'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
              : `${styles.cardBg} ${styles.cardBorder}`
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>{lang === 'so' ? 'La Bixiyay Maanta' : 'Dispensed Today'}</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-2 text-slate-900 dark:text-white">
            {dispensedCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {lang === 'so' ? 'Warqadaha dawooyinka la dhammeeyay' : 'Completed electronic prescriptions'}
          </span>
        </div>

        {/* Card 3: Total Inventory Items */}
        <div 
          onClick={() => { setActiveTab('inventory'); setFilterLowStockOnly(false); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            activeTab === 'inventory' && !filterLowStockOnly
              ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20'
              : `${styles.cardBg} ${styles.cardBorder}`
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-teal-600">
            <span>{lang === 'so' ? 'Noocyada Dawooyinka' : 'Total Items in Stock'}</span>
            <Package className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-2 text-slate-900 dark:text-white">
            {pharmacyItems.length}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {lang === 'so' ? 'Dhammaan keydka diiwaangashan' : 'Catalogued pharmaceutical lines'}
          </span>
        </div>

        {/* Card 4: Low Stock & Expiry Alerts */}
        <div 
          onClick={() => { setActiveTab('alerts'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            activeTab === 'alerts'
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20'
              : `${styles.cardBg} ${styles.cardBorder}`
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-600">
            <span>{lang === 'so' ? 'Digniinta Keydka (Alerts)' : 'Low Stock / Expiry'}</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-2 text-rose-600 dark:text-rose-400">
            {lowStockItems.length + expiringSoonItems.length}
          </div>
          <span className="text-[11px] text-rose-500 font-semibold block mt-1">
            {lowStockItems.length} {lang === 'so' ? 'u baahan dalbasho' : 'low stock'}, {expiringSoonItems.length} {lang === 'so' ? 'dhacaya' : 'expiring'}
          </span>
        </div>
      </div>

      {/* 3. PRIMARY VIEW NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{lang === 'so' ? 'Safka Dawo-Bixinta (Prescriptions)' : 'Prescription Dispensing'}</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-white">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>{lang === 'so' ? 'Keydka Dawooyinka (Stock Inventory)' : 'Medication Inventory'}</span>
          <span className="text-xs text-slate-400 font-mono">({pharmacyItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-rose-500" />
          <span>{lang === 'so' ? 'Digniinta & Badqabka' : 'Safety & Low Stock Alerts'}</span>
          {(lowStockItems.length > 0 || expiringSoonItems.length > 0) && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-600 text-white">
              {lowStockItems.length + expiringSoonItems.length}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: PRESCRIPTIONS DISPENSING QUEUE */}
      {/* ============================================================ */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          
          {/* Subfilter: All / Pending / Dispensed */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setRxStatusFilter('pending')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  rxStatusFilter === 'pending'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'so' ? 'Kuwa Sugaya (Pending)' : 'Waiting Dispense'} ({pendingCount})
              </button>
              <button
                onClick={() => setRxStatusFilter('dispensed')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  rxStatusFilter === 'dispensed'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'so' ? 'La Bixiyay (Dispensed)' : 'Completed'} ({dispensedCount})
              </button>
              <button
                onClick={() => setRxStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  rxStatusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'so' ? 'Dhammaan' : 'All Prescriptions'} ({prescriptions.length})
              </button>
            </div>

            <span className="text-xs text-slate-400">
              {lang === 'so' ? 'Qorista dawooyinka waxay toos uga timaadaa qolalka dhakhaatiirta' : 'Live electronic orders transmitted from physician consoles'}
            </span>
          </div>

          {/* Prescriptions List */}
          {filteredPrescriptions.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Wax Dawo Sugaya Ma Jiraan' : 'No Prescriptions in this queue'}
              </h3>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Dhammaan dawooyinka bukaanka waa la bixiyay ama dhakhtarku wali ma soo gudbin kuwo cusub.'
                  : 'All electronic prescription orders have been handled or no incoming orders.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPrescriptions.map((rx) => {
                const isPending = rx.status === 'pending';
                return (
                  <div
                    key={rx.id}
                    className={`rounded-3xl border p-5 transition-all shadow-xs ${
                      isPending
                        ? 'border-amber-300/80 dark:border-amber-700/50 bg-amber-50/20 dark:bg-amber-950/10'
                        : `${styles.cardBg} ${styles.cardBorder}`
                    }`}
                  >
                    {/* Header: Ticket, Patient & Status */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl font-black px-3 py-1 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {rx.ticketNumber}
                        </span>
                        <div>
                          <h4 className={`text-sm font-extrabold font-display ${styles.textPrimary}`}>
                            {rx.patientName}
                          </h4>
                          <p className={`text-[11px] ${styles.textSecondary}`}>
                            {rx.patientAge} {lang === 'so' ? 'jir' : 'yrs'} · {rx.patientGender === 'female' ? (lang === 'so' ? 'Dheddig' : 'Female') : (lang === 'so' ? 'Lab' : 'Male')} · {rx.patientCategory.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      }`}>
                        {isPending ? (lang === 'so' ? 'SUGAYA BIXIN' : 'PENDING') : (lang === 'so' ? 'LA BIXIYAY' : 'DISPENSED')}
                      </span>
                    </div>

                    {/* Prescribing Doctor & Time */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{rx.doctorName}</span>
                      </div>
                      <span className="font-mono text-[10px]">
                        {new Date(rx.prescribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Medications List */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                        {lang === 'so' ? 'Dawooyinka La Qoray:' : 'Prescribed Medicines:'}
                      </span>
                      {rx.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                            <span className="flex items-center gap-1.5">
                              <Pill className="h-3.5 w-3.5 text-teal-600" />
                              <span>{med.medicineName}</span>
                            </span>
                            <span className="font-mono text-teal-600 dark:text-teal-400 text-[11px]">
                              Qty: {med.quantity}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            <span className="text-slate-400">{lang === 'so' ? 'Xaddiga:' : 'Dosage:'} </span>
                            {med.dosage} ({med.duration})
                          </div>

                          <p className="text-[10px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                            💡 {lang === 'so' ? med.instructionsSo : med.instructionsEn}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Dispense Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => setSelectedRxForSlip(rx)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>{lang === 'so' ? 'Warqad Dawo' : 'Print Slip'}</span>
                          </button>

                          <button
                            onClick={() => handleConfirmDispense(rx)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{lang === 'so' ? 'Bixi Dawada & Gooy Keydka' : 'Dispense & Deduct Stock'}</span>
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="font-bold">
                              {lang === 'so' ? 'La Bixiyay:' : 'Dispensed by:'} {rx.dispensedBy || 'Farmashiistaha'}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedRxForSlip(rx)}
                            className="text-xs font-bold underline cursor-pointer hover:text-emerald-900"
                          >
                            {lang === 'so' ? 'Dib u Daabac' : 'Print Receipt'}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: MEDICATION INVENTORY & STOCK MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Category, Low Stock toggle */}
          <div className={`p-4 rounded-2xl border space-y-3 ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'so' ? 'Raadi dawada, magaca generic-ka, batch-ka ama khaanada...' : 'Search medicine, generic name, batch #, or shelf location...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterLowStockOnly
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Kuwa Yaraaday Keliya' : 'Low Stock Only'}</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Ku dar Dawo' : 'New Medicine'}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-bold mr-1">{lang === 'so' ? 'Nooca:' : 'Category:'}</span>
              {[
                { id: 'all', labelSo: 'Dhammaan', labelEn: 'All' },
                { id: 'maternal', labelSo: 'Hooyada (ANC/MCH)', labelEn: 'Maternal Care' },
                { id: 'pediatric', labelSo: 'Dhallaanka (Pediatric)', labelEn: 'Pediatrics' },
                { id: 'antibiotic', labelSo: 'Antibiotics', labelEn: 'Antibiotics' },
                { id: 'emergency_iv', labelSo: 'Emergency & IV', labelEn: 'Trauma/IV' },
                { id: 'analgesic', labelSo: 'Analgesics / Xanuun-babiye', labelEn: 'Pain Relief' },
                { id: 'vitamin_supplements', labelSo: 'Fiitamiino & Supplements', labelEn: 'Vitamins' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                    selectedCategory === c.id
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lang === 'so' ? c.labelSo : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Table */}
          <div className={`rounded-2xl border overflow-hidden ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">{lang === 'so' ? 'Dawada & Generic' : 'Medicine & Generic'}</th>
                    <th className="p-3.5">{lang === 'so' ? 'Qeybta & Nooca' : 'Category & Form'}</th>
                    <th className="p-3.5">{lang === 'so' ? 'Keydka (Stock)' : 'Quantity In Stock'}</th>
                    <th className="p-3.5">{lang === 'so' ? 'Khaanada (Shelf)' : 'Storage Location'}</th>
                    <th className="p-3.5">{lang === 'so' ? 'Waqtiga Dhaca' : 'Expiry Date'}</th>
                    <th className="p-3.5">{lang === 'so' ? 'Qiimaha' : 'Price'}</th>
                    <th className="p-3.5 text-right">{lang === 'so' ? 'Tallaabo' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.map((item) => {
                    const isLow = item.stock <= item.minStockAlert;
                    const isOut = item.stock === 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Medicine Name */}
                        <td className="p-3.5">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 italic">
                            {item.genericName} · {item.dosage}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Batch: {item.batchNo}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeColor(item.category)}`}>
                            {item.category.toUpperCase()}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1 capitalize">
                            Form: {item.form}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-black font-mono ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {item.stock}
                            </span>
                            <span className="text-[11px] text-slate-400">{item.unit}</span>
                          </div>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                              <AlertTriangle className="h-3 w-3" />
                              {lang === 'so' ? `Yaraaday (Min: ${item.minStockAlert})` : `Low (Min: ${item.minStockAlert})`}
                            </span>
                          )}
                        </td>

                        {/* Shelf */}
                        <td className="p-3.5">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {item.storageLocation}
                          </span>
                        </td>

                        {/* Expiry */}
                        <td className="p-3.5 font-mono text-[11px]">
                          {item.expiryDate}
                        </td>

                        {/* Price */}
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          ${item.priceUSD.toFixed(2)}
                        </td>

                        {/* Actions: Stock adjust */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 5))}
                              title="Deduct 5"
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => onUpdateStock(item.id, item.stock + 10)}
                              title="Add 10"
                              className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold cursor-pointer"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'so' ? `Ma hubtaa inaad tirtirto dawada ${item.name}?` : `Delete ${item.name}?`)) {
                                  onDeletePharmacyItem(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: SAFETY, EXPIRY & REORDER ALERTS */}
      {/* ============================================================ */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          
          {/* Critical Low Stock Warning Card */}
          <div className={`p-6 rounded-3xl border border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-200">
                  {lang === 'so' ? 'Dawooyinka Yaraaday ee u Baahan Dalbasho Degdeg ah' : 'Critical Low Stock / Reorder Needed'}
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-400">
                  {lang === 'so' ? 'Dawooyinkaan waxay gaareen xaddigii digniinta (Minimum Threshold).' : 'Stock has dropped below safe buffer inventory.'}
                </p>
              </div>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs font-bold text-emerald-600">
                {lang === 'so' ? 'Hambalyo! Ma jiraan dawooyin keydkoodu yaraaday xilligan.' : 'Good job! All medication lines have healthy inventory levels.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</span>
                      <span className="font-mono text-xs font-black text-rose-600">{item.stock} {item.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Min Alert: {item.minStockAlert}</span>
                      <span>Khaanada: {item.storageLocation}</span>
                    </div>
                    <button
                      onClick={() => onUpdateStock(item.id, item.stock + 50)}
                      className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer transition-all"
                    >
                      {lang === 'so' ? 'Kordhi Keydka (+50)' : 'Restock (+50)'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Soon Card */}
          <div className={`p-6 rounded-3xl border border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-amber-900 dark:text-amber-200">
                  {lang === 'so' ? 'Dawooyinka Dhacaya Dhawaan (3-6 Bilood Gudahood)' : 'Expiring Batches (Within 90 Days)'}
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {lang === 'so' ? 'Hubi badqabka iyo isticmaalka ka hor inta aysan dhicin.' : 'Prioritize dispensing FEFO (First Expired First Out) to avoid spoilage.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expiringSoonItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">Batch: {item.batchNo} · {item.storageLocation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-600 block">{item.expiryDate}</span>
                    <span className="text-[10px] text-slate-400">{item.stock} haray</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD NEW MEDICATION */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-extrabold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Diiwaangali Dawo Cusub' : 'Add New Pharmaceutical Item'}
                  </h3>
                  <p className={`text-xs ${styles.textSecondary}`}>
                    {lang === 'so' ? 'Ku dar liiska keydka xarunta caafimaadka' : 'Catalog new medicine into hospital pharmacy'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewMedicine} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">{lang === 'so' ? 'Magaca Ganacsiga (Commercial Name) *' : 'Trade Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin 500mg, Paracetamol Syrup"
                  value={newMedData.name}
                  onChange={(e) => setNewMedData({ ...newMedData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{lang === 'so' ? 'Magaca Sayniska (Generic Name) *' : 'Generic Active Ingredient *'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin Trihydrate"
                  value={newMedData.genericName}
                  onChange={(e) => setNewMedData({ ...newMedData, genericName: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Qeybta (Category)' : 'Category'}</label>
                  <select
                    value={newMedData.category}
                    onChange={(e) => setNewMedData({ ...newMedData, category: e.target.value as MedicineCategory })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  >
                    <option value="maternal">{lang === 'so' ? 'Hooyada (Maternal ANC)' : 'Maternal ANC'}</option>
                    <option value="pediatric">{lang === 'so' ? 'Dhallaanka (Pediatric)' : 'Pediatrics'}</option>
                    <option value="antibiotic">Antibiotics</option>
                    <option value="emergency_iv">Emergency & IV</option>
                    <option value="analgesic">Analgesics (Pain)</option>
                    <option value="vitamin_supplements">Vitamins & Minerals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Qaabka (Form)' : 'Dosage Form'}</label>
                  <select
                    value={newMedData.form}
                    onChange={(e) => setNewMedData({ ...newMedData, form: e.target.value as any })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  >
                    <option value="tablets">Tablets / Capsules</option>
                    <option value="syrup">Syrup / Suspension</option>
                    <option value="injection">Injection / Ampoule</option>
                    <option value="iv_fluid">IV Fluid Infusion</option>
                    <option value="drops">Pediatric Drops</option>
                    <option value="sachet">Powder Sachet (ORS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Xaddiga Hadda' : 'Initial Stock'}</label>
                  <input
                    type="number"
                    min="0"
                    value={newMedData.stock}
                    onChange={(e) => setNewMedData({ ...newMedData, stock: parseInt(e.target.value) || 0 })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Digniinta Yareynta' : 'Min Alert'}</label>
                  <input
                    type="number"
                    min="1"
                    value={newMedData.minStockAlert}
                    onChange={(e) => setNewMedData({ ...newMedData, minStockAlert: parseInt(e.target.value) || 10 })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Qiimaha ($)' : 'Price ($)'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMedData.priceUSD}
                    onChange={(e) => setNewMedData({ ...newMedData, priceUSD: parseFloat(e.target.value) || 0 })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Khaanada (Location)' : 'Storage Shelf'}</label>
                  <input
                    type="text"
                    value={newMedData.storageLocation}
                    onChange={(e) => setNewMedData({ ...newMedData, storageLocation: e.target.value })}
                    placeholder="e.g. Khaanada A-2 ama Qaboojiyaha"
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{lang === 'so' ? 'Waqtiga Dhaca' : 'Expiry Date'}</label>
                  <input
                    type="date"
                    value={newMedData.expiryDate}
                    onChange={(e) => setNewMedData({ ...newMedData, expiryDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-bold"
                >
                  {lang === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold cursor-pointer shadow-md"
                >
                  {lang === 'so' ? 'Keydi Dawada' : 'Save Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: PRINT MEDICATION SLIP / RECEIPT */}
      {/* ============================================================ */}
      {selectedRxForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-teal-600" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {lang === 'so' ? 'Warqadda Bixinta Dawada (Prescription Slip)' : 'Official Pharmacy Dispense Slip'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedRxForSlip(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Slip Paper Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3 font-mono">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <h5 className="font-black text-sm tracking-wider uppercase text-slate-900 dark:text-white">
                  DARYEELQOYS MCH HOSPITAL
                </h5>
                <p className="text-[10px] text-slate-500">Qeybta Dawooyinka & Bixinta · Mogadishu, Somalia</p>
                <p className="text-[10px] text-slate-400">Tel: +252 61 500 0011</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tikidh:</span>
                  <span className="font-black text-teal-600">{selectedRxForSlip.ticketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bukaanka:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRxForSlip.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dhakhtarka:</span>
                  <span>{selectedRxForSlip.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taariikhda:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-2 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Dawooyinka & Habka Isticmaalka:
                </span>
                {selectedRxForSlip.medications.map((m, i) => (
                  <div key={i} className="text-[11px]">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {i + 1}. {m.medicineName} (Qty: {m.quantity})
                    </div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-300 font-sans pl-3">
                      👉 {lang === 'so' ? m.instructionsSo : m.instructionsEn}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-1">
                <p>Dawada ku hay meel qabow oo carruurtu aysan gaari karin.</p>
                <p>Keep all medications out of reach of children.</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRxForSlip(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                {lang === 'so' ? 'Xir' : 'Close'}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>{lang === 'so' ? 'Daabac Warqada' : 'Print Receipt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
