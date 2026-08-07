'use client';

import React, { useState } from 'react';
import { Bot, Plus, Search, Filter, ShieldAlert, DollarSign, Activity, ChevronRight, X } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import { WORKSPACE_PRESETS } from '@/lib/workspacePresets';
import AgentDrawer from '@/components/modals/AgentDrawer';
import { AIAgent } from '@/types';

export default function AgentsPage() {
  const { currentWorkspace, agents, spendRequests, addAgent } = useSentinel();
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Agent Form
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<'Marketing' | 'Coding' | 'Travel' | 'Research' | 'HR' | 'Finance' | 'Custom'>('Marketing');
  const [owner, setOwner] = useState('');
  const [dailyBudget, setDailyBudget] = useState('8000');
  const [monthlyBudget, setMonthlyBudget] = useState('160000');

  const wsPreset = WORKSPACE_PRESETS[currentWorkspace] || WORKSPACE_PRESETS['TechNova Inc.'];
  const displayAgents = wsPreset.agents.length > 0 ? wsPreset.agents : agents;

  const filteredAgents = displayAgents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.owner.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || a.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    addAgent({
      name,
      department,
      owner: owner || 'Operations Lead',
      dailyBudget: Number(dailyBudget),
      monthlyBudget: Number(monthlyBudget),
      riskLevel: 'Low',
      status: 'active',
      allowedAPIs: ['OpenAI GPT-4o', 'Anthropic Claude', 'Gemini Flash']
    });
    setIsModalOpen(false);
    setName('');
    setOwner('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{currentWorkspace} AI Agent Registry</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              {filteredAgents.length} Active Agents
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Manage, scope budgets (₹), and enforce API authorization policies for AI workforce</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Register New AI Agent</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents by name or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Marketing">Marketing</option>
            <option value="Coding">Coding</option>
            <option value="Travel">Travel</option>
            <option value="Research">Research</option>
            <option value="Flight Ops">Flight Ops</option>
            <option value="Hotel Booking">Hotel Booking</option>
            <option value="Ad Bidding AI">Ad Bidding AI</option>
            <option value="HIPAA Sanitizer">HIPAA Sanitizer</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const dailyPercent = Math.min(100, Math.round((agent.currentSpendToday / agent.dailyBudget) * 100));

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 hover:border-blue-300 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{agent.name}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{agent.department} • {agent.owner}</span>
                  </div>
                </div>

                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  agent.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {agent.riskLevel} Risk
                </span>
              </div>

              {/* Spend Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Daily Spend ({dailyPercent}%)</span>
                  <span className="font-mono text-slate-900 font-bold">₹{agent.currentSpendToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / ₹{agent.dailyBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dailyPercent > 80 ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${dailyPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                <span>Monthly Cap: ₹{agent.monthlyBudget.toLocaleString('en-IN')}</span>
                <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Details Slide-over Drawer */}
      <AgentDrawer
        agent={selectedAgent}
        spendRequests={spendRequests}
        onClose={() => setSelectedAgent(null)}
      />

      {/* Create Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Register Autonomous AI Agent</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Outreach Bot"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department Scope</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Marketing">Marketing</option>
                  <option value="Coding">Coding</option>
                  <option value="Travel">Travel</option>
                  <option value="Research">Research</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Owner Lead Email</label>
                <input
                  type="text"
                  required
                  placeholder="alex.rivera@company.com"
                  value={owner}
                  onChange={e => setOwner(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Daily Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={dailyBudget}
                    onChange={e => setDailyBudget(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Monthly Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={monthlyBudget}
                    onChange={e => setMonthlyBudget(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 mt-2"
              >
                Register Agent & Issue Keys
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
