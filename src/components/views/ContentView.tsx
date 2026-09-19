import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ContentCard } from '../content/ContentCard';
import { SearchInput } from '../common/SearchInput';
import { ContentItem, PostStatus } from '../../types';
import { Filter, LayoutGrid, List, Columns, Plus, RotateCcw, Search } from 'lucide-react';
import { CardSkeleton, HeaderSkeleton } from '../common/Skeletons';

export const ContentView: React.FC = () => {
  const { canAddContent } = useAuth();
  const {
    filteredContent,
    filters,
    setFilters,
    resetFilters,
    setIsFilterSheetOpen,
    openAddContent,
    isLoading
  } = useApp();

  const [viewStyle, setViewStyle] = useState<'grid' | 'list' | 'pipeline'>('grid');

  const hasActiveFilters =
    filters.storeId !== 'all' ||
    filters.creatorId !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.shootStatus !== 'all' ||
    filters.postStatus !== 'all' ||
    filters.priority !== 'all' ||
    filters.searchQuery.trim() !== '';

  const pipelineColumns: { status: PostStatus; label: string; color: string }[] = [
    { status: 'Pending', label: 'Pending Edit', color: 'border-gray-700' },
    { status: 'Editing', label: 'In Editing', color: 'border-blue-500/40' },
    { status: 'Ready', label: 'Ready to Post', color: 'border-emerald-500/60' },
    { status: 'Posted', label: 'Posted on Social', color: 'border-purple-500/40' }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
          <h2 className="text-lg font-extrabold text-gray-100">Content Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            All content concepts, shoot dates, edit progress, and social post schedules ({filteredContent.length} items)
          </p>
        </div>

        {canAddContent && (
          <button
            type="button"
            onClick={() => openAddContent()}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" /> Create Content
          </button>
        )}
      </header>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput
          value={filters.searchQuery}
          onChange={(val) => setFilters((prev) => ({ ...prev, searchQuery: val }))}
        />

        {/* Mobile Filter Sheet Button */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            hasActiveFilters
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50'
              : 'bg-slate-900 text-gray-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </button>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="p-2 text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* View Mode Toggle: Grid | List | Pipeline */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs ml-auto">
          <button
            type="button"
            onClick={() => setViewStyle('grid')}
            className={`p-1.5 rounded-lg cursor-pointer ${
              viewStyle === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewStyle('list')}
            className={`p-1.5 rounded-lg cursor-pointer ${
              viewStyle === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Compact List View"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewStyle('pipeline')}
            className={`p-1.5 rounded-lg cursor-pointer ${
              viewStyle === 'pipeline' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Kanban Pipeline Board"
          >
            <Columns className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Display */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-16 text-xs text-gray-500 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-gray-400">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <span className="font-bold text-gray-400 text-sm">No content items match your current search or filter criteria.</span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-indigo-400 hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewStyle === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : viewStyle === 'list' ? (
        <div className="flex flex-col gap-3">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} content={item} variant="list" />
          ))}
        </div>
      ) : (
        /* Kanban Pipeline Board */
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 no-scrollbar">
          {pipelineColumns.map((col) => {
            const colItems = filteredContent.filter((i) => i.postStatus === col.status);
            return (
              <div
                key={col.status}
                className={`p-3 bg-slate-900/50 border ${col.color} rounded-2xl flex flex-col gap-3 min-w-[260px]`}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-gray-200">{col.label}</span>
                  <span className="badge px-2 py-0.5 text-[10px] bg-slate-800 text-gray-300 font-semibold">
                    {colItems.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
                  {colItems.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-gray-500 italic">
                      No items in this column
                    </div>
                  ) : (
                    colItems.map((item) => <ContentCard key={item.id} content={item} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
