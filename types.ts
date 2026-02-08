
export interface RoadmapStep {
  title: string;
  description: string;
  icon: string;
}

export interface AppRoadmap {
  appName: string;
  concept: string;
  techStack: string[];
  features: string[];
  timeline: RoadmapStep[];
  estimatedDifficulty: 'Easy' | 'Intermediate' | 'Advanced';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}
