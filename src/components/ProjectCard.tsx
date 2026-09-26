import { ProjectItem } from '../data/projects';
import { 
  HeartPulse, 
  Droplets, 
  Sprout, 
  Receipt, 
  Activity, 
  Home, 
  GraduationCap, 
  Wrench, 
  Trash2, 
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  lang: 'so' | 'en';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpenDetails: (project: ProjectItem) => void;
}

const ICONS_MAP: Record<string, any> = {
  HeartPulse,
  Droplets,
  Sprout,
  Receipt,
  Activity,
  Home,
  GraduationCap,
  Wrench,
  Trash2,
  ShieldCheck
};

export function ProjectCard({
  project,
  lang,
  isSelected,
  onSelect,
  onOpenDetails,
}: ProjectCardProps) {
  const IconComponent = ICONS_MAP[project.iconName] || Activity;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border bg-slate-900/60 p-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 ${
        isSelected
          ? 'border-teal-500/80 ring-1 ring-teal-500/50 bg-slate-900/95'
          : 'border-slate-800/80'
      }`}
    >
      <div>
        {/* Unboxed clean metadata header (Anti-Pill Rule) */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-mono text-teal-400 font-semibold">{project.number}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{lang === 'so' ? project.categoryLabelSo : project.categoryLabelEn}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{project.timeToMVP}</span>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            {project.difficulty}
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-xl font-bold font-display text-white tracking-tight group-hover:text-teal-300 transition-colors">
              {lang === 'so' ? project.titleSo : project.titleEn}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5 line-clamp-1">
              {lang === 'so' ? project.taglineSo : project.taglineEn}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-700/60 text-teal-400">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        {/* The Real-World Problem Box */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-rose-400/90 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>{lang === 'so' ? 'Dhibaatada Dhabta ah:' : 'The Real Problem:'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-300 line-clamp-3">
            {lang === 'so' ? project.problemSo : project.problemEn}
          </p>
        </div>

        {/* The Solution */}
        <div className="mt-3">
          <div className="text-xs font-semibold text-teal-400/90 uppercase tracking-wider mb-1">
            {lang === 'so' ? 'Xalka Software-ka:' : 'The Software Solution:'}
          </div>
          <p className="text-xs leading-relaxed text-slate-300 line-clamp-2">
            {lang === 'so' ? project.solutionSo : project.solutionEn}
          </p>
        </div>

        {/* Key Features snippet */}
        <div className="mt-4">
          <ul className="space-y-1.5 text-xs text-slate-400">
            {(lang === 'so' ? project.coreFeaturesSo : project.coreFeaturesEn)
              .slice(0, 2)
              .map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-teal-500 shrink-0" />
                  <span className="line-clamp-1 text-slate-300">{feature}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Clean unboxed Tech Stack text line */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 uppercase font-sans text-[10px] font-semibold">Stack:</span>
          {project.techStack.frontend.slice(0, 2).map((tech, i) => (
            <span key={i} className="text-slate-300">
              {tech} {i === 0 && '·'}
            </span>
          ))}
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{project.techStack.database[0]}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenDetails(project)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <span>{lang === 'so' ? 'Faahfaahinta Buuxda' : 'Deep Dive Specs'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onSelect(project.id)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            isSelected
              ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
              : 'border border-teal-500/40 text-teal-300 hover:bg-teal-500/10'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>{lang === 'so' ? 'Waa La Doortay' : 'Selected'}</span>
            </>
          ) : (
            <span>{lang === 'so' ? 'Dooro Mashruucan' : 'Choose This'}</span>
          )}
        </button>
      </div>
    </div>
  );
}
