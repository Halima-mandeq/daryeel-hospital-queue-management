import { BillingInvoice, PaymentMethod } from '../types/clinic';

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0038',
    ticketNumber: 'E-001',
    patientName: 'Nimco Cabdullaahi Maxamed',
    patientPhone: '+252 61 544 8892',
    items: [
      { id: 'item-1', descriptionSo: 'Diiwaangelinta & Baaritaanka Degdegga ah', descriptionEn: 'Emergency Triage & Consultation', category: 'emergency', amountUSD: 5.0 },
      { id: 'item-2', descriptionSo: 'Dhiig Tirka Guud (CBC Test)', descriptionEn: 'Complete Blood Count (CBC)', category: 'laboratory', amountUSD: 5.0 },
      { id: 'item-3', descriptionSo: 'Faleebo Normal Saline 500ml + IV Cannula', descriptionEn: 'Normal Saline IV 500ml & Line', category: 'pharmacy', amountUSD: 4.5 },
    ],
    totalAmountUSD: 14.50,
    paymentMethod: 'evc_plus',
    paymentPhone: '0615448892',
    transactionId: 'EVC-88491024',
    status: 'paid',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    paidAt: new Date(Date.now() - 32 * 60000).toISOString(),
    cashierName: 'Fadxiya Cismaan Xirsi',
    receiptNotes: 'Lacag bixinta waxaa lagu xaqiijiyay EVC Plus.',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0039',
    ticketNumber: 'M-14',
    patientName: 'Xaliimo Nuur Warsame',
    patientPhone: '+252 61 577 8899',
    items: [
      { id: 'item-1', descriptionSo: 'Ballanta Joogtada ah ee Daryeelka Hooyada (ANC Visit)', descriptionEn: 'Maternal Antenatal Checkup', category: 'consultation', amountUSD: 3.0 },
      { id: 'item-2', descriptionSo: 'Ultrasound Scan-ka Uurka (Obstetric USG)', descriptionEn: 'Obstetric Ultrasound Scan', category: 'laboratory', amountUSD: 10.0 },
      { id: 'item-3', descriptionSo: 'Kiniinka Dhiigga & Folic Acid (90 maalmood)', descriptionEn: 'Iron & Folic Acid Supplement', category: 'pharmacy', amountUSD: 4.5 },
    ],
    totalAmountUSD: 17.50,
    paymentMethod: 'zaad',
    paymentPhone: '0634112233',
    transactionId: 'ZAAD-7719203',
    status: 'paid',
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
    paidAt: new Date(Date.now() - 50 * 60000).toISOString(),
    cashierName: 'Fadxiya Cismaan Xirsi',
    receiptNotes: 'Waad ku mahadsan tahay booqashada Isbitaalka.',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-0040',
    ticketNumber: 'P-014',
    patientName: 'Yaxye Maxamed Jaamac (Ilmo)',
    patientPhone: '+252 61 288 3311',
    items: [
      { id: 'item-1', descriptionSo: 'La-tashiga Dhakhtarka Carruurta', descriptionEn: 'Pediatric Specialist Consultation', category: 'consultation', amountUSD: 3.0 },
      { id: 'item-2', descriptionSo: 'Baaritaanka Duumada Degdegga (Malaria RDT)', descriptionEn: 'Malaria Rapid Test', category: 'laboratory', amountUSD: 2.0 },
    ],
    totalAmountUSD: 5.00,
    paymentMethod: 'evc_plus',
    paymentPhone: '0612883311',
    status: 'pending',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  }
];

export const PAYMENT_METHOD_NAMES: Record<PaymentMethod, { nameSo: string; nameEn: string; color: string; prefix: string }> = {
  evc_plus: { nameSo: 'EVC Plus (Hormuud)', nameEn: 'EVC Plus Mobile Money', color: 'emerald', prefix: '*712*' },
  zaad: { nameSo: 'Zaad Service (Telesom)', nameEn: 'Zaad Service', color: 'amber', prefix: '*880*' },
  sahal: { nameSo: 'Sahal (Golis Telecom)', nameEn: 'Sahal Mobile Money', color: 'blue', prefix: '*888*' },
  cash: { nameSo: 'Lacag Kaash ah (USD / Sh.So)', nameEn: 'Cash Payment', color: 'slate', prefix: 'CASH' },
};
