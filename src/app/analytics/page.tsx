'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, DollarSign, Wallet, ShieldAlert, Cpu, IndianRupee } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function AnalyticsPage() {
  const { agents, spendRequests } = useSentinel();

  const monthlyTrendData = [
    { month: 'Apr', spend: 672000, budget: 1200000 },
    { month: 'May', spend: 896000, budget: 1200000 },
    { month: 'Jun', spend: 1128000, budget: 1440000 },
    { month: 'Jul', spend: 1344000, budget: 1600000 },
    { month: 'Aug (Cur)', spend: 1512000, budget: 2000000 },
  ];

  const providerUsageData = [
    { name: 'Google Gemini', value: 45 },
    { name: 'OpenRouter', value: 30 },
    { name: 'Grok xAI', value: 15 },
    { name: 'Local Ollama', value: 10 },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial & Governance Analytics</h1>
          <p className="text-xs text-slate-500 font-medium">Deep-dive visual reporting on agent spend velocity, provider allocation, and forecast burn rates (₹)</p>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Monthly Run-Rate Forecast</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">₹17,16,000</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">14.2% below cap threshold</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Primary Provider Share</span>
            <Cpu className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600">Gemini (45%)</div>
          <div className="text-[11px] text-slate-500 font-mono">Lowest cost/token ratio</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Optimization Savings ROI</span>
            <IndianRupee className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600">82.4% Save</div>
          <div className="text-[11px] text-slate-500 font-mono">Frontier model swaps</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Governance Intercepts</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">1,248 Requests</div>
          <div className="text-[11px] text-rose-700 font-mono font-bold">AST Rules Enforced</div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Monthly Spend vs Budget Cap Trend (₹)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }} />
                <Area type="monotone" dataKey="spend" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="budget" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Usage Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Provider Usage Distribution</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={providerUsageData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {providerUsageData.map((e, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
