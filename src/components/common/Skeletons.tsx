import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 w-full animate-pulse">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="w-16 h-5 bg-slate-800 rounded"></div>
          <div className="w-20 h-5 bg-slate-800 rounded"></div>
        </div>
        <div className="w-6 h-6 bg-slate-800 rounded-lg"></div>
      </div>
      
      <div>
        <div className="w-3/4 h-5 bg-slate-800 rounded mb-2"></div>
        <div className="w-full h-3 bg-slate-800 rounded mb-1.5"></div>
        <div className="w-5/6 h-3 bg-slate-800 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
        <div className="h-10 bg-slate-900/60 rounded-xl border border-slate-800/60"></div>
        <div className="h-10 bg-slate-900/60 rounded-xl border border-slate-800/60"></div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 p-2.5 rounded-xl border border-slate-800/60 bg-slate-950/50">
        <div className="h-12 bg-slate-800/50 rounded-lg"></div>
        <div className="h-12 bg-slate-800/50 rounded-lg"></div>
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-3 sm:p-3.5 rounded-2xl flex flex-col gap-2 animate-pulse w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-16 h-4 bg-slate-800 rounded"></div>
          <div className="w-1/2 h-4 bg-slate-800 rounded"></div>
        </div>
        <div className="w-6 h-6 bg-slate-800 rounded-lg shrink-0"></div>
      </div>
      
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-800/60">
        <div className="w-24 h-6 bg-slate-800 rounded-full"></div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-6 bg-slate-800 rounded-lg"></div>
          <div className="w-24 h-6 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 animate-pulse w-full h-[100px]">
      <div className="w-1/2 h-4 bg-slate-800 rounded"></div>
      <div className="w-16 h-8 bg-slate-800 rounded mt-1"></div>
    </div>
  );
};

export const HeaderSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between animate-pulse w-full mb-6">
      <div className="w-48 h-8 bg-slate-800 rounded-lg"></div>
      <div className="w-24 h-8 bg-slate-800 rounded-lg"></div>
    </div>
  );
};
