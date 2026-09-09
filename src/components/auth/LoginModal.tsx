import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BottomSheet } from '../common/BottomSheet';
import { ShieldCheck, User, LogOut, CheckCircle2, Database } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, userRole, signInWithGoogle, logout, isLoggedIn } = useAuth();
  const { enterApp } = useApp();

  const isSuper = userRole === 'super_admin' || (userRole as string) === 'super';

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

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Account & Profile"
      subtitle="ReelFlow User Account"
    >
      <div className="flex flex-col gap-5 text-xs">
        {/* Active Account Info if logged in */}
        {isLoggedIn && userProfile ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-extrabold text-base shrink-0">
                    <User className="w-5 h-5 text-indigo-300" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-gray-100 text-sm">{userProfile.displayName}</span>
                  <span className="text-[11px] text-gray-400 truncate">{userProfile.email}</span>
                </div>
              </div>

              <span className={`badge px-2.5 py-1 text-[11px] border ${currentRoleStyle.color}`}>
                {currentRoleStyle.label}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-gray-400">
              <span>Firebase UID: <code className="text-gray-300 text-[10px]">{userProfile.uid}</code></span>
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
        ) : null}

        {/* Google Sign-In Action */}
        {!isLoggedIn && (
          <div className="flex flex-col gap-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="font-bold text-gray-200 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Google Authentication
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Sign in with your Google account to access authorized creator workspace or admin features.
            </p>

            <button
              type="button"
              onClick={async () => {
                const profile = await signInWithGoogle();
                onClose();
                if (profile) {
                  if (profile.role === 'unassigned') {
                    alert(`Logged in as ${profile.email}. Your account is not onboarded by Aurex Digitals yet.`);
                  } else if (profile.role === 'creator') {
                    enterApp('my_assignments');
                  } else {
                    enterApp('dashboard');
                  }
                }
              }}
              className="w-full mt-2 py-3 bg-white hover:bg-gray-100 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
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

        {/* Subtle Company Attribution */}
        <div className="pt-2 pb-1 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <img src="/Icon Only .png" alt="Aurex Digitals" className="w-3.5 h-3.5 object-contain opacity-75" />
          <span>ReelFlow • Powered by Aurex Digitals</span>
        </div>
      </div>
    </BottomSheet>
  );
};
