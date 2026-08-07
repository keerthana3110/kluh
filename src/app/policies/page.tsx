'use client';

import React, { useState } from 'react';
import { ShieldAlert, Plus, Code, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function PoliciesPage() {
  const { policies, addPolicy } = useSentinel();
  const [testAmount, setTestAmount] = useState('3600.00');
  const [testModel, setTestModel] = useState('gpt-4o');
  const [testDept, setTestDept] = useState('Marketing');

  // New policy form
  const [name, setName] = useState('');
  const [action, setAction] = useState<'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'>('REQUIRE_APPROVAL');
  const [maxSingleSpend, setMaxSingleSpend] = useState('1500');

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    addPolicy({
      name,
      description: 'Custom governance AST policy rule',
      department: testDept,
      action,
      maxSingleSpend: Number(maxSingleSpend),
      maxDailyAmount: 4000,
      allowedVendors: ['OpenAI', 'Anthropic', 'Google'],
      deniedModels: ['gpt-5'],
      agentIds: [],
      conditionAST: {
        operator: 'AND',
        rules: [{ field: 'amount', comparison: 'greater_than', value: Number(maxSingleSpend) }]
      },
      isActive: true
    });
    setName('');
  };

  // Evaluation playground simulation
  const isTestDenied = testModel === 'gpt-5';
  const isTestApprovalReq = Number(testAmount) > 1500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Spend Policy AST Engine</h1>
          <p className="text-xs text-slate-500 font-medium">Construct visual boolean rules (AND, OR, NOT) to authorize or restrict agent expenditures (₹)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Policies List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Organization Policies ({policies.length})</h2>
          </div>

          <div className="space-y-3">
            {policies.map((p) => (
              <div key={p.id} className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">Scope: {p.department} Department</span>
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    p.action === 'ALLOW' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : p.action === 'DENY' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {p.action}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono">
                  <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">Single Cap: ₹{p.maxSingleSpend.toLocaleString('en-IN')}</span>
                  <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">Daily Cap: ₹{p.maxDailyAmount.toLocaleString('en-IN')}</span>
                  {p.deniedModels.length > 0 && (
                    <span className="rounded bg-rose-50 border border-rose-200 px-2 py-0.5 text-rose-700 font-bold">
                      Prohibited: {p.deniedModels.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AST Policy Playground & Validator */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Code className="h-4 w-4 text-blue-600" />
            <span>AST Rule Tester Playground</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Target Department</label>
              <select
                value={testDept}
                onChange={e => setTestDept(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Marketing">Marketing</option>
                <option value="Coding">Coding</option>
                <option value="Travel">Travel</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Test Single Amount (₹)</label>
              <input
                type="number"
                value={testAmount}
                onChange={e => setTestAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Requested Model</label>
              <input
                type="text"
                value={testModel}
                onChange={e => setTestModel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* AST Evaluated Result */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Evaluated AST Output</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Policy Outcome:</span>
                <span className={`font-mono font-bold ${
                  isTestDenied ? 'text-rose-600' : isTestApprovalReq ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {isTestDenied ? 'DENIED (Prohibited Model)' : isTestApprovalReq ? 'REQUIRE_APPROVAL' : 'ALLOWED (Auto)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
