'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, TrendingDown, ShieldAlert, Play } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function ScenarioBar() {
  const { runJurySimulation, simulation } = useSentinel();

  const scenarios = [
    {
      id: 'micro_pass',
      title: 'Scenario 1: Micro Auto-Approve',
      desc: 'Marketing Agent (₹15.00) -> Auto Approved',
      icon: CheckCircle2,
      color: 'emerald',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
    },
    {
      id: 'manager_approval',
      title: 'Scenario 2: Manager Approval Gate',
      desc: 'Travel Agent (₹1,16,000 flight) -> Requires Approval',
      icon: AlertTriangle,
      color: 'amber',
      btnBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
    },
    {
      id: 'high_cost_optimize',
      title: 'Scenario 3: Cost Optimizer Swap',
      desc: 'Coding Agent (GPT-5) -> Swaps to Gemini Flash (90% Save)',
      icon: TrendingDown,
      color: 'indigo',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
    },
    {
      id: 'policy_block',
      title: 'Scenario 4: Malicious Spend Block',
      desc: 'HR Agent (Midjourney ₹2,000) -> Policy Blocked & Logged',
      icon: ShieldAlert,
      color: 'rose',
      btnBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {scenarios.map((sc) => {
        const Icon = sc.icon;
        return (
          <div key={sc.id} className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all shadow-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                <Icon className={`h-4 w-4 text-${sc.color}-600`} />
                <span>{sc.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{sc.desc}</p>
            </div>

            <button
              onClick={() => runJurySimulation(sc.id as any)}
              disabled={simulation.isRunning}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 font-bold text-xs text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${sc.btnBg}`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Demo</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
