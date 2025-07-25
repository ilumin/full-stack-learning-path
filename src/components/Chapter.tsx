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

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <input
              type="checkbox"
              checked={isChapterCompleted}
              onChange={() => onToggleChapter(chapterId)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <div className="flex-1">
              <a
                href={chapter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                {chapter.name}
              </a>
            </div>
          </div>
          {chapter.exercises.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {chapter.exercises.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            {chapter.exercises.length} exercise{chapter.exercises.length !== 1 ? 's' : ''}
            {isExpanded || ' - Click to expand'}
          </div>
        )}

        {isExpanded && chapter.exercises.length > 0 && (
          <div className="mt-4 pl-7 border-l-2 border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Exercises:</h4>
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
