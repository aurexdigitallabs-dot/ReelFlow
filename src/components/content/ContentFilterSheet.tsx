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
        <CustomSelect
          label="Shoot Status"
          options={[
            { value: 'all', label: 'All Shoot Statuses' },
            { value: 'Not Started', label: 'Not Started' },
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Shot', label: 'Shot' },
            { value: 'Cancelled', label: 'Cancelled' }
          ]}
          value={filters.shootStatus}
          onChange={(val) => setFilters((prev) => ({ ...prev, shootStatus: val }))}
        />

        {/* Post Status Filter */}
        <CustomSelect
          label="Post Status"
          options={[
            { value: 'all', label: 'All Post Statuses' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Editing', label: 'Editing' },
            { value: 'Ready', label: 'Ready to Post' },
            { value: 'Posted', label: 'Posted' },
            { value: 'Cancelled', label: 'Cancelled' }
          ]}
          value={filters.postStatus}
          onChange={(val) => setFilters((prev) => ({ ...prev, postStatus: val }))}
        />

        {/* Priority Filter */}
        <CustomSelect
          label="Priority"
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'Low', label: 'Low Priority' },
            { value: 'Normal', label: 'Normal Priority' },
            { value: 'High', label: 'High Priority' },
            { value: 'Urgent', label: 'Urgent Priority' }
          ]}
          value={filters.priority}
          onChange={(val) => setFilters((prev) => ({ ...prev, priority: val }))}
        />

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
