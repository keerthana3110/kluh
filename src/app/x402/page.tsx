'use client';

import React, { useState } from 'react';
import { Key, Lock, ArrowRight, ShieldCheck, Code, Zap, CheckCircle2 } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import { generateX402Challenge, issueX402Authorization } from '@/lib/engines/x402Engine';

export default function X402ProtocolPage() {
  const { spendRequests } = useSentinel();

  const [testAmount, setTestAmount] = useState('15.00');
  const [challengeOutput, setChallengeOutput] = useState<any>(null);
  const [tokenOutput, setTokenOutput] = useState<any>(null);

  const handleSimulateX402Handshake = () => {
    const amountNum = parseFloat(testAmount) || 15.00;
    const challenge = generateX402Challenge(amountNum);
    const auth = issueX402Authorization(amountNum, challenge.headers['X-402-Nonce']);

    setChallengeOutput(challenge);
    setTokenOutput(auth);
  };

  const x402Requests = spendRequests.filter(r => r.x402Token);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">x402 Payment Authorization Protocol</h1>
          <p className="text-xs text-slate-500 font-medium">Native HTTP 402 Payment Required protocol enforcement engine for AI Agent micropayments (₹)</p>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-200 bg-white space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <Lock className="h-5 w-5 text-indigo-600" />
          <span>Standard RFC / HTTP 402 Handshake Pipeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs text-center font-mono">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-blue-700 font-bold block text-[10px]">1. Spend Request</span>
            <p className="text-[10px] text-slate-600">Agent calls protected endpoint</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-indigo-700 font-bold block text-[10px]">2. 402 Challenge</span>
            <p className="text-[10px] text-slate-600">Server returns 402 Payment Required</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-amber-700 font-bold block text-[10px]">3. Policy Pass</span>
            <p className="text-[10px] text-slate-600">Sentinel validates budget & AST</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-purple-700 font-bold block text-[10px]">4. x402 Token Issue</span>
            <p className="text-[10px] text-slate-600">Signed micropayment token created</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-emerald-700 font-bold block text-[10px]">5. API Execution</span>
            <p className="text-[10px] text-slate-600">Header authorized & executed</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1 shadow-xs">
            <span className="text-cyan-700 font-bold block text-[10px]">6. Audit Commit</span>
            <p className="text-[10px] text-slate-600">Algorand block proof saved</p>
          </div>
        </div>
      </div>

      {/* Interactive Protocol Simulator */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">x402 Protocol Inspector & Header Simulator</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={testAmount}
                onChange={e => setTestAmount(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-mono w-28 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSimulateX402Handshake}
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
            >
              Simulate 402 Handshake
            </button>
          </div>
        </div>

        {challengeOutput && tokenOutput && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Challenge Header Box */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-rose-800 font-bold border-b border-rose-200 pb-2 font-sans">
                <span>HTTP Response Status: 402 Payment Required</span>
                <span>CHALLENGE</span>
              </div>
              <pre className="text-[11px] text-slate-800 overflow-x-auto p-2 bg-white rounded border border-rose-200">
                {JSON.stringify(challengeOutput.headers, null, 2)}
              </pre>
            </div>

            {/* Token Authorization Box */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-emerald-800 font-bold border-b border-emerald-200 pb-2 font-sans">
                <span>X-402-Authorization Signature Header</span>
                <span>AUTHORIZED</span>
              </div>
              <pre className="text-[11px] text-slate-800 overflow-x-auto p-2 bg-white rounded border border-emerald-200">
                {JSON.stringify(tokenOutput, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Micropayment Authorization Log */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">x402 Micropayment Ledger ({x402Requests.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-sans uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">x402 Token Signature</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {x402Requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">{req.id}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{req.agentName}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-indigo-700 truncate max-w-xs">{req.x402Token}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-200">
                      {req.x402Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
