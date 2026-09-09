import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { ShootStatus, PostStatus, Priority } from '../../types';
import { RotateCcw } from 'lucide-react';

export const ContentFilterSheet: React.FC = () => {
  const {
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    filters,
    setFilters,
    resetFilters,
    stores,
    creators,
    categories
  } = useApp();

  return (
    <BottomSheet
      isOpen={isFilterSheetOpen}
      onClose={() => setIsFilterSheetOpen(false)}
      title="Filter Content"
      subtitle="Narrow down content by brand, creator, status, or category"
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        {/* Store Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Brand / Store</label>
          <select
            value={filters.storeId}
            onChange={(e) => setFilters((prev) => ({ ...prev, storeId: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-gray-100">All Brands & Stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-gray-100">
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Creator Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Creator</label>
          <select
            value={filters.creatorId}
            onChange={(e) => setFilters((prev) => ({ ...prev, creatorId: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-gray-100">All Creators</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-gray-100">
                {c.name} (@{c.username})
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Category</label>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-gray-100">All Categories</option>
            {(categories.length > 0 ? categories : []).map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900 text-gray-100">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shoot Status Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Shoot Status</label>
          <select
            value={filters.shootStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, shootStatus: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none"
          >
            <option value="all">All Shoot Statuses</option>
            {(['Not Started', 'Scheduled', 'Shot', 'Cancelled'] as ShootStatus[]).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Post Status Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Post Status</label>
          <select
            value={filters.postStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, postStatus: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none"
          >
            <option value="all">All Post Statuses</option>
            {(['Pending', 'Editing', 'Ready', 'Posted', 'Cancelled'] as PostStatus[]).map((st) => (
              <option key={st} value={st}>
                {st === 'Ready' ? 'Ready to Post' : st}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            {(['Low', 'Normal', 'High', 'Urgent'] as Priority[]).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Done button */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(false)}
          className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
        >
          Apply Filters
        </button>
      </div>
    </BottomSheet>
  );
};
