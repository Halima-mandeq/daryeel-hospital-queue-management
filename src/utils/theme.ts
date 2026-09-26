import { ThemePalette } from '../types/clinic';

export interface ThemeStyles {
  bgApp: string;
  headerBg: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  cardInnerBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  navActiveBg: string;
  navActiveText: string;
  navInactiveText: string;
  navInactiveHover: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  emergencyBg: string;
  emergencyText: string;
  urgentBg: string;
  urgentText: string;
  routineBg: string;
  routineText: string;
  isDark: boolean;
}

export function getThemeStyles(theme: ThemePalette): ThemeStyles {
  switch (theme) {
    case 'emerald':
      return {
        bgApp: 'bg-emerald-50/40 text-slate-900',
        headerBg: 'bg-white/95 border-emerald-100 text-slate-900',
        headerBorder: 'border-emerald-100',
        cardBg: 'bg-white',
        cardBorder: 'border-emerald-100 shadow-sm',
        cardInnerBg: 'bg-emerald-50/50',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-600',
        textMuted: 'text-slate-400',
        accentBg: 'bg-emerald-600',
        accentHover: 'hover:bg-emerald-700',
        accentText: 'text-emerald-600',
        accentBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        navActiveBg: 'bg-emerald-600 text-white shadow-sm',
        navActiveText: 'text-white',
        navInactiveText: 'text-slate-600',
        navInactiveHover: 'hover:bg-emerald-50 hover:text-emerald-900',
        inputBg: 'bg-white',
        inputBorder: 'border-slate-300 focus:border-emerald-600',
        inputText: 'text-slate-900',
        emergencyBg: 'bg-rose-50 text-rose-700 border border-rose-200',
        emergencyText: 'text-rose-600',
        urgentBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        urgentText: 'text-amber-600',
        routineBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        routineText: 'text-emerald-600',
        isDark: false,
      };
    case 'warm':
      return {
        bgApp: 'bg-[#faf7f2] text-slate-900',
        headerBg: 'bg-white/95 border-rose-100 text-slate-900',
        headerBorder: 'border-rose-100',
        cardBg: 'bg-white',
        cardBorder: 'border-rose-100/80 shadow-sm',
        cardInnerBg: 'bg-orange-50/40',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-600',
        textMuted: 'text-slate-400',
        accentBg: 'bg-rose-600',
        accentHover: 'hover:bg-rose-700',
        accentText: 'text-rose-600',
        accentBorder: 'border-rose-200',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        navActiveBg: 'bg-rose-600 text-white shadow-sm',
        navActiveText: 'text-white',
        navInactiveText: 'text-slate-600',
        navInactiveHover: 'hover:bg-rose-50 hover:text-rose-900',
        inputBg: 'bg-white',
        inputBorder: 'border-slate-300 focus:border-rose-600',
        inputText: 'text-slate-900',
        emergencyBg: 'bg-red-50 text-red-700 border border-red-200',
        emergencyText: 'text-red-600',
        urgentBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        urgentText: 'text-amber-600',
        routineBg: 'bg-teal-50 text-teal-700 border border-teal-200',
        routineText: 'text-teal-600',
        isDark: false,
      };
    case 'dark':
      return {
        bgApp: 'bg-slate-950 text-slate-100',
        headerBg: 'bg-slate-950/95 border-slate-800 text-white',
        headerBorder: 'border-slate-800',
        cardBg: 'bg-slate-900/80',
        cardBorder: 'border-slate-800',
        cardInnerBg: 'bg-slate-950/70',
        textPrimary: 'text-white',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-500',
        accentBg: 'bg-emerald-600',
        accentHover: 'hover:bg-emerald-500',
        accentText: 'text-emerald-400',
        accentBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
        navActiveBg: 'bg-emerald-600 text-white shadow-sm',
        navActiveText: 'text-white',
        navInactiveText: 'text-slate-300',
        navInactiveHover: 'hover:bg-slate-800 hover:text-white',
        inputBg: 'bg-slate-950',
        inputBorder: 'border-slate-700 focus:border-emerald-500',
        inputText: 'text-white',
        emergencyBg: 'bg-rose-950/40 text-rose-300 border border-rose-800/40',
        emergencyText: 'text-rose-400',
        urgentBg: 'bg-amber-950/40 text-amber-300 border border-amber-800/40',
        urgentText: 'text-amber-400',
        routineBg: 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40',
        routineText: 'text-emerald-400',
        isDark: true,
      };
    case 'sapphire':
    default:
      return {
        bgApp: 'bg-slate-50 text-slate-900',
        headerBg: 'bg-white/95 border-slate-200 text-slate-900',
        headerBorder: 'border-slate-200',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200 shadow-sm',
        cardInnerBg: 'bg-blue-50/40',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-600',
        textMuted: 'text-slate-400',
        accentBg: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
        accentText: 'text-blue-600',
        accentBorder: 'border-blue-200',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        navActiveBg: 'bg-blue-600 text-white shadow-sm',
        navActiveText: 'text-white',
        navInactiveText: 'text-slate-600',
        navInactiveHover: 'hover:bg-blue-50 hover:text-blue-900',
        inputBg: 'bg-white',
        inputBorder: 'border-slate-300 focus:border-blue-600',
        inputText: 'text-slate-900',
        emergencyBg: 'bg-rose-50 text-rose-700 border border-rose-200',
        emergencyText: 'text-rose-600',
        urgentBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        urgentText: 'text-amber-600',
        routineBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        routineText: 'text-emerald-600',
        isDark: false,
      };
  }
}
