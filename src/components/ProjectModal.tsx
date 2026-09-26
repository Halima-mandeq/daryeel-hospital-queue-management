import { useState } from 'react';
import { ProjectItem } from '../data/projects';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Database, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  lang: 'so' | 'en';
  onClose: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ProjectModal({
  project,
  lang,
  onClose,
  isSelected,
  onSelect,
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'schema' | 'roadmap' | 'business'>('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  if (!project) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(project.databaseSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopyBrief = () => {
    const brief = `# ${project.titleSo} (${project.titleEn})
Category: ${project.categoryLabelSo} / ${project.categoryLabelEn}
Difficulty: ${project.difficulty} | MVP Time: ${project.timeToMVP}

## 1. Dhibaatada Dhabta ah (Problem Statement)
${project.problemSo}

## 2. Xalka Software-ka (Proposed Solution)
${project.solutionSo}

## 3. Dadka Ka Faa'iideysanaya (Target Users)
${project.targetAudienceSo.map(u => `- ${u}`).join('\n')}

## 4. Qaybaha Muhiimka ah ee MVP (Core Features)
${project.coreFeaturesSo.map(f => `- ${f}`).join('\n')}

## 5. Tech Stack
- Frontend: ${project.techStack.frontend.join(', ')}
- Backend: ${project.techStack.backend.join(', ')}
- Database: ${project.techStack.database.join(', ')}
- APIs: ${project.techStack.apis.join(', ')}

## 6. Qaabka Dakhliga (Monetization)
${project.monetizationSo}

## 7. Qorshaha 4-ta Toddobaad ee Dhismaha (Roadmap)
${project.starterRoadmapSo.map(r => `- ${r.week}: ${r.task}`).join('\n')}

## 8. Database Schema
\`\`\`sql
${project.databaseSchema}
\`\`\`
`;
    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded">
              PROJECT {project.number}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {lang === 'so' ? project.titleSo : project.titleEn}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'so' ? project.taglineSo : project.taglineEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBrief}
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              title="Copy full project specification"
            >
              {copiedBrief ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">
                {copiedBrief 
                  ? (lang === 'so' ? 'Waa la guuriyay' : 'Copied') 
                  : (lang === 'so' ? 'Koobi Qorshaha' : 'Copy Brief')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Segmented interactive tabs) */}
        <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/40 px-6 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'so' ? '1. Dhibaatada & Xalka' : '1. Problem & Solution'}
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'tech'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'so' ? '2. Qaabka & Tech Stack' : '2. Stack & Architecture'}
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'schema'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'so' ? '3. Database Schema' : '3. Database Schema'}
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'so' ? '4. Qorshaha 4-ta Toddobaad' : '4. 4-Week Roadmap'}
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'business'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'so' ? '5. Dakhliga & Suuqgeynta' : '5. Monetization'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem */}
              <div className="rounded-xl border border-rose-900/30 bg-rose-950/20 p-5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Dhibaatada Dhabta ah ee Jira (Real-World Pain Point)' : 'The Real-World Problem'}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                  {lang === 'so' ? project.problemSo : project.problemEn}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-xl border border-teal-900/40 bg-teal-950/20 p-5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Xalka Farsamada & Software-ka (The Solution)' : 'The Software Solution'}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                  {lang === 'so' ? project.solutionSo : project.solutionEn}
                </p>
              </div>

              {/* Target Users */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  {lang === 'so' ? 'Dadka Ka Faa\'iidaysanaya (Target Users):' : 'Target Users & Beneficiaries:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'so' ? project.targetAudienceSo : project.targetAudienceEn).map((user, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 px-3.5 py-2.5 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400"></span>
                      <span>{user}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Features */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  {lang === 'so' ? 'Qaybaha Ugu Muhiimsan ee MVP-ga (Core Features):' : 'Core Features for MVP:'}
                </h4>
                <div className="space-y-2">
                  {(lang === 'so' ? project.coreFeaturesSo : project.coreFeaturesEn).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border border-slate-800/80 bg-slate-950/30 p-3 text-xs text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {lang === 'so' ? 'Qalabka & Luuqadaha Lagu Dhisayo (Tech Stack Breakdown)' : 'Recommended Technology Stack'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === 'so' 
                    ? 'Qalabkaan waxaa loo doortay inay yihiin kuwo casri ah, xawaare sare leh, isla markaana xog yar ku shaqayn kara.' 
                    : 'Curated for fast development, offline/low-bandwidth resilience, and standard web deployment.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-teal-400 mb-2 uppercase tracking-wider">Frontend</div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {project.techStack.frontend.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500">›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-sky-400 mb-2 uppercase tracking-wider">Backend</div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {project.techStack.backend.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500">›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">Database & Storage</div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {project.techStack.database.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500">›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">External APIs & Services</div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {project.techStack.apis.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500">›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Why build this */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  {lang === 'so' ? 'Maxaa Loogu Baahan Yahay Farsamadan?' : 'Why This Engineering Pattern?'}
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  {lang === 'so' ? project.whyBuildThisSo : project.whyBuildThisEn}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {lang === 'so' ? 'Qorshaha Database-ka (Starter SQL Schema)' : 'Database Schema DDL'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'so' ? 'Nuqul ka qaado oo ku billow database-kaaga (PostgreSQL ama SQLite)' : 'Ready-to-run DDL statements for your initial database tables'}
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {copiedSchema ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSchema ? (lang === 'so' ? 'Waa la guuriyay!' : 'Copied!') : (lang === 'so' ? 'Koobiyeey Schema' : 'Copy Schema')}</span>
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-teal-300/90 leading-relaxed whitespace-pre">
                  {project.databaseSchema}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {lang === 'so' ? 'Qorshaha 4-ta Toddobaad ee Dhismaha (Actionable 4-Week Plan)' : '4-Week MVP Roadmap'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'so' ? 'Tallaabo tallaabo sida aad ugu dhisi karto version-ka ugu horreeya ee shaqaynaya' : 'Step-by-step breakdown to ship a working MVP from idea to live deployment'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {project.starterRoadmapSo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-bold">
                      0{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-teal-300 mb-0.5">
                        {item.week}
                      </div>
                      <div className="text-xs leading-relaxed text-slate-300">
                        {item.task}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Qaabka Dakhli-Abuurka (How to Monetize & Sustain)' : 'Monetization Model'}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                  {lang === 'so' ? project.monetizationSo : project.monetizationEn}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {lang === 'so' ? 'Fursadda Suuqeed ee Mashruucan (Market Potential):' : 'Market Potential & Growth Vector:'}
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {project.marketPotential}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            <span>{lang === 'so' ? 'Heerka:' : 'Level:'} </span>
            <span className="text-slate-200 font-medium">{project.difficulty}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>{lang === 'so' ? 'Muddada:' : 'Timeline:'} </span>
            <span className="text-slate-200 font-medium">{project.timeToMVP}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              {lang === 'so' ? 'Xir' : 'Close'}
            </button>

            <button
              onClick={() => {
                onSelect(project.id);
                onClose();
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold shadow-sm transition-colors ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                  : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Waa Mashruucaaga Hadda' : 'Currently Selected'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === 'so' ? 'Kani Ha Noqdo Mashruuca aan Dhisayo' : 'Pick This Project to Build'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
