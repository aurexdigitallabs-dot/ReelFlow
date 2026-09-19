import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getTodayString, formatDate } from '../../utils/dateUtils';
import { ContentCard } from '../content/ContentCard';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { Camera, Send, CheckCircle2, Video, Sparkles, Calendar, Clock, Film, AlertTriangle } from 'lucide-react';

import { CreatorSettingsModal } from '../creators/CreatorSettingsModal';
import { Settings, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const CreatorDashboardView: React.FC = () => {
  const { content, creators } = useApp();
  const { userProfile, userCreatorId } = useAuth();
  
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const todayStr = getTodayString();

  // Active creator profile object
  const creator = creators.find((c) => c.id === userCreatorId) || {
    id: userCreatorId || 'demo-creator',
    name: userProfile?.displayName || 'Creator',
    username: userProfile?.email?.split('@')[0] || 'creator',
    profileImage: userProfile?.photoURL || '',
    phone: '',
    email: userProfile?.email || '',
    status: 'Active',
    storeIds: []
  };

  // Scoped content: ONLY items assigned to this creator!
  const myAssignedContent = content.filter((i) =>
    userCreatorId ? i.creatorIds.includes(userCreatorId) : true
  );

  // My Shoots Today
  const myShootsToday = myAssignedContent.filter(
    (i) => i.shootDate === todayStr && i.shootStatus !== 'Cancelled'
  );

  // My Posts Today
  const myPostsToday = myAssignedContent.filter(
    (i) => i.postDate === todayStr && i.postStatus !== 'Cancelled'
  );

  // Overdue for me
  const myOverdueShoots = myAssignedContent.filter(
    (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled' && i.shootDate < todayStr
  );
  const myOverduePosts = myAssignedContent.filter(
    (i) => i.postStatus !== 'Posted' && i.postStatus !== 'Cancelled' && i.postDate < todayStr
  );

  // Stats
  const totalAssigned = myAssignedContent.length;
  const totalShot = myAssignedContent.filter((i) => i.shootStatus === 'Shot').length;
  const totalEditing = myAssignedContent.filter((i) => i.postStatus === 'Editing').length;
  const totalReady = myAssignedContent.filter((i) => i.postStatus === 'Ready').length;
  const totalPosted = myAssignedContent.filter((i) => i.postStatus === 'Posted').length;

  const completionRate = totalAssigned > 0 ? Math.round((totalPosted / totalAssigned) * 100) : 0;

  const pieData = [
    { name: 'Pending Shoot', value: myAssignedContent.filter(i => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled').length, color: '#fbbf24' },
    { name: 'In Editing', value: myAssignedContent.filter(i => i.postStatus === 'Editing').length, color: '#60a5fa' },
    { name: 'Ready to Post', value: myAssignedContent.filter(i => i.postStatus === 'Ready').length, color: '#34d399' },
    { name: 'Published', value: myAssignedContent.filter(i => i.postStatus === 'Posted').length, color: '#a855f7' },
    { name: 'Shot, Pending Post', value: myAssignedContent.filter(i => i.shootStatus === 'Shot' && !['Editing', 'Ready', 'Posted', 'Cancelled'].includes(i.postStatus)).length, color: '#818cf8' }
  ].filter(d => d.value > 0);

  const contributionData = [
    {
      name: 'My Contribution',
      assignedCount: totalAssigned,
      shotCount: totalShot,
      postedCount: totalPosted,
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Creator Profile Header */}
      <header className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <CreatorAvatar creator={creator as any} size="lg" />
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h2 className="text-base font-extrabold text-gray-100 truncate">{creator.name}'s Dashboard</h2>
              <span className="badge px-2 py-0.5 text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold whitespace-nowrap">
                Assigned Tasks Only
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">
              @{creator.username} • {creator.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <button
             type="button"
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
             onClick={() => setIsSettingsOpen(true)}
          >
             <Settings className="w-4 h-4" /> Edit Profile
          </button>
          
          <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex flex-col items-center px-3">
              <span className="text-[10px] text-gray-400">Total Assigned</span>
              <span className="text-base font-extrabold text-indigo-400">{totalAssigned}</span>
            </div>
            <div className="flex flex-col items-center px-3 border-x border-slate-800">
              <span className="text-[10px] text-gray-400">Completion</span>
              <span className="text-base font-extrabold text-emerald-400">{completionRate}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overdue Alert if any */}
      {(myOverdueShoots.length > 0 || myOverduePosts.length > 0) && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-200">Attention Required for Your Assigned Tasks</h4>
            <p className="text-[11px] text-rose-300/90 mt-0.5">
              {myOverdueShoots.length > 0 && `${myOverdueShoots.length} shoot(s) past schedule. `}
              {myOverduePosts.length > 0 && `${myOverduePosts.length} post(s) missed target date.`}
            </p>
          </div>
        </div>
      )}

      {/* Creator KPI Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800 bg-indigo-500/5 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Total Assigned
          </span>
          <span className="text-2xl font-black text-gray-100 mt-2">{totalAssigned}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Shot
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-2">{totalShot}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" /> In Editing
          </span>
          <span className="text-2xl font-black text-blue-400 mt-2">{totalEditing}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-emerald-500/30 bg-emerald-500/10">
          <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ready to Post
          </span>
          <span className="text-2xl font-black text-emerald-300 mt-2">{totalReady}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border-slate-800">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Published
          </span>
          <span className="text-2xl font-black text-purple-400 mt-2">{totalPosted}</span>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Task Ratio Chart */}
        <section className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
                <PieChartIcon className="w-4 h-4 text-indigo-400" /> My Task Ratio
              </h3>
              <p className="text-[11px] text-gray-400">Breakdown of your assigned tasks by status</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center mt-2">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {pieData.map((entry, index) => (
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
        </section>

        {/* Creator Contribution Chart */}
        <section className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" /> My Contribution
              </h3>
              <p className="text-[11px] text-gray-400">Your total assigned vs shot vs posted</p>
            </div>
          </div>
          <div className="h-64 w-full mt-2">
            {totalAssigned > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="assignedCount" name="Assigned" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shotCount" name="Shot" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="postedCount" name="Posted" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500 font-medium">
                No active tasks to visualize.
              </div>
            )}
          </div>
        </section>

      </div>

      {/* My Today's Tasks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* My Shoots Today */}
        <div className="p-4 rounded-2xl flex flex-col gap-3 border border-amber-500/20 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-4 h-4" /> My Shoots Today ({myShootsToday.length})
            </span>
            <span className="text-[10px] text-gray-400">{formatDate(todayStr)}</span>
          </div>

          {myShootsToday.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 italic">
              No shoots assigned to you today.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myShootsToday.map((item) => (
                <ContentCard key={`my-shoot-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </div>

        {/* My Posts Today */}
        <div className="p-4 rounded-2xl flex flex-col gap-3 border border-indigo-500/20 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Send className="w-4 h-4" /> My Posts Scheduled Today ({myPostsToday.length})
            </span>
            <span className="text-[10px] text-gray-400">{formatDate(todayStr)}</span>
          </div>

          {myPostsToday.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 italic">
              No social posts assigned to you today.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myPostsToday.map((item) => (
                <ContentCard key={`my-post-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* My All Assigned Content */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-400" /> All Content Assigned to Me ({myAssignedContent.length})
        </h3>
        {myAssignedContent.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-slate-900/50 rounded-2xl border border-slate-800">
            No content items currently assigned to your creator profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignedContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </section>

      <CreatorSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        creator={creator as any} 
      />
    </div>
  );
};
