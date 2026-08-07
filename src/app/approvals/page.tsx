'use client';

import React from 'react';
import { CheckSquare, Check, X, ShieldAlert, Blocks, Key, Bot } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function ApprovalsPage() {
  const { spendRequests, approveSpendRequest, rejectSpendRequest } = useSentinel();

  const pendingRequests = spendRequests.filter(r => r.status === 'pending_approval');
  const processedRequests = spendRequests.filter(r => r.status === 'approved' || r.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Human Governance Approval Center</h1>
          <p className="text-xs text-slate-500 font-medium">Review, approve, or reject high-risk or threshold-exceeding AI agent spend requests (₹)</p>
        </div>
      </div>

      {/* Pending Inbox */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-amber-600" />
          <span>Pending Governance Inbox ({pendingRequests.length})</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 bg-white text-center text-slate-500 text-xs shadow-xs">
            No pending spend requests requiring human approval.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="glass-panel p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 border border-amber-200 font-bold">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{req.agentName}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">Vendor: {req.vendor}</span>
                    </div>
                  </div>

                  <span className="font-mono text-lg font-bold text-amber-700">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">{req.purpose}</p>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-xs">
                  <span className="rounded bg-white border border-amber-200 px-2 py-0.5 text-[10px] text-amber-800 font-bold">
                    Tier: {req.approvalTier}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectSpendRequest(req.id)}
                      className="flex items-center gap-1 rounded-xl bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-200 transition-colors shadow-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => approveSpendRequest(req.id, 'Governance Lead')}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Approvals History */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Governance Decision History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {processedRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{req.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{req.agentName}</td>
                  <td className="py-3 px-4 text-slate-700">{req.vendor}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{req.approvedBy || 'Policy Engine'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
