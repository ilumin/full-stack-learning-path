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
    <div className="glass rounded-xl shadow-lg border border-white/20 mb-6 overflow-hidden">
      <div className="p-6">
        {/* Module Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{module.name}</h3>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{module.description}</p>
            
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar 
                  progress={progress} 
                  size="sm"
                  showPercentage={false}
                />
              </div>
              <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
            aria-label={isExpanded ? 'Collapse module' : 'Expand module'}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
          <div className="space-y-4 animate-fade-in">
            {/* Chapters */}
            <div className="space-y-3">
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
              <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Additional Resources
                </h5>
                <div className="grid gap-2">
                  {module.additionals.map((additional, index) => (
                    <a
                      key={index}
                      href={additional.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
