import React, { useState } from 'react';
import { CalendarViewMode } from '../../types';
import { MonthView } from '../calendar/MonthView';
import { WeekView } from '../calendar/WeekView';
import { ListView } from '../calendar/ListView';
import { CalendarDaySheet } from '../calendar/CalendarDaySheet';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Camera, Send } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

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
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Calendar Header Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-100">{monthYearTitle}</h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400">
                <Camera className="w-3 h-3" /> Shoots
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <Send className="w-3 h-3" /> Posts
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Month / Week Navigation */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-900"
              title="Previous"
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
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
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
