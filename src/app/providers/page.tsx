'use client';

import React from 'react';
import { Cpu, RefreshCw, CheckCircle2, ShieldCheck, Zap, Activity, AlertTriangle } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function ProvidersPage() {
  const { aiProviders, rotateAIKey } = useSentinel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Provider Pool & Failover Status</h1>
          <p className="text-xs text-slate-500 font-medium">Live monitoring of 5-key pools across Gemini, Grok, OpenRouter, and Ollama with 429 quota rotation</p>
        </div>
      </div>

      {/* Fallback Hierarchy Banner */}
      <div className="glass-panel p-4 rounded-xl border border-indigo-200 flex items-center justify-between text-xs bg-indigo-50/50 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span>Priority Fallback Chain:</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-slate-700 font-medium">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800 border border-blue-200 font-bold">1. Gemini</span>
          <span>→</span>
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-800 border border-indigo-200 font-bold">2. Grok</span>
          <span>→</span>
          <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-800 border border-purple-200 font-bold">3. OpenRouter</span>
          <span>→</span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-800 border border-slate-300 font-bold">4. Local Ollama</span>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiProviders.map((provider) => (
          <div key={provider.name} className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{provider.name} Pool</h3>
                  <p className="text-xs text-slate-500 font-medium">{provider.keys.length} API Keys Configured</p>
                </div>
              </div>

              <button
                onClick={() => rotateAIKey(provider.name)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Rotate Active Key</span>
              </button>
            </div>

            {/* Key Pool List */}
            <div className="space-y-2 text-xs font-mono">
              {provider.keys.map((k, idx) => {
                const isActive = provider.activeKeyIndex === idx;
                const usagePercent = Math.min(100, Math.round((k.callsToday / k.quotaLimit) * 100));

                return (
                  <div key={k.id} className={`p-3 rounded-xl border transition-all ${
                    isActive ? 'border-blue-300 bg-blue-50/60 shadow-xs' : 'border-slate-200 bg-slate-50/50'
                  }`}>
                    <div className="flex justify-between items-center font-sans mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{k.keyMasked}</span>
                        {isActive && (
                          <span className="rounded-full bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 shadow-xs">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[10px] font-mono font-bold">Calls: {k.callsToday}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Quota Cap ({k.quotaLimit})</span>
                        <span>{usagePercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full rounded-full ${usagePercent > 80 ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${usagePercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
