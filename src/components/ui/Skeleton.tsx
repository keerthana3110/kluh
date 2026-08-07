import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3 animate-pulse bg-white">
      <div className="h-4 w-1/3 bg-slate-200 rounded" />
      <div className="h-8 w-1/2 bg-slate-200 rounded" />
      <div className="h-3 w-2/3 bg-slate-200 rounded" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4 animate-pulse bg-white">
      <div className="h-6 w-1/4 bg-slate-200 rounded mb-4" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-10 w-full bg-slate-100 rounded" />
      ))}
    </div>
  );
}
