import { useState } from 'react';
import { PROJECTS, ProjectItem } from '../data/projects';
import { Sparkles, Check, ArrowRight, RotateCcw, X, Compass } from 'lucide-react';

interface ProjectMatcherProps {
  lang: 'so' | 'en';
  onClose: () => void;
  onSelectProject: (id: string) => void;
  onOpenDetails: (project: ProjectItem) => void;
}

export function ProjectMatcher({
  lang,
  onClose,
  onSelectProject,
  onOpenDetails,
}: ProjectMatcherProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedInterest, setSelectedInterest] = useState<string>('health');
  const [selectedLevel, setSelectedLevel] = useState<string>('intermediate');
  const [selectedSpeed, setSelectedSpeed] = useState<string>('fast');

  const getMatchedProject = (): ProjectItem => {
    if (selectedInterest === 'health') {
      return PROJECTS.find(p => p.id === 'daryeel-qoys') || PROJECTS[0];
    }
    if (selectedInterest === 'fintech') {
      return PROJECTS.find(p => p.id === 'xisaab-smart') || PROJECTS[3];
    }
    if (selectedInterest === 'emergency') {
      return PROJECTS.find(p => p.id === 'kaalmo-dhiig') || PROJECTS[4];
    }
    if (selectedInterest === 'agri_water') {
      return selectedLevel === 'beginner' 
        ? (PROJECTS.find(p => p.id === 'beero-xiriir') || PROJECTS[2])
        : (PROJECTS.find(p => p.id === 'biyo-kaab') || PROJECTS[1]);
    }
    if (selectedInterest === 'edu') {
      return PROJECTS.find(p => p.id === 'iskuul-kaab') || PROJECTS[6];
    }
    if (selectedInterest === 'jobs_housing') {
      return selectedLevel === 'intermediate'
        ? (PROJECTS.find(p => p.id === 'shaqo-doori') || PROJECTS[7])
        : (PROJECTS.find(p => p.id === 'guri-hel') || PROJECTS[5]);
    }
    if (selectedInterest === 'eco_logistics') {
      return selectedLevel === 'advanced'
        ? (PROJECTS.find(p => p.id === 'dhoof-track') || PROJECTS[9])
        : (PROJECTS.find(p => p.id === 'qashin-kaab') || PROJECTS[8]);
    }
    return PROJECTS[0];
  };

  const matched = getMatchedProject();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {lang === 'so' ? 'I Kaalmee Doorashada Mashruuca' : 'Project Selection Assistant'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'so' 
                ? 'Kaga jawaab 3 su\'aalood oo degdeg ah si aan kuu tuso mashruuca kuugu habboon!' 
                : 'Answer 3 quick questions to discover your ideal problem-solving project!'}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 text-xs text-slate-400">
          <span className={`font-medium ${step === 1 ? 'text-teal-400' : 'text-slate-500'}`}>
            1. {lang === 'so' ? 'Qaybta Ku Xiisogelisa' : 'Field of Interest'}
          </span>
          <span className="text-slate-700">→</span>
          <span className={`font-medium ${step === 2 ? 'text-teal-400' : 'text-slate-500'}`}>
            2. {lang === 'so' ? 'Heerkaaga Coding-ka' : 'Experience Level'}
          </span>
          <span className="text-slate-700">→</span>
          <span className={`font-medium ${step === 3 ? 'text-teal-400' : 'text-slate-500'}`}>
            3. {lang === 'so' ? 'Natiijada' : 'Recommendation'}
          </span>
        </div>

        {/* Step 1: Interest */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">
              {lang === 'so' ? 'Dhibaatadee ayaa aad ugu jeceshahay inaad xalliso?' : 'Which problem domain are you most passionate about solving?'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'fintech', title: lang === 'so' ? 'Ganacsiga & Dukaamada (Diiwaanka Amaahda)' : 'Retail & FinTech (Shop Debt Ledger)', desc: 'XisaabSmart' },
                { id: 'health', title: lang === 'so' ? 'Caafimaadka Hooyada & Safafka Isbitaalka' : 'Healthcare & Clinic Triage', desc: 'DaryeelQoys' },
                { id: 'emergency', title: lang === 'so' ? 'Badbaadinta Nolosha & Baahida Dhiigga' : 'Emergency Blood Dispatch', desc: 'KaalmoDhiig' },
                { id: 'agri_water', title: lang === 'so' ? 'Beeraha, Khudaarta & Ceelasha Biyaha' : 'Agri-Market & Clean Water Points', desc: 'BeeroXiriir / BiyoKaab' },
                { id: 'edu', title: lang === 'so' ? 'Waxbarashada & Diyaarinta Imtixaanaadka' : 'Low-Bandwidth National Exam Prep', desc: 'IskuulKaab' },
                { id: 'jobs_housing', title: lang === 'so' ? 'Guryaha Kireysan & Farsamo-yaqaannada' : 'Housing Escrow & Vetted Trades', desc: 'GuriHel / ShaqoDoori' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedInterest(item.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedInterest === item.id
                      ? 'border-teal-500 bg-teal-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-white mb-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    {selectedInterest === item.id && <Check className="h-3.5 w-3.5 text-teal-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 transition-colors"
              >
                <span>{lang === 'so' ? 'Tallaabada Xigta' : 'Next Step'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience & Speed */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">
                {lang === 'so' ? 'Waa maxay heerkaaga xirfadeed ee horumarinta software-ka?' : 'What is your current software development experience?'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: lang === 'so' ? 'Bilaaw / Bilow' : 'Beginner', sub: lang === 'so' ? 'Fudud & Degdeg' : 'Fast & Clear' },
                  { id: 'intermediate', label: lang === 'so' ? 'Dhexdhexaad' : 'Intermediate', sub: lang === 'so' ? 'Full-stack caadi ah' : 'Full-stack CRUD' },
                  { id: 'advanced', label: lang === 'so' ? 'Sare / Khibradleh' : 'Advanced', sub: lang === 'so' ? 'Complex Logic' : 'APIs & Scaling' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedLevel === lvl.id
                        ? 'border-teal-500 bg-teal-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white mb-0.5">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400">{lvl.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">
                {lang === 'so' ? 'Muddada aad rabto inaad ku dhisto nooca koowaad (MVP)?' : 'Target timeline to launch working MVP?'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'fast', label: lang === 'so' ? '2 Toddobaad (Degdeg)' : '2 Weeks (Sprint)', sub: lang === 'so' ? 'Features kooban oo xoog leh' : 'Lean core features' },
                  { id: 'thorough', label: lang === 'so' ? '3 - 4 Toddobaad' : '3 - 4 Weeks', sub: lang === 'so' ? 'Nidaam buuxa oo tijaabo leh' : 'Complete system & testing' },
                ].map((spd) => (
                  <button
                    key={spd.id}
                    onClick={() => setSelectedSpeed(spd.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSpeed === spd.id
                        ? 'border-teal-500 bg-teal-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white mb-0.5">{spd.label}</div>
                    <div className="text-[10px] text-slate-400">{spd.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {lang === 'so' ? 'Dib u laabo' : 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 transition-colors"
              >
                <span>{lang === 'so' ? 'Tus Mashruuca Ii Habboon' : 'See My Best Match'}</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-teal-500/40 bg-teal-950/20 p-5">
              <div className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider mb-1">
                {lang === 'so' ? 'Mashruuca Kuugu Habboon ee La Soo Xulay:' : 'Recommended Top Match:'}
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-1">
                {matched.number}. {lang === 'so' ? matched.titleSo : matched.titleEn}
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                {lang === 'so' ? matched.taglineSo : matched.taglineEn}
              </p>

              <div className="border-t border-teal-500/20 pt-3">
                <div className="text-xs font-semibold text-teal-300 mb-1">
                  {lang === 'so' ? 'Sababta laguu doortay:' : 'Why this fits your criteria:'}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {lang === 'so' ? matched.whyBuildThisSo : matched.whyBuildThisEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectProject(matched.id);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-300 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{lang === 'so' ? 'Dooro Mashruucan Hadda!' : 'Select This Project Now'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenDetails(matched);
                  onClose();
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {lang === 'so' ? 'Faahfaahinta Eeg' : 'View Full Details'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title={lang === 'so' ? 'Dib u billow' : 'Reset'}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
