import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { LayoutDashboard, Calendar, Film, Users, BarChart3, Plus, Clock, UserCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddContent, content } = useApp();
  const { userRole } = useAuth();

  const pendingCount = content.filter(
    (i) => (i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled') || (i.postStatus === 'Ready')
  ).length;

  const isCreatorRole = userRole === 'creator';

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = isCreatorRole
    ? [
        { tab: 'my_assignments', label: 'My Tasks', icon: <UserCheck className="w-5 h-5 text-emerald-400" /> },
        { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { tab: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
        { tab: 'content', label: 'Content', icon: <Film className="w-5 h-5" /> },
        { tab: 'pending', label: 'Pending', icon: <Clock className="w-5 h-5" />, badge: pendingCount }
      ]
    : [
        { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { tab: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
        { tab: 'content', label: 'Content', icon: <Film className="w-5 h-5" /> },
        { tab: 'pending', label: 'Pending', icon: <Clock className="w-5 h-5" />, badge: pendingCount },
        { tab: 'creators', label: 'Creators', icon: <Users className="w-5 h-5" /> },
        { tab: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> }
      ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around relative">
        {navItems.slice(0, 3).map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-indigo-500 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Center Floating + Add Content Button */}
        <button
          type="button"
          onClick={() => openAddContent()}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-slate-950 active:scale-95 transition-transform"
          title="Add Content"
        >
          <Plus className="w-6 h-6" />
        </button>

        {navItems.slice(3).map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-indigo-500 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
