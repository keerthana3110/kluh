'use client';

import React, { useState } from 'react';
import { Clock, Search, Code, ShieldCheck, Filter, X } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function AuditLogsPage() {
  const { spendRequests } = useSentinel();
  const [search, setSearch] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  const auditEvents = spendRequests.map(r => ({
    id: `audit-${r.id}`,
    timestamp: r.timestamp,
    actor: r.agentName,
    department: r.department,
    action: `SPEND_REQUEST_${r.status.toUpperCase()}`,
    resource: r.vendor,
    amount: r.amount,
    raw: r
  }));

  const filtered = auditEvents.filter(a =>
    a.actor.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enterprise Audit Logs</h1>
          <p className="text-xs text-slate-500 font-medium">Searchable immutable audit record of all financial governance and system events (₹)</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="glass-panel p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or vendor resource..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono font-bold">{filtered.length} Audit Events</span>
      </div>

      {/* Audit Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-sans uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor Agent</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Vendor Resource</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Raw JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">{log.id}</td>
                  <td className="py-3 px-4 text-slate-700">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{log.actor}</td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-700">{log.resource}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">₹{log.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedAudit(log.raw)}
                      className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-blue-700 hover:bg-slate-200 transition-colors shadow-xs"
                    >
                      Inspect JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw JSON Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Code className="h-5 w-5 text-blue-600" />
                <span>Audit Raw Payload ({selectedAudit.id})</span>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 border border-slate-800 max-h-96 overflow-y-auto shadow-inner">
              {JSON.stringify(selectedAudit, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
