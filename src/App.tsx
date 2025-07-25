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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const totalTasks = calculateTotalExercises(learningPath);
  const completedTasks = Object.values({}).filter(Boolean).length; // This will be updated by useProgress

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              FullStack Open Learning Path
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              คอร์สสำหรับเรียนรู้ Full Stack Web Development จาก University of Helsinki
            </p>
            <div className="max-w-md mx-auto">
              <ProgressBar 
                progress={totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}
                label="Overall Progress"
                size="lg"
              />
            </div>
          </div>
          
          <div className="text-center">
            <a
              href="https://fullstackopen.com/en/#course-contents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Official Course
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Core Learning Phases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🎯 Core Learning Path
          </h2>
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

        {/* Optional Modules */}
        {learningPath.optional_modules && learningPath.optional_modules.length > 0 && (
          <OptionalModules optionalModules={learningPath.optional_modules} />
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Built with ❤️ for learning Full Stack Development
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Progress is automatically saved in your browser
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
