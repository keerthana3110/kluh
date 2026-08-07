'use client';

import React from 'react';
import { Wallet, AlertTriangle, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function BudgetsPage() {
  const { agents } = useSentinel();

  const totalDailyCap = agents.reduce((a, b) => a + b.dailyBudget, 0);
  const totalDailyUsed = agents.reduce((a, b) => a + b.currentSpendToday, 0);
  const totalMonthlyCap = agents.reduce((a, b) => a + b.monthlyBudget, 0);
  const totalMonthlyUsed = agents.reduce((a, b) => a + b.currentSpendMonth, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budget & Runway Engine</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time daily burn rate monitoring, monthly cap runway forecasting, and killswitches (₹)</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Daily Pool Cap</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{totalDailyCap.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-700 font-bold font-mono">Used: ₹{totalDailyUsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Monthly Cap</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{totalMonthlyCap.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-blue-700 font-bold font-mono">Used: ₹{totalMonthlyUsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Projected Runway</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">84.2 Days</div>
          <div className="text-[11px] text-slate-500 font-mono">Based on 7-day velocity</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active Killswitches</span>
          <div className="text-2xl font-bold font-mono text-slate-900">0 Engaged</div>
          <div className="text-[11px] text-emerald-700 font-bold font-mono">All agents operational</div>
        </div>
      </div>

      {/* Agent Budget Allocation Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Agent Budget Allocations & Live Burn Rates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Daily Spent / Cap</th>
                <th className="py-3 px-4">Monthly Spent / Cap</th>
                <th className="py-3 px-4">Burn Progress</th>
                <th className="py-3 px-4 text-right">Emergency Killswitch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {agents.map((agent) => {
                const dailyPercent = Math.min(100, Math.round((agent.currentSpendToday / agent.dailyBudget) * 100));

                return (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{agent.name}</td>
                    <td className="py-3 px-4 text-slate-600">{agent.department}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{agent.currentSpendToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / ₹{agent.dailyBudget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-bold">
                      ₹{agent.currentSpendMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / ₹{agent.monthlyBudget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32 space-y-1">
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${dailyPercent > 80 ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${dailyPercent}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{dailyPercent}% Daily</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-xs">
                        Freeze Agent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
