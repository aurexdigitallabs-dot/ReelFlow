import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateOverviewMetrics,
  calculateCategoryMetrics,
  calculateCreatorMetrics,
  calculateWeeklyTrends
} from '../../utils/analyticsUtils';
import { CreatorAvatar } from '../common/CreatorAvatar';
import {
  BarChart3,
  CheckCircle2,
  Film,
  Camera,
  Video,
  Sparkles,
  Send,
  PieChart,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { filteredContent, categories, creators, setSelectedCreatorId } = useApp();
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');

  const overview = calculateOverviewMetrics(filteredContent);
  const categoryData = calculateCategoryMetrics(filteredContent, categories);
  const creatorData = calculateCreatorMetrics(filteredContent, creators);
  const weeklyTrends = calculateWeeklyTrends(filteredContent);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Bar & Toggle */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800/90 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Agency Analytics & Production Intel
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Derive shoot completion rates, category distributions, and creator performance metrics
          </p>
        </div>

        {/* Weekly | Monthly Toggle */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setRange('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              range === 'weekly' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Weekly View
          </button>
          <button
            type="button"
            onClick={() => setRange('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              range === 'monthly' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Monthly View
          </button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {range === 'weekly' ? 'This Week Performance Overview' : 'This Month Performance Overview'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800 bg-indigo-500/5">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Total Content
            </span>
            <span className="text-2xl font-black text-gray-100 mt-2">{overview.totalContent}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-emerald-500/30 bg-emerald-500/10">
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ready to Post
            </span>
            <span className="text-2xl font-black text-emerald-300 mt-2">{overview.readyToPost}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Pending Shoot
            </span>
            <span className="text-2xl font-black text-amber-400 mt-2">{overview.pendingShoot}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Total Shot
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-2">{overview.shot}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" /> In Editing
            </span>
            <span className="text-2xl font-black text-blue-400 mt-2">{overview.editing}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Published
            </span>
            <span className="text-2xl font-black text-purple-400 mt-2">{overview.posted}</span>
          </div>
        </div>
      </section>

      {/* Completion Rates Progress Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shoot Completion Rate */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-400" /> Shoot Completion Rate
            </span>
            <span className="text-lg font-extrabold text-amber-400">{overview.shootCompletionRate}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${overview.shootCompletionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            {overview.shot} of {overview.totalContent} scheduled shoots completed.
          </p>
        </div>

        {/* Posting Completion Rate */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-indigo-400" /> Posting Completion Rate
            </span>
            <span className="text-lg font-extrabold text-indigo-400">{overview.postCompletionRate}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${overview.postCompletionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            {overview.posted} of {overview.totalContent} scheduled social posts published.
          </p>
        </div>
      </section>

      {/* Production Trend & Category Analytics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Content Production Trend Chart */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Content Production Trend
            </span>
            <span className="text-[10px] text-gray-400">Week-by-week comparison</span>
          </div>

          {weeklyTrends.length > 0 ? (
            <div className="flex flex-col gap-3">
              {weeklyTrends.map((trend) => (
                <div key={trend.weekLabel} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="font-bold">{trend.weekLabel}</span>
                    <span className="text-[11px] text-gray-400">
                      <strong className="text-indigo-400">{trend.shot} Shot</strong> / {trend.total} Total (Target: {trend.target})
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                    <div
                      className="bg-indigo-500 h-full transition-all"
                      style={{ width: `${(trend.shot / (trend.target || 1)) * 100}%` }}
                      title={`${trend.shot} Shot`}
                    />
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${(trend.posted / (trend.target || 1)) * 100}%` }}
                      title={`${trend.posted} Posted`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500 font-medium">
              No production trend data available yet. Schedule or create content items to see week-by-week trends.
            </div>
          )}
        </div>

        {/* Content Category Analytics */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              <PieChart className="w-4 h-4 text-purple-400" /> Category Breakdown
            </span>
            <span className="text-[10px] text-gray-400">{categoryData.length} active categories</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {categoryData.map((cat) => (
              <div key={cat.categoryId} className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.categoryName}
                  </span>
                  <span className="font-extrabold text-gray-300">
                    {cat.count} items ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Analytics Section - Dual responsive: Cards on Mobile, Table on Tablet/Desktop */}
      <section className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="w-4 h-4 text-indigo-400" /> Creator Contribution
            </h3>
            <p className="text-[11px] text-gray-400">Assignment breakdown and completion rates per creator</p>
          </div>
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
        </div>

        {/* Mobile View (< sm): Touch Cards */}
        <div className="sm:hidden flex flex-col gap-2.5">
          {creatorData.map((c) => (
            <div
              key={`mobile-creator-${c.creatorId}`}
              onClick={() => setSelectedCreatorId(c.creatorId)}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5 cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <CreatorAvatar creator={creators.find((cr) => cr.id === c.creatorId)} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-gray-100 truncate">{c.creatorName}</span>
                    <span className="text-[10px] text-gray-400 truncate">@{c.username}</span>
                  </div>
                </div>
                <span className="badge px-2 py-0.5 text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold shrink-0">
                  {c.completionRate}% Done
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 uppercase">Assigned</span>
                  <span className="text-xs font-bold text-gray-200">{c.assignedCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-amber-400 uppercase">Shot</span>
                  <span className="text-xs font-bold text-emerald-400">{c.shotCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-400 uppercase">Edit</span>
                  <span className="text-xs font-bold text-blue-400">{c.editingCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-purple-400 uppercase">Posted</span>
                  <span className="text-xs font-bold text-purple-400">{c.postedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet View (>= sm): Full Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-gray-400">
                <th className="py-2 px-3">Creator</th>
                <th className="py-2 px-2 text-center">Assigned</th>
                <th className="py-2 px-2 text-center">Shot</th>
                <th className="py-2 px-2 text-center">Editing</th>
                <th className="py-2 px-2 text-center">Ready</th>
                <th className="py-2 px-2 text-center">Posted</th>
                <th className="py-2 px-3 text-right">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {creatorData.map((c) => (
                <tr
                  key={c.creatorId}
                  onClick={() => setSelectedCreatorId(c.creatorId)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <CreatorAvatar creator={creators.find((cr) => cr.id === c.creatorId)} size="sm" />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-100">{c.creatorName}</span>
                        <span className="text-[10px] text-gray-400">@{c.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-gray-200">{c.assignedCount}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-emerald-400">{c.shotCount}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-blue-400">{c.editingCount}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-emerald-400">{c.readyCount}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-purple-400">{c.postedCount}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-indigo-400">
                    {c.completionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
