import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { LayoutDashboard, Calendar, Film, Users, BarChart3, Plus, Clock, UserCheck, MoreHorizontal, X, Building2, Download, Smartphone } from 'lucide-react';
import { SingleAvatar } from '../common/CreatorAvatar';
import { LoginModal } from '../auth/LoginModal';

import { BottomSheet } from '../common/BottomSheet';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddContent, content, stores, currentStoreId, setCurrentStoreId } = useApp();
  const { userRole, userProfile } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsMoreOpen(false);
      }
    } else {
      alert(
        'To install ReelFlow on your Android or iOS device:\n\n1. Tap your browser menu (⋮ or Share icon)\n2. Select "Add to Home screen" or "Install App"'
      );
    }
  };

  const pendingCount = content.filter(
    (i) => (i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled') || (i.postStatus === 'Ready')
  ).length;

  const isCreatorRole = userRole === 'creator';
  const isMoreActive = activeTab === 'pending' || activeTab === 'creators' || activeTab === 'analytics';

  return (
    <>
      {/* More Options Native Bottom Sheet */}
      <BottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title="More Navigation"
        subtitle="Access all views, switch active brand, and manage account"
      >
        <div className="flex flex-col gap-4 text-xs">
          {/* User Account / Role Card for Mobile */}
          <div
            onClick={() => {
              setIsMoreOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <SingleAvatar
                name={userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User'}
                profileImage={userProfile?.photoURL}
                sizeClass="w-8 h-8 text-xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-gray-100 text-xs truncate">
                  {userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Sign In / Profile'}
                </span>
                <span className="text-[10px] text-gray-400 truncate">
                  {userProfile?.email || 'Tap to manage account & role'}
                </span>
              </div>
            </div>
            <span className="badge px-2 py-0.5 text-[9px] font-semibold border bg-purple-500/20 text-purple-300 border-purple-500/30 shrink-0 capitalize">
              {userRole ? userRole.replace('_', ' ') : 'User'}
            </span>
          </div>

          {/* Mobile Store / Brand Selector */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Active Brand / Store
            </span>
            <div className="relative">
              <select
                value={currentStoreId}
                onChange={(e) => {
                  setCurrentStoreId(e.target.value);
                  setIsMoreOpen(false);
                }}
                className="w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-slate-900 border border-slate-700/80 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Brands ({stores.length})</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                setIsMoreOpen(false);
              }}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 relative ${
                activeTab === 'pending'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-sm'
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
              <span className="text-xs font-semibold">Pending</span>
            </button>

            {!isCreatorRole && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('creators');
                    setIsMoreOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                    activeTab === 'creators'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                  }`}
                >
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-semibold">Creators</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsMoreOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-semibold">Analytics</span>
                </button>
              </>
            )}
          </div>

          {/* PWA Install / Android Native shortcut */}
          {!isStandalone && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full p-3 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-left active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-100">Install ReelFlow App</h5>
                    <p className="text-[10px] text-gray-400">Add to home screen for native mobile experience</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-indigo-400 shrink-0 mr-1" />
              </button>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/85 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
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

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};
