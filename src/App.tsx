import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPageView } from './components/views/LandingPageView';
import { UIProvider } from './context/UIContext';
import { GlobalDialogs } from './components/common/GlobalDialogs';
import { ReelFlowLogo } from './components/common/ReelFlowLogo';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppContainer() {
  const { viewMode, activeTab, setViewMode, setActiveTab } = useApp();
  const { isAuthorized, isLoadingAuth, isLoggedIn, userRole } = useAuth();

  useEffect(() => {
    if (isLoadingAuth) return;

    // Automatically navigate authenticated & authorized users to dashboard
    if (isLoggedIn && isAuthorized) {
      if (viewMode === 'landing') {
        if (userRole === 'creator') {
          setActiveTab('my_assignments');
        }
        setViewMode('app');
      }
    } else {
      // Unauthorized or logged-out users must be kept on landing
      if (viewMode === 'app') {
        setViewMode('landing');
      }
    }
  }, [viewMode, isAuthorized, isLoggedIn, isLoadingAuth, userRole, setViewMode, setActiveTab]);

  useEffect(() => {
    if (viewMode === 'landing' || !isAuthorized) {
      document.title = 'ReelFlow — Creator & Content Management';
    } else {
      const titles: Record<string, string> = {
        dashboard: 'ReelFlow — Dashboard',
        calendar: 'ReelFlow — Calendar',
        content: 'ReelFlow — Content',
        creators: 'ReelFlow — Creators',
        analytics: 'ReelFlow — Analytics',
        pending: 'ReelFlow — Workflows',
        my_assignments: 'ReelFlow — Creator Workspace'
      };
      document.title = titles[activeTab] || 'ReelFlow';
    }
  }, [viewMode, activeTab, isAuthorized]);

  // Dedicated loader before making any routing decisions to prevent landing page flash
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-6 z-50 selection:bg-indigo-500">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-600/20 rounded-full blur-2xl animate-pulse" />
          <ReelFlowLogo size="lg" showSubtitle={true} className="relative z-10" />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-xs font-semibold text-gray-300">Checking session & workspace...</span>
          </div>
          <div className="w-44 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'landing' || !isAuthorized) {
    return <LandingPageView />;
  }

  return <AppLayout />;
}

function MainAppShell() {
  const { creators } = useApp();

  return (
    <AuthProvider creators={creators}>
      <AppContainer />
    </AuthProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AppProvider>
          <MainAppShell />
          <GlobalDialogs />
        </AppProvider>
      </UIProvider>
    </ErrorBoundary>
  );
}

export default App;

