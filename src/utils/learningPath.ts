import * as yaml from 'js-yaml';
import type { LearningPath } from '../types';

export const loadLearningPath = async (): Promise<LearningPath> => {
  try {
    const response = await fetch('/learning-path.yaml');
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as LearningPath;
    return data;
  } catch (error) {
    console.error('Error loading learning path:', error);
    throw error;
  }
};

export const generateExerciseId = (moduleId: string, chapterId: string, exerciseIndex: number): string => {
  return `${moduleId}-${chapterId}-exercise-${exerciseIndex}`;
};

export const generateChapterId = (moduleId: string, chapterId: string): string => {
  return `${moduleId}-${chapterId}`;
};

export const calculateTotalExercises = (learningPath: LearningPath): number => {
  let total = 0;
  
  learningPath.phases.forEach(phase => {
    phase.modules.forEach(module => {
      module.chapters.forEach(chapter => {
        total += chapter.exercises.length;
        total += 1; // for chapter completion
      });
    });
  });
  
  return total;
};

export const formatProgress = (current: number, total: number): string => {
  return `${current}/${total}`;
};
