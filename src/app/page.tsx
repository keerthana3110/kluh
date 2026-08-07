'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Play, 
  ArrowRight, 
  Zap, 
  Lock, 
  Blocks, 
  Bot, 
  Activity, 
  Wallet, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  Cpu,
  Layers,
  ChevronRight,
  ShieldAlert,
  Key
} from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function LandingPage() {
  const { runJurySimulation } = useSentinel();

  const workflowSteps = [
    { title: "1. User Task", desc: "User assigns task to AI Agent" },
    { title: "2. API Selection", desc: "Agent selects required paid API" },
    { title: "3. Spend Request", desc: "Outbound request intercepted" },
    { title: "4. Tracking.ai", desc: "Governance Proxy receives payload" },
    { title: "5. Policy AST", desc: "Dynamic rules & AST evaluated" },
    { title: "6. Budget Engine", desc: "Daily & monthly caps checked" },
    { title: "7. Risk Engine", desc: "0-100 AI risk score calculated" },
    { title: "8. Approval Tier", desc: "Multi-tier human threshold check" },
    { title: "9. Algorand Audit", desc: "SHA-256 state proof hash committed" },
    { title: "10. x402 Protocol", desc: "HTTP 402 payment handshake" },
    { title: "11. API Call", desc: "Authorized call executes safely" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span>Financial Governance Layer for Autonomous AI Agents</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          No AI Agent Spends a Single Cent Without <span className="text-gradient-blue font-extrabold">Tracking.ai</span> Authorization.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Tracking.ai authorizes, limits, monitors, and audits autonomous agent spending in real time with Algorand blockchain immutable proofs and x402 micropayments.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => runJurySimulation('micro_pass')}
            className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all transform active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Launch 30-Sec Jury Demo</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-xs"
          >
            <span>Open Executive Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-200 bg-white shadow-xs">
            <span className="text-xs text-slate-500 font-medium block mb-1">Protected Spend</span>
            <span className="text-2xl font-bold font-mono text-slate-900">â‚¹1,14,28,500</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-200 bg-white shadow-xs">
            <span className="text-xs text-slate-500 font-medium block mb-1">Blocked Violations</span>
            <span className="text-2xl font-bold font-mono text-rose-600">1,248</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-200 bg-white shadow-xs">
            <span className="text-xs text-slate-500 font-medium block mb-1">Algorand Block Commits</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">14,920</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-200 bg-white shadow-xs">
            <span className="text-xs text-slate-500 font-medium block mb-1">x402 Latency</span>
            <span className="text-2xl font-bold font-mono text-blue-600">&lt; 1.2ms</span>
          </div>
        </div>
      </section>

      {/* Main Workflow Section */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="h-4 w-4" />
              <span>Interactive Architecture</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">End-to-End Governance Pipeline</h2>
          </div>
          <button
            onClick={() => runJurySimulation('micro_pass')}
            className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all self-start shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Simulate Live Pipeline Execution</span>
          </button>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1 hover:border-blue-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 text-[11px]">{step.title}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">#{idx + 1}</span>
              </div>
              <p className="text-[11px] text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Feature Matrix */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Enterprise Financial Control Modules</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Tracking.ai sits transparently between your LLMs and HTTP APIs to enforce compliance, budget limits, and audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Spend Policy Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create dynamic rule trees with AND, OR, NOT logic. Limit single spend caps, whitelist vendors, and restrict unapproved model usage per department.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Blocks className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Algorand Blockchain Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every spend authorization commits an immutable SHA-256 state proof to Algorand Mainnet, ensuring tamper-proof audit trails for CFOs and auditors.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">x402 Micropayment Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforces HTTP 402 Payment Required headers natively. Intercepts paid API invocations and issues cryptographically signed payment tokens.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Risk Evaluator (0-100)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time multi-factor AI scoring analyzing amount severity, vendor trust, request velocity bursts, and off-hours execution.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cost Optimization AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interprets requests for expensive frontier models (e.g. GPT-5) and suggests equivalent alternatives (Gemini Flash, DeepSeek) saving up to 90%.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">API Key Rotation & Resilience</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Round-robin load balancing across 5 keys per provider (Gemini, Grok, OpenRouter) with automatic circuit breaker fallback on 429 quota exhaustion.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center space-y-4 text-white shadow-lg">
        <h2 className="text-2xl font-bold text-white">Ready to govern your AI Agent workforce?</h2>
        <p className="text-xs text-blue-100 max-w-lg mx-auto">
          Deploy Tracking.ai proxy in 5 minutes with our lightweight SDK or HTTP middleware headers.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-md"
        >
          <span>Enter Sentinel Console</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

