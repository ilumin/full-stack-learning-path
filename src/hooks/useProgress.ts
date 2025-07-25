import { useState, useEffect } from 'react';
import type { ProgressData } from '../types';

const STORAGE_KEY = 'fullstack-learning-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }, [progress]);

  const toggleExercise = (exerciseId: string) => {
    setProgress(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const toggleChapter = (chapterId: string) => {
    setProgress(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const isExerciseCompleted = (exerciseId: string): boolean => {
    return !!progress[exerciseId];
  };

  const isChapterCompleted = (chapterId: string): boolean => {
    return !!progress[chapterId];
  };

  const getModuleProgress = (moduleId: string, totalExercises: number): number => {
    if (totalExercises === 0) return 0;
    
    const completedCount = Object.keys(progress).filter(key => 
      key.startsWith(moduleId) && progress[key]
    ).length;
    
    return Math.round((completedCount / totalExercises) * 100);
  };

  const getPhaseProgress = (phaseId: string, totalExercises: number): number => {
    if (totalExercises === 0) return 0;
    
    const completedCount = Object.keys(progress).filter(key => 
      key.startsWith(phaseId) && progress[key]
    ).length;
    
    return Math.round((completedCount / totalExercises) * 100);
  };

  const getTotalProgress = (): number => {
    const totalItems = Object.keys(progress).length;
    if (totalItems === 0) return 0;
    
    const completedItems = Object.values(progress).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return {
    progress,
    toggleExercise,
    toggleChapter,
    isExerciseCompleted,
    isChapterCompleted,
    getModuleProgress,
    getPhaseProgress,
    getTotalProgress
  };
};
