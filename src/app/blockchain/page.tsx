'use client';

import React, { useState } from 'react';
import { Blocks, CheckCircle2, ExternalLink, ShieldCheck, Lock, X } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import { AlgorandAuditRecord } from '@/types';

export default function BlockchainPage() {
  const { algorandRecords } = useSentinel();
  const [selectedRecord, setSelectedRecord] = useState<AlgorandAuditRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Algorand Mainnet Cryptographic Ledger</h1>
          <p className="text-xs text-slate-500 font-medium">Immutable, tamper-proof SHA-256 state proof audit records for all authorized spend requests (₹)</p>
        </div>
      </div>

      {/* Explorer Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Algorand Blockchain Audit Transactions ({algorandRecords.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-sans font-bold">
                <th className="py-3 px-4">Transaction Hash</th>
                <th className="py-3 px-4">Block Height</th>
                <th className="py-3 px-4">Spend Request ID</th>
                <th className="py-3 px-4">Committed Amount</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Inspect Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {algorandRecords.map((record) => (
                <tr key={record.txHash} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-blue-700 font-bold">{record.txHash}</td>
                  <td className="py-3 px-4 text-slate-700">{record.blockNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{record.spendRequestId}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">₹{record.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{record.verificationStatus}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-blue-700 hover:bg-slate-200 transition-colors shadow-xs"
                    >
                      Verify Proof
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Algorand Cryptographic Proof Verification</span>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tx Hash:</span>
                <span className="text-blue-700 font-bold">{selectedRecord.txHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Block Height:</span>
                <span className="text-slate-900 font-bold">#{selectedRecord.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payload SHA-256:</span>
                <span className="text-emerald-700 font-bold truncate max-w-xs">{selectedRecord.payloadHash}</span>
              </div>
            </div>

            <a
              href={`https://testnet.algoexplorer.io/tx/${selectedRecord.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <span>View on Algorand Explorer</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
