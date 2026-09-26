import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  FileCode,
  X
} from 'lucide-react';
import { ThemePalette } from '../../types/clinic';
import { getThemeStyles } from '../../utils/theme';
import { 
  getApiBaseUrl, 
  setApiBaseUrl, 
  checkBackendHealth, 
  downloadMySQLSchema,
  HealthCheckResult 
} from '../../services/apiService';

interface LaravelBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'so' | 'en';
  theme: ThemePalette;
}

export const LaravelBackendModal: React.FC<LaravelBackendModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme,
}) => {
  const styles = getThemeStyles(theme);

  const [apiUrl, setApiUrlState] = useState(getApiBaseUrl());
  const [checking, setChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quickstart' | 'schema' | 'endpoints'>('quickstart');

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setChecking(true);
    setApiBaseUrl(apiUrl);
    const result = await checkBackendHealth();
    setHealthStatus(result);
    setChecking(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const setupCommands = `# 1. Gal faylka Laravel Backend-ka
cd backend-laravel

# 2. Ku shub xirmooyinka lagama maarmaanka ah (Dependencies)
composer install

# 3. Samee faylka habaynta (.env) oo furaha sirta ah samee
cp .env.example .env
php artisan key:generate

# 4. Samee Database MySQL ah (phpMyAdmin ama Terminal)
mysql -u root -e "CREATE DATABASE somali_hospital_db CHARACTER SET utf8mb4;"

# 5. Ku shub miisaska & xogta hordhaca ah (Migrations & Seeders)
php artisan migrate --seed

# 6. Kici Server-ka Laravel
php artisan serve`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-6 transition-all ${styles.cardBg} ${styles.cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Backend Laravel & MySQL Database' : 'Laravel & MySQL Backend Portal'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                  Laravel 11.x
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  MySQL 8.0+
                </span>
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                {lang === 'so' 
                  ? 'Faylasha buuxa ee Laravel REST API iyo keydka MySQL ee isbitaalka'
                  : 'Complete Laravel REST API architecture and MySQL database setup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Connection Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                API Base URL:
              </span>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrlState(e.target.value)}
                placeholder="http://localhost:8000/api"
                className={`flex-1 px-3 py-2 text-xs font-mono rounded-xl border ${styles.cardBorder} bg-slate-50 dark:bg-slate-950 ${styles.textPrimary} focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestConnection}
                disabled={checking}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? (lang === 'so' ? 'Tijaabinaya...' : 'Testing...') : (lang === 'so' ? 'Tijaabi Xiriirka' : 'Test Connection')}</span>
              </button>
              <button
                onClick={downloadMySQLSchema}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                title={lang === 'so' ? 'Soo degso faylka MySQL .sql' : 'Download MySQL .sql schema'}
              >
                <Download className="h-3.5 w-3.5" />
                <span>{lang === 'so' ? 'Degso MySQL (.sql)' : 'Download SQL'}</span>
              </button>
            </div>
          </div>

          {/* Connection Status Badge */}
          {healthStatus && (
            <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between ${
              healthStatus.online 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                {healthStatus.online ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span className="font-semibold">{healthStatus.message}</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">
                {healthStatus.online ? 'CONNECTED (Port 8000)' : 'STANDALONE (Browser DB)'}
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'quickstart'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{lang === 'so' ? '1. Tilmaamaha Kicinta (Quickstart)' : '1. Setup & Quickstart'}</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>{lang === 'so' ? '2. Miisaska MySQL (Database Schema)' : '2. MySQL Tables (6 Tables)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'endpoints'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>{lang === 'so' ? '3. REST API Endpoints' : '3. API Endpoints'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${styles.textPrimary}`}>
                  {lang === 'so' ? 'Tallaabooyinka Terminal-ka ee Kicinta Laravel:' : 'Terminal Commands to Start Laravel:'}
                </h4>
                <button
                  onClick={() => handleCopy(setupCommands, 'commands')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === 'commands' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{lang === 'so' ? 'Waa la guuriyey' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{lang === 'so' ? 'Koobi Garee' : 'Copy Commands'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{setupCommands}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span>Xogta MySQL Database-ka (.env):</span>
                  </div>
                  <ul className="text-xs space-y-1 font-mono text-slate-600 dark:text-slate-400">
                    <li>DB_CONNECTION=mysql</li>
                    <li>DB_HOST=127.0.0.1</li>
                    <li>DB_PORT=3306</li>
                    <li>DB_DATABASE=somali_hospital_db</li>
                    <li>DB_USERNAME=root</li>
                    <li>DB_PASSWORD=</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Akoonnada Hordhaca ah (Pre-seeded):</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong className="text-slate-800 dark:text-slate-200">Admin:</strong> admin@somali-hospital.so (Admin123!)</li>
                    <li><strong className="text-slate-800 dark:text-slate-200">Doctor:</strong> faadumo@somali-hospital.so (Doctor123!)</li>
                    <li><strong className="text-slate-800 dark:text-slate-200">Nurse:</strong> maryan@somali-hospital.so (Nurse123!)</li>
                    <li><strong className="text-slate-800 dark:text-slate-200">Reception:</strong> reception@somali-hospital.so (Reception123!)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className={`text-xs ${styles.textSecondary}`}>
                  {lang === 'so' 
                    ? 'Miisaska rasmiga ah ee ku jira database-ka MySQL (somali_hospital_db):' 
                    : 'MySQL Database tables with types and relations:'}
                </p>
                <button
                  onClick={downloadMySQLSchema}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{lang === 'so' ? 'Soo degso schema_mysql.sql' : 'Download .SQL File'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'patients',
                    desc: 'Diiwaanka bukaanada, lambarka tikidhka, triage score, calaamadaha nolosha (vitals json), iyo waqtiga safka',
                    fields: 'id, ticket_number, full_name, phone, age, gender, category, symptoms, triage_level, triage_score, vitals (JSON), status, assigned_room_id, registered_at, estimated_wait_minutes',
                  },
                  {
                    name: 'doctor_rooms',
                    desc: 'Qolalka baaritaanka dhakhaatiirta, takhasusyada, iyo bukaanka hadda ku jira',
                    fields: 'id, room_code, room_name, doctor_name, title, specialty, current_patient_id, is_available',
                  },
                  {
                    name: 'users',
                    desc: 'Shaqaalaha isbitaalka (Admin, Dhakhaatiirta, Kalkaalisooyinka, Soo-dhaweynta, Farmashiyaha) oo leh xilalka RBAC',
                    fields: 'id, custom_id, name, email, password, role, title, department, phone, specialty, assigned_room_id',
                  },
                  {
                    name: 'prescriptions',
                    desc: 'Warqadaha dawooyinka elektarooniga ah (e-Prescriptions) ee dhakhtarku u qoro farmashiyaha',
                    fields: 'id, prescription_number, patient_ticket, patient_name, doctor_name, medicines (JSON), status, dispensed_by, dispensed_at',
                  },
                  {
                    name: 'pharmacy_items',
                    desc: 'Keydka dawooyinka ee farmashiyaha, tirada harsan (stock), taariikhda dhicitaanka, iyo qiimaha',
                    fields: 'id, name, generic_name, category, stock, minimum_threshold, unit, dosage, expiry_date, unit_price',
                  },
                  {
                    name: 'maternal_records',
                    desc: 'Diiwaanka daryeelka hooyada uurka leh (ANC) iyo jadwalka tallaalka dhallaanka',
                    fields: 'id, mother_name, phone, pregnancy_weeks, trimester, risk_level, next_checkup_date, child_name, next_vaccine_due, sms_sent',
                  },
                ].map((tbl, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        TABLE `{tbl.name}`
                      </span>
                    </div>
                    <p className={`text-xs mb-1.5 ${styles.textPrimary}`}>{tbl.desc}</p>
                    <div className="text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      {tbl.fields}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENDPOINTS */}
          {activeTab === 'endpoints' && (
            <div className="space-y-3">
              {[
                { method: 'GET', path: '/api/health', desc: 'Hubinta xaaladda server-ka (Health Check)' },
                { method: 'POST', path: '/api/auth/login', desc: 'Gelitaanka shaqaalaha (Email & Password)' },
                { method: 'GET', path: '/api/queue/live-board', desc: 'Shaashadda TV-ga ee qolka sugitaanka (Now Serving & Up Next)' },
                { method: 'GET', path: '/api/patients/lookup?q=M-14', desc: 'Baarista tikidhka bukaanka ama telefoonkiisa' },
                { method: 'POST', path: '/api/kiosk/scan-qr', desc: 'Akhriska QR Code-ka albaabka hore (Entrance Scanner)' },
                { method: 'GET', path: '/api/patients', desc: 'Liiska bukaanada safka ku jira oo leh kala-sooc' },
                { method: 'POST', path: '/api/patients', desc: 'Diiwaangelinta bukaanka cusub & bixinta tikidh' },
                { method: 'PATCH', path: '/api/patients/{id}/status', desc: 'Beddelka xaaladda bukaanka (called, completed, etc.)' },
                { method: 'GET', path: '/api/rooms', desc: 'Liiska qolalka dhakhaatiirta iyo xaaladooda' },
                { method: 'POST', path: '/api/queue/call-next', desc: 'Dhakhtarka oo u yeeraya bukaanka xiga ee safka' },
                { method: 'POST', path: '/api/prescriptions', desc: 'Qorista warqad dawo ah (e-Prescription)' },
                { method: 'POST', path: '/api/prescriptions/{id}/dispense', desc: 'Bixinta daawada farmashiyaha' },
                { method: 'GET', path: '/api/pharmacy/inventory', desc: 'Keydka dawooyinka ee farmashiyaha' },
              ].map((ep, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  <div className="flex items-center gap-2.5 font-mono">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      ep.method === 'GET' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : ep.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ep.path}</span>
                  </div>
                  <span className={`text-[11px] ${styles.textSecondary}`}>{ep.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className={`text-xs ${styles.textSecondary}`}>
            Folder-ka faylashu ku jiraan: <code className="font-mono text-blue-600 dark:text-blue-400">/backend-laravel</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'so' ? 'Xir Daaqadda' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
