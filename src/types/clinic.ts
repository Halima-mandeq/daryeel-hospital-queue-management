export type TriageLevel = 'emergency' | 'urgent' | 'routine';
export type PatientCategory = 'maternal' | 'child' | 'adult' | 'emergency';
export type PatientStatus = 'waiting' | 'called' | 'in_consultation' | 'completed' | 'referred';
export type ThemePalette = 'sapphire' | 'emerald' | 'warm' | 'dark';

export type UserRole = 'doctor' | 'nurse' | 'admin' | 'receptionist' | 'patient' | 'pharmacist' | 'lab_tech' | 'cashier';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  title: string;
  department: string;
  assignedRoomId?: string; // For doctors
  patientTicket?: string;  // For patients
  phone?: string;
  password?: string;       // Custom password set by Agaasimaha Guud
  specialty?: string;
  roomName?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Vitals {
  temperature: number;      // e.g. 37.2 °C
  bloodPressure: string;    // e.g. "120/80"
  heartRate: number;        // e.g. 84 bpm
  spO2: number;             // Oxygen saturation % e.g. 98%
}

export interface Patient {
  id: string;
  ticketNumber: string;     // e.g. "E-01", "M-14", "P-08", "R-33"
  fullName: string;
  phone: string;
  age: number;
  gender: 'female' | 'male';
  category: PatientCategory;
  pregnancyWeek?: number;
  symptoms: string;
  triageLevel: TriageLevel;
  triageScore: number;      // 1 (Critical) to 3 (Routine)
  vitals: Vitals;
  status: PatientStatus;
  assignedRoomId?: string;
  assignedDoctorName?: string;
  registeredAt: string;     // ISO timestamp
  calledAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  doctorNotes?: string;
  prescriptions?: string[];
  vaccinationFollowUp?: {
    vaccineName: string;
    dueDate: string;
    reminderSent: boolean;
  };
}

export interface DoctorRoom {
  id: string;
  roomName: string;
  doctorName: string;
  title: string;
  specialty: string;
  currentPatientId: string | null;
  isAvailable: boolean;
}

export interface MaternalRecord {
  id: string;
  motherName: string;
  phone: string;
  age: number;
  pregnancyWeeks: number;
  trimester: 1 | 2 | 3;
  nextCheckupDate: string;
  lastHbLevel: string; // e.g. 11.4 g/dL
  riskLevel: 'safe' | 'caution' | 'high_risk';
  childName?: string;
  childAgeMonths?: number;
  nextVaccineDue?: string;
  vaccineDate?: string;
  smsSent: boolean;
}

export type MedicineCategory = 
  | 'maternal' 
  | 'pediatric' 
  | 'antibiotic' 
  | 'analgesic' 
  | 'emergency_iv' 
  | 'vitamin_supplements';

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  form: 'tablets' | 'syrup' | 'injection' | 'drops' | 'iv_fluid' | 'sachet';
  dosage: string;
  stock: number;
  unit: string; // e.g. "xabbo (tablets)", "dhalo (bottles)", "ampoules", "bacaha (sachets)"
  minStockAlert: number;
  batchNo: string;
  expiryDate: string; // YYYY-MM-DD
  storageLocation: string; // e.g. "Khaanada A-1", "Qaboojiyaha (Cold Chain 2-8°C)"
  priceUSD: number;
  requiresPrescription: boolean;
}

export interface PrescribedMedicine {
  medicineId?: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructionsSo: string;
  instructionsEn: string;
  quantity: number;
  dispensed: boolean;
}

export interface PrescriptionOrder {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'female' | 'male';
  patientCategory: PatientCategory;
  doctorName: string;
  doctorDepartment: string;
  prescribedAt: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  medications: PrescribedMedicine[];
  dispensedAt?: string;
  dispensedBy?: string;
  pharmacistNotes?: string;
}

// ----------------------------------------------------
// Laboratory & Diagnostics Module Types
// ----------------------------------------------------
export type LabTestCategory = 'hematology' | 'parasitology' | 'biochemistry' | 'urinalysis' | 'microbiology' | 'ultrasound';

export interface LabTestCatalogItem {
  id: string;
  code: string;
  nameSo: string;
  nameEn: string;
  category: LabTestCategory;
  sampleType: 'Blood (Dhiig)' | 'Urine (Kaadi)' | 'Stool (Saxaro)' | 'Swab' | 'Imaging (Scan)';
  standardTurnaroundMinutes: number;
  costUSD: number;
  normalRange: string;
  unit?: string;
}

export interface LabTestOrder {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'female' | 'male';
  testCode: string;
  testNameSo: string;
  testNameEn: string;
  category: LabTestCategory;
  sampleType: string;
  doctorName: string;
  doctorRoom: string;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'ordered' | 'sample_collected' | 'analyzing' | 'completed' | 'cancelled';
  orderedAt: string;
  completedAt?: string;
  resultValue?: string;
  normalRange?: string;
  isAbnormal?: boolean;
  notes?: string;
  labTechnicianName?: string;
  costUSD: number;
}

// ----------------------------------------------------
// Cashier, Billing & Mobile Money (EVC / Zaad) Types
// ----------------------------------------------------
export type PaymentMethod = 'evc_plus' | 'zaad' | 'sahal' | 'cash';

export interface BillingLineItem {
  id: string;
  descriptionSo: string;
  descriptionEn: string;
  category: 'consultation' | 'laboratory' | 'pharmacy' | 'procedure' | 'emergency';
  amountUSD: number;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  ticketNumber: string;
  patientName: string;
  patientPhone: string;
  items: BillingLineItem[];
  totalAmountUSD: number;
  paymentMethod: PaymentMethod;
  paymentPhone?: string; // e.g. "061 544 8892"
  transactionId?: string; // e.g. "EVC-94827104"
  status: 'pending' | 'paid';
  createdAt: string;
  paidAt?: string;
  cashierName?: string;
  receiptNotes?: string;
}

// ----------------------------------------------------
// Electronic Medical Record (EHR / History) Types
// ----------------------------------------------------
export interface PatientHistoryVisit {
  id: string;
  date: string;
  doctorName: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentNotes: string;
  vitalsSummary: string;
  prescriptions: string[];
  labTestsConducted?: string[];
}

export interface PatientMedicalRecord {
  patientPhoneOrTicket: string;
  fullName: string;
  dateOfBirthOrAge: string;
  gender: 'female' | 'male';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Lama Xaqiijin';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  visits: PatientHistoryVisit[];
}

// ----------------------------------------------------
// Official Sick Leave & Birth Certificate Types
// ----------------------------------------------------
export interface SickLeaveCertificate {
  certificateNumber: string;
  patientName: string;
  age: number;
  gender: 'female' | 'male';
  diagnosis: string;
  daysGranted: number;
  startDate: string;
  endDate: string;
  workplaceOrSchool: string;
  doctorName: string;
  doctorTitle: string;
  issuedAt: string;
  recommendations: string;
}


