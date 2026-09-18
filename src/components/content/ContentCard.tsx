import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ContentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusSelector } from '../common/StatusSelector';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { formatDate, isShootOverdue, isPostOverdue, getDaysDifference } from '../../utils/dateUtils';
import { Camera, Send, ExternalLink, AlertTriangle, MoreVertical, Trash2, Edit2, Copy, ChevronDown, ChevronUp, Building2, Users, CheckCircle2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { BottomSheet } from '../common/BottomSheet';

interface ContentCardProps {
  content: ContentItem;
  onEdit?: (item: ContentItem) => void;
  variant?: 'card' | 'list';
  defaultExpanded?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onEdit,
  variant = 'card',
  defaultExpanded = false
}) => {
  const { creators, categories, stores, updateShootStatus, updatePostStatus, deleteContent, openEditContent, duplicateContent } = useApp();
  const { canEditContent, canManageCreators } = useAuth();
  const { showConfirm } = useUI();
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileActionSheet, setShowMobileActionSheet] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [menuCoords, setMenuCoords] = useState<{ top?: number; bottom?: number; right: number }>({ right: 0 });

  // Long-press detection for mobile
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

    longPressTimerRef.current = setTimeout(() => {
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(40);
      }
      setShowMobileActionSheet(true);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!longPressTimerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    // If user is scrolling, cancel long press
    if (dx > 10 || dy > 10) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // If on mobile / narrow screen, prefer the native BottomSheet action sheet
    if (window.innerWidth < 640) {
      setShowMobileActionSheet(true);
      return;
    }

    const target = e.currentTarget;
    if (!showMenu && target) {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 140 && spaceAbove > spaceBelow) {
        setMenuCoords({
          bottom: viewportHeight - rect.top + 4,
          right: window.innerWidth - rect.right
        });
      } else {
        setMenuCoords({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right
        });
      }
    }
    setShowMenu(!showMenu);
  };

  // Check if current user is authorized to edit this content item
  const isEditable = canEditContent(content);

  // Derive associated creator objects
  const assignedCreators = creators.filter((c) => content.creatorIds.includes(c.id));
  
  // Derive category and store
  const category = categories.find((cat) => cat.id === content.categoryId);
  const store = stores.find((s) => s.id === content.storeId);

  // Overdue calculations
  const shootOverdue = isShootOverdue(content.shootDate, content.shootStatus);
  const postOverdue = isPostOverdue(content.postDate, content.postStatus);
  
  const shootOverdueDays = getDaysDifference(content.shootDate);
  const postOverdueDays = getDaysDifference(content.postDate);

  // Priority color map
  const priorityColorMap: Record<string, { bg: string; text: string }> = {
    Low: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' },
    Normal: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
    High: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
    Urgent: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' }
  };

  const priorityStyle = priorityColorMap[content.priority] || priorityColorMap.Normal;

  const renderStoreLogo = () => {
    if (!store) return null;
    const logo = store.logo || '';
    if (logo.startsWith('data:image') || logo.startsWith('http') || logo.startsWith('/')) {
      return <img src={logo} alt={store.name} className="w-3.5 h-3.5 object-contain rounded shrink-0" />;
    }
    if (logo.length > 0 && logo.length <= 4) {
      return <span className="shrink-0">{logo}</span>;
    }
    return <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />;
  };

  const renderMobileActionSheet = () => {
    return (
      <BottomSheet
        isOpen={showMobileActionSheet}
        onClose={() => setShowMobileActionSheet(false)}
        title={content.title}
        subtitle={`${category?.name || 'Content'}${store ? ` • ${store.name}` : ''}`}
      >
        <div className="flex flex-col gap-4 py-1 text-sm">
          {/* Quick Concept Preview */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-gray-300 leading-relaxed break-words">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Concept</span>
            {content.concept}
          </div>

          {/* Quick Status Selectors */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Camera className="w-3 h-3" /> Shoot ({formatDate(content.shootDate)})
              </span>
              <StatusSelector
                type="shoot"
                currentStatus={content.shootStatus}
                onStatusChange={(status) => {
                  updateShootStatus(content.id, status);
                }}
                disabled={!isEditable}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Send className="w-3 h-3" /> Post ({formatDate(content.postDate)})
              </span>
              <StatusSelector
                type="post"
                currentStatus={content.postStatus}
                onStatusChange={(status) => {
                  updatePostStatus(content.id, status);
                }}
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* Action List */}
          <div className="flex flex-col gap-2 pt-1">
            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  setShowMobileActionSheet(false);
                  if (onEdit) {
                    onEdit(content);
                  } else {
                    openEditContent(content);
                  }
                }}
                className="w-full flex items-center gap-3 p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 rounded-xl text-left text-gray-100 font-semibold text-xs active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-100">Edit Details</p>
                  <p className="text-[11px] text-gray-400">Change dates, assignees, concept, or notes</p>
                </div>
              </button>
            )}

            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  setShowMobileActionSheet(false);
                  duplicateContent(content);
                }}
                className="w-full flex items-center gap-3 p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 rounded-xl text-left text-gray-100 font-semibold text-xs active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Copy className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-100">Duplicate Content</p>
                  <p className="text-[11px] text-gray-400">Create a cloned copy with new dates</p>
                </div>
              </button>
            )}

            {content.referenceUrl && (
              <a
                href={content.referenceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowMobileActionSheet(false)}
                className="w-full flex items-center gap-3 p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 rounded-xl text-left text-gray-100 font-semibold text-xs active:scale-[0.99] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <p className="font-bold text-gray-100">Open Reference Link</p>
                  <p className="text-[11px] text-gray-400 truncate">{content.referenceUrl}</p>
                </div>
              </a>
            )}

            {(canManageCreators || isEditable) && (
              <button
                type="button"
                onClick={() => {
                  setShowMobileActionSheet(false);
                  showConfirm({
                    title: 'Delete Content',
                    message: `Delete content item "${content.title}"?`,
                    isDestructive: true,
                    confirmText: 'Delete',
                    onConfirm: () => deleteContent(content.id)
                  });
                }}
                className="w-full flex items-center gap-3 p-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-left text-rose-300 font-semibold text-xs active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-rose-300">Delete Content</p>
                  <p className="text-[11px] text-rose-400/80">Permanently remove this content item</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </BottomSheet>
    );
  };

  const renderPortaledMenu = () => {
    return (
      <>
        {renderMobileActionSheet()}
        {showMenu && createPortal(
          <>
            <div
              className="fixed inset-0 z-[99998] cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div
              className="fixed z-[99999] w-36 bg-slate-900 border border-slate-700/90 rounded-xl p-1 shadow-2xl shadow-black/90 animate-fade-in ring-1 ring-white/10 flex flex-col gap-0.5"
              style={{
                ...(menuCoords.top !== undefined ? { top: `${menuCoords.top}px` } : {}),
                ...(menuCoords.bottom !== undefined ? { bottom: `${menuCoords.bottom}px` } : {}),
                right: `${menuCoords.right}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    if (onEdit) {
                      onEdit(content);
                    } else {
                      openEditContent(content);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-slate-800 hover:text-white rounded-lg w-full text-left cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> Edit Details
                </button>
              )}

              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    duplicateContent(content);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-slate-800 hover:text-white rounded-lg w-full text-left cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-400" /> Duplicate
                </button>
              )}

              {(canManageCreators || isEditable) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    showConfirm({
                      title: 'Delete Content',
                      message: `Delete content item "${content.title}"?`,
                      isDestructive: true,
                      confirmText: 'Delete',
                      onConfirm: () => deleteContent(content.id)
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg w-full text-left cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          </>,
          document.body
        )}
      </>
    );
  };

  if (variant === 'list') {
    return (
      <div
        className="glass-panel p-3 sm:p-3.5 rounded-2xl flex flex-col gap-2 relative transition-all hover:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 hover:z-20 focus-within:z-30 touch-manipulation"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <span
              className="badge px-2 py-0.5 text-[10px] font-bold shrink-0"
              style={{
                backgroundColor: `${category?.color || '#6366f1'}20`,
                color: category?.color || '#818cf8',
                border: `1px solid ${category?.color || '#6366f1'}40`
              }}
            >
              {category?.name || 'Content'}
            </span>

            {store && (
              <span
                className="badge p-1 bg-slate-800 text-gray-300 border border-slate-700 flex items-center justify-center shrink-0"
                title={store.name}
              >
                {renderStoreLogo()}
              </span>
            )}

            <h4 className="text-xs font-bold text-gray-100 truncate min-w-0 flex-1">{content.title}</h4>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isEditable && (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="touch-target-44 p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="touch-target-44 p-1.5 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center"
              title={isExpanded ? 'Collapse item details' : 'Expand to view completely'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 shrink-0">
            <CreatorAvatar creators={assignedCreators} size="sm" showNames />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StatusSelector
              type="shoot"
              currentStatus={content.shootStatus}
              onStatusChange={(status) => updateShootStatus(content.id, status)}
              size="sm"
              disabled={!isEditable}
            />

            <StatusSelector
              type="post"
              currentStatus={content.postStatus}
              onStatusChange={(status) => updatePostStatus(content.id, status)}
              size="sm"
              disabled={!isEditable}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5 animate-fade-in text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Concept / Core Messaging:</span>
              <p className="text-xs text-gray-200 mt-0.5 leading-relaxed">{content.concept}</p>
            </div>

            {(shootOverdue || postOverdue) && (
              <div className="flex flex-col gap-1 my-0.5">
                {shootOverdue && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Shoot overdue by {shootOverdueDays} day{shootOverdueDays > 1 ? 's' : ''}</span>
                  </div>
                )}
                {postOverdue && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Post overdue by {postOverdueDays} day{postOverdueDays > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap pt-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span
                  className="badge px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}
                >
                  {content.priority} Priority
                </span>

                {content.referenceUrl && (
                  <a
                    href={content.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> View Reference Link
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <span>Shoot: <strong className="text-gray-200">{formatDate(content.shootDate)}</strong></span>
                <span>Post: <strong className="text-gray-200">{formatDate(content.postDate)}</strong></span>
              </div>
            </div>

            {content.notes && (
              <p className="p-2 bg-slate-900/80 rounded-lg text-xs text-gray-300 italic border border-slate-800">
                "{content.notes}"
              </p>
            )}
          </div>
        )}
        {renderPortaledMenu()}
      </div>
    );
  }

  return (
    <div
      className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col gap-3 relative transition-all hover:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 hover:z-20 focus-within:z-30 touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
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

          {assignedCreators.length >= 2 && (
            <span className="badge px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-400" /> Collaboration ({assignedCreators.length})
            </span>
          )}

          {store && (
            <span
              className="badge p-1 bg-slate-800 text-gray-300 border border-slate-700 flex items-center justify-center shrink-0"
              title={store.name}
            >
              {renderStoreLogo()}
            </span>
          )}

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

        {isEditable && (
          <div className="relative">
            <button
              type="button"
              onClick={toggleMenu}
              className="touch-target-44 p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer flex items-center justify-center"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
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
              <span>Shoot overdue by {shootOverdueDays} day{shootOverdueDays > 1 ? 's' : ''}</span>
            </div>
          )}
          {postOverdue && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Post overdue by {postOverdueDays} day{postOverdueDays > 1 ? 's' : ''}</span>
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
      {renderPortaledMenu()}
    </div>
  );
};
