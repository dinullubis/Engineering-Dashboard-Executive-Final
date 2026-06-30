import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 bg-slate-800/50 rounded-xl mb-6"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-800/40 rounded-xl border border-slate-800"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 bg-slate-800/40 rounded-xl border border-slate-800"></div>
        ))}
      </div>
    </div>
  );
};
