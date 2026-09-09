import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { LayoutDashboard, Calendar, Film, Users, BarChart3, Plus, Clock, UserCheck, MoreHorizontal, X } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddContent, content } = useApp();
  const { userRole } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const pendingCount = content.filter(
    (i) => (i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled') || (i.postStatus === 'Ready')
  ).length;

  const isCreatorRole = userRole === 'creator';

  const isMoreActive = activeTab === 'pending' || activeTab === 'creators' || activeTab === 'analytics';

  return (
    <>
      {/* More Options Drawer Menu Popup */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="bg-slate-900 border-t border-slate-800 rounded-t-2xl p-4 flex flex-col gap-3 shadow-2xl pb-[calc(5rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">More Navigation</span>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pending');
                  setIsMoreOpen(false);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors relative ${
                  activeTab === 'pending'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                }`}
              >
                <div className="relative">
                  <Clock className="w-5 h-5 text-amber-400" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span>Pending</span>
              </button>

              {!isCreatorRole && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('creators');
                      setIsMoreOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                      activeTab === 'creators'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                    }`}
                  >
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Creators</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('analytics');
                      setIsMoreOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <span>Analytics</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 items-center text-center">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab(isCreatorRole ? 'my_assignments' : 'dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'dashboard' || activeTab === 'my_assignments'
                ? 'text-indigo-400 font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {isCreatorRole ? <UserCheck className="w-5 h-5 text-emerald-400" /> : <LayoutDashboard className="w-5 h-5" />}
            <span className="text-[10px] mt-0.5 truncate">{isCreatorRole ? 'Tasks' : 'Dashboard'}</span>
          </button>

          {/* Calendar */}
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'calendar' ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 truncate">Calendar</span>
          </button>

          {/* Center Floating + Add Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => openAddContent()}
              className="-mt-5 w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-slate-950 active:scale-95 transition-transform"
              title="Add Content"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'content' ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 truncate">Content</span>
          </button>

          {/* More Drawer Button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
              isMoreActive ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="relative">
              <MoreHorizontal className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[12px] h-[12px] px-1 bg-amber-500 text-slate-950 text-[8px] font-black rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 truncate">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
