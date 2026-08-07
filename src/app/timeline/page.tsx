'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert, Blocks, Key, Bot } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function TimelinePage() {
  const { spendRequests } = useSentinel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apple-Style Animated Spend Timeline</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time chronological feed detailing all 9 pipeline steps per spend request (₹)</p>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {spendRequests.map((req, idx) => (
          <div key={req.id} className="relative flex items-start gap-4 pl-12">
            <div className="absolute left-3.5 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs font-bold text-xs">
              {idx + 1}
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 w-full shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">{req.agentName}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">({req.vendor})</span>
                </div>

                <span className="font-mono text-sm font-bold text-slate-900">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <p className="text-xs text-slate-600 font-medium">{req.purpose}</p>

              {/* 9 Step Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 text-[10px] font-mono">
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-800 font-bold">1. Request Created</span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-800 font-bold">2. Policy Evaluated</span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-800 font-bold">3. Budget Checked</span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-800 font-bold">4. Risk Score: {req.riskScore}</span>
                <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-blue-800 font-bold">5. Algorand Committed</span>
                <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-indigo-800 font-bold">6. x402 Authorized</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
