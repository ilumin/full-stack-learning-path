import React, { useState, useMemo } from 'react';
import type { LearningPath } from '../types';
import { ProgressBar } from './ProgressBar';
import { ProgressManager } from './ProgressManager';
import { calculateTotalExercises, generateChapterId, generateExerciseId } from '../utils/learningPath';

interface SidebarProps {
  learningPath: LearningPath;
  progress: Record<string, boolean>;
  isChapterCompleted: (chapterId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
  onNavigate: (phaseId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  learningPath,
  progress,
  isChapterCompleted,
  isExerciseCompleted,
  onNavigate
}) => {
  const [showProgressManager, setShowProgressManager] = useState(false);

  // Calculate overall stats
  const totalTasks = calculateTotalExercises(learningPath);

  // Calculate completed tasks the same way as phases do
  const completedTasks = learningPath.phases.reduce((total, phase) => {
    return total + phase.modules.reduce((moduleTotal, module) => {
      return moduleTotal + module.chapters.reduce((chapterTotal, chapter) => {
        let count = 0;

        // Check chapter completion
        const chapterId = generateChapterId(module.id, chapter.id);
        if (isChapterCompleted(chapterId)) count++;

        // Check exercise completion
        chapter.exercises.forEach((_, index) => {
          const exerciseId = generateExerciseId(module.id, chapter.id, index);
          if (isExerciseCompleted(exerciseId)) count++;
        });

        return chapterTotal + count;
      }, 0);
    }, 0);
  }, 0);

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate phase stats - use useMemo to recalculate when progress changes
  const phaseStats = useMemo(() => {
    return learningPath.phases.map(phase => {
      const phaseTotalTasks = phase.modules.reduce((total, module) => {
        return total + module.chapters.reduce((chapterTotal, chapter) => {
          return chapterTotal + chapter.exercises.length + 1; // +1 for chapter completion
        }, 0);
      }, 0);

      const phaseCompletedTasks = phase.modules.reduce((completed, module) => {
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

      return {
        id: phase.id,
        name: phase.name,
        progress: phaseTotalTasks > 0 ? Math.round((phaseCompletedTasks / phaseTotalTasks) * 100) : 0,
        completed: phaseCompletedTasks,
        total: phaseTotalTasks
      };
    });
  }, [learningPath.phases, progress, isChapterCompleted, isExerciseCompleted]);

  const completedPhases = phaseStats.filter(phase => phase.progress === 100).length;

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        {/* Progress Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Progress Overview</h2>
            <button
              onClick={() => setShowProgressManager(!showProgressManager)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Manage Progress"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>

          {!showProgressManager && (
            <div className="space-y-4">
              {/* Overall Progress */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Overall Progress</span>
                  <span className="text-xl font-bold text-blue-600">{overallProgress}%</span>
                </div>
                <ProgressBar progress={overallProgress} size="md" showPercentage={false} />
                <div className="flex justify-between text-xs text-blue-600 mt-2">
                  <span>{completedTasks} completed</span>
                  <span>{totalTasks - completedTasks} remaining</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div className="text-lg font-bold text-green-600">{completedPhases}</div>
                  <div className="text-xs text-green-600">Phases Done</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-center">
                  <div className="text-lg font-bold text-orange-600">{learningPath.phases.length}</div>
                  <div className="text-xs text-orange-600">Total Phases</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Manager */}
          {showProgressManager && (
            <div className="mt-4">
              <ProgressManager onClose={() => setShowProgressManager(false)} />
            </div>
          )}
        </div>

        {!showProgressManager && (
          <>
            {/* Navigation */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-slate-800 mb-3">Learning Phases</h3>
              <div className="space-y-2">
                {phaseStats.map((phase, index) => (
                  <button
                    key={phase.id}
                    onClick={() => onNavigate(phase.id)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-800 truncate">{phase.name}</span>
                    </div>
                    <div className="ml-9">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">{phase.completed}/{phase.total} tasks</span>
                        <span className="text-xs font-mono text-slate-500">{phase.progress}%</span>
                      </div>
                      <ProgressBar progress={phase.progress} size="sm" showPercentage={false} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-slate-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="https://fullstackopen.com/en/#course-contents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Course Website
                </a>

                <a
                  href="https://github.com/fullstack-hy2020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Course Repository
                </a>

                <a
                  href="https://discord.gg/fullstackopen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.942 8.305c-.197-1.77-1.153-3.273-2.531-4.222-.13-.089-.275-.152-.432-.188-.156-.036-.318-.039-.476-.009-.329.063-.621.23-.828.473l-.414.486c-.832-.157-1.686-.235-2.549-.233-.863-.002-1.717.076-2.549.233l-.414-.486c-.207-.243-.499-.41-.828-.473-.158-.03-.32-.027-.476.009-.157.036-.302.099-.432.188-1.378.949-2.334 2.453-2.531 4.222-1.076 1.963-1.641 4.103-1.641 6.269 0 .269.105.527.293.716 1.153 1.162 2.703 1.958 4.414 2.266.29.052.584-.032.803-.229.218-.197.354-.473.372-.757l.186-2.944c.717.133 1.456.2 2.2.2s1.483-.067 2.2-.2l.186 2.944c.018.284.154.56.372.757.219.197.513.281.803.229 1.711-.308 3.261-1.104 4.414-2.266.188-.189.293-.447.293-.716 0-2.166-.565-4.306-1.641-6.269zm-7.084 5.045c-.691 0-1.25-.559-1.25-1.25s.559-1.25 1.25-1.25 1.25.559 1.25 1.25-.559 1.25-1.25 1.25zm2.284 0c-.691 0-1.25-.559-1.25-1.25s.559-1.25 1.25-1.25 1.25.559 1.25 1.25-.559 1.25-1.25 1.25z" />
                  </svg>
                  Join Discord
                </a>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Pro Tip
              </h4>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Your progress is automatically saved in your browser. Use the settings button above to export, import, or backup your progress.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
