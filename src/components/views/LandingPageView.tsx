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
  ArrowRight,
  User,
  LayoutDashboard,
  LogOut,
  Camera,
  Layers,
  Globe,
  AlertTriangle
} from 'lucide-react';

import { ReelFlowLogo } from '../common/ReelFlowLogo';

export const LandingPageView: React.FC = () => {
  const { enterApp, content, creators, stores } = useApp();
  const { userProfile, userRole, signInWithGoogle, logout, isLoggedIn, promoteToSuperAdmin } = useAuth();

  const readyCount = content.filter((i) => i.postStatus === 'Ready').length;
  const shotCount = content.filter((i) => i.shootStatus === 'Shot').length;

  const features = [
    {
      icon: <Building2 className="w-6 h-6 text-indigo-400" />,
      title: 'Multi-Brand Workspace',
      description: 'Manage social media content production for multiple agency stores & brands in isolated, role-scoped environments.'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: 'Creator Roster & Auto-Linking',
      description: 'Assign single or multiple creators to content reels. Logging in via Google auto-links creators by email to their personal dashboard.'
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: 'Production Workflow Pipeline',
      description: 'Categorize stages from Pending Shoot, In Video Editing, Ready to Post, to Posted on Social Media.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      title: 'Interactive Content Calendar',
      description: 'Month, Week, and List calendar views to schedule shooting dates and coordinate target social post deadlines.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: 'Production Analytics & Metrics',
      description: 'Real-time production completion rates, category distribution, creator contribution graphs, and overdue warnings.'
    },
    {
      icon: <Upload className="w-6 h-6 text-cyan-400" />,
      title: 'Cloudflare R2 Storage & Real DB',
      description: 'Direct S3-compatible cloud object storage for brand logos and avatars, synchronized with live Firebase Firestore streams.'
    }
  ];

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleEnterDashboard = () => {
    if (!isLoggedIn || userProfile?.role === 'unassigned') {
      alert('Your Google account is not onboarded as an authorized Creator or Admin yet. Please contact Aurex Digitals administration.');
      return;
    }
    if (userRole === 'creator') {
      enterApp('my_assignments');
    } else {
      enterApp('dashboard');
    }
  };

  const roleName =
    userRole === 'super_admin' || (userRole as string) === 'super'
      ? 'Super Admin'
      : userRole === 'admin'
      ? 'Store Admin'
      : 'Creator';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Standalone Landing Header Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <ReelFlowLogo size="md" showSubtitle={true} />

        {/* Quick Nav Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Platform Features</a>
          <a href="#workflow" className="hover:text-indigo-400 transition-colors">Workflow Pipeline</a>
          <a href="#rbac" className="hover:text-indigo-400 transition-colors">Roles & Security</a>
        </nav>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn && userProfile ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-indigo-400" />
                )}
                <span className="font-bold text-gray-200 truncate max-w-[110px]">{userProfile.displayName}</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">
                  {roleName}
                </span>
              </div>

              {userProfile.role !== 'unassigned' ? (
                <button
                  type="button"
                  onClick={handleEnterDashboard}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LayoutDashboard className="w-4 h-4" /> Enter App Dashboard
                </button>
              ) : null}

              <button
                type="button"
                onClick={logout}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-900 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-98"
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
          )}
        </div>
      </header>

      {/* Main Landing Body Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 shadow-2xl flex flex-col items-center text-center gap-6">
          {/* Background Glow Effect */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            Social Media Content Operations SaaS
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Scale Multi-Brand Video Production & <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Creator Workflows</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Empower social media agencies, brands, and creators to streamline multi-store content production, shooting schedules, editing pipelines, and real-time social posting in a unified platform.
          </p>

          {/* Dedicated Onboarding Pending Screen for Unassigned Users */}
          {userProfile && userProfile.role === 'unassigned' && (
            <div className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl flex flex-col items-center text-center gap-5 my-2 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>

              <div className="flex flex-col gap-2 max-w-xl">
                <span className="text-[11px] font-mono font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  Firestore User Document Created • Onboarding Pending
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Account Not Onboarded Yet
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Welcome, <strong className="text-white">{userProfile.displayName || userProfile.email}</strong>! Your account (<code className="text-amber-300 font-mono text-xs">{userProfile.email}</code>) signed in successfully via Google, but has not been assigned to an authorized Creator profile or Admin role by Aurex Digitals yet.
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs flex flex-col gap-3">
                <span className="font-extrabold text-gray-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Next Steps to Activate Access:
                </span>
                <ol className="list-decimal list-inside text-gray-300 space-y-1.5 leading-relaxed text-[11px]">
                  <li>Contact <strong>Aurex Digitals</strong> administration with your registered email (<code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">{userProfile.email}</code>).</li>
                  <li>An Aurex Admin will add your email to the <strong>Creators Roster</strong> in ReelFlow.</li>
                  <li>Once linked, refresh this page to automatically unlock your <strong>Creator Workspace Dashboard</strong>!</li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:support@aurexdigitals.com?subject=ReelFlow%20Creator%20Onboarding%20Request&body=Hi%20Aurex%20Team%2C%0A%0APlease%20onboard%20my%20email%20(${encodeURIComponent(userProfile.email)})%20for%20ReelFlow%20access.%0A%0AThanks!`}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  Contact Aurex Administration
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
            {isLoggedIn && userProfile?.role !== 'unassigned' ? (
              <button
                type="button"
                onClick={handleEnterDashboard}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <LayoutDashboard className="w-5 h-5" /> Open App Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : !isLoggedIn ? (
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                Sign in with Google to Launch App
              </button>
            ) : null}
          </div>

          {/* Live Platform Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-indigo-400">{content.length}</span>
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Content Items</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-purple-400">{creators.length}</span>
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Active Creators</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-400">{readyCount}</span>
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Ready to Post</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-cyan-400">{stores.length}</span>
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Stores & Brands</span>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="features" className="flex flex-col gap-6 scroll-mt-24">
          <div className="text-center flex flex-col items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for Modern Social Media Operations
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              Everything your agency needs to manage creators, shoot days, editing queues, and brand deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group"
              >
                <div className="p-3 rounded-xl bg-slate-950 w-fit border border-slate-800 group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-100">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Engine Pipeline */}
        <section id="workflow" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-6 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Workflow Architecture</span>
            <h3 className="text-xl font-extrabold text-white">3-Stage Content Progression Pipeline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> 1. Pending Shoot
              </span>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                Schedule shoot dates, record venue notes, and assign single or multiple creators.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-2">
              <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5">
                <Film className="w-4 h-4" /> 2. In Post-Production
              </span>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                Video footage shot. Editors color grade, add audio tracks, and prepare social reels.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 3. Ready to Post
              </span>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Final reel approved and ready for social media publishing by the marketing team.
              </p>
            </div>
          </div>
        </section>

        {/* Roles & Security RBAC Section */}
        <section id="rbac" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Firebase Auth & Role-Based Access Control
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Roles are dynamically loaded from your Firebase Firestore record under <code className="text-indigo-300">users/{'{uid}'}</code>.
              </p>
            </div>

            {!isLoggedIn && (
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="px-5 py-2.5 bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-98"
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
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col gap-2">
              <span className="font-extrabold text-purple-300 text-sm flex items-center justify-between">
                Super Admin <span className="text-[10px] font-mono bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">role: "super"</span>
              </span>
              <p className="text-[11px] text-purple-200/80 leading-relaxed">
                Full platform administration. Add & manage brands/stores, oversee creators, and assign user roles.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col gap-2">
              <span className="font-extrabold text-indigo-300 text-sm flex items-center justify-between">
                Store Admin <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/40">role: "admin"</span>
              </span>
              <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                Manage content, creators, and schedules strictly for assigned brands (<code className="text-indigo-300">assignedStoreIds</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col gap-2">
              <span className="font-extrabold text-emerald-300 text-sm flex items-center justify-between">
                Creator <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">role: "creator"</span>
              </span>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                Dedicated Creator Dashboard. Write & edit rights are scoped strictly to assigned content items.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col gap-2">
              <span className="font-extrabold text-amber-300 text-sm flex items-center justify-between">
                Unassigned <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">role: "unassigned"</span>
              </span>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Default state for new Google sign-ins not yet onboarded by Aurex Digitals. Access restricted until onboarded.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Standalone Landing Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <img src="/Icon Only .png" alt="Aurex Digitals" className="w-4 h-4 object-contain opacity-80" />
          <span className="font-extrabold text-gray-200 text-sm">ReelFlow</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 font-medium">by Aurex Digitals</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-indigo-400 transition-colors">Workflow Engine</a>
          <a href="#rbac" className="hover:text-indigo-400 transition-colors">Roles</a>
          <button onClick={handleEnterDashboard} className="hover:text-indigo-400 font-semibold transition-colors">
            App Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
