import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AddStoreModal } from '../stores/AddStoreModal';
import { LoginModal } from '../auth/LoginModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { SingleAvatar } from '../common/CreatorAvatar';
import { Plus, Bell, Store, Moon, Sun, Database, Sparkles, User, ShieldCheck } from 'lucide-react';
// ThemeToggle import removed
import { ReelFlowLogo } from '../common/ReelFlowLogo';
import { useUI } from '../../context/UIContext';

export const Header: React.FC = () => {
  const {
    stores,
    currentStoreId,
    setCurrentStoreId,
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    openAddContent,
    theme,
    toggleTheme,
    setActiveTab
  } = useApp();

  const { canAddStore, userProfile, userRole, assignedStoreIds } = useAuth();
  const { showAlert } = useUI();

  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter stores available to current user based on assignedStoreIds
  const visibleStores = stores.filter((s) => {
    if (userRole === 'super_admin' || (userRole as string) === 'super' || !assignedStoreIds) return true;
    return assignedStoreIds.includes(s.id);
  });

  const roleBadgeStyle =
    userRole === 'super_admin' || (userRole as string) === 'super'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : userRole === 'admin'
      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  const roleName =
    userRole === 'super_admin' || (userRole as string) === 'super'
      ? 'Super Admin'
      : userRole === 'admin'
      ? 'Admin'
      : 'Creator';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-5 py-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Store Selector */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab(userRole === 'creator' ? 'my_assignments' : 'dashboard')}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0 transition-transform active:scale-95"
            title="ReelFlow Dashboard"
          >
            <ReelFlowLogo size="sm" showSubtitle={false} />
          </button>

          {/* Store Selector Dropdown (Desktop & Tablet) */}
          <div className="relative hidden md:flex items-center shrink">
            <Store className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 pointer-events-none" />
            <select
              value={currentStoreId}
              onChange={(e) => {
                if (e.target.value === '__add_new__') {
                  if (canAddStore) {
                    setIsAddStoreOpen(true);
                  } else {
                    showAlert('Access Denied', 'Only Super Admins are authorized to add new brands/stores.', 'error');
                  }
                } else {
                  setCurrentStoreId(e.target.value);
                }
              }}
              className="pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:border-slate-700 transition-colors max-w-[160px] truncate"
            >
              <option value="all">All Brands ({visibleStores.length})</option>
              {visibleStores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}

              {canAddStore && <option value="__add_new__">+ Add Brand</option>}
            </select>
            <div className="pointer-events-none absolute right-2.5 text-gray-400 text-[10px]">▼</div>
          </div>

          {/* Active Store Indicator for Mobile (< md) */}
          {currentStoreId !== 'all' && (
            <div className="md:hidden flex items-center gap-1 px-2 py-0.5 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-[10px] text-indigo-300 font-semibold truncate max-w-[90px] xs:max-w-[130px]">
              <Store className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{visibleStores.find(s => s.id === currentStoreId)?.name || 'Store'}</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Notifications Icon & Attached Floating Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="touch-target-44 p-2 text-gray-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors shrink-0 relative flex items-center justify-center"
              title="View Alerts & Reminders"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            <NotificationDrawer />
          </div>

          {/* User Profile Button & Attached Popover (Hidden on Mobile) */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
              title="Manage Profile & Roles"
            >
              <SingleAvatar
                name={userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User'}
                profileImage={userProfile?.photoURL}
                sizeClass="w-5 h-5 text-[10px]"
              />
              <span className="hidden lg:inline truncate max-w-[80px]">
                {userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Sign In'}
              </span>
              <span className={`badge hidden sm:inline-flex px-1.5 py-0.5 text-[9px] border shrink-0 ${roleBadgeStyle}`}>
                {roleName}
              </span>
            </button>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} position="down" />
          </div>

          {/* + Add Content Header Button */}
          <button
            type="button"
            onClick={() => openAddContent()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
            aria-label="Add Content"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Content</span>
          </button>
        </div>
      </header>

      {/* Modal to add new Store/Brand */}
      <AddStoreModal isOpen={isAddStoreOpen} onClose={() => setIsAddStoreOpen(false)} />
    </>
  );
};
