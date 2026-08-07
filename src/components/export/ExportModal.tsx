'use client';

import React, { useState } from 'react';
import { Download, FileText, Code, CheckCircle2, X } from 'lucide-react';
import { useSentinel } from '@/lib/store';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { spendRequests, agents, policies } = useSentinel();
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ spendRequests, agents, policies }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel_ai_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
  };

  const handleExportCSV = () => {
    const headers = "ID,Agent,Vendor,Amount,Status,RiskScore,ApprovalTier,Timestamp\n";
    const rows = spendRequests.map(r => `"${r.id}","${r.agentName}","${r.vendor}",${r.amount},"${r.status}",${r.riskScore},"${r.approvalTier}","${r.timestamp}"`).join("\n");
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel_ai_audit_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Download className="h-5 w-5 text-blue-600" />
            <span>Export Governance Records</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {exported && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Governance report exported successfully!</span>
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          Download formatted financial audit trails, risk scoring metrics, and Algorand state proofs for compliance reporting.
        </p>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900 hover:border-blue-500 hover:bg-slate-100 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>Export CSV Audit Ledger</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">.CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900 hover:border-blue-500 hover:bg-slate-100 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Code className="h-4 w-4 text-blue-600" />
              <span>Export Complete JSON Snapshot</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">.JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
