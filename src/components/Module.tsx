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
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{module.name}</h3>
            <p className="text-gray-600 mb-3">{module.description}</p>
            <ProgressBar 
              progress={progress} 
              label={`Progress (${completedTasks}/${totalTasks})`}
              size="md"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 text-gray-500 hover:text-gray-700 p-2"
          >
            <svg
              className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-4">Chapters:</h4>
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
            
            {module.additionals.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-3">Additional Resources:</h5>
                <ul className="space-y-2">
                  {module.additionals.map((additional, index) => (
                    <li key={index}>
                      <a
                        href={additional.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
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
