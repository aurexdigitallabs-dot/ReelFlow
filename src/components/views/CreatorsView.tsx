import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatorCard } from '../creators/CreatorCard';
import { AddCreatorModal } from '../creators/AddCreatorModal';
import { SearchInput } from '../common/SearchInput';
import { UserPlus, Users } from 'lucide-react';

export const CreatorsView: React.FC = () => {
  const { creators, setSelectedCreatorId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);

  const filteredCreators = creators.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Agency Creators & Roster
          </h2>
          <p className="text-xs text-gray-400">
            Manage agency creators, track content assignments, shoots, and completed social reels ({creators.length} active)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCreatorOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30"
        >
          <UserPlus className="w-4 h-4" /> Add Creator
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search creator by name or @handle..."
        />
      </div>

      {/* Creators Roster Grid */}
      {filteredCreators.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-500 bg-slate-900/50 rounded-2xl border border-slate-800">
          No creators found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onSelect={(id) => setSelectedCreatorId(id)}
            />
          ))}
        </div>
      )}

      {/* Add Creator Modal */}
      <AddCreatorModal
        isOpen={isAddCreatorOpen}
        onClose={() => setIsAddCreatorOpen(false)}
      />
    </div>
  );
};
