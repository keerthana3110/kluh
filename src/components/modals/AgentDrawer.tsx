'use client';

import React from 'react';
import { X, Bot, ShieldAlert, DollarSign, Activity, CheckCircle2, Clock } from 'lucide-react';
import { AIAgent, SpendRequest } from '@/types';

interface AgentDrawerProps {
  agent: AIAgent | null;
  spendRequests: SpendRequest[];
  onClose: () => void;
}

export default function AgentDrawer({ agent, spendRequests, onClose }: AgentDrawerProps) {
  if (!agent) return null;

  const agentRequests = spendRequests.filter(r => r.agentId === agent.id);
  const dailyPercent = Math.min(100, Math.round((agent.currentSpendToday / agent.dailyBudget) * 100));
  const monthlyPercent = Math.min(100, Math.round((agent.currentSpendMonth / agent.monthlyBudget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l border-slate-200 p-6 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{agent.name}</h2>
              <p className="text-xs text-slate-500">ID: {agent.id} • {agent.department}</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Metadata Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Owner Lead</span>
            <span className="font-bold text-slate-900">{agent.owner}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Risk Profile</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              agent.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {agent.riskLevel} Risk
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Invocations</span>
            <span className="font-mono text-slate-900 font-bold">{agent.totalRequests} Requests</span>
          </div>
        </div>

        {/* Spend Progress */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">Live Spend Allocation</h3>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Daily Cap (₹{agent.dailyBudget.toLocaleString('en-IN')})</span>
              <span className="font-mono text-slate-900 font-bold">₹{agent.currentSpendToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({dailyPercent}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${dailyPercent}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Monthly Cap (₹{agent.monthlyBudget.toLocaleString('en-IN')})</span>
              <span className="font-mono text-slate-900 font-bold">₹{agent.currentSpendMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({monthlyPercent}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${monthlyPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Whitelisted APIs */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900">Whitelisted API Endpoints</h3>
          <div className="flex flex-wrap gap-1.5">
            {agent.allowedAPIs.map((api, idx) => (
              <span key={idx} className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 font-mono">
                {api}
              </span>
            ))}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="space-y-3 text-xs pt-4 border-t border-slate-200">
          <h3 className="font-bold text-slate-900">Agent Request History ({agentRequests.length})</h3>

          {agentRequests.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No recent spend events recorded.</p>
          ) : (
            <div className="space-y-2">
              {agentRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{req.vendor}</span>
                    <span className="font-mono font-bold text-emerald-600">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{req.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
