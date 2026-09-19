import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Creator } from '../../types';
import { CreatorCard } from '../creators/CreatorCard';
import { AddCreatorModal } from '../creators/AddCreatorModal';
import { EditCreatorModal } from '../creators/EditCreatorModal';
import { SearchInput } from '../common/SearchInput';
import { UserPlus, Users, ShieldCheck } from 'lucide-react';
import { CardSkeleton, HeaderSkeleton } from '../common/Skeletons';

export const CreatorsView: React.FC = () => {
  const { creators, setSelectedCreatorId, isLoading, openBrandAdminsModal } = useApp();
  const { canManageBrandAdmins } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);

  const filteredCreators = creators.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <HeaderSkeleton />
        <div className="w-full max-w-md h-10 bg-slate-800/50 rounded-xl mb-2 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Agency Creators & Roster
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage agency creators, track content assignments, shoots, and completed social reels ({creators.length} active)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageBrandAdmins && (
            <button
              type="button"
              onClick={() => openBrandAdminsModal()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Brand Admins
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddCreatorOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 transition-transform"
          >
            <UserPlus className="w-4 h-4" /> Add Creator
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search creator by name or @handle..."
        className="max-w-md"
      />

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
              onEdit={(c) => setEditingCreator(c)}
            />
          ))}
        </div>
      )}

      {/* Add Creator Modal */}
      <AddCreatorModal
        isOpen={isAddCreatorOpen}
        onClose={() => setIsAddCreatorOpen(false)}
      />

      {/* Edit Creator Modal */}
      <EditCreatorModal
        creator={editingCreator}
        isOpen={!!editingCreator}
        onClose={() => setEditingCreator(null)}
      />
    </div>
  );
};
