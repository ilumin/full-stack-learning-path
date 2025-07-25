import { useState, useEffect } from 'react';
import type { LearningPath } from './types';
import { loadLearningPath, calculateTotalExercises } from './utils/learningPath';
import { useProgress } from './hooks/useProgress';
import { Phase, OptionalModules, ProgressBar } from './components';
import './index.css';

function App() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FullStack Open
              </h1>
            </div>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Complete learning path for Full Stack Web Development from University of Helsinki
            </p>
            
            {/* Overall Progress */}
            <div className="max-w-md mx-auto mb-6">
              <ProgressBar 
                progress={overallProgress}
                label="Overall Progress"
                size="lg"
                variant="primary"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://fullstackopen.com/en/#course-contents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Course
              </a>
              
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>{completedTasks} completed</span>
                </div>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  <span>{totalTasks - completedTasks} remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Core Learning Phases */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Core Learning Path</h2>
            <p className="text-slate-600">Essential phases to master full-stack development</p>
          </div>
          
          <div className="space-y-8">
            {learningPath.phases.map((phase) => (
              <Phase
                key={phase.id}
                phase={phase}
                isChapterCompleted={isChapterCompleted}
                isExerciseCompleted={isExerciseCompleted}
                onToggleExercise={toggleExercise}
                onToggleChapter={toggleChapter}
              />
            ))}
          </div>
        </section>

        {/* Optional Modules */}
        {learningPath.optional_modules && learningPath.optional_modules.length > 0 && (
          <section className="mb-12">
            <OptionalModules optionalModules={learningPath.optional_modules} />
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-slate-600">Built with</span>
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-600">for learning</span>
          </div>
          <p className="text-sm text-slate-500">
            Progress automatically saved in your browser • Built with React + TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
