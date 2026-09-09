import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPageView } from './components/views/LandingPageView';

function AppContainer() {
  const { viewMode, activeTab, setViewMode } = useApp();
  const { isAuthorized } = useAuth();

  useEffect(() => {
    // Force landing view if user is unassigned or not authorized
    if (viewMode === 'app' && !isAuthorized) {
      setViewMode('landing');
    }
  }, [viewMode, isAuthorized, setViewMode]);

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
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}

export default App;

