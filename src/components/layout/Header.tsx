import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AddStoreModal } from '../stores/AddStoreModal';
import { LoginModal } from '../auth/LoginModal';
import { Plus, Bell, Store, Moon, Sun, Database, Sparkles, User, ShieldCheck } from 'lucide-react';
import { ReelFlowLogo } from '../common/ReelFlowLogo';

export const Header: React.FC = () => {
  const {
    stores,
    currentStoreId,
    setCurrentStoreId,
    notifications,
    setIsNotificationsOpen,
    openAddContent,
    theme,
    toggleTheme,
    goToLanding
  } = useApp();

  const { canAddStore, userProfile, userRole, assignedStoreIds } = useAuth();

  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter stores available to current user based on assignedStoreIds
  const visibleStores = stores.filter((s) => {
    if (userRole === 'super_admin' || !assignedStoreIds) return true;
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
      <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Store Selector */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={goToLanding}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0 group-hover:scale-102 transition-transform"
            title="ReelFlow — by Aurex Digitals"
          >
            <ReelFlowLogo size="sm" showSubtitle={false} />
          </button>

          {/* Store Selector Dropdown */}
          <div className="relative flex items-center shrink">
            <Store className="w-3.5 h-3.5 text-indigo-400 absolute left-2 pointer-events-none" />
            <select
              value={currentStoreId}
              onChange={(e) => {
                if (e.target.value === '__add_new__') {
                  if (canAddStore) {
                    setIsAddStoreOpen(true);
                  } else {
                    alert('Only Super Admins are authorized to add new brands/stores.');
                  }
                } else {
                  setCurrentStoreId(e.target.value);
                }
              }}
              className="pl-7 pr-6 py-1.5 text-[11px] sm:text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:border-slate-700 transition-colors max-w-[85px] xs:max-w-[130px] sm:max-w-none truncate"
            >
              <option value="all">All Brands ({visibleStores.length})</option>
              {visibleStores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
              {canAddStore && <option value="__add_new__">+ Add Brand</option>}
            </select>
            <div className="pointer-events-none absolute right-2 text-gray-400 text-[10px]">▼</div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-200 hover:bg-slate-900 rounded-xl transition-colors shrink-0"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Notifications Icon */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-1.5 sm:p-2 text-gray-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors shrink-0"
            title="View Alerts & Reminders"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* + Add Content Header Button */}
          <button
            type="button"
            onClick={() => openAddContent()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">+ Add Content</span>
          </button>
        </div>
      </header>

      {/* Modal to add new Store/Brand */}
      <AddStoreModal isOpen={isAddStoreOpen} onClose={() => setIsAddStoreOpen(false)} />

      {/* Login & Auth Persona Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
