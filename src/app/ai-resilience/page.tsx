'use client';

import React from 'react';
import { Zap, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function AIResiliencePage() {
  const { aiProviders, rotateAIKey } = useSentinel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Model Resilience & Key Rotation</h1>
          <p className="text-xs text-slate-500 font-medium">Automatic round-robin key pool rotation & fallback orchestration across Gemini, Grok, OpenRouter, and Ollama</p>
        </div>
      </div>

      {/* Provider Resilience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiProviders.map((provider) => (
          <div key={provider.name} className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{provider.name} Key Pool</h3>
                  <p className="text-xs text-slate-500 font-medium">Priority #{provider.fallbackPriority} in Fallback Hierarchy</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Health: {provider.healthScore}%
                </span>
                <button
                  onClick={() => rotateAIKey(provider.name)}
                  className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Rotate Key</span>
                </button>
              </div>
            </div>

            {/* Key Pool List */}
            <div className="space-y-2 text-xs font-mono">
              {provider.keys.map((keyItem, idx) => {
                const isActive = provider.activeKeyIndex === idx;
                const percentUsed = Math.min(100, Math.round((keyItem.callsToday / keyItem.quotaLimit) * 100));

                return (
                  <div
                    key={keyItem.id}
                    className={`rounded-xl p-3 border transition-all ${
                      isActive
                        ? 'border-blue-300 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{keyItem.keyMasked}</span>
                        {isActive && (
                          <span className="rounded-full bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 shadow-xs">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">Calls Today: {keyItem.callsToday}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Quota Limit ({keyItem.quotaLimit})</span>
                        <span>{percentUsed}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percentUsed > 90 ? 'bg-rose-500' : 'bg-blue-600'}`}
                          style={{ width: `${percentUsed}%` }}
                        />
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
