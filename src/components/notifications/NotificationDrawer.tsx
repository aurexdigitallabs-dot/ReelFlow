import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { AlertTriangle, Clock, CheckCircle2, Sparkles, Bell } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications } = useApp();

  return (
    <BottomSheet
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Alerts & Reminders"
      subtitle="Automated shoot notifications, posting alerts, and overdue tracking"
    >
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-gray-600" />
            <span>No pending notifications or overdue items! All clear.</span>
          </div>
        ) : (
          notifications.map((notif) => {
            const isOverdue = notif.type === 'overdue_shoot' || notif.type === 'overdue_post';
            const isReady = notif.type === 'ready_to_post' || notif.type === 'post_today';

            return (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  isOverdue
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : isReady
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-gray-300'
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
                  <h5 className="text-xs font-bold">{notif.title}</h5>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </BottomSheet>
  );
};
