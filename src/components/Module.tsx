import React, { useState, useEffect } from 'react';
import type { Module as ModuleType } from '../types';
import { Chapter } from './Chapter';
import { ProgressBar } from './ProgressBar';
import { generateExerciseId, generateChapterId } from '../utils/learningPath';

interface ModuleProps {
  module: ModuleType;
  isChapterCompleted: (chapterId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
  onToggleExercise: (exerciseId: string) => void;
  onToggleChapter: (chapterId: string) => void;
}

export const Module: React.FC<ModuleProps> = ({
  module,
  isChapterCompleted,
  isExerciseCompleted,
  onToggleExercise,
  onToggleChapter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate progress
  const totalTasks = module.chapters.reduce((total, chapter) => {
    return total + chapter.exercises.length + 1; // +1 for chapter completion
  }, 0);

  const completedTasks = module.chapters.reduce((completed, chapter) => {
    let count = 0;

    // Check chapter completion
    const chapterId = generateChapterId(module.id, chapter.id);
    if (isChapterCompleted(chapterId)) count++;

    // Check exercise completion
    chapter.exercises.forEach((_, index) => {
      const exerciseId = generateExerciseId(module.id, chapter.id, index);
      if (isExerciseCompleted(exerciseId)) count++;
    });

    return completed + count;
  }, 0);

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate module completion state
  const isFullyCompleted = progress === 100;
  const isPartiallyCompleted = progress > 0 && progress < 100;

  // Handle module checkbox toggle
  const handleModuleToggle = () => {
    const shouldComplete = !isFullyCompleted;

    // Toggle all chapters and exercises in this module
    module.chapters.forEach((chapter) => {
      const chapterId = generateChapterId(module.id, chapter.id);

      // Set chapter completion state
      if (isChapterCompleted(chapterId) !== shouldComplete) {
        onToggleChapter(chapterId);
      }

      // Set all exercise completion states
      chapter.exercises.forEach((_, index) => {
        const exerciseId = generateExerciseId(module.id, chapter.id, index);
        if (isExerciseCompleted(exerciseId) !== shouldComplete) {
          onToggleExercise(exerciseId);
        }
      });
    });
  };

  // Auto-update module state when all chapters and exercises are completed
  useEffect(() => {
    if (progress === 100 && !isFullyCompleted) {
      // All tasks are complete but module isn't marked as complete
      // This happens when user completes individual exercises/chapters
      // The module checkbox will automatically reflect the completion
    }
  }, [progress, isFullyCompleted]);

  return (
    <div className="module-card rounded-lg mb-3 overflow-hidden">
      <div className="p-3">
        {/* Module Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Module Checkbox */}
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={isFullyCompleted}
              onChange={handleModuleToggle}
              className="sr-only"
            />
            <div
              className={`
                module-checkbox w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer
                ${isFullyCompleted
                  ? 'completed bg-blue-500 border-blue-500 text-white'
                  : isPartiallyCompleted
                    ? 'partial bg-blue-100 border-blue-400 text-blue-600'
                    : 'empty border-slate-300'
                }
              `}
              onClick={handleModuleToggle}
            >
              {isFullyCompleted && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {isPartiallyCompleted && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>


          </div>

          <div className="flex-1 min-w-0">
            <h3 className="module-title text-sm font-semibold text-slate-800 mb-2">{module.name}</h3>

            {/* Module Description - Compact */}
            <div className="mb-2">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-1">{module.description}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ProgressBar
                  progress={progress}
                  size="sm"
                  showPercentage={false}
                />
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {completedTasks}/{totalTasks}
              </span>
              <span className={`text-xs font-medium ${isFullyCompleted ? 'text-green-600' :
                isPartiallyCompleted ? 'text-blue-600' :
                  'text-slate-500'
                }`}>
                {isFullyCompleted ? '✓' :
                  isPartiallyCompleted ? `${progress}%` :
                    '○'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-md transition-colors"
            aria-label={isExpanded ? 'Collapse module' : 'Expand module'}
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

        {/* Module Content */}
        {isExpanded && (
          <div className="space-y-3 animate-fade-in">
            {/* Chapters */}
            <div className="space-y-2">
              {module.chapters.map((chapter) => {
                const chapterId = generateChapterId(module.id, chapter.id);
                return (
                  <Chapter
                    key={chapter.id}
                    chapter={chapter}
                    moduleId={module.id}
                    isChapterCompleted={isChapterCompleted(chapterId)}
                    isExerciseCompleted={isExerciseCompleted}
                    onToggleExercise={onToggleExercise}
                    onToggleChapter={onToggleChapter}
                  />
                );
              })}
            </div>

            {/* Additional Resources */}
            {module.additionals.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Additional Resources
                </h5>
                <div className="space-y-1">
                  {module.additionals.map((additional, index) => (
                    <a
                      key={index}
                      href={additional.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-yellow-700 hover:text-yellow-800 hover:underline transition-colors"
                    >
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      {additional.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
