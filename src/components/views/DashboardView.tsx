import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculateOverviewMetrics } from '../../utils/analyticsUtils';
import { getTodayString, getWeekDays, formatDate } from '../../utils/dateUtils';
import { ContentCard } from '../content/ContentCard';
import { StatCardSkeleton, ListSkeleton, HeaderSkeleton } from '../common/Skeletons';
import {
  Film,
  Camera,
  CheckCircle2,
  Video,
  Sparkles,
  Send,
  Calendar as CalendarIcon,
  AlertTriangle,
  Plus,
  ArrowRight,
  List,
  LayoutGrid,
  Maximize2,
  Minimize2,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Loader } from '../common/Loader';

export const DashboardView: React.FC = () => {
  const { canAddContent } = useAuth();
  const {
    creators,
    filteredContent,
    openAddContent,
    setActiveTab,
    currentStore,
    isLoading
  } = useApp();

  const [overviewRange, setOverviewRange] = useState<'weekly' | 'monthly'>('weekly');
  const [recentViewMode, setRecentViewMode] = useState<'list' | 'grid'>('list');
  const [showAllRecent, setShowAllRecent] = useState(false);

  const todayStr = getTodayString();
  const metrics = calculateOverviewMetrics(filteredContent);

  // Today's Shoots & Posts
  const shootsToday = filteredContent.filter(
    (i) => i.shootDate === todayStr && i.shootStatus !== 'Cancelled'
  );
  const postsToday = filteredContent.filter(
    (i) => i.postDate === todayStr && i.postStatus !== 'Cancelled'
  );

  // Overdue items
  const overdueShoots = filteredContent.filter(
    (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled' && i.shootDate < todayStr
  );
  const overduePosts = filteredContent.filter(
    (i) => i.postStatus !== 'Posted' && i.postStatus !== 'Cancelled' && i.postDate < todayStr
  );

  // Weekly Overview breakdown calculation
  const weekDays = getWeekDays();
  const weeklySummary = weekDays.map((day) => {
    const count = filteredContent.filter(
      (i) => i.shootDate === day.dateStr || i.postDate === day.dateStr
    ).length;
    return { ...day, count };
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <HeaderSkeleton />
        
        <section className="flex flex-col gap-2.5">
          <div className="w-48 h-4 bg-slate-800/50 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-2.5">
            {Array(6).fill(0).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
             <div className="w-32 h-5 bg-slate-800/50 rounded mb-2 animate-pulse"></div>
             {Array(2).fill(0).map((_, i) => <ListSkeleton key={i} />)}
          </div>
          <div className="flex flex-col gap-3">
             <div className="w-32 h-5 bg-slate-800/50 rounded mb-2 animate-pulse"></div>
             {Array(2).fill(0).map((_, i) => <ListSkeleton key={i} />)}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Banner Context */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800/90 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-gray-100">
              {currentStore ? currentStore.name : 'Agency Operations Dashboard'}
            </h2>
            <span className="badge px-2 py-0.5 text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Overview of social content production, shoots, edits, and posting schedule.
          </p>
        </div>

        {canAddContent && (
          <button
            type="button"
            onClick={() => openAddContent()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Quick Add Content
          </button>
        )}
      </header>

      {/* Overdue Warning Alert Box if any items are overdue */}
      {(overdueShoots.length > 0 || overduePosts.length > 0) && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex flex-col min-w-0">
            <h4 className="font-bold text-rose-200">Attention Required: Overdue Items</h4>
            <p className="text-[11px] text-rose-300/90 mt-0.5">
              {overdueShoots.length > 0 && `${overdueShoots.length} shoot(s) past schedule. `}
              {overduePosts.length > 0 && `${overduePosts.length} post(s) missed publication date.`}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className="mt-2 text-indigo-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              Resolve Pending Items in Hub <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Production Pipeline Metrics
          </h3>
          <span className="text-[11px] text-gray-400">
            {metrics.totalContent} active reels
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {/* Total Content */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800 bg-indigo-500/5">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Total Reels
            </span>
            <span className="text-2xl font-black text-gray-100 mt-2">{metrics.totalContent}</span>
          </div>

          {/* Ready to Post */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-emerald-500/30 bg-emerald-500/10">
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ready to Post
            </span>
            <span className="text-2xl font-black text-emerald-300 mt-2">{metrics.readyToPost}</span>
          </div>

          {/* Pending Shoot */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Pending Shoot
            </span>
            <span className="text-2xl font-black text-amber-400 mt-2">{metrics.pendingShoot}</span>
          </div>

          {/* Shot */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Shot
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-2">{metrics.shot}</span>
          </div>

          {/* Editing */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" /> In Editing
            </span>
            <span className="text-2xl font-black text-blue-400 mt-2">{metrics.editing}</span>
          </div>

          {/* Posted */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Published
            </span>
            <span className="text-2xl font-black text-purple-400 mt-2">{metrics.posted}</span>
          </div>
        </div>
      </section>

      {/* Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overall Agency Task Ratio */}
        <div className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
                <PieChartIcon className="w-4 h-4 text-indigo-400" /> Agency Task Ratio
              </h3>
              <p className="text-[11px] text-gray-400">Breakdown of all active content by status</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center mt-2">
            {filteredContent.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending Shoot', value: filteredContent.filter(i => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled').length, color: '#fbbf24' },
                      { name: 'In Editing', value: filteredContent.filter(i => i.postStatus === 'Editing').length, color: '#60a5fa' },
                      { name: 'Ready to Post', value: filteredContent.filter(i => i.postStatus === 'Ready').length, color: '#34d399' },
                      { name: 'Published', value: filteredContent.filter(i => i.postStatus === 'Posted').length, color: '#a855f7' },
                      { name: 'Shot, Pending Post', value: filteredContent.filter(i => i.shootStatus === 'Shot' && !['Editing', 'Ready', 'Posted', 'Cancelled'].includes(i.postStatus)).length, color: '#818cf8' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {[
                      { name: 'Pending Shoot', value: filteredContent.filter(i => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled').length, color: '#fbbf24' },
                      { name: 'In Editing', value: filteredContent.filter(i => i.postStatus === 'Editing').length, color: '#60a5fa' },
                      { name: 'Ready to Post', value: filteredContent.filter(i => i.postStatus === 'Ready').length, color: '#34d399' },
                      { name: 'Published', value: filteredContent.filter(i => i.postStatus === 'Posted').length, color: '#a855f7' },
                      { name: 'Shot, Pending Post', value: filteredContent.filter(i => i.shootStatus === 'Shot' && !['Editing', 'Ready', 'Posted', 'Cancelled'].includes(i.postStatus)).length, color: '#818cf8' }
                    ].filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '11px' }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-xs text-gray-500 font-medium">
                No active tasks to visualize.
              </div>
            )}
          </div>
        </div>

        {/* Creator Performance (Completed vs Pending) */}
        <div className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
                <BarChartIcon className="w-4 h-4 text-indigo-400" /> Creator Performance
              </h3>
              <p className="text-[11px] text-gray-400">Completed vs Pending tasks per creator</p>
            </div>
          </div>
          <div className="h-64 w-full mt-2">
            {creators.length > 0 && filteredContent.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={creators.map(c => {
                    const cContent = filteredContent.filter(item => item.creatorIds.includes(c.id));
                    return {
                      name: c.name || c.username,
                      completed: cContent.filter(item => item.postStatus === 'Posted').length,
                      pending: cContent.filter(item => item.postStatus !== 'Posted' && item.postStatus !== 'Cancelled').length,
                      total: cContent.length
                    };
                  }).filter(c => c.total > 0).sort((a, b) => b.completed - a.completed)} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="completed" name="Completed" fill="#a855f7" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="pending" name="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500 font-medium">
                No active creator tasks to visualize.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Today's Content Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-indigo-400" /> Today's Content Action Hub
            </h3>
            <p className="text-[11px] text-gray-400">What needs to be shot or published today?</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            View Calendar <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shoot Today - Clean Section Container (No Cardception) */}
          <div className="p-4 rounded-2xl flex flex-col gap-3 border border-amber-500/20 bg-slate-900/40">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera className="w-4 h-4" /> Shoot Today ({shootsToday.length})
              </span>
              <span className="text-[10px] text-gray-400">{formatDate(todayStr)}</span>
            </div>

            {shootsToday.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500 italic">
                No content scheduled for shooting today.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {shootsToday.map((item) => (
                  <ContentCard key={`today-shoot-${item.id}`} content={item} variant="list" />
                ))}
              </div>
            )}
          </div>

          {/* Post Today - Clean Section Container (No Cardception) */}
          <div className="p-4 rounded-2xl flex flex-col gap-3 border border-indigo-500/20 bg-slate-900/40">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Send className="w-4 h-4" /> Post Today ({postsToday.length})
              </span>
              <span className="text-[10px] text-gray-400">{formatDate(todayStr)}</span>
            </div>

            {postsToday.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500 italic">
                No content scheduled for posting today.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {postsToday.map((item) => (
                  <ContentCard key={`today-post-${item.id}`} content={item} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent & Upcoming Content Queue */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
              <Film className="w-4 h-4 text-indigo-400" /> Recent & Upcoming Content
            </h3>
            <p className="text-[11px] text-gray-400">All recent and scheduled content items in the pipeline</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: List | Grid */}
            <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setRecentViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  recentViewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                type="button"
                onClick={() => setRecentViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  recentViewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid
              </button>
            </div>

            {/* Expand List / Show All Button */}
            <button
              type="button"
              onClick={() => setShowAllRecent(!showAllRecent)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-xl transition-all cursor-pointer"
            >
              {showAllRecent ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> Show Top 5
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> Expand All ({filteredContent.length})
                </>
              )}
            </button>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-xs text-gray-500 flex flex-col items-center gap-2">
            <Film className="w-8 h-8 text-gray-600" />
            <span>No content created yet. Click "+ Quick Add Content" above to schedule your first post!</span>
          </div>
        ) : recentViewMode === 'list' ? (
          <div className="flex flex-col gap-2.5">
            {(showAllRecent
              ? filteredContent
                  .slice()
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              : filteredContent
                  .slice()
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                  .slice(0, 5)
            ).map((item) => (
              <ContentCard key={`recent-${item.id}`} content={item} variant="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllRecent
              ? filteredContent
                  .slice()
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              : filteredContent
                  .slice()
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                  .slice(0, 6)
            ).map((item) => (
              <ContentCard key={`recent-${item.id}`} content={item} variant="card" />
            ))}
          </div>
        )}
      </section>

      {/* Weekly Overview Section */}
      <section className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              Production Rhythm Summary
            </h3>
            <p className="text-[11px] text-gray-400">Content distribution across the week</p>
          </div>

          {/* Toggle Weekly | Monthly */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setOverviewRange('weekly')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overviewRange === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-400'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setOverviewRange('monthly')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overviewRange === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-400'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Compact Weekly Schedule Bar */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
          <div className="grid grid-cols-7 gap-1.5 text-center min-w-[320px] sm:min-w-0">
            {weeklySummary.map((day) => (
              <div
                key={day.dateStr}
                onClick={() => setActiveTab('calendar')}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  day.isToday
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-bold ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800/60 text-gray-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-gray-400 uppercase font-bold">{day.dayName}</span>
                <span className="text-sm sm:text-base font-black mt-0.5">{day.count}</span>
                <span className="text-[9px] text-gray-500">{day.count === 1 ? 'item' : 'items'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

