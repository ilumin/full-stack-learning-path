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
    <div className="flex items-center space-x-3 py-2">
      <label className="flex items-center cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(exerciseId)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className={`ml-3 text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
          {exerciseName}
        </span>
      </label>
    </div>
  );
};
