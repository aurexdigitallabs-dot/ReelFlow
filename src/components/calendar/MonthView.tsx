import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getMonthCalendarGrid, formatDate, formatDayName, getTodayString } from '../../utils/dateUtils';
import { Camera, Send, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ContentCard } from '../content/ContentCard';

interface MonthViewProps {
  currentDate: Date;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, onSelectDate }) => {
  const { filteredContent, openAddContent } = useApp();
  const todayStr = getTodayString();
  const [selectedDayStr, setSelectedDayStr] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = getMonthCalendarGrid(year, month);

  // Content for the mobile-selected day
  const activeShoots = filteredContent.filter((i) => i.shootDate === selectedDayStr);
  const activePosts = filteredContent.filter((i) => i.postDate === selectedDayStr);
  const totalActiveItems = Array.from(new Set([...activeShoots, ...activePosts]));

  const handleCellClick = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    setSelectedDayStr(dateStr);
    onSelectDate(dateStr);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider py-1 border-b border-slate-800">
        {WEEKDAY_NAMES.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {grid.map((cell, idx) => {
          const shoots = filteredContent.filter((i) => i.shootDate === cell.dateStr);
          const posts = filteredContent.filter((i) => i.postDate === cell.dateStr);
          const totalCount = shoots.length + posts.length;
          const isSelected = selectedDayStr === cell.dateStr;

          const isOverdueShoot = shoots.some(
            (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled' && cell.dateStr < todayStr
          );

          return (
            <div
              key={cell.dateStr + idx}
              onClick={(e) => handleCellClick(e, cell.dateStr)}
              className={`min-h-[48px] sm:min-h-[96px] p-1 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all active:scale-95 sm:hover:scale-[1.01] ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/60 shadow-md'
                  : cell.isToday
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-sm ring-1 ring-indigo-500/40'
                  : cell.isCurrentMonth
                  ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-900/60 text-gray-600 opacity-50'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    cell.isToday
                      ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]'
                      : isSelected
                      ? 'text-indigo-300 font-extrabold'
                      : cell.isCurrentMonth
                      ? 'text-gray-200'
                      : 'text-gray-600'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Desktop total badge */}
                {totalCount > 0 && (
                  <span
                    className={`hidden sm:inline-flex badge px-1.5 py-0.5 text-[9px] font-extrabold ${
                      isOverdueShoot ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-indigo-300'
                    }`}
                  >
                    {totalCount}
                  </span>
                )}
              </div>

              {/* Mobile Dots Indicator (< sm) */}
              <div className="sm:hidden flex items-center justify-center gap-1 mt-1">
                {shoots.length > 0 && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                    title={`${shoots.length} shoots`}
                  />
                )}
                {posts.length > 0 && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"
                    title={`${posts.length} posts`}
                  />
                )}
              </div>

              {/* Desktop Details (>= sm) */}
              <div className="hidden sm:flex flex-col gap-1 my-1">
                {shoots.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-semibold truncate">
                    <Camera className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{shoots.length} Shoot{shoots.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                {posts.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-semibold truncate">
                    <Send className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{posts.length} Post{posts.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                {shoots[0] && (
                  <span className="text-[9px] text-gray-400 truncate">
                    • {shoots[0].title}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Integrated Daily Agenda Section (< sm) */}
      <div className="sm:hidden mt-2 flex flex-col gap-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-gray-100">
                {formatDayName(selectedDayStr)}, {formatDate(selectedDayStr)}
              </span>
              <span className="text-[10px] text-gray-400">
                {totalActiveItems.length} Content Item{totalActiveItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openAddContent({ shootDate: selectedDayStr, postDate: selectedDayStr })}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule
          </button>
        </div>

        {totalActiveItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-500 italic flex flex-col items-center gap-2">
            <span>No shoots or posts scheduled on this date.</span>
            <button
              type="button"
              onClick={() => openAddContent({ shootDate: selectedDayStr, postDate: selectedDayStr })}
              className="text-indigo-400 hover:underline font-semibold text-xs mt-1"
            >
              + Plan a shoot or post for this day
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activeShoots.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Shoots ({activeShoots.length})
                </span>
                {activeShoots.map((item) => (
                  <ContentCard key={`m-shoot-${item.id}`} content={item} variant="list" />
                ))}
              </div>
            )}

            {activePosts.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Send className="w-3 h-3" /> Posts ({activePosts.length})
                </span>
                {activePosts.map((item) => (
                  <ContentCard key={`m-post-${item.id}`} content={item} variant="list" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
