import React, { useState } from 'react';
import type { Phase as PhaseType } from '../types';
import { Module } from './Module';
import { ProgressBar } from './ProgressBar';
import { generateExerciseId, generateChapterId } from '../utils/learningPath';

interface PhaseProps {
  phase: PhaseType;
  isChapterCompleted: (chapterId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
  onToggleExercise: (exerciseId: string) => void;
  onToggleChapter: (chapterId: string) => void;
}

export const Phase: React.FC<PhaseProps> = ({
  phase,
  isChapterCompleted,
  isExerciseCompleted,
  onToggleExercise,
  onToggleChapter
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate total progress for this phase
  const totalTasks = phase.modules.reduce((total, module) => {
    return total + module.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.exercises.length + 1; // +1 for chapter completion
    }, 0);
  }, 0);

  const completedTasks = phase.modules.reduce((completed, module) => {
    return completed + module.chapters.reduce((chapterCompleted, chapter) => {
      let count = 0;
      
      // Check chapter completion
      const chapterId = generateChapterId(module.id, chapter.id);
      if (isChapterCompleted(chapterId)) count++;
      
      // Check exercise completion
      chapter.exercises.forEach((_, index) => {
        const exerciseId = generateExerciseId(module.id, chapter.id, index);
        if (isExerciseCompleted(exerciseId)) count++;
      });
      
      return chapterCompleted + count;
    }, 0);
  }, 0);

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const phaseColors = {
    foundation: 'from-blue-500/10 to-indigo-500/10 border-blue-200',
    client_server: 'from-emerald-500/10 to-teal-500/10 border-emerald-200',
    testing_quality: 'from-orange-500/10 to-red-500/10 border-orange-200',
    advanced_concepts: 'from-purple-500/10 to-pink-500/10 border-purple-200',
    production_ready: 'from-slate-500/10 to-gray-500/10 border-slate-200'
  };

  const colorClass = phaseColors[phase.id as keyof typeof phaseColors] || phaseColors.foundation;

  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-2xl shadow-xl border-2 mb-8 overflow-hidden`}>
      <div className="p-8">
        {/* Phase Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">{phase.name}</h2>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed max-w-3xl">{phase.description}</p>
            
            {/* Progress Bar */}
            <div className="max-w-md">
              <ProgressBar 
                progress={progress} 
                label={`Progress • ${completedTasks}/${totalTasks} tasks`}
                size="lg"
                variant="primary"
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-6 p-3 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all duration-200"
            aria-label={isExpanded ? 'Collapse phase' : 'Expand phase'}
          >
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Phase Modules */}
        {isExpanded && (
          <div className="space-y-6 animate-fade-in">
            {phase.modules.map((module) => (
              <Module
                key={module.id}
                module={module}
                isChapterCompleted={isChapterCompleted}
                isExerciseCompleted={isExerciseCompleted}
                onToggleExercise={onToggleExercise}
                onToggleChapter={onToggleChapter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
