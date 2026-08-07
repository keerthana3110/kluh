'use client';

import React from 'react';
import { Key, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function X402Visualizer() {
  const steps = [
    { title: '1. Outbound Request', desc: 'Agent invokes protected endpoint' },
    { title: '2. 402 Challenge', desc: 'Server returns HTTP 402 Payment Required' },
    { title: '3. Token Authorized', desc: 'Sentinel issues signed micropayment token' },
    { title: '4. Provider Granted', desc: 'API executes call with x402 header' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-200 space-y-4 bg-gradient-to-r from-indigo-50/50 to-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
          <Key className="h-5 w-5 text-indigo-600" />
          <span>x402 Micropayment Protocol Handshake Flow</span>
        </div>
        <span className="text-[11px] font-mono text-indigo-700 font-bold">RFC / HTTP 402 Enforced</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
        {steps.map((st, i) => (
          <div key={i} className="rounded-xl border border-indigo-200 bg-white p-3 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-indigo-900 font-bold">
              <span>{st.title}</span>
              <Lock className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <p className="text-[10px] text-slate-600">{st.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
