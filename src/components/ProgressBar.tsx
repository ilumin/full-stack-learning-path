import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  size = 'md',
  showPercentage = true,
  variant = 'primary'
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm'
  };

  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-indigo-500',
    success: 'bg-green-500'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className={`font-medium text-slate-700 ${textSizeClasses[size]}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-slate-500 font-mono ${textSizeClasses[size]}`}>
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
