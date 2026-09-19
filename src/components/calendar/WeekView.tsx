import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getWeekDays, formatDate } from '../../utils/dateUtils';
import { Camera, Send, Plus } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { CreatorAvatar } from '../common/CreatorAvatar';

interface WeekViewProps {
  currentDate: Date;
  onSelectDate: (dateStr: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, onSelectDate }) => {
  const { filteredContent, creators, openAddContent } = useApp();
  const { canAddContent } = useAuth();

  const weekDays = getWeekDays(currentDate);

  return (
    <div className="flex flex-col gap-3">
      {weekDays.map((day) => {
        const shoots = filteredContent.filter((i) => i.shootDate === day.dateStr);
        const posts = filteredContent.filter((i) => i.postDate === day.dateStr);
        const totalItems = Array.from(new Set([...shoots, ...posts]));

        return (
          <div
            key={day.dateStr}
            className={`p-3.5 rounded-2xl border transition-all ${
              day.isToday
                ? 'bg-indigo-950/30 border-indigo-500/80 ring-1 ring-indigo-500/50'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                    day.isToday ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-gray-300'
                  }`}
                >
                  {day.dayName}
                </span>
                <span className="text-sm font-extrabold text-gray-100">{formatDate(day.dateStr)}</span>
                {day.isToday && <span className="text-[10px] text-indigo-400 font-bold">Today</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {totalItems.length} Item{totalItems.length !== 1 ? 's' : ''}
                </span>
                {canAddContent && (
                  <button
                    type="button"
                    onClick={() => openAddContent({ shootDate: day.dateStr })}
                    className="touch-target-44 p-1.5 text-indigo-400 hover:bg-indigo-600/20 rounded-xl flex items-center justify-center transition-colors"
                    title="Schedule content on this day"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Shoots & Posts Cards */}
            {totalItems.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500 italic">
                No shoots or posts scheduled for this day.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Shoots list */}
                {shoots.map((item) => {
                  const itemCreators = creators.filter((c) => item.creatorIds.includes(c.id));
                  return (
                    <div
                      key={`w-shoot-${item.id}`}
                      onClick={() => onSelectDate(day.dateStr)}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start justify-between gap-2.5 cursor-pointer hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 uppercase tracking-wider">
                          <Camera className="w-3 h-3" /> Shoot Scheduled
                        </span>
                        <h5 className="text-xs font-bold text-gray-100 truncate mt-0.5">{item.title}</h5>
                        <span className="text-[11px] text-gray-400 truncate">{item.concept}</span>
                        <div className="mt-2 flex items-center gap-1.5">
                          <CreatorAvatar creators={itemCreators} size="sm" showNames />
                        </div>
                      </div>
                      <StatusBadge type="shoot" status={item.shootStatus} size="sm" />
                    </div>
                  );
                })}

                {/* Posts list */}
                {posts.map((item) => {
                  const itemCreators = creators.filter((c) => item.creatorIds.includes(c.id));
                  return (
                    <div
                      key={`w-post-${item.id}`}
                      onClick={() => onSelectDate(day.dateStr)}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start justify-between gap-2.5 cursor-pointer hover:border-indigo-500/50 transition-colors"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 uppercase tracking-wider">
                          <Send className="w-3 h-3" /> Post Scheduled
                        </span>
                        <h5 className="text-xs font-bold text-gray-100 truncate mt-0.5">{item.title}</h5>
                        <span className="text-[11px] text-gray-400 truncate">{item.concept}</span>
                        <div className="mt-2 flex items-center gap-1.5">
                          <CreatorAvatar creators={itemCreators} size="sm" showNames />
                        </div>
                      </div>
                      <StatusBadge type="post" status={item.postStatus} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
