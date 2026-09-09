import React from 'react';
import { useApp } from '../../context/AppContext';
import { getMonthCalendarGrid } from '../../utils/dateUtils';
import { Camera, Send } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, onSelectDate }) => {
  const { filteredContent } = useApp();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const grid = getMonthCalendarGrid(year, month);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider py-1 border-b border-slate-800">
        {WEEKDAY_NAMES.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {grid.map((cell, idx) => {
          // Find shoots and posts for this date
          const shoots = filteredContent.filter((i) => i.shootDate === cell.dateStr);
          const posts = filteredContent.filter((i) => i.postDate === cell.dateStr);
          const totalCount = shoots.length + posts.length;

          const isOverdueShoot = shoots.some(
            (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled' && cell.dateStr < new Date().toISOString().split('T')[0]
          );

          return (
            <div
              key={cell.dateStr + idx}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`min-h-[76px] sm:min-h-[96px] p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                cell.isToday
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : cell.isCurrentMonth
                  ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 text-gray-600 opacity-60'
              }`}
            >
              {/* Top row: Day Number & Total Pill */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    cell.isToday
                      ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]'
                      : cell.isCurrentMonth
                      ? 'text-gray-200'
                      : 'text-gray-600'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {totalCount > 0 && (
                  <span
                    className={`badge px-1.5 py-0.5 text-[9px] font-extrabold ${
                      isOverdueShoot ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-indigo-300'
                    }`}
                  >
                    {totalCount} item{totalCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Status Indicators Stack */}
              <div className="flex flex-col gap-1 my-1">
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
              </div>

              {/* Title preview snippet for larger screens */}
              {shoots[0] && (
                <span className="hidden sm:block text-[9px] text-gray-400 truncate">
                  • {shoots[0].title}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
