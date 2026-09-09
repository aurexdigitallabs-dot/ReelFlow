import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../content/ContentCard';
import { Camera, Video, Sparkles, Clock } from 'lucide-react';

export const PendingView: React.FC = () => {
  const { filteredContent } = useApp();
  const [activeSection, setActiveSection] = useState<'all' | 'pending_shoot' | 'editing' | 'ready' | 'completed'>('all');

  // Category 1: Pending Shoot (Shoot = Not Started or Scheduled)
  const pendingShootList = filteredContent.filter(
    (i) => i.shootStatus !== 'Shot' && i.shootStatus !== 'Cancelled'
  );

  // Category 2: In Post Production (Shoot = Shot && Post = Editing or Pending)
  const inPostProdList = filteredContent.filter(
    (i) => i.shootStatus === 'Shot' && (i.postStatus === 'Editing' || i.postStatus === 'Pending')
  );

  // Category 3: Ready to Post (Shoot = Shot && Post = Ready)
  const readyToPostList = filteredContent.filter(
    (i) => i.postStatus === 'Ready'
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800/90 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Pending Content & Workflow Hub
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Categorized workflow stages from pending shoots to ready-to-post social media reels
          </p>
        </div>

        {/* Section Filter Select Dropdown */}
        <div className="relative flex items-center w-full sm:w-auto min-w-[220px]">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as any)}
            className="w-full pl-3 pr-8 py-2 text-xs font-bold bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:border-slate-700 transition-colors shadow-inner"
          >
            <option value="all">All Workflow Stages ({pendingShootList.length + inPostProdList.length + readyToPostList.length})</option>
            <option value="ready">Ready to Post ({readyToPostList.length})</option>
            <option value="pending_shoot">Pending Shoot ({pendingShootList.length})</option>
            <option value="editing">In Editing / Post-Prod ({inPostProdList.length})</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 text-gray-400 text-xs">▼</div>
        </div>
      </header>

      {/* 1. Ready to Post Section */}
      {(activeSection === 'all' || activeSection === 'ready') && (
        <section className="p-4 rounded-2xl border border-emerald-500/20 bg-slate-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Ready to Post ({readyToPostList.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Edited & Approved for Social
            </span>
          </div>

          {readyToPostList.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-4 text-center">
              No content items currently ready to post.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readyToPostList.map((item) => (
                <ContentCard key={`ready-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. Pending Shoot Section */}
      {(activeSection === 'all' || activeSection === 'pending_shoot') && (
        <section className="p-4 rounded-2xl border border-amber-500/20 bg-slate-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-4 h-4" /> Pending Shoot ({pendingShootList.length})
            </span>
            <span className="text-[10px] text-gray-400">Content waiting to be recorded</span>
          </div>

          {pendingShootList.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-4 text-center">
              No pending shoots required.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingShootList.map((item) => (
                <ContentCard key={`pending-shoot-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. In Post Production (Editing) */}
      {(activeSection === 'all' || activeSection === 'editing') && (
        <section className="p-4 rounded-2xl border border-blue-500/20 bg-slate-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Video className="w-4 h-4" /> In Post-Production / Editing ({inPostProdList.length})
            </span>
            <span className="text-[10px] text-gray-400">Content shot, undergoing video edit</span>
          </div>

          {inPostProdList.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-4 text-center">
              No content currently undergoing video editing.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inPostProdList.map((item) => (
                <ContentCard key={`in-post-${item.id}`} content={item} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
