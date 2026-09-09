import React from 'react';
import { Creator } from '../../types';
import { useApp } from '../../context/AppContext';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { Phone, ChevronRight, Video, CheckCircle2, Clock, AtSign } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onSelect: (creatorId: string) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onSelect }) => {
  const { content } = useApp();

  // Derived content counts for this creator
  const assignedItems = content.filter((item) => item.creatorIds.includes(creator.id));
  const totalCount = assignedItems.length;
  const completedCount = assignedItems.filter((item) => item.postStatus === 'Posted').length;
  const pendingCount = assignedItems.filter(
    (item) => item.postStatus !== 'Posted' && item.postStatus !== 'Cancelled'
  ).length;

  return (
    <div
      onClick={() => onSelect(creator.id)}
      className="glass-panel p-4 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg transition-all group"
    >
      {/* Top Header: Avatar, Name, Handle, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CreatorAvatar creator={creator} size="lg" />
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors truncate">
              {creator.name}
            </h4>
            <a
              href={`https://instagram.com/${creator.username}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-400 hover:text-indigo-400 flex items-center gap-1 truncate"
            >
              <AtSign className="w-3 h-3 text-pink-500" />
              @{creator.username}
            </a>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`badge px-2 py-0.5 text-[10px] ${
            creator.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-gray-400 border border-slate-700'
          }`}
        >
          {creator.status}
        </span>
      </div>

      {/* Bio excerpt if available */}
      {creator.bio && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic">
          "{creator.bio}"
        </p>
      )}

      {/* Content Counts Grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <Video className="w-3 h-3 text-indigo-400" /> Total
          </span>
          <span className="text-sm font-extrabold text-gray-100 mt-0.5">{totalCount}</span>
        </div>

        <div className="flex flex-col items-center border-x border-slate-800/80">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
          </span>
          <span className="text-sm font-extrabold text-emerald-400 mt-0.5">{completedCount}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <Clock className="w-3 h-3 text-amber-400" /> Pending
          </span>
          <span className="text-sm font-extrabold text-amber-400 mt-0.5">{pendingCount}</span>
        </div>
      </div>

      {/* Footer Contact & View Profile Link */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-3">
          {creator.phone && (
            <span className="flex items-center gap-1 text-[11px]" title={creator.phone}>
              <Phone className="w-3 h-3 text-gray-500" /> {creator.phone}
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
          View Profile <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
