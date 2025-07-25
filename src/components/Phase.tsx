import React, { useState } from 'react';
import type { Phase as PhaseType } from '../types';
import { Module } from './Module';
import { ProgressBar } from './ProgressBar';
import { generateExerciseId, generateChapterId } from '../utils/learningPath';

interface PhaseProps {
  phase: PhaseType;
  isChapterCompleted: (chapterId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
  onToggleExercise: (exerciseId: string) => void;
  onToggleChapter: (chapterId: string) => void;
}

export const Phase: React.FC<PhaseProps> = ({
  phase,
  isChapterCompleted,
  isExerciseCompleted,
  onToggleExercise,
  onToggleChapter
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded for main phases

  // Calculate total progress for this phase
  const totalTasks = phase.modules.reduce((total, module) => {
    return total + module.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.exercises.length + 1; // +1 for chapter completion
    }, 0);
  }, 0);

  const completedTasks = phase.modules.reduce((completed, module) => {
    return completed + module.chapters.reduce((chapterCompleted, chapter) => {
      let count = 0;
      
      // Check chapter completion
      const chapterId = generateChapterId(module.id, chapter.id);
      if (isChapterCompleted(chapterId)) count++;
      
      // Check exercise completion
      chapter.exercises.forEach((_, index) => {
        const exerciseId = generateExerciseId(module.id, chapter.id, index);
        if (isExerciseCompleted(exerciseId)) count++;
      });
      
      return chapterCompleted + count;
    }, 0);
  }, 0);

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg mb-8">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{phase.name}</h2>
            <p className="text-gray-700 mb-4">{phase.description}</p>
            <ProgressBar 
              progress={progress} 
              label={`Overall Progress (${completedTasks}/${totalTasks})`}
              size="lg"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-6 text-blue-600 hover:text-blue-800 p-2"
          >
            <svg
              className={`w-8 h-8 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-8">
            {phase.modules.map((module) => (
              <Module
                key={module.id}
                module={module}
                isChapterCompleted={isChapterCompleted}
                isExerciseCompleted={isExerciseCompleted}
                onToggleExercise={onToggleExercise}
                onToggleChapter={onToggleChapter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
