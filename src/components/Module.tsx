import React, { useState } from 'react';
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

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 mb-3 overflow-hidden">
      <div className="p-3">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-slate-800 truncate">{module.name}</h3>
              <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                {completedTasks}/{totalTasks}
              </span>
            </div>

            {/* Progress */}
            <div className="w-full max-w-xs">
              <ProgressBar
                progress={progress}
                size="sm"
                showPercentage={false}
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded transition-colors"
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
          <div className="space-y-2 animate-fade-in">
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
              <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded">
                <h5 className="text-xs font-medium text-blue-800 mb-2">Additional Resources</h5>
                <ul className="space-y-1 list-none">
                  {module.additionals.map((additional, index) => (
                    <li key={index}>
                      <a
                        href={additional.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        {additional.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
