import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SingleAvatar } from '../common/CreatorAvatar';
import { ShieldCheck, User, LogOut, X, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'up' | 'down';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, position = 'down' }) => {
  const { userProfile, userRole, signInWithGoogle, logout, isLoggedIn } = useAuth();
  const { enterApp } = useApp();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on Escape or Outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roleLabelMap: Record<string, { label: string; color: string; desc: string }> = {
    super_admin: {
      label: 'Super Admin',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Full system control, Add/Delete Stores, Manage User Roles'
    },
    super: {
      label: 'Super Admin',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Full system control, Add/Delete Stores, Manage User Roles'
    },
    admin: {
      label: 'Store Admin',
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      desc: 'Manage assigned store content & creators (Cannot add stores)'
    },
    creator: {
      label: 'Creator',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'Dedicated Creator Dashboard & write permissions for assigned tasks'
    }
  };

  const currentRoleStyle = roleLabelMap[userRole] || roleLabelMap.super_admin;

  const popoverPosClass =
    position === 'up'
      ? 'bottom-full mb-2 left-0'
      : 'right-0 top-full mt-2';

  return (
    <>
      {/* Invisible backdrop to capture click-outside */}
      <div className="fixed inset-0 z-[80]" onClick={onClose} />

      {/* Floating Popover Menu attached directly to trigger button */}
      <div
        ref={popoverRef}
        className={`absolute ${popoverPosClass} z-[90] w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-4 gap-3 animate-fade-in ring-1 ring-white/10 text-xs`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-gray-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Account Profile
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Account Info */}
        {isLoggedIn && userProfile ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <SingleAvatar
                name={userProfile.displayName || userProfile.email}
                profileImage={userProfile.photoURL}
                sizeClass="w-9 h-9 text-xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-gray-100 text-xs truncate">{userProfile.displayName}</span>
                <span className="text-[10px] text-gray-400 truncate">{userProfile.email}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Current Role</span>
              <span className={`badge px-2 py-0.5 text-[10px] border ${currentRoleStyle.color}`}>
                {currentRoleStyle.label}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Onboarding Status</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Active & Onboarded
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-[10px] text-gray-500 font-mono">UID: {userProfile.uid?.slice(0, 8)}...</span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sign In Required
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Sign in with your Google account to access your workspace.
            </p>

            <button
              type="button"
              onClick={async () => {
                const profile = await signInWithGoogle();
                onClose();
                if (profile) {
                  if (profile.role === 'creator') {
                    enterApp('my_assignments');
                  } else {
                    enterApp('dashboard');
                  }
                }
              }}
              className="w-full mt-1 py-2.5 bg-white hover:bg-gray-100 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        {/* Company Attribution */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-gray-500 border-t border-slate-800/80">
          <span className="flex items-center gap-1">
            <img src="/Icon Only .png" alt="Aurex Digitals" className="w-3 h-3 object-contain opacity-75" />
            <span>Aurex Digitals</span>
          </span>
          <span className="font-mono">ReelFlow</span>
        </div>
      </div>
    </>
  );
};

