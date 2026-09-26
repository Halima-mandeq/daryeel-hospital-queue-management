import { useState } from 'react';
import { 
  HeartPulse, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Users, 
  Stethoscope, 
  Baby, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Activity, 
  Ambulance, 
  LogIn, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Building2,
  AlertTriangle,
  Phone,
  Tv,
  Camera,
  QrCode
} from 'lucide-react';
import { CLINIC_IMAGES } from '../data/clinicMedia';
import { Patient, DoctorRoom, ThemePalette, UserProfile, PatientCategory } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';
import { TicketQRCode } from './TicketQRCode';

interface HospitalWebsiteProps {
  onOpenLogin: () => void;
  onOpenLiveQueue: () => void;
  onCheckTicket?: () => void;
  onOpenScanner?: () => void;
  onBookAppointment: (newPatient: Patient, userProfile: UserProfile) => void;
  patients: Patient[];
  rooms: DoctorRoom[];
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export function HospitalWebsite({
  onOpenLogin,
  onOpenLiveQueue,
  onCheckTicket,
  onOpenScanner,
  onBookAppointment,
  patients,
  rooms,
  lang,
  theme,
}: HospitalWebsiteProps) {
  const styles = getThemeStyles(theme);

  // Appointment Modal State
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [generatedInfo, setGeneratedInfo] = useState<{
    patient: Patient;
    profile: UserProfile;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'maternity',
    date: '',
    notes: '',
  });

  const waitingCount = patients.filter((p) => p.status === 'waiting').length;
  const emergencyCount = patients.filter(
    (p) => p.status === 'waiting' && p.triageLevel === 'emergency'
  ).length;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    // Determine category, prefix and clinical room
    let category: PatientCategory = 'maternal';
    let prefix = 'M';
    let assignedRoomId = 'room-1';
    let assignedDoctorName = 'Dr. Maryan Xasan Faarax';

    if (formData.department === 'pediatrics') {
      category = 'child';
      prefix = 'P';
      assignedRoomId = 'room-2';
      assignedDoctorName = 'Dr. Cabdiraxmaan Guuleed';
    } else if (formData.department === 'emergency') {
      category = 'emergency';
      prefix = 'E';
      assignedRoomId = 'room-3';
      assignedDoctorName = 'Dr. Sahra Cumar Cali';
    } else if (formData.department === 'ultrasound') {
      category = 'maternal';
      prefix = 'U';
      assignedRoomId = 'room-1';
      assignedDoctorName = 'Dr. Maryan Xasan Faarax';
    } else if (formData.department === 'general') {
      category = 'adult';
      prefix = 'G';
      assignedRoomId = 'room-3';
      assignedDoctorName = 'Dr. Sahra Cumar Cali';
    }

    // Generate ticket number
    const existingCount = patients.filter(p => p.ticketNumber.startsWith(prefix)).length;
    const ticketSeq = (existingCount + 1).toString().padStart(2, '0');
    const generatedTicket = `${prefix}-${ticketSeq}`;

    const newPatientId = `patient-${Date.now()}`;
    const newPatient: Patient = {
      id: newPatientId,
      ticketNumber: generatedTicket,
      fullName: formData.name.trim(),
      phone: formData.phone.trim(),
      age: category === 'child' ? 3 : 27,
      gender: 'female',
      category: category,
      pregnancyWeek: category === 'maternal' ? 28 : undefined,
      symptoms: formData.notes.trim() || (
        formData.department === 'maternity' ? 'Ballan Baaritaan Uur (ANC) & Ultrasound' :
        formData.department === 'pediatrics' ? 'Baaritaanka Caafimaadka Ilmaha & Tallaal' :
        formData.department === 'emergency' ? 'Gurmad Degdeg ah' :
        formData.department === 'ultrasound' ? 'Baaritaanka Ultrasound & Scan' :
        'Baaritaan Guud'
      ),
      triageLevel: category === 'emergency' ? 'emergency' : 'routine',
      triageScore: category === 'emergency' ? 1 : 3,
      vitals: {
        temperature: 36.8,
        bloodPressure: '118/78',
        heartRate: 76,
        spO2: 98,
      },
      status: 'waiting',
      assignedRoomId,
      assignedDoctorName,
      registeredAt: new Date().toISOString(),
      estimatedWaitMinutes: category === 'emergency' ? 5 : 15,
    };

