import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Sparkles, 
  Phone, 
  Building2, 
  DoorOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile, DoctorRoom, ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { CLINIC_IMAGES } from '../../data/clinicMedia';

interface DoctorManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (
    doctorData: {
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
    }
  ) => void;
  existingRooms: DoctorRoom[];
  lang: 'so' | 'en';
  theme: ThemePalette;
}

const SPECIALTY_PRESETS = [
  { so: 'Cudurada Guud (General Medicine / OPD)', en: 'General Medicine / OPD' },
  { so: 'Haweenka & Dhalmada (OB/GYN)', en: 'Obstetrics & Gynecology (OB/GYN)' },
  { so: 'Carruurta & Dhallaanka (Pediatrics)', en: 'Pediatrics & Neonatal' },
  { so: 'Qalliinka Guud (General Surgery)', en: 'General Surgery' },
  { so: 'Wadnaha & Dhiig-karka (Cardiology)', en: 'Cardiology' },
  { so: 'Lafaha & Kala-goysyada (Orthopedics)', en: 'Orthopedics' },
  { so: 'Indhaha (Ophthalmology)', en: 'Ophthalmology' },
  { so: 'Ilkaha (Dentistry)', en: 'Dentistry' },
  { so: 'Maqaarka (Dermatology)', en: 'Dermatology' },
  { so: 'Dhimirka & Neerfaha (Neurology)', en: 'Neurology' },
  { so: 'Kallida & Kaadida (Urology)', en: 'Urology' },
  { so: 'Gurmadka Degdegga ah (Emergency Care)', en: 'Emergency Medicine' },
];

