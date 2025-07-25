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
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div className="phase-card rounded-lg border border-slate-200 mb-4 overflow-hidden">
      <div className="p-4">
        {/* Phase Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="phase-title text-lg font-semibold text-slate-800">{phase.name}</h2>
            </div>

            {/* Compact description */}
            <p className="text-xs text-slate-600 mb-3 line-clamp-1">{phase.description}</p>

            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 max-w-xs">
                <ProgressBar
                  progress={progress}
                  size="sm"
                  showPercentage={false}
                />
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {completedTasks}/{totalTasks}
              </span>
              <span className={`text-xs font-medium ${progress === 100 ? 'text-green-600' :
                progress > 0 ? 'text-blue-600' : 'text-slate-500'
                }`}>
                {progress === 100 ? '✓' : progress > 0 ? `${progress}%` : '○'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse phase' : 'Expand phase'}
          >
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Phase Modules */}
        {isExpanded && (
          <div className="space-y-2 animate-fade-in">
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
