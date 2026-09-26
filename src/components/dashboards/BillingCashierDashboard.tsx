import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Plus, 
  PhoneCall, 
  Smartphone, 
  Building2, 
  FileCheck, 
  Filter, 
  X, 
  Receipt,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { BillingInvoice, BillingLineItem, PaymentMethod, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { PAYMENT_METHOD_NAMES } from '../../data/mockBillingData';

interface BillingCashierDashboardProps {
  invoices: BillingInvoice[];
  onMarkPaid: (invoiceId: string, method: PaymentMethod, phone?: string, transactionId?: string) => void;
  onCreateInvoice?: (newInvoice: BillingInvoice) => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export const BillingCashierDashboard: React.FC<BillingCashierDashboardProps> = ({
  invoices,
  onMarkPaid,
  onCreateInvoice,
  lang,
  theme,
}) => {
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Payment Processing Modal
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<BillingInvoice | null>(null);
  const [chosenMethod, setChosenMethod] = useState<PaymentMethod>('evc_plus');
  const [payerPhone, setPayerPhone] = useState('');
  const [isProcessingUSSD, setIsProcessingUSSD] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Print Receipt Modal
  const [printReceiptInvoice, setPrintReceiptInvoice] = useState<BillingInvoice | null>(null);

  // Create New Invoice Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLineItemDesc, setNewLineItemDesc] = useState('');
  const [newLineItemAmount, setNewLineItemAmount] = useState<number>(5.0);
  const [newItemsList, setNewItemsList] = useState<BillingLineItem[]>([
    { id: 'item-1', descriptionSo: 'Diiwaangelinta Bukaanka & Tikidhka Safka', descriptionEn: 'Patient Registration & Consultation', category: 'consultation', amountUSD: 3.0 }
  ]);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.patientPhone && inv.patientPhone.includes(searchQuery));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Financial KPI totals
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalAmountUSD, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.totalAmountUSD, 0);
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const pendingCount = invoices.filter(i => i.status === 'pending').length;

  const handleStartPayment = (invoice: BillingInvoice) => {
    setSelectedInvoiceForPayment(invoice);
    setPayerPhone(invoice.paymentPhone || invoice.patientPhone || '061');
    setPaymentSuccessMessage(null);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    setIsProcessingUSSD(true);

    setTimeout(() => {
      const generatedTxId = `${chosenMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      onMarkPaid(selectedInvoiceForPayment.id, chosenMethod, payerPhone, generatedTxId);
      setIsProcessingUSSD(false);
      setPaymentSuccessMessage(
        lang === 'so' 
          ? `Lacag-bixinta $${selectedInvoiceForPayment.totalAmountUSD.toFixed(2)} waa la xaqiijiyay! Tx: ${generatedTxId}`
          : `Payment of $${selectedInvoiceForPayment.totalAmountUSD.toFixed(2)} confirmed! Tx: ${generatedTxId}`
      );

      setTimeout(() => {
        setSelectedInvoiceForPayment(null);
      }, 1500);
    }, 1200);
  };

  const handleAddItemToNewInvoice = () => {
    if (!newLineItemDesc) return;
    const newItem: BillingLineItem = {
      id: `item-${Date.now()}`,
      descriptionSo: newLineItemDesc,
      descriptionEn: newLineItemDesc,
      category: 'procedure',
      amountUSD: Number(newLineItemAmount),
    };
    setNewItemsList([...newItemsList, newItem]);
    setNewLineItemDesc('');
    setNewLineItemAmount(5.0);
  };

  const handleSaveNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newItemsList.reduce((acc, curr) => acc + curr.amountUSD, 0);

    const newInvoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketNumber: newTicket.toUpperCase() || 'R-01',
      patientName: newName || 'Bukaan Guud',
      patientPhone: newPhone || '+252 61 500 0000',
      items: newItemsList,
      totalAmountUSD: total,
      paymentMethod: 'evc_plus',
      status: 'pending',
      createdAt: new Date().toISOString(),
      cashierName: 'Fadxiya Cismaan Xirsi',
    };

    if (onCreateInvoice) {
      onCreateInvoice(newInvoice);
    }
    setShowCreateModal(false);
    setNewTicket('');
    setNewName('');
    setNewPhone('');
    setNewItemsList([{ id: 'item-1', descriptionSo: 'Diiwaangelinta Bukaanka & Tikidhka Safka', descriptionEn: 'Patient Registration & Consultation', category: 'consultation', amountUSD: 3.0 }]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <CreditCard className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-2xl font-black ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Qaybta Lacag-Qabashada & Biilasha (Cashier & Billing)' : 'Hospital Cashier & Mobile Money Billing'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  EVC Plus • Zaad • Sahal
                </span>
              </div>
              <p className={`text-xs mt-1 ${styles.textSecondary}`}>
                {lang === 'so' 
                  ? 'Lacag-bixinta safka, baaritaannada shaybaarka, dawooyinka farmashiyaha iyo daabacaadda rasiidhada rasmiga ah' 
                  : 'Automated billing, instant mobile money settlement, and official hospital receipt generation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'so' ? 'Samee Rasiid/Biil Cusub' : 'Create New Invoice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'so' ? 'Dakhliga Maanta La Qabtay' : 'Collected Today'}</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{paidCount} {lang === 'so' ? 'biil oo la bixiyay' : 'paid invoices'}</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{lang === 'so' ? 'Lacagta Sugaysa Bixinta' : 'Pending Payment'}</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            ${pendingAmount.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{pendingCount} {lang === 'so' ? 'bukaan sugaya bixin' : 'unpaid tickets'}</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">EVC Plus (Hormuud)</span>
            <Smartphone className="h-4 w-4 text-blue-500" />
          </div>
          <div className={`text-2xl font-black mt-2 ${styles.textPrimary}`}>
            ${invoices.filter(i => i.status === 'paid' && i.paymentMethod === 'evc_plus').reduce((a, b) => a + b.totalAmountUSD, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">*712* Mobile USSD</div>
        </div>

        <div className={`p-5 rounded-2xl border ${styles.cardBg} ${styles.cardBorder} shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Zaad / Sahal / Kaash</span>
            <Receipt className="h-4 w-4 text-indigo-500" />
          </div>
          <div className={`text-2xl font-black mt-2 ${styles.textPrimary}`}>
            ${invoices.filter(i => i.status === 'paid' && i.paymentMethod !== 'evc_plus').reduce((a, b) => a + b.totalAmountUSD, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">*880* / *888* / USD</div>
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
            placeholder={lang === 'so' ? 'Raadi magaca bukaanka, nambarka tikidhka, invoice #, ama telefoon...' : 'Search patient, ticket, invoice, phone...'}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} focus:outline-hidden focus:ring-2 focus:ring-emerald-500`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {lang === 'so' ? 'Dhammaan' : 'All'}
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'pending' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            }`}
          >
            {lang === 'so' ? 'Sugaya Bixin' : 'Pending'}
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'paid' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {lang === 'so' ? 'La Bixiyay' : 'Paid'}
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xs ${styles.cardBg} ${styles.cardBorder}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">{lang === 'so' ? 'Invoice # & Tikidh' : 'Invoice & Ticket'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Bukaanka & Taleefanka' : 'Patient & Phone'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Adeegyada Ku Jira' : 'Billing Items'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Wadarta Lacagta' : 'Total Amount'}</th>
                <th className="py-3.5 px-4">{lang === 'so' ? 'Xaaladda & Qaabka' : 'Status & Method'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'so' ? 'Ficillo' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CreditCard className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-semibold">{lang === 'so' ? 'Lama helin rasiidho/biilal u dhigma' : 'No invoices found'}</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  const methodInfo = PAYMENT_METHOD_NAMES[inv.paymentMethod];
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {inv.invoiceNumber}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-black text-[11px] text-indigo-600 dark:text-indigo-400">
                          {inv.ticketNumber}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className={`font-bold ${styles.textPrimary}`}>{inv.patientName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <PhoneCall className="h-3 w-3" />
                          <span>{inv.patientPhone || 'Telefoon la\'aan'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          {inv.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                              • {lang === 'so' ? it.descriptionSo : it.descriptionEn} (${it.amountUSD.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-base font-black text-slate-900 dark:text-slate-100">
                          ${inv.totalAmountUSD.toFixed(2)}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isPaid ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{lang === 'so' ? 'La Bixiyay' : 'Paid'}</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1 font-mono">
                              {inv.paymentMethod.toUpperCase()} {inv.transactionId && `• ${inv.transactionId}`}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            <span>{lang === 'so' ? 'Sugaya Bixin' : 'Unpaid'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid ? (
                            <button
                              onClick={() => handleStartPayment(inv)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Smartphone className="h-3.5 w-3.5" />
                              <span>{lang === 'so' ? 'Qabo Lacagta (EVC)' : 'Pay Now'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setPrintReceiptInvoice(inv)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>{lang === 'so' ? 'Rasiidh' : 'Receipt'}</span>
                            </button>
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

      {/* Modal 1: Process Payment (EVC Plus, Zaad, Sahal) */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Qabashada Lacagta Bukaanka' : 'Collect Mobile Money Payment'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedInvoiceForPayment.invoiceNumber} • {selectedInvoiceForPayment.patientName}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoiceForPayment(null)} className="p-1.5 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'so' ? 'Lacag Bixintu Way Guuleysatay!' : 'Payment Received Successfully!'}
                </h4>
                <p className="text-xs text-slate-500">{paymentSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block uppercase">
                    {lang === 'so' ? 'Wadarta Lacagta La Qabanayo' : 'Total Amount Due'}
                  </span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    ${selectedInvoiceForPayment.totalAmountUSD.toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'so' ? 'Dooro Qaabka Lacag-Bixinta:' : 'Select Payment Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'evc_plus', name: 'EVC Plus (Hormuud)' },
                      { id: 'zaad', name: 'Zaad (Telesom)' },
                      { id: 'sahal', name: 'Sahal (Golis)' },
                      { id: 'cash', name: 'Kaash / USD Cash' },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setChosenMethod(m.id as PaymentMethod)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                          chosenMethod === m.id
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span>{m.name}</span>
                        {chosenMethod === m.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {chosenMethod !== 'cash' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'so' ? 'Nambarka Mobilka ee Lacagta Laga Jarayo:' : 'Payer Mobile Number:'}
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        placeholder="061 544 8892 ama 063..."
                        className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-mono`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {lang === 'so' 
                        ? 'Bukaanka waxaa taleefankiisa ku dhici doona fariinta xaqiijinta (USSD Push Prompt).' 
                        : 'System will trigger automatic USSD approval prompt.'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForPayment(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border text-slate-600 dark:text-slate-300"
                  >
                    {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingUSSD}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isProcessingUSSD ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{lang === 'so' ? 'USSD La Dirayaa...' : 'Sending USSD...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{lang === 'so' ? 'Xaqiiji Lacag Bixinta' : 'Confirm Payment'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Official Printable Hospital Payment Receipt */}
      {printReceiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-3xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 border border-slate-200 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lang === 'so' ? 'Rasiidhka Rasmiga ah ee Lacag-Qabashada' : 'Official Hospital Receipt'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Daabac' : 'Print'}</span>
                </button>
                <button
                  onClick={() => setPrintReceiptInvoice(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Official Hospital Receipt Slip */}
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1.5 font-black text-lg">
                DH
              </div>
              <h2 className="text-sm font-black tracking-wide uppercase">
                ISBITAALKA DARYEEL QOYS
              </h2>
              <p className="text-[10px] text-slate-600">
                RASIIDHKA LACAG-QABASHADA (OFFICIAL PAYMENT RECEIPT)
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Mogadishu, Somalia • Tell: +252 61 511 2233
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'so' ? 'Rasiidh #:' : 'Receipt #:'}</span>
                <strong className="text-slate-900">{printReceiptInvoice.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'so' ? 'Tikidhka Safka:' : 'Queue Ticket:'}</span>
                <strong className="text-indigo-600">{printReceiptInvoice.ticketNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'so' ? 'Bukaanka:' : 'Patient:'}</span>
                <span className="text-slate-900 font-bold">{printReceiptInvoice.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'so' ? 'Taariikhda:' : 'Date:'}</span>
                <span>{new Date(printReceiptInvoice.paidAt || printReceiptInvoice.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'so' ? 'Habka:' : 'Method:'}</span>
                <span className="uppercase text-emerald-700 font-bold">{printReceiptInvoice.paymentMethod}</span>
              </div>
              {printReceiptInvoice.transactionId && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Tx ID:</span>
                  <span className="font-bold text-slate-700">{printReceiptInvoice.transactionId}</span>
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-[10px] text-slate-500 uppercase">
                    <th className="py-1 text-left">{lang === 'so' ? 'Adeegga' : 'Description'}</th>
                    <th className="py-1 text-right">{lang === 'so' ? 'Qiimaha' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printReceiptInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 text-slate-800">{lang === 'so' ? item.descriptionSo : item.descriptionEn}</td>
                      <td className="py-1.5 text-right font-mono font-bold">${item.amountUSD.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-slate-900 mt-3 pt-2 flex justify-between items-center text-sm font-black">
                <span>{lang === 'so' ? 'WADARTA GUUD (TOTAL):' : 'TOTAL PAID:'}</span>
                <span className="text-base text-emerald-700">${printReceiptInvoice.totalAmountUSD.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer with barcode & cashier */}
            <div className="text-center pt-3 border-t border-slate-200 text-xs">
              <div className="font-mono text-[10px] tracking-widest text-slate-400 mb-1 select-none">
                ||| | |||| || ||| ||||| ||| ||
              </div>
              <div className="text-[10px] text-slate-500">
                {lang === 'so' ? 'Waxaa qabtay Cashier:' : 'Processed by Cashier:'} {printReceiptInvoice.cashierName || 'Fadxiya Cismaan Xirsi'}
              </div>
              <p className="text-[9px] text-slate-400 italic mt-1">
                Waad ku mahadsan tahay doorashada Isbitaalka Daryeel Qoys.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Create New Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Samee Biil / Rasiidh Cusub' : 'Create New Hospital Bill'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Tikidhka Safka:</label>
                  <input
                    type="text"
                    required
                    placeholder="M-14 ama R-01..."
                    value={newTicket}
                    onChange={(e) => setNewTicket(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Magaca Bukaanka:</label>
                  <input
                    type="text"
                    required
                    placeholder="Magaca buuxa..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Telefoonka Bukaanka:</label>
                <input
                  type="tel"
                  placeholder="+252 61 5..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                />
              </div>

              {/* Items List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'so' ? 'Adeegyada Biilka lagu darayo:' : 'Line Items:'}
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
                  {newItemsList.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-800">
                      <span>{it.descriptionSo}</span>
                      <span className="font-bold text-emerald-600">${it.amountUSD.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={lang === 'so' ? 'Adeeg dheeraad ah (tusaale: Dawo, Baaritaan)...' : 'Additional line item...'}
                    value={newLineItemDesc}
                    onChange={(e) => setNewLineItemDesc(e.target.value)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary}`}
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={newLineItemAmount}
                    onChange={(e) => setNewLineItemAmount(Number(e.target.value))}
                    className={`w-20 px-2.5 py-1.5 text-xs rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-900 ${styles.textPrimary} font-bold`}
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToNewInvoice}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    + Ku Dar
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border text-slate-600 dark:text-slate-300"
                >
                  {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                >
                  {lang === 'so' ? 'Keydi Biilka' : 'Save Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
