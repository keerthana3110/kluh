import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl">
        <ShieldCheck className="h-9 w-9" />
      </div>

      <h1 className="text-6xl font-extrabold font-mono text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200">Page Not Found in Tracking.ai Console</h2>
      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
        The requested financial governance view or resource endpoint does not exist or has been relocated.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

