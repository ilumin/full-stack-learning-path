export interface Exercise {
  name: string;
  completed: boolean;
}

export interface Additional {
  name: string;
  url: string;
}

export interface Chapter {
  id: string;
  name: string;
  url: string;
  exercises: string[];
  completed?: boolean;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  additionals: Additional[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export interface OptionalModule {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface LearningPath {
  phases: Phase[];
  optional_modules: OptionalModule[];
}

export interface ProgressData {
  [key: string]: boolean; // exerciseId: completed
}
