import React from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../content/ContentCard';

export const ListView: React.FC = () => {
  const { filteredContent } = useApp();

  // Sort content chronologically by shootDate then postDate
  const sortedContent = [...filteredContent].sort((a, b) => {
    return new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime();
  });

  if (sortedContent.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
        No content items match the current schedule or filters.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedContent.map((item) => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  );
};
