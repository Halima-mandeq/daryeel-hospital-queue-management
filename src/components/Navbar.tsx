import { Compass, Sparkles, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  lang: 'so' | 'en';
  setLang: (lang: 'so' | 'en') => void;
  onOpenMatcher: () => void;
  selectedProjectId: string | null;
  onScrollToProjects: () => void;
  onScrollToComparison: () => void;
}

export function Navbar({
  lang,
  setLang,
  onOpenMatcher,
  selectedProjectId,
  onScrollToProjects,
  onScrollToComparison,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold font-display text-lg shadow-sm">
            10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-tight text-white">
                10XSOLVE
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-medium text-teal-400 hidden sm:inline-block">
                {lang === 'so' ? '10 Mashruuc oo Xallinaya Dhibaatooyin Dhab ah' : '10 Real Problem-Solving Projects'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onScrollToProjects}
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-900"
          >
            {lang === 'so' ? 'Mashaariicda' : 'Projects'}
          </button>

          <button
            onClick={onScrollToComparison}
            className="hidden md:inline-flex text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-900"
          >
            {lang === 'so' ? 'Jadwalka Isbarbardhigga' : 'Comparison Matrix'}
          </button>

          {/* Interactive Project Matcher CTA */}
          <button
            onClick={onOpenMatcher}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors px-3 py-1.5 rounded-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === 'so' ? 'I Kaalmee Doorashada' : 'Help Me Choose'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-900/90 p-0.5 text-xs">
            <button
              onClick={() => setLang('so')}
              className={`px-2 py-1 font-semibold rounded transition-colors ${
                lang === 'so'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 font-semibold rounded transition-colors ${
                lang === 'en'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
