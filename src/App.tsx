import { useState, useEffect, useRef } from 'react';
import type { LearningPath } from './types';
import { loadLearningPath, calculateTotalExercises } from './utils/learningPath';
import { useProgress } from './hooks/useProgress';
import { Phase, OptionalModules, ProgressBar, Sidebar } from './components';
import './index.css';

function App() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const phaseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const {
    progress,
    toggleExercise,
    toggleChapter,
    isExerciseCompleted,
    isChapterCompleted
  } = useProgress();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadLearningPath();
        setLearningPath(data);
      } catch (err) {
        setError('Failed to load learning path data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigateToPhase = (phaseId: string) => {
    const element = phaseRefs.current[phaseId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-medium">{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const totalTasks = calculateTotalExercises(learningPath);
  const completedTasks = Object.values(progress).filter(Boolean).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">FullStack Open</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-32">
                <ProgressBar
                  progress={overallProgress}
                  size="sm"
                  showPercentage={false}
                />
              </div>
              <span className="text-sm text-slate-600 font-mono">{completedTasks}/{totalTasks}</span>
            </div>
            <a
              href="https://fullstackopen.com/en/#course-contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Course</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            learningPath={learningPath}
            progress={progress}
            isChapterCompleted={isChapterCompleted}
            isExerciseCompleted={isExerciseCompleted}
            onNavigate={handleNavigateToPhase}
          />
        </div>

        {/* Sidebar - Mobile */}
        {showSidebar && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSidebar(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 z-50 h-full">
              <Sidebar
                learningPath={learningPath}
                progress={progress}
                isChapterCompleted={isChapterCompleted}
                isExerciseCompleted={isExerciseCompleted}
                onNavigate={(phaseId) => {
                  handleNavigateToPhase(phaseId);
                  setShowSidebar(false);
                }}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {learningPath.phases.map((phase) => (
                <div
                  key={phase.id}
                  ref={(el) => (phaseRefs.current[phase.id] = el)}
                >
                  <Phase
                    phase={phase}
                    isChapterCompleted={isChapterCompleted}
                    isExerciseCompleted={isExerciseCompleted}
                    onToggleExercise={toggleExercise}
                    onToggleChapter={toggleChapter}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Optional Modules */}
          {learningPath.optional_modules && learningPath.optional_modules.length > 0 && (
            <section className="mt-8 max-w-4xl mx-auto">
              <OptionalModules optionalModules={learningPath.optional_modules} />
            </section>
          )}

          {/* Footer */}
          <footer className="text-center py-6 mt-8 text-xs text-slate-500">
            Progress saved locally • Built with React + TypeScript
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
