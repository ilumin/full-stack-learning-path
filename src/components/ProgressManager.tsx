import React, { useState } from 'react';
import { useProgress } from '../hooks/useProgress';

interface ProgressManagerProps {
  onClose?: () => void;
}

export const ProgressManager: React.FC<ProgressManagerProps> = ({ onClose }) => {
  const {
    exportProgress,
    importProgress,
    resetProgress,
    restoreFromBackup,
    getProgressStats,
    debugStorage,
    isLoaded
  } = useProgress();

  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const stats = getProgressStats();

  const handleExport = () => {
    try {
      const data = exportProgress();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fullstack-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Progress exported successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to export progress' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setMessage({ type: 'error', text: 'Please paste your progress data' });
        return;
      }

      const success = importProgress(importData);
      if (success) {
        setMessage({ type: 'success', text: 'Progress imported successfully!' });
        setImportData('');
        setShowImport(false);
      } else {
        setMessage({ type: 'error', text: 'Invalid progress data format' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to import progress' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone. (A backup will be created automatically)')) {
      resetProgress();
      setMessage({ type: 'success', text: 'Progress reset successfully! Backup created.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRestore = () => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite your current progress.')) {
      const success = restoreFromBackup();
      if (success) {
        setMessage({ type: 'success', text: 'Progress restored from backup!' });
      } else {
        setMessage({ type: 'error', text: 'No backup found or restore failed' });
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCopyToClipboard = () => {
    try {
      const data = exportProgress();
      navigator.clipboard.writeText(data);
      setMessage({ type: 'success', text: 'Progress copied to clipboard!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to copy to clipboard' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Progress Manager</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Learning Statistics</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-800 font-medium">Overall Progress</div>
              <div className="text-xl font-bold text-blue-600">{stats.completionRate}%</div>
              <div className="text-xs text-blue-600">{stats.completedItems}/{stats.totalItems} items</div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-800 font-medium">Chapters</div>
              <div className="text-xl font-bold text-green-600">{stats.chapterCompletionRate}%</div>
              <div className="text-xs text-green-600">{stats.completedChapters}/{stats.totalChapters} done</div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-purple-800 font-medium">Exercises</div>
              <div className="text-xl font-bold text-purple-600">{stats.exerciseCompletionRate}%</div>
              <div className="text-xs text-purple-600">{stats.completedExercises}/{stats.totalExercises} done</div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-orange-800 font-medium">Total Items</div>
              <div className="text-xl font-bold text-orange-600">{stats.totalItems}</div>
              <div className="text-xs text-orange-600">tracked items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Manage Progress</h4>

        {/* Export/Import */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              📥 Export
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              📋 Copy
            </button>
          </div>

          <button
            onClick={() => setShowImport(!showImport)}
            className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            📤 Import Progress
          </button>
        </div>

        {/* Import Interface */}
        {showImport && (
          <div className="space-y-2">
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your exported progress data here..."
              className="w-full h-32 p-2 text-xs border border-slate-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleImport}
                className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportData('');
                }}
                className="flex-1 px-3 py-2 text-sm bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Backup/Restore */}
        <div className="flex gap-2">
          <button
            onClick={handleRestore}
            className="flex-1 px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            🔄 Restore Backup
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            🗑️ Reset All
          </button>
        </div>

        {/* Debug Section */}
        <div className="pt-4 border-t border-slate-200">
          <h5 className="text-xs font-medium text-slate-600 mb-2">Debug Tools</h5>
          <div className="flex gap-2">
            <button
              onClick={debugStorage}
              className="flex-1 px-3 py-2 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              🐛 Debug Storage
            </button>
            <div className="flex items-center text-xs text-slate-500">
              Loaded: {isLoaded ? '✅' : '❌'}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 leading-relaxed">
            💡 <strong>Tips:</strong> Export your progress regularly as backup.
            All data is stored locally in your browser. Clearing browser data will remove your progress.
          </p>
        </div>
      </div>
    </div>
  );
};
