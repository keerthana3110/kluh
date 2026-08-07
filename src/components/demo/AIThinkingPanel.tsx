'use client';

import React from 'react';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import { SpendRequest } from '@/types';

interface AIThinkingPanelProps {
  currentStep: number;
  stepMessage: string;
  simulatedRequest?: SpendRequest | null;
}

export default function AIThinkingPanel({ currentStep, stepMessage, simulatedRequest }: AIThinkingPanelProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-blue-200 bg-white/95 space-y-4 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
          <Brain className="h-5 w-5 animate-pulse text-blue-600" />
          <span>Tracking.ai Governance Thinking Stream</span>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200">
          STEP {currentStep} / 11
        </span>
      </div>

      {/* Step Message Ticker */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs font-mono text-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="line-clamp-2 font-medium">{stepMessage}</span>
        </div>
      </div>

      {/* Real-time Thought Factor List */}
      {simulatedRequest && (
        <div className="space-y-2 text-xs font-mono pt-1">
          <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider font-bold">Decision Audit Breakdown</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex justify-between">
              <span className="text-slate-500">Agent</span>
              <span className="text-slate-900 font-bold">{simulatedRequest.agentName}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="text-emerald-700 font-bold">â‚¹{simulatedRequest.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex justify-between">
              <span className="text-slate-500">Calculated Risk Score</span>
              <span className="text-amber-700 font-bold">{simulatedRequest.riskScore} / 100</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex justify-between">
              <span className="text-slate-500">Required Approval</span>
              <span className="text-indigo-700 font-bold">{simulatedRequest.approvalTier}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

