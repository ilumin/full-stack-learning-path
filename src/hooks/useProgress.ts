import { useState, useEffect } from 'react';
import type { ProgressData } from '../types';

const STORAGE_KEY = 'fullstack-learning-progress';
const BACKUP_KEY = 'fullstack-learning-progress-backup';

// Fallback storage using sessionStorage and memory
let memoryStorage: ProgressData = {};

// Check if localStorage is available
const isStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Storage wrapper with fallback
const storage = {
  getItem: (key: string): string | null => {
    try {
      if (isStorageAvailable()) {
        return localStorage.getItem(key);
      }
      // Try sessionStorage as fallback
      return sessionStorage.getItem(key) || null;
    } catch {
      // Last resort: return from memory
      if (key === STORAGE_KEY) {
        return Object.keys(memoryStorage).length > 0 ? JSON.stringify(memoryStorage) : null;
      }
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (isStorageAvailable()) {
        localStorage.setItem(key, value);
        // Also backup to sessionStorage
        sessionStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, value);
      }
      // Always keep in memory as last resort
      if (key === STORAGE_KEY) {
        memoryStorage = JSON.parse(value);
      }
    } catch (error) {
      console.warn('Storage failed, keeping in memory only:', error);
      if (key === STORAGE_KEY) {
        memoryStorage = JSON.parse(value);
      }
    }
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!isStorageAvailable()) {
      console.warn('localStorage is not available');
      setIsLoaded(true);
      return;
    }

    try {
      const savedProgress = storage.getItem(STORAGE_KEY);
      if (savedProgress && savedProgress !== 'undefined' && savedProgress !== 'null') {
        const parsedProgress = JSON.parse(savedProgress);
        if (parsedProgress && typeof parsedProgress === 'object') {
          setProgress(parsedProgress);
        }
      } else {
        // No saved progress found in storage
      }
    } catch (error) {
      console.error('Error loading progress from storage:', error);
      // Try to recover from memory
      if (Object.keys(memoryStorage).length > 0) {
        setProgress(memoryStorage);
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save progress to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const progressString = JSON.stringify(progress);
      storage.setItem(STORAGE_KEY, progressString);
    } catch (error) {
      console.error('Error saving progress to storage:', error);
    }
  }, [progress, isLoaded]);

  const toggleExercise = (exerciseId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [exerciseId]: !prev[exerciseId]
      };
      return newProgress;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [chapterId]: !prev[chapterId]
      };
      return newProgress;
    });
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

  const exportProgress = (): string => {
    return JSON.stringify({
      progress,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  };

  const importProgress = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.progress && typeof data.progress === 'object') {
        // Create backup before importing
        createBackup();
        setProgress(data.progress);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing progress:', error);
      return false;
    }
  };

  const resetProgress = () => {
    // Create backup before resetting
    createBackup();
    setProgress({});
  };

  const createBackup = () => {
    try {
      const backupData = {
        progress,
        backupDate: new Date().toISOString(),
        version: '1.0'
      };
      storage.setItem(BACKUP_KEY, JSON.stringify(backupData));
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  // Debug function to check storage
  const debugStorage = () => {
    // Debug storage function - logs removed for production
    try {
      const stored = storage.getItem(STORAGE_KEY);
      const backup = storage.getItem(BACKUP_KEY);

      // Storage debug data available but not logged
      // Check all storage types silently
      if (isStorageAvailable()) {
        localStorage.getItem(STORAGE_KEY);
      }
      sessionStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error parsing stored values:', error);
    }
  };

  const restoreFromBackup = (): boolean => {
    try {
      const backupData = storage.getItem(BACKUP_KEY);
      if (backupData) {
        const data = JSON.parse(backupData);
        if (data.progress) {
          setProgress(data.progress);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  };

  const getProgressStats = () => {
    const totalItems = Object.keys(progress).length;
    const completedItems = Object.values(progress).filter(Boolean).length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Count exercises vs chapters
    const exercises = Object.keys(progress).filter(key => key.includes('-') && key.split('-').length >= 3);
    const chapters = Object.keys(progress).filter(key => key.includes('-') && key.split('-').length === 2);

    const completedExercises = exercises.filter(key => progress[key]).length;
    const completedChapters = chapters.filter(key => progress[key]).length;

    return {
      totalItems,
      completedItems,
      completionRate,
      totalExercises: exercises.length,
      completedExercises,
      totalChapters: chapters.length,
      completedChapters,
      exerciseCompletionRate: exercises.length > 0 ? Math.round((completedExercises / exercises.length) * 100) : 0,
      chapterCompletionRate: chapters.length > 0 ? Math.round((completedChapters / chapters.length) * 100) : 0
    };
  };

  return {
    progress,
    toggleExercise,
    toggleChapter,
    isExerciseCompleted,
    isChapterCompleted,
    getModuleProgress,
    getPhaseProgress,
    getTotalProgress,
    exportProgress,
    importProgress,
    resetProgress,
    createBackup,
    restoreFromBackup,
    getProgressStats,
    debugStorage,
    isLoaded
  };
};
