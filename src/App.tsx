import { useState, useEffect } from 'react';
import { 
  Patient, 
  DoctorRoom, 
  MaternalRecord, 
  ThemePalette, 
  UserProfile, 
  PharmacyItem, 
  PrescriptionOrder,
  LabTestOrder,
  BillingInvoice,
  PaymentMethod
} from './types/clinic';
import { 
  INITIAL_PATIENTS, 
  INITIAL_ROOMS, 
  INITIAL_MATERNAL_RECORDS 
} from './data/mockClinicData';
import { INITIAL_PHARMACY_ITEMS, INITIAL_PRESCRIPTIONS } from './data/mockPharmacy';
import { INITIAL_LAB_ORDERS } from './data/mockLabData';
import { INITIAL_INVOICES } from './data/mockBillingData';
import { DEMO_USERS } from './data/mockUsers';
import { Header, ActiveTab } from './components/Header';
import { HospitalWebsite } from './components/HospitalWebsite';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ReceptionDashboard } from './components/dashboards/ReceptionDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { PharmacyDashboard } from './components/dashboards/PharmacyDashboard';
import { LaboratoryDashboard } from './components/dashboards/LaboratoryDashboard';
import { BillingCashierDashboard } from './components/dashboards/BillingCashierDashboard';
import { TriageIntakeView } from './components/TriageIntakeView';
import { WaitingRoomDisplay } from './components/WaitingRoomDisplay';
import { DoctorConsoleView } from './components/DoctorConsoleView';
import { MaternalVaccineView } from './components/MaternalVaccineView';
import { PatientTicketLookup } from './components/PatientTicketLookup';
import { ClinicAnalyticsView } from './components/ClinicAnalyticsView';
import { EntranceKioskScanner } from './components/EntranceKioskScanner';
import { getThemeStyles } from './utils/theme';
import { 
  HeartPulse, 
  MapPin, 
  ShieldCheck, 
  RotateCcw,
  Globe,
  LogIn,
  Users,
  Stethoscope
} from 'lucide-react';

const STORAGE_KEY_PATIENTS = 'daryeelqoys_patients_v1';
const STORAGE_KEY_ROOMS = 'daryeelqoys_rooms_v1';
const STORAGE_KEY_MATERNAL = 'daryeelqoys_maternal_v1';
const STORAGE_KEY_THEME = 'daryeelqoys_theme_v1';
const STORAGE_KEY_USER = 'daryeelqoys_user_v1';
const STORAGE_KEY_USERS = 'daryeelqoys_users_v2';
const STORAGE_KEY_PHARMACY = 'daryeelqoys_pharmacy_items_v1';
const STORAGE_KEY_PRESCRIPTIONS = 'daryeelqoys_prescriptions_v1';
const STORAGE_KEY_LAB_ORDERS = 'daryeelqoys_lab_orders_v1';
const STORAGE_KEY_INVOICES = 'daryeelqoys_invoices_v1';

