'use client';

import React from 'react';
import { 
  User, 
  Bot, 
  Send, 
  ShieldAlert, 
  Wallet, 
  Activity, 
  CheckSquare, 
  Blocks, 
  Key, 
  Cpu,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { SpendRequest } from '@/types';

interface WorkflowCanvasProps {
  currentStep: number;
  request?: SpendRequest | null;
  onNodeClick?: (nodeId: string) => void;
}

export default function WorkflowCanvas({ currentStep, request, onNodeClick }: WorkflowCanvasProps) {
  const nodes = [
    { id: 'user', title: 'User Request', icon: User, desc: 'Assigns task to Agent' },
    { id: 'agent', title: 'AI Agent', icon: Bot, desc: 'Generates API spend request' },
    { id: 'spend', title: 'Spend Request', icon: Send, desc: 'Outbound payload intercepted' },
    { id: 'policy', title: 'Policy Engine', icon: ShieldAlert, desc: 'Evaluates AST conditions' },
    { id: 'budget', title: 'Budget Engine', icon: Wallet, desc: 'Checks daily/monthly cap' },
    { id: 'risk', title: 'Risk Engine', icon: Activity, desc: 'Calculates 0-100 risk score' },
    { id: 'approval', title: 'Approval Tier', icon: CheckSquare, desc: 'Enforces human threshold' },
    { id: 'blockchain', title: 'Algorand Ledger', icon: Blocks, desc: 'Commits SHA-256 state proof' },
    { id: 'x402', title: 'x402 Protocol', icon: Key, desc: 'HTTP 402 payment token' },
    { id: 'provider', title: 'API Provider', icon: Cpu, desc: 'Executes call via Key Pool' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-gradient-to-b from-white to-slate-50 shadow-md relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
          <span>Interactive 10-Node Financial Governance Canvas</span>
        </h3>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Approved
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Processing
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Blocked
          </span>
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {nodes.map((node, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;
          const Icon = node.icon;

          let statusColor = 'border-slate-200 bg-white text-slate-600';
          if (isCurrent) {
            statusColor = 'border-blue-500 bg-blue-50 text-blue-900 shadow-md shadow-blue-500/10 scale-105 font-bold';
          } else if (isDone) {
            if (request && (request.status === 'blocked_by_policy' || request.status === 'blocked_by_budget') && stepNum >= 4) {
              statusColor = 'border-rose-300 bg-rose-50 text-rose-900';
            } else {
              statusColor = 'border-emerald-300 bg-emerald-50 text-emerald-900';
            }
          }

          return (
            <div
              key={node.id}
              onClick={() => onNodeClick && onNodeClick(node.id)}
              className={`rounded-xl p-3 border text-xs cursor-pointer transition-all duration-300 relative group hover:border-blue-400 shadow-xs ${statusColor}`}
            >
              <div className="flex items-center justify-between mb-1.5 font-bold">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-blue-600 animate-bounce' : isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[11px] truncate">{node.title}</span>
                </div>
                <span className="font-mono text-[9px] opacity-60">#{stepNum}</span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-1">{node.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
