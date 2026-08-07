'use client';

import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import WorkflowCanvas from '../demo/WorkflowCanvas';
import AIThinkingPanel from '../demo/AIThinkingPanel';

export default function JurySimulatorModal() {
  const { simulation } = useSentinel();

  if (!simulation.isRunning && simulation.currentStep !== 11) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-blue-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Jury Mode: 60-Second Real-Time Pipeline</h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  LIVE ANIMATION
                </span>
              </div>
              <p className="text-xs text-slate-400">{simulation.stepMessage}</p>
            </div>
          </div>
        </div>

        {/* Workflow Canvas */}
        <WorkflowCanvas
          currentStep={simulation.currentStep}
          request={simulation.simulatedRequest}
        />

        {/* AI Thinking Stream */}
        <AIThinkingPanel
          currentStep={simulation.currentStep}
          stepMessage={simulation.stepMessage}
          simulatedRequest={simulation.simulatedRequest}
        />
      </div>
    </div>
  );
}
