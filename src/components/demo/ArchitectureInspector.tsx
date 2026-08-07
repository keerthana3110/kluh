'use client';

import React, { useState } from 'react';
import { Layers, ShieldAlert, Wallet, Activity, CheckSquare, Blocks, Key, Cpu, X, Code } from 'lucide-react';

export default function ArchitectureInspector() {
  const [activeComponent, setActiveComponent] = useState<string>('policy');

  const componentsData: Record<string, {
    title: string;
    icon: any;
    purpose: string;
    inputSchema: string;
    outputSchema: string;
    samplePayload: any;
  }> = {
    policy: {
      title: "Spend Policy AST Engine",
      icon: ShieldAlert,
      purpose: "Evaluates dynamic boolean rules (AND, OR, NOT), single spend caps, vendor whitelists, and model prohibitions.",
      inputSchema: "SpendRequestPayload { agentId, department, amount, vendor, requestedModel }",
      outputSchema: "PolicyEvaluation { allowed: boolean, action: ALLOW | DENY | REQUIRE_APPROVAL, reason: string }",
      samplePayload: {
        rule: "Marketing Cap & Prohibited Models",
        ast_operator: "AND",
        rules: [
          { field: "department", comparison: "equals", value: "Marketing" },
          { field: "amount", comparison: "greater_than", value: 1500.00 }
        ],
        action: "REQUIRE_APPROVAL"
      }
    },
    budget: {
      title: "Budget & Runway Engine",
      icon: Wallet,
      purpose: "Monitors daily/monthly burn rates, verifies remaining budget runway allocations, and calculates monthly run-rate projections.",
      inputSchema: "BudgetCheck { agentId, requestAmount, currentSpendToday, dailyCap }",
      outputSchema: "BudgetResult { exceeded: boolean, remainingDaily: float, remainingMonthly: float }",
      samplePayload: {
        agent_id: "agent-mkt-01",
        daily_cap: 4000.00,
        current_today: 1480.50,
        request_amount: 3600.00,
        status: "Exceeds daily cap (â‚¹1,480.50 + â‚¹3,600.00 > â‚¹4,000.00)"
      }
    },
    risk: {
      title: "AI Risk Evaluator (0-100)",
      icon: Activity,
      purpose: "Calculates real-time 0-100 risk score based on amount severity, vendor verification, velocity bursts, and off-hours execution.",
      inputSchema: "RiskPayload { amount, vendor, requestedModel, hourlyVelocity }",
      outputSchema: "RiskScoreResult { score: 0-100, category: Low|Medium|High|Critical, factors: Array }",
      samplePayload: {
        risk_score: 78,
        risk_category: "High",
        factors: [
          { factor: "High Amount Severity", score: 85, description: "Amount > â‚¹8,000 threshold" },
          { factor: "Velocity Anomaly", score: 40, description: "2nd request in 1 hour" }
        ]
      }
    },
    approval: {
      title: "Human Approval Threshold Engine",
      icon: CheckSquare,
      purpose: "Enforces multi-tier approval threshold rules (<â‚¹1,500 auto, â‚¹1,500-â‚¹8,000 manager, >â‚¹8,000 finance, >â‚¹80,000 executive).",
      inputSchema: "ApprovalCheck { requestAmount, riskScore, policyAction }",
      outputSchema: "ApprovalTierResult { status: auto_approved | pending_approval, requiredTier: Manager | Finance | Executive }",
      samplePayload: {
        amount: 3600.00,
        status: "pending_approval",
        required_tier: "Manager",
        assigned_queue: "Marketing Manager Governance Inbox"
      }
    },
    blockchain: {
      title: "Algorand Blockchain Audit Layer",
      icon: Blocks,
      purpose: "Commits SHA-256 state proof hashes and transaction references to Algorand Mainnet for immutable auditability.",
      inputSchema: "AuditPayload { spendRequestId, amount, policyVersionHash }",
      outputSchema: "AlgorandTxRecord { txHash: TX_ALGO_..., blockNumber: int, payloadHash: sha256, verificationStatus: VERIFIED }",
      samplePayload: {
        tx_hash: "TX_ALGO_7F89A2BC34DE0192",
        block_number: 3849102,
        payload_hash: "a8b9c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234",
        state_proof: "ALGO_ZKPROOF_VERIFIED_SIGNATURE_0x99281734918237"
      }
    },
    x402: {
      title: "x402 Payment Authorization Protocol",
      icon: Key,
      purpose: "Native HTTP 402 Payment Required header challenge and signed token authorization for agent micropayments.",
      inputSchema: "X402Request { amount, nonce, realm }",
      outputSchema: "X402Token { token: x402_tok_..., signature: 0x..., settlementStatus: SETTLED }",
      samplePayload: {
        status_code: 402,
        header_challenge: "x402 realm=\"Tracking.ai\", nonce=\"nonce_99812\"",
        issued_token: "x402_tok_9081_verified_sig_78a12b",
        settlement: "SETTLED"
      }
    },
    provider: {
      title: "AI Key Pool & Fallback Orchestration",
      icon: Cpu,
      purpose: "Round-robin load balancing across 5 keys per provider (Gemini, Grok, OpenRouter, Ollama) with 429 quota failover.",
      inputSchema: "ProviderCall { prompt, preferredProvider, model }",
      outputSchema: "ExecutionResult { provider: string, keyUsed: string, text: string, usage: object }",
      samplePayload: {
        provider: "Gemini",
        active_key: "AIzaSyD-89...x92A",
        fallback_priority: ["Gemini", "Grok", "OpenRouter", "Ollama"],
        status: "healthy"
      }
    }
  };

  const comp = componentsData[activeComponent];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Layers className="h-5 w-5 text-blue-600" />
          <span>Interactive Component Architecture Inspector</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">Click any module to inspect payload schema</span>
      </div>

      {/* Component Selector Buttons */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.keys(componentsData).map((key) => {
          const item = componentsData[key];
          const Icon = item.icon;
          const isActive = activeComponent === key;

          return (
            <button
              key={key}
              onClick={() => setActiveComponent(key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-semibold transition-all shadow-xs ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
          <comp.icon className="h-5 w-5 text-blue-600" />
          <span>{comp.title}</span>
        </div>

        <p className="text-slate-700 leading-relaxed font-medium">{comp.purpose}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px] pt-2 border-t border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Input Contract Schema</span>
            <span className="text-blue-700 font-bold">{comp.inputSchema}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Output Contract Schema</span>
            <span className="text-emerald-700 font-bold">{comp.outputSchema}</span>
          </div>
        </div>

        {/* Code Sample */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mb-1">
            <Code className="h-3.5 w-3.5" />
            <span>Sample Real-time JSON Payload</span>
          </div>
          <pre className="rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto shadow-inner">
            {JSON.stringify(comp.samplePayload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

