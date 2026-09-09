import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  Film,
  BarChart3,
  Clock,
  Database,
  Upload,
  X,
  CheckCircle2,
  ArrowRight,
  User,
  LayoutDashboard
} from 'lucide-react';

interface SplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isOpen, onClose }) => {
  const { userProfile, userRole, signInWithGoogle, isLoggedIn } = useAuth();

  if (!isOpen) return null;

  const features = [
    {
      icon: <Building2 className="w-5 h-5 text-indigo-400" />,
      title: 'Multi-Brand & Store Control',
      description: 'Manage social media content production for multiple agency stores & brands in isolated, role-scoped workspaces.'
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      title: 'Creator Roster & Auto-Linking',
      description: 'Assign single or multiple creators to content. Logging in via Google auto-links creators by email to their personal task dashboard.'
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      title: 'Production Workflow Pipeline',
      description: 'Track content across clear stages: Pending Shoot, In Video Editing, Ready to Post, and Posted on Social Media.'
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      title: 'Interactive Content Calendar',
      description: 'Month, Week, and List calendar views to schedule shooting dates and coordinate target social post deadlines.'
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
      title: 'Production Analytics & Metrics',
      description: 'Real-time production completion rates, category distribution, creator contribution graphs, and overdue warnings.'
    },
    {
      icon: <Upload className="w-5 h-5 text-cyan-400" />,
      title: 'Cloudflare R2 Storage & Real DB',
      description: 'Direct S3-compatible cloud object storage for logos & avatars, synchronized with live Firebase Firestore real-time streams.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 pt-6 pb-6 overflow-hidden">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Main Splash Container */}
      <div
        className="relative z-10 w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto animate-slide-up max-h-[92vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
              <img src="/Icon Only .png" alt="Aurex Digitals" className="w-5 h-5 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-100 flex items-center gap-1.5">
                ReelFlow
              </span>
              <span className="text-[10px] text-gray-400">by Aurex Digitals</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close Splash Screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
          {/* Hero Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Welcome to ReelFlow
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              Streamline Social Media Content Production, Creators & Schedules
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Designed for social media agencies, stores, and content teams to manage creator rosters, shoot schedules, video editing pipelines, and real-time social posting in a unified SaaS dashboard.
            </p>
          </div>

          {/* Platform Features Grid */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Key Platform Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col gap-2"
                >
                  <div className="p-2 rounded-xl bg-slate-900 w-fit border border-slate-800">
                    {feat.icon}
                  </div>
                  <h4 className="text-xs font-bold text-gray-100">{feat.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Authentication & Login Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-gray-100">Firebase Authentication & Access Control</span>
              </div>
              {isLoggedIn && (
                <span className="badge px-2.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Authenticated
                </span>
              )}
            </div>

            {/* If Logged In */}
            {isLoggedIn && userProfile ? (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {userProfile.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4 text-indigo-300" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-gray-100 text-xs">{userProfile.displayName}</span>
                    <span className="text-[11px] text-gray-400 truncate">{userProfile.email}</span>
                  </div>
                </div>

                <span className="badge px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-bold">
                  {userRole}
                </span>
              </div>
            ) : null}

            {/* Google Sign In CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  await signInWithGoogle();
                  onClose();
                }}
                className="w-full sm:w-1/2 py-3 bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
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
                {isLoggedIn ? 'Switch Google Account' : 'Sign in with Google'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <LayoutDashboard className="w-4 h-4" />
                Explore Platform Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role Config Details */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-gray-400 flex flex-col gap-1.5">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Firestore Role Instructions (`users` collection)
              </span>
              <p className="leading-relaxed">
                Roles are dynamically evaluated from your Firestore document under <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">users/{'{uid}'}</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1 text-[10px] font-mono">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-purple-400 font-bold">role: "super"</span>
                  <span className="block text-gray-500 text-[9px] font-sans">Full Admin + Add Brands</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-bold">role: "admin"</span>
                  <span className="block text-gray-500 text-[9px] font-sans">Assigned Store Admin</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold">role: "creator"</span>
                  <span className="block text-gray-500 text-[9px] font-sans">Assigned Dashboard Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
