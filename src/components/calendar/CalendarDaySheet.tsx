import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { ContentCard } from '../content/ContentCard';
import { formatDate, formatDayName } from '../../utils/dateUtils';
import { Camera, Send, Plus } from 'lucide-react';

interface CalendarDaySheetProps {
  dateStr: string | null;
  onClose: () => void;
}

export const CalendarDaySheet: React.FC<CalendarDaySheetProps> = ({ dateStr, onClose }) => {
  const { filteredContent, openAddContent } = useApp();

  if (!dateStr) return null;

  // Filter shoots on this date
  const dayShoots = filteredContent.filter((i) => i.shootDate === dateStr);
  // Filter posts on this date
  const dayPosts = filteredContent.filter((i) => i.postDate === dateStr);

  const totalDayItems = Array.from(new Set([...dayShoots, ...dayPosts]));

  return (
    <BottomSheet
      isOpen={!!dateStr}
      onClose={onClose}
      title={`Schedule for ${formatDayName(dateStr)}, ${formatDate(dateStr)}`}
      subtitle={`${totalDayItems.length} Content Item${totalDayItems.length !== 1 ? 's' : ''} Scheduled`}
    >
      <div className="flex flex-col gap-4">
        {/* Quick Add Content on this Date button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            openAddContent({ shootDate: dateStr, postDate: dateStr });
          }}
          className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule New Content on {formatDate(dateStr)}
        </button>

        {/* Shoots Section */}
        <div>
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
            <Camera className="w-4 h-4" /> Shoots Scheduled ({dayShoots.length})
          </h4>
          {dayShoots.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-2 bg-slate-900/50 rounded-xl border border-slate-800">
              No shoots scheduled for this date.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {dayShoots.map((item) => (
                <ContentCard key={`shoot-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div>
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
            <Send className="w-4 h-4" /> Posts Scheduled ({dayPosts.length})
          </h4>
          {dayPosts.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-2 bg-slate-900/50 rounded-xl border border-slate-800">
              No social media posts scheduled for this date.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {dayPosts.map((item) => (
                <ContentCard key={`post-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
