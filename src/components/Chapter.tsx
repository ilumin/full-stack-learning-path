import React, { useState } from 'react';
import type { Chapter as ChapterType } from '../types';
import { Exercise } from './Exercise';
import { generateExerciseId, generateChapterId } from '../utils/learningPath';

interface ChapterProps {
  chapter: ChapterType;
  moduleId: string;
  isChapterCompleted: boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
  onToggleExercise: (exerciseId: string) => void;
  onToggleChapter: (chapterId: string) => void;
}

export const Chapter: React.FC<ChapterProps> = ({
  chapter,
  moduleId,
  isChapterCompleted,
  isExerciseCompleted,
  onToggleExercise,
  onToggleChapter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const chapterId = generateChapterId(moduleId, chapter.id);
  const hasExercises = chapter.exercises.length > 0;

  const completedExercises = chapter.exercises.filter((_, index) => {
    const exerciseId = generateExerciseId(moduleId, chapter.id, index);
    return isExerciseCompleted(exerciseId);
  }).length;

  return (
    <div className="border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Chapter completion checkbox */}
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={isChapterCompleted}
              onChange={() => onToggleChapter(chapterId)}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
              ${isChapterCompleted 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-slate-300 hover:border-blue-400'
              }
            `}>
              {isChapterCompleted && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Chapter content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <a
                  href={chapter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {chapter.name}
                </a>
                {hasExercises && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {completedExercises}/{chapter.exercises.length} exercises
                    </span>
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 transition-all duration-300"
                        style={{ width: `${hasExercises ? (completedExercises / chapter.exercises.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {hasExercises && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                  aria-label={isExpanded ? 'Collapse exercises' : 'Expand exercises'}
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
              )}
            </div>

            {/* Exercises */}
            {isExpanded && hasExercises && (
              <div className="mt-3 pl-3 border-l-2 border-slate-100">
                <div className="space-y-1">
                  {chapter.exercises.map((exercise, index) => {
                    const exerciseId = generateExerciseId(moduleId, chapter.id, index);
                    return (
                      <Exercise
                        key={exerciseId}
                        exerciseId={exerciseId}
                        exerciseName={exercise}
                        isCompleted={isExerciseCompleted(exerciseId)}
                        onToggle={onToggleExercise}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
