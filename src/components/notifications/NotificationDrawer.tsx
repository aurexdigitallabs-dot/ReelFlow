import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Clock, Sparkles, Bell, X, ChevronRight, Calendar } from 'lucide-react';

type NotifFilter = 'all' | 'overdue' | 'today';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, content, openEditContent } = useApp();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<NotifFilter>('all');

  // Close on Escape or Outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNotificationsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  if (!isNotificationsOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'overdue') return n.type === 'overdue_shoot' || n.type === 'overdue_post';
    if (filter === 'today') return n.type === 'shoot_today' || n.type === 'post_today' || n.type === 'ready_to_post';
    return true;
  });

  const handleNotificationClick = (contentId?: string) => {
    if (!contentId) return;
    const target = content.find((c) => c.id === contentId);
    if (target) {
      setIsNotificationsOpen(false);
      openEditContent(target);
    }
  };

  return (
    <>
      {/* Invisible backdrop for dismissal */}
      <div className="fixed inset-0 z-[80]" onClick={() => setIsNotificationsOpen(false)} />

      {/* Notification Container: Compact right-aligned on mobile, floating popover on desktop */}
      <div
        ref={drawerRef}
        className="fixed right-3 top-16 z-[90] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-80 sm:w-96 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in ring-1 ring-white/10 max-h-[80vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div>
            <h4 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-indigo-400" /> Alerts & Reminders
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {notifications.length} active notification{notifications.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            className="touch-target-44 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          {(['all', 'overdue', 'today'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'all' ? (
                <>
                  <Bell className="w-3 h-3 text-indigo-300" />
                  <span>All</span>
                </>
              ) : tab === 'overdue' ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Overdue</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Today</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Notifications Scroll Body */}
        <div className="p-3 overflow-y-auto flex flex-col gap-2.5 max-h-80">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
              <Bell className="w-6 h-6 text-gray-600" />
              <span>No notifications in this filter!</span>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isOverdue = notif.type === 'overdue_shoot' || notif.type === 'overdue_post';
              const isReady = notif.type === 'ready_to_post' || notif.type === 'post_today';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.contentId)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all text-xs cursor-pointer hover:border-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] group ${
                    isOverdue
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : isReady
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-gray-300'
                  }`}
                >
                  {isOverdue ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : isReady ? (
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-xs truncate">{notif.title}</h5>
                      {notif.contentId && (
                        <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 flex items-center transition-opacity shrink-0">
                          View <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

