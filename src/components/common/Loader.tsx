import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
};
