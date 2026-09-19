import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CalendarViewMode } from '../../types';
import { MonthView } from '../calendar/MonthView';
import { WeekView } from '../calendar/WeekView';
import { ListView } from '../calendar/ListView';
import { CalendarDaySheet } from '../calendar/CalendarDaySheet';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Camera, Send, Filter, Plus } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { setIsFilterSheetOpen, openAddContent, filters } = useApp();
  const { canAddContent } = useAuth();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const hasActiveFilters =
    filters.storeId !== 'all' ||
    filters.creatorId !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.shootStatus !== 'all' ||
    filters.postStatus !== 'all';

  // Month navigation
  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(nextDate.getMonth() - 1);
    } else {
      nextDate.setDate(nextDate.getDate() - 7);
    }
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setDate(nextDate.getDate() + 7);
    }
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthYearTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Calendar Header Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-100">{monthYearTitle}</h2>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Camera className="w-3 h-3" /> Shoots
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                  <Send className="w-3 h-3" /> Posts
                </span>
              </div>
            </div>
          </div>

          {canAddContent && (
            <button
              type="button"
              onClick={() => openAddContent()}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Filter button */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              hasActiveFilters
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-950 text-gray-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>

          {/* Month / Week Navigation */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-900"
              title="Previous"
              aria-label="Previous Period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-gray-300 hover:text-white font-semibold rounded-lg hover:bg-slate-900"
            >
              Today
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-900"
              title="Next"
              aria-label="Next Period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle: Month | Week | List */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['month', 'week', 'list'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {canAddContent && (
            <button
              type="button"
              onClick={() => openAddContent()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> Schedule
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div>
        {viewMode === 'month' && (
          <MonthView currentDate={currentDate} onSelectDate={(dateStr) => setSelectedDateStr(dateStr)} />
        )}
        {viewMode === 'week' && (
          <WeekView currentDate={currentDate} onSelectDate={(dateStr) => setSelectedDateStr(dateStr)} />
        )}
        {viewMode === 'list' && <ListView />}
      </div>

      {/* Tapping a date opens detail bottom sheet */}
      <CalendarDaySheet
        dateStr={selectedDateStr}
        onClose={() => setSelectedDateStr(null)}
      />
    </div>
  );
};
