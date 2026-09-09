import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusSelector } from '../common/StatusSelector';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { formatDate, isShootOverdue, isPostOverdue, getDaysDifference } from '../../utils/dateUtils';
import { Camera, Send, ExternalLink, AlertTriangle, MoreVertical, Trash2, Edit2, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface ContentCardProps {
  content: ContentItem;
  onEdit?: (item: ContentItem) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content, onEdit }) => {
  const { creators, categories, stores, updateShootStatus, updatePostStatus, deleteContent } = useApp();
  const { canEditContent, canManageCreators } = useAuth();
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Check if current user is authorized to edit this content item
  const isEditable = canEditContent(content);

  // Derive associated creator objects
  const assignedCreators = creators.filter((c) => content.creatorIds.includes(c.id));
  
  // Derive category and store
  const category = categories.find((cat) => cat.id === content.categoryId);
  const store = stores.find((s) => s.id === content.storeId);

  // Overdue checks
  const shootOverdue = isShootOverdue(content.shootDate, content.shootStatus);
  const postOverdue = isPostOverdue(content.postDate, content.postStatus);
  
  const shootOverdueDays = shootOverdue ? getDaysDifference(content.shootDate) : 0;
  const postOverdueDays = postOverdue ? getDaysDifference(content.postDate) : 0;

  // Priority color map
  const priorityColorMap: Record<string, { bg: string; text: string }> = {
    Low: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8' },
    Normal: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
    High: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
    Urgent: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' }
  };

  const priorityStyle = priorityColorMap[content.priority] || priorityColorMap.Normal;

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 relative hover:border-slate-700 transition-all">
      {/* Header Bar: Category Pill, Store Badge, Priority, Menu */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Category Pill */}
          <span
            className="badge px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              backgroundColor: `${category?.color || '#6366f1'}20`,
              color: category?.color || '#818cf8',
              border: `1px solid ${category?.color || '#6366f1'}40`
            }}
          >
            {category?.name || 'Content'}
          </span>

          {/* Store Pill */}
          {store && (
            <span className="badge px-2 py-0.5 text-[10px] bg-slate-800 text-gray-300 border border-slate-700">
              {store.logo} {store.name}
            </span>
          )}

          {/* Priority Pill */}
          <span
            className="badge px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: priorityStyle.bg,
              color: priorityStyle.text
            }}
          >
            {content.priority} Priority
          </span>
        </div>

        {/* Card Options Menu (If editable) */}
        {isEditable && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 z-20 w-32 bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-xl animate-fade-in">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(content);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-slate-800 hover:text-white rounded-lg w-full text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                {canManageCreators && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm('Delete this content item?')) {
                        deleteContent(content.id);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg w-full text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Concept & Title */}
      <div>
        <h4 className="text-sm font-bold text-gray-100 line-clamp-1 break-words">{content.title}</h4>
        <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed break-words">
          {content.concept}
        </p>
      </div>

      {/* Overdue Alerts if applicable */}
      {(shootOverdue || postOverdue) && (
        <div className="flex flex-col gap-1 my-0.5">
          {shootOverdue && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>⚠️ Shoot overdue by {shootOverdueDays} day{shootOverdueDays > 1 ? 's' : ''}</span>
            </div>
          )}
          {postOverdue && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>⚠️ Post overdue by {postOverdueDays} day{postOverdueDays > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Creators & Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
        {/* Creator(s) */}
        <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 min-w-0">
          <span className="text-[11px] text-gray-400 font-medium shrink-0">Creator(s):</span>
          <CreatorAvatar creators={assignedCreators} size="sm" showNames />
        </div>

        {/* Reference Link if available */}
        {content.referenceUrl && (
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 min-w-0">
            <span className="text-[11px] text-gray-400 font-medium shrink-0">Reference:</span>
            <a
              href={content.referenceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline truncate max-w-[120px]"
            >
              <ExternalLink className="w-3 h-3 shrink-0" /> View Link
            </a>
          </div>
        )}
      </div>

      {/* Statuses Grid: Shoot & Post Status Interactive Selectors */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
        {/* Shoot Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Camera className="w-3 h-3 text-amber-400" /> Shoot: {formatDate(content.shootDate)}
          </div>
          <StatusSelector
            type="shoot"
            currentStatus={content.shootStatus}
            onStatusChange={(status) => updateShootStatus(content.id, status)}
            size="sm"
            disabled={!isEditable}
          />
        </div>

        {/* Post Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Send className="w-3 h-3 text-indigo-400" /> Post: {formatDate(content.postDate)}
          </div>
          <StatusSelector
            type="post"
            currentStatus={content.postStatus}
            onStatusChange={(status) => updatePostStatus(content.id, status)}
            size="sm"
            disabled={!isEditable}
          />
        </div>
      </div>

      {/* Expandable Notes section */}
      {content.notes && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-200"
          >
            {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showNotes ? 'Hide Production Notes' : 'View Production Notes'}
          </button>
          {showNotes && (
            <p className="mt-1.5 p-2 bg-slate-900 rounded-lg text-xs text-gray-300 italic border border-slate-800">
              "{content.notes}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
