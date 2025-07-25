import React from 'react';
import type { OptionalModule } from '../types';

interface OptionalModulesProps {
  optionalModules: OptionalModule[];
}

export const OptionalModules: React.FC<OptionalModulesProps> = ({
  optionalModules
}) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800">Optional Modules</h2>
          <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </div>
        <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
          เนื้อหาเสริมที่สามารถข้ามได้ หรือเรียนเมื่อจบเนื้อหาหลักแล้ว
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {optionalModules.map((module) => (
          <a
            key={module.id}
            href={module.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {module.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {module.description}
                </p>
              </div>
              <svg 
                className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors flex-shrink-0 mt-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
