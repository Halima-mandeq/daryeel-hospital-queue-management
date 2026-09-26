export type Language = 'so' | 'en';

export type ProjectDifficulty = 'Bilaaw' | 'Dhexe' | 'Sare';

export type ProjectCategory = 
  | 'health'
  | 'water'
  | 'agri'
  | 'fintech'
  | 'education'
  | 'housing'
  | 'environment'
  | 'jobs'
  | 'emergency'
  | 'logistics';

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  apisAndTools: string[];
}

export interface RoadmapWeek {
  week: number;
  titleSo: string;
  titleEn: string;
  tasksSo: string[];
  tasksEn: string[];
  deliverableSo: string;
  deliverableEn: string;
}

export interface ProjectItem {
  id: string;
  orderNumber: string;
  titleSo: string;
  titleEn: string;
  taglineSo: string;
  taglineEn: string;
  category: ProjectCategory;
  categoryLabelSo: string;
  categoryLabelEn: string;
  difficulty: ProjectDifficulty;
  difficultyEn: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToMVP: string;
  socialImpactSo: string;
  socialImpactEn: string;
  keyMetricSo: string;
  keyMetricEn: string;
  iconName: string;
  colorTheme: {
    accent: string;
    border: string;
    glow: string;
    badge: string;
  };
  
  // Deep problem & solution
  problemSo: string;
  problemEn: string;
  problemContextSo: string[];
  problemContextEn: string[];
  
  solutionSo: string;
  solutionEn: string;
  
  beneficiariesSo: string[];
  beneficiariesEn: string[];
  
  coreFeaturesSo: { title: string; desc: string }[];
  coreFeaturesEn: { title: string; desc: string }[];
  
  techStack: TechStack;
  
  architectureFlow: {
    step: number;
    titleSo: string;
    titleEn: string;
    descSo: string;
    descEn: string;
  }[];
  
  databaseSchema: string;
  apiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    descSo: string;
    descEn: string;
  }[];
  
  fourWeekRoadmap: RoadmapWeek[];
  
  monetizationSo: {
    model: string;
    details: string;
  }[];
  monetizationEn: {
    model: string;
    details: string;
  }[];
  
  risksAndMitigationSo: {
    risk: string;
    mitigation: string;
  }[];
  risksAndMitigationEn: {
    risk: string;
    mitigation: string;
  }[];
}