const AVATAR_PRESETS = [
  { label: 'Dr. Male 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Dr. Female 1', url: CLINIC_IMAGES.doctors.maryan },
  { label: 'Dr. Male 2', url: CLINIC_IMAGES.doctors.cabdiraxmaan },
  { label: 'Dr. Female 2', url: CLINIC_IMAGES.doctors.sahra },
  { label: 'Dr. Male 3', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Dr. Female 3', url: 'https://images.unsplash.com/photo-1594824813589-9a25039be482?auto=format&fit=crop&w=400&q=80' },
];

export function DoctorManagementModal({
  isOpen,
  onClose,
  onAddDoctor,
  existingRooms,
  lang,
  theme,
}: DoctorManagementModalProps) {
  const styles = getThemeStyles(theme);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [specialty, setSpecialty] = useState(SPECIALTY_PRESETS[0].so);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [department, setDepartment] = useState('Qeybta Baaritaanka Bukaanka (OPD)');
  const [phone, setPhone] = useState('+252 61 ');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);

  // Room assignment options
  const [roomOption, setRoomOption] = useState<'new' | 'existing'>('new');
  const [newRoomName, setNewRoomName] = useState(`Qolka ${existingRooms.length + 1} (Room ${existingRooms.length + 1})`);
  const [existingRoomId, setExistingRoomId] = useState(existingRooms[0]?.id || '');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate secure random password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = 'Doc@';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '2026';
    setPassword(result);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setError(lang === 'so' ? 'Fadlan geli magaca buuxa ee dhakhtarka' : 'Please enter the doctor full name');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError(lang === 'so' ? 'Fadlan geli Gmail ama Email sax ah (tusaale: dhakhtar@gmail.com)' : 'Please enter a valid Gmail or Email address');
      return;
    }

    if (cleanPassword.length < 5) {
      setError(lang === 'so' ? 'Furaha sirta ah (Password) waa inuu ka koobnaadaa ugu yaraan 5 xaraf/tiro' : 'Password must be at least 5 characters long');
      return;
    }

    const finalSpecialty = specialty === 'CUSTOM' ? (customSpecialty.trim() || 'Dhakhtar Guud') : specialty;

    onAddDoctor({
      name: cleanName.startsWith('Dr.') ? cleanName : `Dr. ${cleanName}`,
      email: cleanEmail,
      password: cleanPassword,
      specialty: finalSpecialty,
      department: department.trim() || 'Qeybta Caafimaadka Guud',
      phone: phone.trim(),
      avatar,
      roomOption,
      newRoomName: roomOption === 'new' ? (newRoomName.trim() || `Qolka ${existingRooms.length + 1}`) : undefined,
      existingRoomId: roomOption === 'existing' ? existingRoomId : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl my-8 overflow-hidden ${styles.cardBg} ${styles.cardBorder}`}>
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {lang === 'so' ? 'Agaasinka Guud' : 'Director Access'}
                </span>
                <span className="text-xs text-slate-400">· {lang === 'so' ? 'Diiwaangelinta Dhakhtarka' : 'Staff Provisioning'}</span>
              </div>
              <h2 className={`text-xl font-black font-display ${styles.textPrimary}`}>
                {lang === 'so' ? 'Ku Dar Dhakhtar Cusub' : 'Register New Medical Doctor'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* 1. Magaca & Sawirka */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <label className={`block text-xs font-bold mb-1.5 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Magaca Buuxa ee Dhakhtarka *' : 'Doctor Full Name *'}
              </label>
              <div className="relative">
                <Stethoscope className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
                <input
                  type="text"
                  required
                  placeholder="Tusaale: Dr. Axmed Cali Maxamuud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className={`block text-xs font-bold mb-1.5 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Taleefanka / WhatsApp' : 'Phone / WhatsApp'}
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
                <input
                  type="text"
                  placeholder="+252 61 XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>
            </div>
          </div>

          {/* 2. Gmail iyo Furaha Sirta ah (Credentials for Doctor) */}
          <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  {lang === 'so' ? 'Xogta Gelitaanka (Gmail & Furaha Sirta ah)' : 'Login Credentials (Gmail & Password)'}
                </span>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                {lang === 'so' ? 'Dhakhtarku wuxuu ku galayaa xogtani' : 'For doctor portal sign-in'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gmail/Email input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'so' ? 'Gmail / Email-ka Rasmiga ah *' : 'Gmail / Official Email *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="tusaale.dhakhtar@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                </div>
              </div>

              {/* Password input with generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'so' ? 'Furaha Sirta ah (Password) *' : 'Assigned Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{lang === 'so' ? 'Samee Password' : 'Auto-Generate'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Doc2026!#"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Takhasuska & Waaxda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Takhasuska Dhakhtarka (Specialty) *' : 'Medical Specialty *'}
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none cursor-pointer ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
              >
                {SPECIALTY_PRESETS.map((p) => (
                  <option key={p.so} value={p.so}>
                    {lang === 'so' ? p.so : p.en}
                  </option>
                ))}
                <option value="CUSTOM">{lang === 'so' ? '+ Takhasus kale (Custom)...' : '+ Other Specialty...'}</option>
              </select>

              {specialty === 'CUSTOM' && (
                <input
                  type="text"
                  placeholder="Geli takhasuska..."
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  className={`w-full mt-2 px-3.5 py-2 rounded-xl border text-xs outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              )}
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${styles.textPrimary}`}>
                {lang === 'so' ? 'Qeybta / Waaxda Isbitaalka (Department)' : 'Hospital Department'}
              </label>
              <div className="relative">
                <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${styles.textSecondary}`} />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Tusaale: Qeybta Baaritaanka Bukaanka (OPD)"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20 ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>
            </div>
          </div>

          {/* 4. Qolka Baaritaanka (Consultation Room Allocation) */}
          <div className={`p-4 rounded-2xl border ${styles.cardInnerBg} ${styles.cardBorder} space-y-3`}>
            <div className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-emerald-600" />
              <label className={`text-xs font-bold ${styles.textPrimary}`}>
                {lang === 'so' ? 'Qolka Baaritaanka Bukaanka (Consultation Room)' : 'Consultation Room Assignment'}
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: New Room */}
              <label
                onClick={() => setRoomOption('new')}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  roomOption === 'new'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : `${styles.cardBorder} hover:border-slate-300 dark:hover:border-slate-700`
                }`}
              >
                <input
                  type="radio"
                  name="roomOption"
                  checked={roomOption === 'new'}
                  onChange={() => setRoomOption('new')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <div className={`text-xs font-bold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'U samee Qol Cusub' : 'Create New Room'}
                  </div>
                  <p className={`text-[11px] ${styles.textSecondary}`}>
                    {lang === 'so' ? 'Waxay toos ugu daraysaa shaashadda safka' : 'Adds new room to queue display'}
                  </p>
                </div>
              </label>

              {/* Option 2: Existing Room */}
              <label
                onClick={() => setRoomOption('existing')}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  roomOption === 'existing'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : `${styles.cardBorder} hover:border-slate-300 dark:hover:border-slate-700`
                }`}
              >
                <input
                  type="radio"
                  name="roomOption"
                  checked={roomOption === 'existing'}
                  onChange={() => setRoomOption('existing')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <div className={`text-xs font-bold ${styles.textPrimary}`}>
                    {lang === 'so' ? 'Qol Jira Ku Qor' : 'Assign Existing Room'}
                  </div>
                  <p className={`text-[11px] ${styles.textSecondary}`}>
                    {lang === 'so' ? 'Qol hadda shaqeeya ku biiri' : 'Select an active room'}
                  </p>
                </div>
              </label>
            </div>

            {roomOption === 'new' ? (
              <div>
                <input
                  type="text"
                  placeholder="Tusaale: Qolka 4 (Room 4)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                />
              </div>
            ) : (
              <div>
                <select
                  value={existingRoomId}
                  onChange={(e) => setExistingRoomId(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium outline-none ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                >
                  {existingRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomName} ({r.doctorName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 5. Avatar Presets */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${styles.textPrimary}`}>
              {lang === 'so' ? 'Dooro Sawirka Dhakhtarka (Profile Photo)' : 'Select Doctor Avatar'}
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(preset.url)}
                  className={`relative shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-0.5 ${
                    avatar === preset.url
                      ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  {avatar === preset.url && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-xs">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${styles.textPrimary} hover:bg-slate-50 dark:hover:bg-slate-700`}
            >
              {lang === 'so' ? 'Ka Noqo' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{lang === 'so' ? 'Diiwaangeli Dhakhtarka & Gmail-ka' : 'Save & Provision Doctor'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
