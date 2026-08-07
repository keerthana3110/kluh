'use client';

import React from 'react';
import { Blocks, CheckCircle2, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BlockchainVisualizer() {
  const steps = [
    { title: '1. Approval Created', desc: 'Spend request validated by policy' },
    { title: '2. Transaction Signed', desc: 'Sentinel private key signs payload' },
    { title: '3. Hash Generated', desc: 'Cryptographic SHA-256 state proof' },
    { title: '4. Block Submitted', desc: 'Dispatched to Algorand Mainnet' },
    { title: '5. Confirmed', desc: 'Permanent 100% finality commit' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-200 space-y-4 bg-gradient-to-r from-emerald-50/50 to-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <Blocks className="h-5 w-5 text-emerald-600" />
          <span>Algorand Mainnet State Proof Commitment Visualizer</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 font-bold">App ID: #1049283</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
        {steps.map((st, i) => (
          <div key={i} className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-emerald-900 font-bold">
              <span>{st.title}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="text-[10px] text-slate-600">{st.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