export default function App() {
  const [lang, setLang] = useState<'so' | 'en'>('so');
  // Default to public website view so visitors see the hospital promotion first
  const [activeTab, setActiveTab] = useState<ActiveTab>('website');

  // Entrance Scanner modal state & ticket param from QR scan URL
  const [isEntranceScannerOpen, setIsEntranceScannerOpen] = useState(false);
  const [scannedTicketParam, setScannedTicketParam] = useState<string>('');

  // Handle URL query parameters (e.g. scanning QR with mobile phone camera loads ?ticket=M-008 or ?scan=true)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const ticketParam = params.get('ticket');
        const scanParam = params.get('scan');

        if (ticketParam) {
          setScannedTicketParam(ticketParam.trim().toUpperCase());
          setIsEntranceScannerOpen(true);
        } else if (scanParam === 'true' || scanParam === '1') {
          setIsEntranceScannerOpen(true);
        }
      }
    } catch {}
  }, []);

  // Currently logged in staff or patient (null by default so all visitors see the public website)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Theme Palette: Defaults to 'sapphire'
  const [theme, setTheme] = useState<ThemePalette>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemePalette;
      if (saved && ['sapphire', 'emerald', 'warm', 'dark'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'sapphire';
  });

  // Persistent Clinical State
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PATIENTS;
  });

  const [rooms, setRooms] = useState<DoctorRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ROOMS;
  });

  const [maternalRecords, setMaternalRecords] = useState<MaternalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERNAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MATERNAL_RECORDS;
  });

  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHARMACY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PHARMACY_ITEMS;
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRESCRIPTIONS;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_USERS;
  });

  const [labOrders, setLabOrders] = useState<LabTestOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAB_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LAB_ORDERS;
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INVOICES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch {}
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATERNAL, JSON.stringify(maternalRecords));
    } catch {}
  }, [maternalRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHARMACY, JSON.stringify(pharmacyItems));
    } catch {}
  }, [pharmacyItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(prescriptions));
    } catch {}
  }, [prescriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAB_ORDERS, JSON.stringify(labOrders));
    } catch {}
  }, [labOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  // Laboratory & Billing Handlers
  const handleUpdateLabOrderStatus = (
    orderId: string, 
    status: LabTestOrder['status'], 
    resultValue?: string, 
    isAbnormal?: boolean, 
    notes?: string
  ) => {
    setLabOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          resultValue: resultValue !== undefined ? resultValue : o.resultValue,
          isAbnormal: isAbnormal !== undefined ? isAbnormal : o.isAbnormal,
          notes: notes !== undefined ? notes : o.notes,
          completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt,
        };
      }
      return o;
    }));
  };

  const handleAddLabOrder = (newOrder: LabTestOrder) => {
    setLabOrders(prev => [newOrder, ...prev]);
  };

  const handleMarkInvoicePaid = (invoiceId: string, method: PaymentMethod, phone?: string, transactionId?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'paid',
          paymentMethod: method,
          paymentPhone: phone,
          transactionId: transactionId || `TX-${Date.now()}`,
          paidAt: new Date().toISOString(),
        };
      }
      return inv;
    }));
  };

  const handleCreateInvoice = (newInvoice: BillingInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('website');
  };

  // Handler: Register New Patient via Triage Desk or Reception
  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  // Handler: Doctor Calls Next Highest Priority Patient
  const handleCallNextPatient = (roomId: string) => {
    const waitingPatients = patients
      .filter(p => p.status === 'waiting')
      .sort((a, b) => {
        if (a.triageScore !== b.triageScore) {
          return a.triageScore - b.triageScore;
        }
        return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
      });

    if (waitingPatients.length === 0) return;

    const nextPatient = waitingPatients[0];
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    setPatients(prev =>
      prev.map(p => {
        if (p.id === nextPatient.id) {
          return {
            ...p,
            status: 'in_consultation',
            assignedDoctorName: targetRoom.doctorName,
            assignedRoomId: targetRoom.id,
          };
        }
        return p;
      })
    );

    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            currentPatientId: nextPatient.id,
            isAvailable: false,
          };
        }
        return r;
      })
    );
  };

  // Handler: Complete consultation & save notes & auto forward prescription to pharmacy
  const handleCompletePatient = (
    patientId: string,
    doctorNotes: string,
    prescriptionsList: string[]
  ) => {
    const patientObj = patients.find(p => p.id === patientId);
    const roomObj = rooms.find(r => r.currentPatientId === patientId);

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'completed',
            completedAt: new Date().toISOString(),
            doctorNotes: doctorNotes || p.doctorNotes,
            prescriptions: prescriptionsList.length > 0 ? prescriptionsList : p.prescriptions,
          };
        }
        return p;
      })
    );

    setRooms(prev =>
      prev.map(r => {
        if (r.currentPatientId === patientId) {
          return {
            ...r,
            currentPatientId: null,
            isAvailable: true,
          };
        }
        return r;
      })
    );

    // If doctor prescribed medications, create electronic prescription order for the pharmacy
    if (prescriptionsList.length > 0 && patientObj) {
      const newRx: PrescriptionOrder = {
        id: `rx-${Date.now()}`,
        ticketNumber: patientObj.ticketNumber,
        patientId: patientObj.id,
        patientName: patientObj.fullName,
        patientAge: patientObj.age,
        patientGender: patientObj.gender,
        patientCategory: patientObj.category,
        doctorName: roomObj?.doctorName || 'Dhakhtarka Xarunta',
        doctorDepartment: roomObj?.roomName || 'Consultation Room',
        prescribedAt: new Date().toISOString(),
        status: 'pending',
        medications: prescriptionsList.map(medStr => ({
          medicineName: medStr,
          dosage: 'Sida dhakhtarku qoray',
          duration: '5-7 maalmood',
          instructionsSo: 'Qaado cuntada kadib subaxdii iyo fiidkii oo koob biyo ah raaci.',
          instructionsEn: 'Take as directed by physician after meals with water.',
          quantity: 1,
          dispensed: false,
        })),
      };
      setPrescriptions(prev => [newRx, ...prev]);
    }
  };

  // Pharmacy Handlers
  const handleDispensePrescription = (prescriptionId: string, pharmacistName: string, notes?: string) => {
    const rx = prescriptions.find(p => p.id === prescriptionId);
    if (!rx) return;

    // Deduct stock for each medicine in the prescription
    setPharmacyItems(prevItems => {
      let updated = [...prevItems];
      rx.medications.forEach(med => {
        updated = updated.map(item => {
          if (
            (med.medicineId && item.id === med.medicineId) ||
            item.name.toLowerCase().includes(med.medicineName.toLowerCase()) ||
            med.medicineName.toLowerCase().includes(item.name.toLowerCase())
          ) {
            return {
              ...item,
              stock: Math.max(0, item.stock - (med.quantity || 1)),
            };
          }
          return item;
        });
      });
      return updated;
    });

    // Mark prescription as dispensed
    setPrescriptions(prev =>
      prev.map(p => {
        if (p.id === prescriptionId) {
          return {
            ...p,
            status: 'dispensed',
            dispensedAt: new Date().toISOString(),
            dispensedBy: pharmacistName,
            pharmacistNotes: notes || p.pharmacistNotes,
            medications: p.medications.map(m => ({ ...m, dispensed: true })),
          };
        }
        return p;
      })
    );
  };

  const handleAddPharmacyItem = (newItem: PharmacyItem) => {
    setPharmacyItems(prev => [newItem, ...prev]);
  };

  const handleUpdatePharmacyStock = (itemId: string, newStock: number) => {
    setPharmacyItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, stock: Math.max(0, newStock) } : item))
    );
  };

  const handleDeletePharmacyItem = (itemId: string) => {
    setPharmacyItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Handlers for Doctor Management (Agaasimaha Guud)
  const handleAddDoctor = (doctorData: {
    name: string;
    email: string;
    password: string;
    specialty: string;
    department: string;
    phone: string;
    avatar: string;
    roomOption: 'new' | 'existing';
    existingRoomId?: string;
    newRoomName?: string;
  }) => {
    const newDoctorId = `user-doc-${Date.now()}`;
    let assignedRoomId = doctorData.existingRoomId;
    let roomName = '';

    if (doctorData.roomOption === 'new') {
      const newRoomId = `room-${Date.now()}`;
      const newRoomNameStr = doctorData.newRoomName || `Qolka ${rooms.length + 1} (Room ${rooms.length + 1})`;
      const newRoomObj: DoctorRoom = {
        id: newRoomId,
        roomName: newRoomNameStr,
        doctorName: doctorData.name,
        title: doctorData.specialty,
        specialty: doctorData.specialty,
        currentPatientId: null,
        isAvailable: true,
      };
      setRooms(prev => [...prev, newRoomObj]);
      assignedRoomId = newRoomId;
      roomName = newRoomNameStr;
    } else if (doctorData.existingRoomId) {
      const existing = rooms.find(r => r.id === doctorData.existingRoomId);
      if (existing) {
        roomName = existing.roomName;
        setRooms(prev =>
          prev.map(r =>
            r.id === doctorData.existingRoomId
              ? { ...r, doctorName: doctorData.name, specialty: doctorData.specialty }
              : r
          )
        );
      }
    }

    const newDocUser: UserProfile = {
      id: newDoctorId,
      name: doctorData.name,
      role: 'doctor',
      email: doctorData.email,
      password: doctorData.password,
      avatar: doctorData.avatar,
      title: doctorData.specialty,
      department: doctorData.department,
      specialty: doctorData.specialty,
      assignedRoomId,
      roomName,
      phone: doctorData.phone,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Agaasimaha Guud',
    };

    setUsers(prev => [newDocUser, ...prev]);
  };

  const handleUpdateDoctorPassword = (doctorId: string, newPass: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === doctorId ? { ...u, password: newPass } : u))
    );
  };

  const handleDeleteDoctor = (doctorId: string) => {
    setUsers(prev => prev.filter(u => u.id !== doctorId));
  };

  // Handler: Maternal Record Add
  const handleAddMaternalRecord = (newRec: MaternalRecord) => {
    setMaternalRecords(prev => [newRec, ...prev]);
  };

  // Handler: Maternal SMS reminder toggle
  const handleSendSms = (recordId: string) => {
    setMaternalRecords(prev =>
      prev.map(r => (r.id === recordId ? { ...r, smsSent: true } : r))
    );
  };

  // Route Guard: Unauthenticated visitors must login to access internal desks, and logged-in users only access their role features
  useEffect(() => {
    // If not logged in, protected tabs redirect to Login (visitors cannot access patient queue or staff desks)
    if (!currentUser) {
      if (['dashboard', 'triage', 'doctor', 'mch', 'analytics', 'patient', 'pharmacy'].includes(activeTab)) {
        setActiveTab('login');
      }
      return;
    }

    // Role check: enforce appropriate views
    const role = currentUser.role;
    if (role === 'patient') {
      // Patients cannot view internal clinical queue, pharmacy, or staff desks
      if (['triage', 'doctor', 'mch', 'analytics', 'patient', 'pharmacy'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'pharmacist') {
      // Pharmacist can view their dashboard and pharmacy desk
      if (['triage', 'doctor', 'mch', 'analytics', 'patient'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'doctor') {
      if (['triage', 'mch', 'patient', 'analytics'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'nurse') {
      // Nurse (Kalkaaliye) can view triage, mch, and queue & tickets (patient tab)
      if (['doctor', 'analytics', 'pharmacy'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'receptionist') {
      // Receptionist (Diiwaangalin) can view registration and queue & tickets (patient tab)
      if (['doctor', 'triage', 'mch', 'analytics', 'pharmacy'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser, activeTab]);

  // Handler: Directly trigger turn notification for a specific patient (for live test & sync)
  const handleTriggerPatientCall = (patientId: string, roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId) || rooms[0];
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'in_consultation',
            assignedDoctorName: targetRoom.doctorName,
            assignedRoomId: targetRoom.id,
          };
        }
        return p;
      })
    );

    setRooms(prev =>
      prev.map(r => {
        if (r.id === targetRoom.id) {
          return {
            ...r,
            currentPatientId: patientId,
            isAvailable: false,
          };
        }
        return r;
      })
    );
  };

  // Handler: Reset patient back to waiting queue
  const handleResetPatientStatus = (patientId: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'waiting',
          };
        }
        return p;
      })
    );

    setRooms(prev =>
      prev.map(r => {
        if (r.currentPatientId === patientId) {
          return {
            ...r,
            currentPatientId: null,
            isAvailable: true,
          };
        }
        return r;
      })
    );
  };

  // Handler: When patient books appointment on public website, register them & redirect to their dashboard
  const handlePatientAppointmentBooked = (newPatient: Patient, userProfile: UserProfile) => {
    setPatients(prev => [newPatient, ...prev]);
    setCurrentUser(userProfile);
    setActiveTab('dashboard');
  };

  // Reset to default clinic demo data
  const handleResetDemoData = () => {
    if (window.confirm(lang === 'so' ? 'Ma hubtaa inaad rabto dib u dejinta xogta isbitaalka?' : 'Reset clinic demo data to initial state?')) {
      setPatients(INITIAL_PATIENTS);
      setRooms(INITIAL_ROOMS);
      setMaternalRecords(INITIAL_MATERNAL_RECORDS);
      setPharmacyItems(INITIAL_PHARMACY_ITEMS);
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      setCurrentUser(DEMO_USERS[0]);
      localStorage.removeItem(STORAGE_KEY_PATIENTS);
      localStorage.removeItem(STORAGE_KEY_ROOMS);
      localStorage.removeItem(STORAGE_KEY_MATERNAL);
      localStorage.removeItem(STORAGE_KEY_PHARMACY);
      localStorage.removeItem(STORAGE_KEY_PRESCRIPTIONS);
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  };

  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const emergencyCount = patients.filter(
    p => p.status === 'waiting' && p.triageLevel === 'emergency'
  ).length;

  const styles = getThemeStyles(theme);

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white font-sans transition-colors duration-200 ${styles.bgApp}`}>
      {/* Global Header with Theme, Language, Profile & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        waitingCount={waitingCount}
        emergencyCount={emergencyCount}
        theme={theme}
        setTheme={setTheme}
        onOpenScanner={() => {
          setScannedTicketParam('');
          setIsEntranceScannerOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. PUBLIC HOSPITAL WEBSITE (Seen by visitors) */}
        {activeTab === 'website' && (
          <HospitalWebsite
            onOpenLogin={() => setActiveTab('login')}
            onOpenLiveQueue={() => setActiveTab('display')}
            onCheckTicket={() => setActiveTab('patient')}
            onOpenScanner={() => {
              setScannedTicketParam('');
              setIsEntranceScannerOpen(true);
            }}
            onBookAppointment={handlePatientAppointmentBooked}
            patients={patients}
            rooms={rooms}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 2. PORTAL LOGIN PAGE */}
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToWebsite={() => setActiveTab('website')}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 3. ROLE-BASED TAILORED DASHBOARDS */}
        {activeTab === 'dashboard' && (
          <>
            {!currentUser ? (
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onBackToWebsite={() => setActiveTab('website')}
                lang={lang}
                theme={theme}
              />
            ) : currentUser.role === 'doctor' ? (
              <DoctorDashboard
                currentUser={currentUser}
                patients={patients}
                rooms={rooms}
                onCallNextPatient={handleCallNextPatient}
                onCompletePatient={handleCompletePatient}
                lang={lang}
                theme={theme}
              />
            ) : currentUser.role === 'nurse' ? (
              <NurseDashboard
                currentUser={currentUser}
                patients={patients}
                onAddPatient={handleAddPatient}
                lang={lang}
                theme={theme}
              />
            ) : currentUser.role === 'admin' ? (
              <AdminDashboard
                currentUser={currentUser}
                patients={patients}
                rooms={rooms}
                users={users}
                onAddDoctor={handleAddDoctor}
                onUpdateDoctorPassword={handleUpdateDoctorPassword}
                onDeleteDoctor={handleDeleteDoctor}
                lang={lang}
                theme={theme}
              />
            ) : currentUser.role === 'receptionist' ? (
              <ReceptionDashboard
                currentUser={currentUser}
                patients={patients}
                rooms={rooms}
                onAddPatient={handleAddPatient}
                lang={lang}
                theme={theme}
              />
            ) : currentUser.role === 'pharmacist' ? (
              <PharmacyDashboard
                currentUser={currentUser}
                pharmacyItems={pharmacyItems}
                prescriptions={prescriptions}
                onDispensePrescription={handleDispensePrescription}
                onAddPharmacyItem={handleAddPharmacyItem}
                onUpdateStock={handleUpdatePharmacyStock}
                onDeletePharmacyItem={handleDeletePharmacyItem}
                lang={lang}
                theme={theme}
              />
            ) : (
              <PatientDashboard
                currentUser={currentUser}
                patients={patients}
                rooms={rooms}
                onTriggerCall={handleTriggerPatientCall}
                onResetPatientStatus={handleResetPatientStatus}
                onBackToWebsite={() => setActiveTab('website')}
                lang={lang}
                theme={theme}
              />
            )}
          </>
        )}

        {/* 4. TRIAGE INTAKE DESK */}
        {activeTab === 'triage' && (
          <TriageIntakeView
            patients={patients}
            onAddPatient={handleAddPatient}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 5. WAITING ROOM TV DISPLAY */}
        {activeTab === 'display' && (
          <WaitingRoomDisplay
            patients={patients}
            rooms={rooms}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 6. DOCTOR CONSOLE */}
        {activeTab === 'doctor' && (
          <DoctorConsoleView
            rooms={rooms}
            patients={patients}
            onCallNextPatient={handleCallNextPatient}
            onCompletePatient={handleCompletePatient}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 7. MCH & MATERNAL VACCINE RECORDS */}
        {activeTab === 'mch' && (
          <MaternalVaccineView
            records={maternalRecords}
            onAddRecord={handleAddMaternalRecord}
            onSendSms={handleSendSms}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 8. PATIENT TICKET LOOKUP */}
        {activeTab === 'patient' && (
          <PatientTicketLookup
            patients={patients}
            rooms={rooms}
            lang={lang}
            theme={theme}
            onOpenLiveTv={() => setActiveTab('display')}
            onOpenScanner={() => {
              setScannedTicketParam('');
              setIsEntranceScannerOpen(true);
            }}
            initialTicketQuery={scannedTicketParam}
          />
        )}

        {/* 9. CLINICAL ANALYTICS & EXPORT (PDF & CSV) */}
        {activeTab === 'analytics' && (
          <ClinicAnalyticsView
            patients={patients}
            rooms={rooms}
            maternalRecords={maternalRecords}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 10. CENTRAL PHARMACY & DISPENSING DESK */}
        {activeTab === 'pharmacy' && (
          <PharmacyDashboard
            currentUser={currentUser || DEMO_USERS.find(u => u.role === 'pharmacist')!}
            pharmacyItems={pharmacyItems}
            prescriptions={prescriptions}
            onDispensePrescription={handleDispensePrescription}
            onAddPharmacyItem={handleAddPharmacyItem}
            onUpdateStock={handleUpdatePharmacyStock}
            onDeletePharmacyItem={handleDeletePharmacyItem}
            lang={lang}
            theme={theme}
          />
        )}
      </main>

      {/* Entrance Kiosk QR Scanner Station Modal */}
      {isEntranceScannerOpen && (
        <EntranceKioskScanner
          patients={patients}
          rooms={rooms}
          initialTicketQuery={scannedTicketParam}
          onClose={() => {
            setIsEntranceScannerOpen(false);
            setScannedTicketParam('');
          }}
          onSelectPatient={(p) => {
            setScannedTicketParam(p.ticketNumber);
            setIsEntranceScannerOpen(false);
            setActiveTab('patient');
          }}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Professional Clinical Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 text-xs transition-colors duration-200 ${
        styles.isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${styles.accentBg}`}>
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-bold font-display ${styles.textPrimary}`}>
                DaryeelQoys Maternal & Family Clinic
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3 w-3 text-rose-500" />
                <span>Degmada Hodan, Wadada Maka Al-Mukarama, Muqdisho</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>{lang === 'so' ? 'Triage Caafimaad oo Rasmiga ah' : 'Verified Clinical Triage Standard'}</span>
            </div>

            <button
              onClick={() => setActiveTab('website')}
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                styles.isDark ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="h-3 w-3" />
              <span>{lang === 'so' ? 'Bogga Hore' : 'Website'}</span>
            </button>

            <button
              onClick={handleResetDemoData}
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                styles.isDark ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
              title="Reset Demo Data"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{lang === 'so' ? 'Dib u deji Xogta' : 'Reset Demo'}</span>
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} DaryeelQoys Hospital System. {lang === 'so' ? 'Dhammaan xuquuqdu waa dhowran tahay.' : 'All rights reserved.'}
        </div>
      </footer>
    </div>
  );
}
