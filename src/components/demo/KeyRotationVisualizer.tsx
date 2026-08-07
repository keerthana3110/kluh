'use client';

import React from 'react';
import { Cpu, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function KeyRotationVisualizer() {
  const { aiProviders, rotateAIKey } = useSentinel();

  return (
    <div className="glass-panel p-5 rounded-2xl border border-blue-200 space-y-4 bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
          <Cpu className="h-5 w-5 text-blue-600" />
          <span>API Key Pool Failover & Rotation Live Monitor</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-medium">5 Keys per Provider Pool</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {aiProviders.map((provider) => (
          <div key={provider.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 shadow-xs">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{provider.name} Pool</span>
              <button
                onClick={() => rotateAIKey(provider.name)}
                className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                title="Rotate Key"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              {provider.keys.map((k, idx) => (
                <div
                  key={k.id}
                  className={`flex items-center justify-between px-2 py-1 rounded border transition-all ${
                    provider.activeKeyIndex === idx
                      ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="truncate">{k.keyMasked}</span>
                  <span className="text-[9px] font-sans">{provider.activeKeyIndex === idx ? 'ACTIVE' : 'IDLE'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
