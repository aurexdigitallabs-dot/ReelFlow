import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { ContentCard } from '../content/ContentCard';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { Phone, Mail, AtSign, Calendar, Tag } from 'lucide-react';

interface CreatorDetailModalProps {
  creatorId: string;
  onClose: () => void;
}

export const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({ creatorId, onClose }) => {
  const { creators, content, categories } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'assignments' | 'shoots' | 'posts' | 'completed'>('assignments');

  const creator = creators.find((c) => c.id === creatorId);
  if (!creator) return null;

  // Filter content assigned to this creator
  const assignedContent = content.filter((item) => item.creatorIds.includes(creator.id));

  // Date bounds for week & month calculations
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Weekly Stats
  const thisWeekItems = assignedContent.filter((item) => new Date(item.shootDate) >= weekStart);
  const weekAssigned = thisWeekItems.length;
  const weekCompleted = thisWeekItems.filter((i) => i.postStatus === 'Posted').length;
  const weekPending = weekAssigned - weekCompleted;

  // Monthly Stats
  const thisMonthItems = assignedContent.filter((item) => new Date(item.shootDate) >= monthStart);
  const monthAssigned = thisMonthItems.length;
  const monthCompleted = thisMonthItems.filter((i) => i.postStatus === 'Posted').length;
  const monthPending = monthAssigned - monthCompleted;

  // Category distribution calculation
  const categoryCounts: Record<string, number> = {};
  assignedContent.forEach((item) => {
    categoryCounts[item.categoryId] = (categoryCounts[item.categoryId] || 0) + 1;
  });

  // Filtered lists for sub-tabs
  const upcomingShoots = assignedContent.filter(
    (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled'
  );
  const upcomingPosts = assignedContent.filter(
    (i) => i.postStatus !== 'Posted' && i.postStatus !== 'Cancelled'
  );
  const completedList = assignedContent.filter((i) => i.postStatus === 'Posted');

  const getSubTabList = () => {
    switch (activeSubTab) {
      case 'assignments':
        return assignedContent;
      case 'shoots':
        return upcomingShoots;
      case 'posts':
        return upcomingPosts;
      case 'completed':
        return completedList;
      default:
        return assignedContent;
    }
  };

  const displayedList = getSubTabList();

  return (
    <BottomSheet isOpen={true} onClose={onClose} maxHeight="90vh">
      <div className="flex flex-col gap-5">
        {/* Creator Header Profile */}
        <div className="flex items-start justify-between gap-4 p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <CreatorAvatar creator={creator} size="lg" />
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-gray-100">{creator.name}</h3>
              <a
                href={`https://instagram.com/${creator.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-pink-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <AtSign className="w-3.5 h-3.5" /> @{creator.username}
              </a>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 flex-wrap">
                {creator.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-500" /> {creator.phone}
                  </span>
                )}
                {creator.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-500" /> {creator.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <span
            className={`badge px-2.5 py-1 text-xs font-semibold ${
              creator.status === 'Active'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-gray-400'
            }`}
          >
            {creator.status}
          </span>
        </div>

        {/* Weekly & Monthly Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* This Week Stats */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> This Week Contribution
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <span className="text-[10px] text-gray-400 block">Assigned</span>
                <span className="text-sm font-extrabold text-gray-200">{weekAssigned}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Completed</span>
                <span className="text-sm font-extrabold text-emerald-400">{weekCompleted}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Pending</span>
                <span className="text-sm font-extrabold text-amber-400">{weekPending}</span>
              </div>
            </div>
          </div>

          {/* This Month Stats */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> This Month Contribution
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <span className="text-[10px] text-gray-400 block">Assigned</span>
                <span className="text-sm font-extrabold text-gray-200">{monthAssigned}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Completed</span>
                <span className="text-sm font-extrabold text-emerald-400">{monthCompleted}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Pending</span>
                <span className="text-sm font-extrabold text-amber-400">{monthPending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Categories Breakdown Chips */}
        <div>
          <span className="text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-indigo-400" /> Content Categories
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              if (count === 0) return null;
              return (
                <span
                  key={cat.id}
                  className="badge px-2.5 py-1 text-[11px]"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    color: cat.color,
                    border: `1px solid ${cat.color}40`
                  }}
                >
                  {cat.name} ({count})
                </span>
              );
            })}
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('assignments')}
            className={`px-3 py-1.5 font-semibold rounded-lg shrink-0 ${
              activeSubTab === 'assignments'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All Content ({assignedContent.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('shoots')}
            className={`px-3 py-1.5 font-semibold rounded-lg shrink-0 ${
              activeSubTab === 'shoots'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Upcoming Shoots ({upcomingShoots.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('posts')}
            className={`px-3 py-1.5 font-semibold rounded-lg shrink-0 ${
              activeSubTab === 'posts'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Upcoming Posts ({upcomingPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('completed')}
            className={`px-3 py-1.5 font-semibold rounded-lg shrink-0 ${
              activeSubTab === 'completed'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Completed ({completedList.length})
          </button>
        </div>

        {/* Content Items List */}
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
          {displayedList.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 bg-slate-900/50 rounded-xl border border-slate-800">
              No content items found in this section.
            </div>
          ) : (
            displayedList.map((item) => <ContentCard key={item.id} content={item} />)
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