    const newProfile: UserProfile = {
      id: `user-${newPatientId}`,
      name: formData.name.trim(),
      role: 'patient',
      email: `${formData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '.')}@patient.daryeelqoys.so`,
      avatar: CLINIC_IMAGES.doctors.patientMom,
      title: category === 'maternal'
        ? (lang === 'so' ? 'Bukaan - Qeybta Hooyada & Dhalmada' : 'Maternal ANC Patient')
        : category === 'child'
        ? (lang === 'so' ? 'Waali / Qoyska Ilmaha (Pediatrics)' : 'Pediatric Guardian')
        : (lang === 'so' ? 'Bukaan - Qeybta Guud' : 'Outpatient'),
      department: lang === 'so' ? 'Bukaanka Xarunta (Patient Portal)' : 'Hospital Patient Portal',
      patientTicket: generatedTicket,
      phone: formData.phone.trim(),
    };

    const bundle = { patient: newPatient, profile: newProfile };
    setGeneratedInfo(bundle);
    setAppointmentSuccess(true);

    // After 2.2 seconds, automatically transition the patient to their dashboard!
    setTimeout(() => {
      setAppointmentSuccess(false);
      setAppointmentModalOpen(false);
      onBookAppointment(newPatient, newProfile);
    }, 2200);
  };

  const services = [
    {
      id: 'maternity',
      titleSo: 'Qeybta Hooyada & Dhalmada (ANC/PNC)',
      titleEn: 'Maternal & Obstetrics (ANC/PNC)',
      descSo: 'Daryeelka qaaliga ah ee hooyada uurka leh, baaritaanka 4D Ultrasound, dhalmada badqabka leh, iyo daryeelka kadib dhalmada 24/7.',
      descEn: 'Comprehensive prenatal checkups, high-definition 4D fetal ultrasound, sterile delivery suites, and post-partum neonatal support.',
      img: CLINIC_IMAGES.maternalCare,
      badgeSo: 'Qeybta 1-aad ee Xarunta',
      badgeEn: 'Center of Excellence',
      icon: Baby,
    },
    {
      id: 'pediatrics',
      titleSo: 'Qeybta Dhallaanka & Tallaalka',
      titleEn: 'Pediatric Care & Immunization',
      descSo: 'Tallaallada carruurta ee jadwalsan (BCG, Polio, Pentavalent), la socodka miisaanka iyo nafaqada, iyo daaweynta cudurada carruurta.',
      descEn: 'Full schedule pediatric immunization, child nutrition monitoring, neonatal care, and prompt treatment of childhood illnesses.',
      img: CLINIC_IMAGES.childVaccine,
      badgeSo: 'Tallaal Bilaash ah',
      badgeEn: 'Free Routine Vaccines',
      icon: HeartPulse,
    },
    {
      id: 'emergency',
      titleSo: 'Gurmadka Degdegga ah (Trauma & ER)',
      titleEn: 'Emergency & Trauma Center (24/7)',
      descSo: 'Qolalka gurmadka degdegga ah ee casriga ah oo leh triage degdeg ah (< 2 min), oksijiin toos ah, iyo gaadiidka gurmadka (Ambulance).',
      descEn: 'State-of-the-art emergency trauma unit with immediate automated triage (< 2 min), piped central oxygen, and dedicated dispatch ambulances.',
      img: CLINIC_IMAGES.emergencyTrauma,
      badgeSo: '24 Saac Furan',
      badgeEn: 'Open 24/7 Live',
      icon: Ambulance,
    },
    {
      id: 'surgery',
      titleSo: 'Qalliimada Guud & Dhalmada Qalliinka',
      titleEn: 'Modern Surgical Theatres (C-Section)',
      descSo: 'Qolal qalliin oo nadiif ah (Laminar Air Flow) oo loogu talagalay qalliinka dhalmada degdegga ah (C-section) iyo qalliimada guud.',
      descEn: 'Ultra-sterile positive-pressure surgical theaters equipped for emergent cesarean deliveries and general procedures.',
      img: CLINIC_IMAGES.operatingRoom,
      badgeSo: 'Qalab Casri ah',
      badgeEn: 'Ultra-Sterile Suites',
      icon: Activity,
    },
    {
      id: 'diagnostics',
      titleSo: 'Shaybaarka Sare & Ultrasound',
      titleEn: 'Diagnostic Ultrasound & Clinical Lab',
      descSo: 'Shaybaar kombuyuutareysan oo bixiya natiijooyinka dhiigga 15 daqiiqo gudahood (CBC, Hb, Malaria, Blood Sugar) iyo Ultrasound 4D ah.',
      descEn: 'Fully automated diagnostic lab offering 15-minute hematology panels (CBC, Hb, infectious disease markers) and 4D sonography.',
      img: CLINIC_IMAGES.ultrasound,
      badgeSo: '15 Daqiiqo Natiijo',
      badgeEn: '15-Min Rapid Results',
      icon: Stethoscope,
    },
    {
      id: 'ward',
      titleSo: 'Qolalka Jiifka ee Raaxada leh (Private Wards)',
      titleEn: 'Maternal Recovery Suites & Inpatient',
      descSo: 'Qolal jiif oo deggen, nadiif ah, kuna habboon nasashada hooyada iyo dhallaanka cusub iyadoo ay weheliyaan kalkaaliyeyaal joogto ah.',
      descEn: 'Serene, climate-controlled recovery suites designed for the comfort, dignity, and calm rest of new mothers and their infants.',
      img: CLINIC_IMAGES.interiorCorridor,
      badgeSo: 'Daryeel Qoys',
      badgeEn: 'Family Comfort',
      icon: Building2,
    },
  ];

  const doctorsList = [
    {
      name: 'Dr. Maryan Xasan Faarax',
      titleSo: 'Khabiir Sare oo Cudurada Haweenka & Dhalmada (OB/GYN)',
      titleEn: 'Senior Consultant Obstetrician & Gynecologist',
      experience: '14+ Sano oo Khibrad ah',
      img: CLINIC_IMAGES.doctors.maryan,
      room: 'Qolka 1 (Room 1)',
    },
    {
      name: 'Dr. Cabdiraxmaan Guuleed',
      titleSo: 'Dhakhtarka Takhasuska ee Carruurta & Dhallaanka',
      titleEn: 'Consultant Pediatrician & Neonatologist',
      experience: '11+ Sano oo Khibrad ah',
      img: CLINIC_IMAGES.doctors.cabdiraxmaan,
      room: 'Qolka 2 (Room 2)',
    },
    {
      name: 'Dr. Sahra Cumar Cali',
      titleSo: 'Khabiirka Gurmadka Degdegga ah & Daryeelka Halista',
      titleEn: 'Emergency Medicine & Critical Care Specialist',
      experience: '9+ Sano oo Khibrad ah',
      img: CLINIC_IMAGES.doctors.sahra,
      room: 'Qolka 3 (Room 3)',
    },
    {
      name: 'Dr. Xasan Maxamed Nuur',
      titleSo: 'Dhakhtarka Qalliinka Guud & Laparoscopy',
      titleEn: 'General & Minimally Invasive Surgeon',
      experience: '16+ Sano oo Khibrad ah',
      img: CLINIC_IMAGES.doctors.xasan,
      room: 'Qeybta Qalliinka',
    },
  ];

  const stats = [
    { num: '24/7', labelSo: 'Furan Saacad Kasta', labelEn: 'Emergency Care 24/7', subSo: 'Gurmad aan kala go’ lahayn', subEn: 'Always open' },
    { num: '< 2 min', labelSo: 'Jawaabta Degdegga ah', labelEn: 'Emergency Response Time', subSo: 'Bukaanka halista ah', subEn: 'Zero wait for trauma' },
    { num: '98.6%', labelSo: 'Qanacsanaanta Hooyooyinka', labelEn: 'Patient Satisfaction', subSo: 'Daryeel lagu kalsoonaan karo', subEn: 'Based on verified reviews' },
    { num: '15,000+', labelSo: 'Hooyo & Ilmo la daryeelay', labelEn: 'Mothers & Children Served', subSo: 'Muqdisho iyo nawaaxigeeda', subEn: 'Trusted by families' },
  ];

  return (
    <div className={`w-full overflow-hidden transition-colors ${styles.bgApp}`}>
      {/* ============================================================ */}
      {/* 1. TOP EMERGENCY BANNER TICKER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider text-[10px] animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              {lang === 'so' ? 'Gurmad Degdeg ah' : 'Emergency Hotline'}
            </span>
            <span className="font-semibold hidden sm:inline">
              {lang === 'so' ? 'Ambulance & Gurmadka Hooyada:' : '24/7 Dispatch Ambulance & Maternal Rescue:'}
            </span>
            <a href="tel:999" className="font-mono font-black underline tracking-wide hover:text-amber-200">
              999 / +252 61 500 0011
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="hidden md:flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>{lang === 'so' ? 'Dhammaan Qolalka Dhakhaatiirta Way Furan Yihiin' : 'All Doctor Suites Operational'}</span>
            </div>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer text-xs"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Gal Nidaamka Isbitaalka (Login)' : 'Hospital Portal Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH VIVID MEDICAL PHOTOGRAPHY */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-slate-200 dark:border-slate-800">
        {/* Background glow & subtle patterns */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-xs bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  {lang === 'so'
                    ? 'Isbitaalka Takhasusiga ee Hooyada, Dhallaanka & Gurmadka'
                    : 'Premier Maternal, Neonatal & Emergency Hospital'}
                </span>
              </div>

              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.12] ${styles.textPrimary}`}>
                {lang === 'so' ? (
                  <>
                    Daryeel Caafimaad oo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Casri ah</span>, Badbaado leh oo Qoys Kasta u Furan.
                  </>
                ) : (
                  <>
                    Compassionate, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">World-Class Healthcare</span> for Every Mother & Child.
                  </>
                )}
              </h1>

              <p className={`text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0 ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Waxaan dhisnay isbitaal dhab ah oo loogu talagalay badbaadada hooyada iyo dhallaanka, nidaamka Triage-ka degdegga ah oo aan saf lahayn, qolal qalliin oo casri ah, iyo dhakhaatiir takhasus leh 24/7.'
                  : 'Empowering families with rapid emergency triage, advanced maternal care, pediatric immunizations, and a dignified patient-first experience with zero waiting delays.'}
              </p>

              {/* Call-to-action buttons for Visitors & Patients */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer ${styles.accentBg}`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Qabso Ballan Dhakhtar' : 'Book a Consultation'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onOpenLogin}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                    styles.isDark 
                      ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' 
                      : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <LogIn className="h-4 w-4 text-blue-600" />
                  <span>{lang === 'so' ? 'Gal Nidaamka Shaqada (Staff Portal)' : 'Staff Clinical Portal'}</span>
                </button>

                <a
                  href="tel:999"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all active:scale-95"
                >
                  <Phone className="h-4 w-4 text-rose-600" />
                  <span>{lang === 'so' ? 'Gurmadka Degdegga ah: 999' : '24/7 Emergency: 999'}</span>
                </a>

                {onOpenScanner && (
                  <button
                    onClick={onOpenScanner}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{lang === 'so' ? '📷 Skaanka Tikidhka Albaabka' : '📷 Entrance QR Scanner'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenLiveQueue}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Tv className="h-4 w-4 text-slate-500" />
                  <span>{lang === 'so' ? 'Shaashadda Qolka Sugitaanka (TV)' : 'Waiting Hall Screen (TV)'}</span>
                </button>
              </div>

              {/* Live Status Pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{lang === 'so' ? 'Qirasho Sharciyeed oo Was. Caafimaadka' : 'MOH Certified Standards'}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span>{lang === 'so' ? 'Qalab & Daawooyin Asal ah' : 'Authentic Certified Pharmaceuticals'}</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-rose-600">
                  <span className="font-bold">{emergencyCount > 0 ? emergencyCount : 0}</span>
                  <span>{lang === 'so' ? 'Gurmad firfircoon' : 'Active trauma cases'}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Multi-Image Healthcare Mosaic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img
                  src={CLINIC_IMAGES.hero}
                  alt="DaryeelQoys Modern Healthcare Center"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold w-fit mb-2">
                    <HeartPulse className="h-3.5 w-3.5" />
                    {lang === 'so' ? 'Xarunta Hooyada & Qoyska' : 'Center of Family Wellness'}
                  </span>
                  <h3 className="text-lg font-bold">
                    {lang === 'so' ? 'Albaabka Furan ee Isbitaalka DaryeelQoys' : 'DaryeelQoys Specialized Hospital Lobby'}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    {lang === 'so'
                      ? 'Nadiif, qalabyo casri ah, iyo soo dhoweyn naxariis leh saacad kasta.'
                      : 'Sterile atmosphere, advanced resuscitation suites, and compassionate round-the-clock staff.'}
                  </p>
                </div>
              </div>

              {/* Floating Stat Card 1: Maternal Care */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl flex items-center gap-3.5 max-w-[260px] animate-in fade-in slide-in-from-bottom-3 duration-500">
                <img
                  src={CLINIC_IMAGES.maternalCare}
                  alt="Maternal Health"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'so' ? 'Hooyada & Dhallaanka' : 'Maternal & Neonatal'}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {lang === 'so' ? '0 Dhimasho Dhalmo' : 'Safe Deliveries 100%'}
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 2: Live Queue Speed */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'so' ? 'Waqtiga Safka' : 'Wait Time'}</div>
                  <div className="text-xs font-mono font-extrabold text-blue-600">&lt; 15 min avg</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. KEY METRICS & TRUST STATS */}
      {/* ============================================================ */}
      <section className={`py-12 border-b transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className={`text-2xl sm:text-4xl font-extrabold font-mono tracking-tight ${styles.accentText}`}>
                  {s.num}
                </div>
                <div className={`text-xs sm:text-sm font-bold mt-1.5 ${styles.textPrimary}`}>
                  {lang === 'so' ? s.labelSo : s.labelEn}
                </div>
                <div className={`text-[11px] mt-0.5 ${styles.textSecondary}`}>
                  {lang === 'so' ? s.subSo : s.subEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOSPITAL CLINICAL DEPARTMENTS & SERVICES */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badgeBg} ${styles.badgeText}`}>
              <Stethoscope className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Adeegyada Isbitaalka' : 'Comprehensive Clinical Specialties'}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold font-display mt-3 ${styles.textPrimary}`}>
              {lang === 'so'
                ? 'Qeybaha Caafimaadka & Takhasusyada Sare'
                : 'State-of-the-Art Medical Departments'}
            </h2>
            <p className={`text-sm mt-3 leading-relaxed ${styles.textSecondary}`}>
              {lang === 'so'
                ? 'DaryeelQoys waxaa lagu qalabeeyay tignoolajiyad caafimaad oo casri ah, shaybaar sare, iyo qolal qalliin oo u heellan badbaadinta hooyada iyo ilmaha.'
                : 'Designed from the ground up for safety, rapid response, and uncompromising clinical hygiene across every department.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div
                  key={svc.id}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${styles.cardBg} ${styles.cardBorder}`}
                >
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={svc.img}
                      alt={svc.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[10px] font-extrabold text-blue-600 dark:text-blue-400 shadow-xs">
                        {lang === 'so' ? svc.badgeSo : svc.badgeEn}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${styles.badgeBg} ${styles.accentText}`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                          {lang === 'so' ? svc.titleSo : svc.titleEn}
                        </h3>
                      </div>
                      <p className={`text-xs leading-relaxed ${styles.textSecondary}`}>
                        {lang === 'so' ? svc.descSo : svc.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, department: svc.id }));
                          setAppointmentModalOpen(true);
                        }}
                        className={`font-bold flex items-center gap-1 ${styles.accentText} hover:underline cursor-pointer`}
                      >
                        <span>{lang === 'so' ? 'Qabso Ballan' : 'Book Specialist'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[11px] text-slate-400 font-medium">24/7 Available</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MEET OUR EXPERT SPECIALISTS & DOCTORS */}
      {/* ============================================================ */}
      <section className={`py-16 md:py-24 border-y transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badgeBg} ${styles.badgeText}`}>
              <Users className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Dhakhaatiirta Isbitaalka' : 'Meet Our Medical Specialists'}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold font-display mt-3 ${styles.textPrimary}`}>
              {lang === 'so' ? 'Dhakhaatiir Takhasus Sare Leh' : 'Dedicated Clinical Leadership'}
            </h2>
            <p className={`text-sm mt-3 ${styles.textSecondary}`}>
              {lang === 'so'
                ? 'Dhakhaatiir aqoon iyo khibrad dheer u leh daryeelka hooyada, dhallaanka, iyo xaaladaha degdegga ah.'
                : 'Compassionate board-certified consultants committed to evidence-based healthcare and patient dignity.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorsList.map((doc, idx) => (
              <div
                key={idx}
                className={`rounded-3xl border overflow-hidden p-5 flex flex-col items-center text-center transition-all hover:shadow-lg ${styles.cardBg} ${styles.cardBorder}`}
              >
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-4 border-2 border-slate-100 dark:border-slate-700 shadow-md">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Active on Duty" />
                </div>

                <h3 className={`text-sm font-bold font-display ${styles.textPrimary}`}>{doc.name}</h3>
                <p className={`text-xs font-medium text-blue-600 dark:text-blue-400 mt-1`}>
                  {lang === 'so' ? doc.titleSo : doc.titleEn}
                </p>
                <span className="text-[11px] text-slate-400 mt-1">{doc.experience}</span>

                <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded-md font-mono font-bold ${styles.badgeBg} ${styles.badgeText}`}>
                    {doc.room}
                  </span>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, notes: `Consultation with ${doc.name}` }));
                      setAppointmentModalOpen(true);
                    }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
                  >
                    {lang === 'so' ? 'Ballanso' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. HOSPITAL FACILITIES & AMBIENCE SHOWCASE */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badgeBg} ${styles.badgeText}`}>
                <Building2 className="h-3.5 w-3.5" />
                {lang === 'so' ? 'Dhismaha & Qalabaynta' : 'Sterile World-Class Facility'}
              </span>

              <h2 className={`text-2xl sm:text-4xl font-extrabold font-display ${styles.textPrimary}`}>
                {lang === 'so'
                  ? 'Jawiga Nadiifka ah ee Isbitaalka DaryeelQoys'
                  : 'An Environment Built For Healing & Patient Dignity'}
              </h2>

              <p className={`text-sm leading-relaxed ${styles.textSecondary}`}>
                {lang === 'so'
                  ? 'Isbitaalka waxaa loogu talagalay inuu noqdo meel qoysasku ku dareemaan xasillooni iyo kalsooni buuxda. Waxaa jira nidaamka korantada joogtada ah ee cadceedda iyo matoorada, oksijiinta tooska ah ee qolalka oo dhan ku xiran, iyo qolal gaar ah oo loogu talagalay hooyada iyo dhallaanka.'
                  : 'Featuring continuous solar-hybrid redundant power, central piped medical oxygen lines, HEPA air filtration in all delivery rooms, and soothing private spaces for mother-infant bonding.'}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { titleSo: 'Oksijiin Toos ah (Central Piped Medical O2)', titleEn: 'Central Piped Medical Oxygen in every room' },
                  { titleSo: 'Nidaamka Triage-ka Degdegga ah ee SMS-ka', titleEn: 'Real-time SMS queue ticket updates on your phone' },
                  { titleSo: 'Dhalmada Qalliinka & Qolka Dhiigga (Emergency Blood Bank)', titleEn: '24/7 Emergency Blood Bank & Rapid Surgical Access' },
                  { titleSo: 'Shaashadaha Tooska ah ee Safka (Waiting Screen TV)', titleEn: 'Large Queue TV Display in comfortable waiting halls' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className={`font-semibold ${styles.textPrimary}`}>
                      {lang === 'so' ? item.titleSo : item.titleEn}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${styles.inputBorder} ${styles.textPrimary}`}
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{lang === 'so' ? 'Qabso Ballan Dhakhtar' : 'Book a Consultation'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md h-48 sm:h-56">
                  <img
                    src={CLINIC_IMAGES.waitingLobby}
                    alt="Waiting Lounge"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-36 sm:h-44">
                  <img
                    src={CLINIC_IMAGES.childVaccine}
                    alt="Pediatric Clinic"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden shadow-md h-36 sm:h-44">
                  <img
                    src={CLINIC_IMAGES.operatingRoom}
                    alt="Operating Theater"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-48 sm:h-56">
                  <img
                    src={CLINIC_IMAGES.maternalDoctor}
                    alt="Doctor Consultation"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. PATIENT TESTIMONIALS & FAMILY VOICES */}
      {/* ============================================================ */}
      <section className={`py-16 md:py-20 border-t transition-colors ${styles.cardInnerBg} ${styles.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badgeBg} ${styles.badgeText}`}>
              <MessageSquare className="h-3.5 w-3.5" />
              {lang === 'so' ? 'Sheekooyinka Hooyooyinka' : 'Maternal Stories'}
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-display mt-2 ${styles.textPrimary}`}>
              {lang === 'so' ? 'Kalsoonida Qoysaska Soomaaliyeed' : 'Trusted by Thousands of Mothers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quoteSo: 'Waxaan uurka ku dhashay anigoo nabad qaba. Triage-ka degdegga ah ayaa isla markiiba i ogaaday dhiig-karka anigoo aan saf gelin. Mahad dhan waxaa leh Eebbe iyo dhakhaatiirta DaryeelQoys.',
                quoteEn: 'I had acute pregnancy-induced hypertension. The triage desk flagged my vitals within 2 minutes and routed me straight to Dr. Maryan without queuing. They saved my baby.',
                author: 'Xaliimo Nuur Warsame',
                tag: 'Hooyo dhashay wiil caafimaad qaba (M-14)',
              },
              {
                quoteSo: 'Tallaalka carruurta oo hore dhibaato ugu jirtay safkiisa hadda SMS ayaa la ii soo diraa markuu xilligu gaaro. Isbitaal aad u nadaafad badan oo naxariis leh.',
                quoteEn: 'Vaccinating my twins used to be chaotic. Now I receive an SMS reminder and the waiting time was only 12 minutes. Exceptional clinical care.',
                author: 'Fadumo Cabdi Cilmi',
                tag: 'Hooyada Labo Mataano ah (P-08)',
              },
              {
                quoteSo: 'Wiilkeyga oo neeftu ku dhagtay habeenkii 2:00 AM waxaan nimid ER-ka. Isla markiiba O2 iyo nebulizer ayaa loo saaray. 24 saac ayay diyaar u yihiin daryeelka.',
                quoteEn: 'My son had severe asthma at 2 AM. The emergency team administered nebulizers and central oxygen instantly. Truly life-saving 24/7 dedication.',
                author: 'Axmed Jaamac Cali',
                tag: 'Aabbaha Bukaan Yar (E-01)',
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between ${styles.cardBg} ${styles.cardBorder}`}
              >
                <div className="space-y-3">
                  <div className="text-amber-400 text-base">★★★★★</div>
                  <p className={`text-xs sm:text-sm leading-relaxed italic ${styles.textSecondary}`}>
                    "{lang === 'so' ? t.quoteSo : t.quoteEn}"
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={`text-xs font-bold ${styles.textPrimary}`}>{t.author}</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">{t.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CALL TO ACTION & PORTAL LOGIN BANNER */}
      {/* ============================================================ */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>{lang === 'so' ? 'Nidaamka Isku Xiran ee DaryeelQoys' : 'Connected Hospital Care Ecosystem'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display max-w-2xl mx-auto leading-tight">
            {lang === 'so'
              ? 'Ma tahay Dhakhtar, Kalkaaliye, ama Bukaan Raadinaya Xogtiisa?'
              : 'Are You a Clinician, Nurse, Admin, or Registered Patient?'}
          </h2>

          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            {lang === 'so'
              ? 'Gasho qeybtaada u gaarka ah ee nidaamka si aad u maamusho qolkaaga, u qiimeyso bukaanada triage-ka, ama ula socoto ballantaada.'
              : 'Sign in to access your role-specific dashboard with tailored clinical telemetry, electronic prescriptions, and live patient queue rosters.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{lang === 'so' ? 'Gal Nidaamka Isbitaalka (Sign In)' : 'Enter Hospital Portal'}</span>
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-bold text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>{lang === 'so' ? 'Ballanso Maanta' : 'Request Appointment'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. APPOINTMENT / PRE-REGISTRATION MODAL */}
      {/* ============================================================ */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 transition-colors ${styles.cardBg} ${styles.cardBorder}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${styles.accentBg}`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-display ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Qabso Ballan / Balanso Dhakhtar' : 'Book a Clinical Appointment'}
                  </h3>
                  <p className={`text-xs ${styles.textSecondary}`}>
                    {lang === 'so' ? 'Isbitaalka DaryeelQoys - Qeybta Hooyada & Qoyska' : 'DaryeelQoys Hospital Specialist Consultations'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAppointmentModalOpen(false)}
                className={`text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold p-1 cursor-pointer`}
              >
                ✕
              </button>
            </div>

            {appointmentSuccess && generatedInfo ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce shadow-md">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h4 className={`text-xl font-black font-display ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Ballantaada Si Guul leh Ayaa Loo Qabtay!' : 'Appointment Confirmed!'}
                  </h4>
                  <p className={`text-xs mt-1 ${styles.textSecondary}`}>
                    {lang === 'so'
                      ? `Ku soo dhowow DaryeelQoys, ${generatedInfo.patient.fullName}. Tikidhkaaga safka waa la diyaariyay.`
                      : `Welcome to DaryeelQoys, ${generatedInfo.patient.fullName}. Your queue ticket has been issued.`}
                  </p>
                </div>

                {/* Ticket Details Box */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 max-w-sm mx-auto text-left shadow-xs">
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800/80 pb-2.5 mb-2.5">
                    <span className="text-[11px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                      {lang === 'so' ? 'Lambarka Tikidhka' : 'Ticket Code'}
                    </span>
                    <span className="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {generatedInfo.patient.ticketNumber}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{lang === 'so' ? 'Dhakhtarka:' : 'Doctor:'}</span>
                      <span className="font-bold">{generatedInfo.patient.assignedDoctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{lang === 'so' ? 'Qolka:' : 'Room:'}</span>
                      <span className="font-bold">
                        {rooms.find(r => r.id === generatedInfo.patient.assignedRoomId)?.roomName || 'Qolka 1aad (Maternity)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code preview */}
                <div className="py-2 flex flex-col items-center">
                  <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
                    <TicketQRCode
                      ticketNumber={generatedInfo.patient.ticketNumber}
                      patientName={generatedInfo.patient.fullName}
                      size={110}
                      showDetails={false}
                      showActions={false}
                      theme={theme}
                      lang={lang}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    <span>{lang === 'so' ? 'Ku skaan garee albaabka markaad timaado' : 'Scan this at entrance kiosk on arrival'}</span>
                  </span>
                </div>

                {/* Auto Redirect Banner & Immediate Action Button */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                    <span>
                      {lang === 'so'
                        ? 'Fadlan sug... Waxaa toos laguu geynayaa Dashboodhkaaga'
                        : 'Redirecting to your Patient Dashboard...'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAppointmentSuccess(false);
                      setAppointmentModalOpen(false);
                      onBookAppointment(generatedInfo.patient, generatedInfo.profile);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'so' ? 'Toos u Tag Dashboodhka Hadda' : 'Open Dashboard Now'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Magacaaga Buuxa *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'so' ? 'Tusaale: Xaliimo Nuur Warsame' : 'e.g. Halima Nur'}
                    className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                      {lang === 'so' ? 'Taleefankaaga (WhatsApp/SMS) *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+252 61..."
                      className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                      {lang === 'so' ? 'Qeybta Aad U Baahan Tahay' : 'Specialty Department'}
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                    >
                      <option value="maternity">{lang === 'so' ? 'Hooyada & Uurka (OB/GYN)' : 'Maternity & OB/GYN'}</option>
                      <option value="pediatrics">{lang === 'so' ? 'Carruurta & Tallaalka (Pediatrics)' : 'Pediatrics & Vaccines'}</option>
                      <option value="emergency">{lang === 'so' ? 'Gurmadka Degdegga (Emergency)' : 'Emergency & Trauma'}</option>
                      <option value="ultrasound">{lang === 'so' ? 'Ultrasound & Shaybaar' : 'Ultrasound & Lab'}</option>
                      <option value="general">{lang === 'so' ? 'Daaweynta Guud (General Care)' : 'General Outpatient'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Taariikhda Aad Doonayso' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Calaamadaha ama Faahfaahin Dheeraad ah' : 'Symptoms or Additional Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={lang === 'so' ? 'Tusaale: Baaritaan bil kasta ah oo uurka...' : 'Optional details...'}
                    className={`w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAppointmentModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer font-semibold"
                  >
                    {lang === 'so' ? 'Ka noqo' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-md cursor-pointer ${styles.accentBg}`}
                  >
                    {lang === 'so' ? 'Xaqiiji Ballanta' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
