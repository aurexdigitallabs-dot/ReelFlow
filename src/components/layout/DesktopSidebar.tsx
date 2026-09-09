import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { LoginModal } from '../auth/LoginModal';
import { SingleAvatar } from '../common/CreatorAvatar';
import {
  LayoutDashboard,
  Calendar,
  Film,
  Users,
  BarChart3,
  Clock,
  Plus,
  Sparkles,
  UserCheck,
  Building2,
  User
} from 'lucide-react';


export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, openAddContent, content, currentStore } = useApp();
  const { userProfile, userRole, assignedStoreIds } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const readyCount = content.filter((i) => i.postStatus === 'Ready').length;
  const overdueCount = content.filter(
    (i) =>
      (i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled' && new Date(i.shootDate) < new Date()) ||
      (i.postStatus !== 'Posted' && i.postStatus !== 'Cancelled' && new Date(i.postDate) < new Date())
  ).length;

  const isCreatorRole = userRole === 'creator';

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

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = isCreatorRole
    ? [
        { tab: 'my_assignments', label: 'My Assignments', icon: <UserCheck className="w-4 h-4 text-emerald-400" /> },
        { tab: 'dashboard', label: 'Agency Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { tab: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
        { tab: 'content', label: 'All Content', icon: <Film className="w-4 h-4" /> },
        { tab: 'pending', label: 'Pending & Ready', icon: <Clock className="w-4 h-4" />, count: readyCount }
      ]
    : [
        { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { tab: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
        { tab: 'content', label: 'All Content', icon: <Film className="w-4 h-4" /> },
        { tab: 'pending', label: 'Pending & Ready', icon: <Clock className="w-4 h-4" />, count: readyCount },
        { tab: 'creators', label: 'Creators', icon: <Users className="w-4 h-4" /> },
        { tab: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
      ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 bg-slate-950/90 border-r border-slate-800/80 shrink-0 h-[calc(100vh-60px)] sticky top-[60px] z-40">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* Active Store Indicator */}
        <div className="p-3 mb-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-gray-200 truncate">
              {currentStore ? currentStore.name : 'All Brands & Stores'}
            </span>
            <span className="text-[10px] text-indigo-400">
              {currentStore ? `Store Code: ${currentStore.code}` : 'Multi-Store View'}
            </span>
          </div>
        </div>

        {/* Primary + Create Content Button */}
        <button
          type="button"
          onClick={() => openAddContent()}
          className="w-full py-2.5 px-4 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Create Content
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1">
            {isCreatorRole ? 'Creator Workspace' : 'Main Menu'}
          </span>
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                    : 'text-gray-400 hover:bg-slate-900 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                    {item.count} Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Summary Widget */}
        {overdueCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className="mt-4 p-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-2 text-left cursor-pointer w-full"
            title="Click to view all overdue items"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col text-[11px]">
              <span className="font-bold text-amber-300">{overdueCount} Items Overdue</span>
              <span className="text-amber-400/80 text-[10px]">Attention required today • View Hub</span>
            </div>
          </button>
        )}

        </div>

        {/* Dedicated User Profile Section */}
        <div className="mt-auto p-4 border-t border-slate-800 flex flex-col gap-2 relative bg-slate-950/90">
          <button
            type="button"
            onClick={() => setIsLoginOpen(!isLoginOpen)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors w-full text-left cursor-pointer"
            title="Click to manage account & auth roles"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <SingleAvatar
                name={userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User'}
                profileImage={userProfile?.photoURL}
                sizeClass="w-8 h-8 text-xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-100 truncate">
                  {userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Sign In'}
                </span>
                <span className="text-[10px] text-gray-400 truncate">
                  {userProfile?.email || 'Account settings'}
                </span>
              </div>
            </div>
            <span className={`badge px-1.5 py-0.5 text-[9px] border shrink-0 ${roleBadgeStyle}`}>
              {roleName}
            </span>
          </button>

          {/* Login & Auth Persona Attached Popover */}
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} position="up" />

          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity">
              <img src="/Icon Only .png" alt="Aurex Digitals" className="w-3.5 h-3.5 object-contain" />
              <span className="text-[11px] font-medium text-gray-400">Aurex Digitals</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">ReelFlow</span>
          </div>
        </div>
      </aside>
    </>
  );
};

