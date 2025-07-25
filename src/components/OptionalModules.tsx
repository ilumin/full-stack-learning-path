import React from 'react';
import type { OptionalModule } from '../types';

interface OptionalModulesProps {
  optionalModules: OptionalModule[];
}

export const OptionalModules: React.FC<OptionalModulesProps> = ({
  optionalModules
}) => {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔶 Optional Modules
      </h2>
      <p className="text-gray-700 mb-6">
        เนื้อหาเสริมที่สามารถข้ามได้ หรือเรียนเมื่อจบเนื้อหาหลักแล้ว
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optionalModules.map((module) => (
          <div
            key={module.id}
            className="bg-white border border-yellow-300 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              <a
                href={module.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-700 hover:text-yellow-900 hover:underline"
              >
                {module.name}
              </a>
            </h3>
            <p className="text-gray-600 text-sm">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
