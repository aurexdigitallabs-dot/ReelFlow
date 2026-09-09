import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Clock, Sparkles, Bell, X } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications } = useApp();
  const drawerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Invisible backdrop for dismissal */}
      <div className="fixed inset-0 z-[80]" onClick={() => setIsNotificationsOpen(false)} />

      {/* Floating Popover Container attached under Bell icon */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-full mt-2 z-[90] w-80 sm:w-96 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in ring-1 ring-white/10 max-h-[80vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div>
            <h4 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-indigo-400" /> Alerts & Reminders
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Automated shoot & post notifications</p>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Scroll Body */}
        <div className="p-3 overflow-y-auto flex flex-col gap-2.5 max-h-80">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
              <Bell className="w-6 h-6 text-gray-600" />
              <span>No pending notifications! All clear.</span>
            </div>
          ) : (
            notifications.map((notif) => {
              const isOverdue = notif.type === 'overdue_shoot' || notif.type === 'overdue_post';
              const isReady = notif.type === 'ready_to_post' || notif.type === 'post_today';

              return (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all text-xs ${
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

                  <div className="flex flex-col min-w-0">
                    <h5 className="font-bold text-xs">{notif.title}</h5>
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

