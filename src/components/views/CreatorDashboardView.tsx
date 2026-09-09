import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getTodayString, formatDate } from '../../utils/dateUtils';
import { ContentCard } from '../content/ContentCard';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { Camera, Send, CheckCircle2, Video, Sparkles, Calendar, Clock, Film, AlertTriangle } from 'lucide-react';

export const CreatorDashboardView: React.FC = () => {
  const { content, creators } = useApp();
  const { userProfile, userCreatorId } = useAuth();

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Creator Profile Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreatorAvatar creator={creator as any} size="lg" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-gray-100">{creator.name}'s Creator Dashboard</h2>
              <span className="badge px-2 py-0.5 text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                Assigned Tasks Only
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              @{creator.username} • {creator.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 shrink-0">
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
      <div className="grid grid-cols-2 xs:grid-cols-5 gap-2.5">
        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
            <Film className="w-3 h-3 text-indigo-400" /> My Total
          </span>
          <span className="text-xl font-extrabold text-gray-100 mt-1">{totalAssigned}</span>
        </div>

        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Shot
          </span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1">{totalShot}</span>
        </div>

        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
            <Video className="w-3 h-3 text-blue-400" /> Editing
          </span>
          <span className="text-xl font-extrabold text-blue-400 mt-1">{totalEditing}</span>
        </div>

        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between border-slate-800 bg-emerald-500/5">
          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Ready to Post
          </span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1">{totalReady}</span>
        </div>

        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
            <Send className="w-3 h-3 text-purple-400" /> Published
          </span>
          <span className="text-xl font-extrabold text-purple-400 mt-1">{totalPosted}</span>
        </div>
      </div>

      {/* My Today's Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* My Shoots Today */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 border-amber-500/20 bg-gradient-to-b from-slate-900 to-amber-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
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
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 border-indigo-500/20 bg-gradient-to-b from-slate-900 to-indigo-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
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
      </div>

      {/* My All Assigned Content */}
      <div className="flex flex-col gap-3">
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
      </div>
    </div>
  );
};
