import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { ShootStatus, PostStatus, Priority } from '../../types';
import { RotateCcw } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { INITIAL_CATEGORIES } from '../../data/seedData';

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

  const activeCategories = categories.length > 0 ? categories : INITIAL_CATEGORIES;

  const storeOptions = [
    { value: 'all', label: 'All Brands & Stores' },
    ...stores.map((s) => ({
      value: s.id,
      label: s.name // ONLY display store name
    }))
  ];

  const creatorOptions = [
    { value: 'all', label: 'All Creators' },
    ...creators.map((c) => ({
      value: c.id,
      label: c.name,
      sublabel: `@${c.username}`
    }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...activeCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
      color: cat.color
    }))
  ];

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
        <CustomSelect
          label="Brand / Store"
          options={storeOptions}
          value={filters.storeId}
          onChange={(val) => setFilters((prev) => ({ ...prev, storeId: val }))}
        />

        {/* Creator Filter */}
        <CustomSelect
          label="Creator"
          searchable
          searchPlaceholder="Search creator..."
          options={creatorOptions}
          value={filters.creatorId}
          onChange={(val) => setFilters((prev) => ({ ...prev, creatorId: val }))}
        />

        {/* Category Filter */}
        <CustomSelect
          label="Category"
          searchable
          searchPlaceholder="Search category..."
          options={categoryOptions}
          value={filters.categoryId}
          onChange={(val) => setFilters((prev) => ({ ...prev, categoryId: val }))}
        />


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
