'use client';

import React from 'react';
import Link from 'next/link';
import { 
  IndianRupee, 
  Wallet, 
  ShieldAlert, 
  CheckSquare, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Check, 
  X, 
  Blocks, 
  Key, 
  Bot,
  Sparkles,
  Building2
} from 'lucide-react';
import { useSentinel } from '@/lib/store';
import { WORKSPACE_PRESETS } from '@/lib/workspacePresets';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { currentWorkspace, agents, spendRequests, algorandRecords, approveSpendRequest, rejectSpendRequest, runJurySimulation } = useSentinel();

  const wsPreset = WORKSPACE_PRESETS[currentWorkspace] || WORKSPACE_PRESETS['TechNova Inc.'];

  // Metrics calculations from active workspace preset
  const totalSpendToday = wsPreset.todaySpend;
  const totalSpendMonth = wsPreset.monthlySpend;
  const totalBudgetMonth = wsPreset.monthlyCap;
  const remainingBudgetMonth = Math.max(0, totalBudgetMonth - totalSpendMonth);
  const projectedMonthlySpend = Number((totalSpendMonth * 1.15).toFixed(2));

  const blockedRequestsCount = wsPreset.blockedRequestsCount;
  const pendingApprovalsCount = wsPreset.pendingApprovalsCount;
  const pendingApprovals = spendRequests.filter(r => r.status === 'pending_approval');
  const recentRequests = spendRequests.slice(0, 6);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{currentWorkspace} Dashboard</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              {wsPreset.plan} • {wsPreset.agentCount} Agents
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Live monitoring of Autonomous AI Agent financial requests & governance (INR ₹)</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runJurySimulation('manager_approval')}
            className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simulate Pending Approval</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today Spend */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Today&apos;s Spend</span>
            <IndianRupee className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{totalSpendToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="flex items-center text-[10px] text-emerald-700 font-bold gap-1 font-mono">
            <TrendingUp className="h-3 w-3" />
            <span>Authorized within limit</span>
          </div>
        </div>

        {/* Monthly Spend */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Monthly Spend</span>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{totalSpendMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 font-mono">Caps Total: ₹{totalBudgetMonth.toLocaleString('en-IN')}</div>
        </div>

        {/* Remaining Budget */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Budget Remaining</span>
            <Activity className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">₹{remainingBudgetMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 font-mono">Run-rate Project: ₹{projectedMonthlySpend.toLocaleString('en-IN')}</div>
        </div>

        {/* Blocked Requests */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Blocked Requests</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">{blockedRequestsCount}</div>
          <div className="text-[10px] text-rose-700 font-bold font-mono">Enforced by Policy AST</div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Approvals</span>
            <CheckSquare className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{pendingApprovalsCount}</div>
          <div className="text-[10px] text-amber-700 font-bold font-mono">Requires Human Review</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Velocity Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daily Spend Velocity & Blocked Interceptions</h2>
              <p className="text-xs text-slate-500">7-Day rolling timeline of AI Agent activity ({currentWorkspace})</p>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-700 font-mono">Live Feed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wsPreset.velocityTrend}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }} />
                <Area type="monotone" dataKey="spend" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Department Spend Scoping</h2>
            <p className="text-xs text-slate-500">Monthly budget consumption per department ({currentWorkspace})</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wsPreset.departmentBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {wsPreset.departmentBreakdown.map((e, idx) => (
                    <Cell key={idx} fill={e.color || COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {wsPreset.departmentBreakdown.map((d, idx) => (
              <div key={d.name} className="flex items-center gap-2 text-slate-700">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color || COLORS[idx % COLORS.length] }} />
                <span className="truncate">{d.name}: ₹{d.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals Queue */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <CheckSquare className="h-5 w-5 text-amber-600" />
              <span>Pending Approval Queue</span>
            </div>
            <Link href="/approvals" className="text-xs text-blue-600 font-bold hover:underline">
              View All ({pendingApprovals.length})
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No pending approvals required.</p>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map((req) => (
                <div key={req.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-slate-900">{req.agentName}</span>
                    <span className="font-mono font-bold text-amber-700">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{req.purpose}</p>

                  <div className="flex justify-between items-center pt-1 border-t border-amber-200 text-[10px]">
                    <span className="text-slate-500 font-mono">Vendor: {req.vendor}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveSpendRequest(req.id)}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectSpendRequest(req.id)}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-white font-bold hover:bg-rose-700 transition-colors shadow-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Intercepted Feed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
              <span>Live Intercepted Spend Feed</span>
            </div>
            <Link href="/timeline" className="text-xs text-blue-600 font-bold hover:underline">
              View Full Timeline
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white ${
                    req.status === 'auto_approved' || req.status === 'approved' ? 'bg-emerald-600' :
                    req.status === 'pending_approval' ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{req.agentName}</span>
                    <span className="text-[10px] text-slate-500">{req.vendor} • {req.requestedModel}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900 block">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className={`text-[10px] font-sans font-bold uppercase ${
                    req.status === 'auto_approved' || req.status === 'approved' ? 'text-emerald-600' :
                    req.status === 'pending_approval' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
