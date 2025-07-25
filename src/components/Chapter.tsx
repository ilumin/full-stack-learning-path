import React, { useState, useEffect } from 'react';
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

  // Calculate chapter states
  const totalExercises = chapter.exercises.length;
  const exerciseProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // For chapters with exercises: check both chapter and exercises completion
  // For chapters without exercises: only check chapter completion
  const isChapterFullyComplete = hasExercises
    ? (isChapterCompleted && exerciseProgress === 100)
    : isChapterCompleted;

  const isChapterPartial = hasExercises
    ? (isChapterCompleted || (exerciseProgress > 0 && exerciseProgress < 100))
    : false; // No partial state for no-exercise chapters

  // Handle chapter checkbox toggle
  const handleChapterToggle = () => {
    if (hasExercises) {
      // For chapters with exercises: toggle both chapter and all exercises
      const shouldComplete = !isChapterFullyComplete;

      if (isChapterCompleted !== shouldComplete) {
        onToggleChapter(chapterId);
      }

      chapter.exercises.forEach((_, index) => {
        const exerciseId = generateExerciseId(moduleId, chapter.id, index);
        if (isExerciseCompleted(exerciseId) !== shouldComplete) {
          onToggleExercise(exerciseId);
        }
      });
    } else {
      // For chapters without exercises: only toggle chapter
      onToggleChapter(chapterId);
    }
  };

  // Auto-check chapter when all exercises are completed
  useEffect(() => {
    if (hasExercises && exerciseProgress === 100 && !isChapterCompleted) {
      onToggleChapter(chapterId);
    }
  }, [exerciseProgress, hasExercises, isChapterCompleted, chapterId, onToggleChapter]);

  return (
    <div className="border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Chapter checkbox */}
          <div className="relative group">
            <input
              type="checkbox"
              checked={isChapterFullyComplete}
              onChange={handleChapterToggle}
              className="sr-only"
            />
            <div
              className={`
                w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
                ${isChapterFullyComplete
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : isChapterPartial
                    ? 'bg-blue-100 border-blue-400 text-blue-600'
                    : 'border-slate-300 hover:border-blue-400'
                }
              `}
              onClick={handleChapterToggle}
            >
              {isChapterFullyComplete && (
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {isChapterPartial && !isChapterFullyComplete && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Chapter content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <a
                  href={chapter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {chapter.name}
                </a>

                {hasExercises && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-mono">
                      {completedExercises}/{totalExercises}
                    </span>
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
                        style={{ width: `${exerciseProgress}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isChapterFullyComplete ? 'text-green-600' :
                      isChapterPartial ? 'text-blue-600' :
                        'text-slate-500'
                      }`}>
                      {isChapterFullyComplete ? '✓' :
                        isChapterPartial ? `${exerciseProgress}%` :
                          '○'}
                    </span>
                  </div>
                )}
              </div>

              {hasExercises && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  aria-label={isExpanded ? 'Collapse exercises' : 'Expand exercises'}
                >
                  <svg
                    className={`w-3 h-3 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Exercises */}
        {isExpanded && hasExercises && (
          <div className="mt-3 ml-7 space-y-1 animate-fade-in">
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
        )}
      </div>
    </div>
  );
};
