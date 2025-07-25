import React from 'react';

interface ExerciseProps {
  exerciseId: string;
  exerciseName: string;
  isCompleted: boolean;
  onToggle: (exerciseId: string) => void;
}

export const Exercise: React.FC<ExerciseProps> = ({
  exerciseId,
  exerciseName,
  isCompleted,
  onToggle
}) => {
  return (
    <div className="group flex items-center py-1 hover:bg-slate-50 transition-colors">
      <label className="flex items-center cursor-pointer flex-1 select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(exerciseId)}
            className="sr-only"
          />
          <div className={`
            w-3 h-3 rounded border flex items-center justify-center transition-colors
            ${isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-slate-300 hover:border-green-400'
            }
          `}>
            {isCompleted && (
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <span className={`
          ml-2 text-xs transition-colors
          ${isCompleted
            ? 'line-through text-slate-500'
            : 'text-slate-700'
          }
        `}>
          {exerciseName}
        </span>
      </label>
    </div>
  );
};
