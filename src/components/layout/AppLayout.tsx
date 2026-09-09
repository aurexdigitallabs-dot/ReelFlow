import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from './Header';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';

// View Imports
import { DashboardView } from '../views/DashboardView';
import { CreatorDashboardView } from '../views/CreatorDashboardView';
import { CalendarView } from '../views/CalendarView';
import { ContentView } from '../views/ContentView';
import { CreatorsView } from '../views/CreatorsView';
import { AnalyticsView } from '../views/AnalyticsView';
import { PendingView } from '../views/PendingView';

import { AddContentModal } from '../content/AddContentModal';
import { ContentFilterSheet } from '../content/ContentFilterSheet';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { CreatorDetailModal } from '../creators/CreatorDetailModal';

export const AppLayout: React.FC = () => {
  const { activeTab, selectedCreatorId, setSelectedCreatorId } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'my_assignments':
        return <CreatorDashboardView />;
      case 'calendar':
        return <CalendarView />;
      case 'content':
        return <ContentView />;
      case 'creators':
        return <CreatorsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'pending':
        return <PendingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Dynamic Main View Area */}
        <main className="flex-1 w-full p-4 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8 overflow-y-auto min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Bottom Sheets */}
      <AddContentModal />
      <ContentFilterSheet />
      <NotificationDrawer />

      {/* Creator Detail Profile Modal */}
      {selectedCreatorId && (
        <CreatorDetailModal
          creatorId={selectedCreatorId}
          onClose={() => setSelectedCreatorId(null)}
        />
      )}
    </div>
  );
};
